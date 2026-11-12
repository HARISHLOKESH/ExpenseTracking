
import { useEffect, useState } from "react";
import { getBudgets, addBudget, getBudgetSummary } from "../services/api";

function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [summary, setSummary] = useState([]);
    const [category, setCategory] = useState("Food");
    const [limit, setLimit] = useState("");
    const [month, setMonth] = useState("2026-11");
    const [message, setMessage] = useState("");

    const categories = [
        "Food", "Transport", "Shopping",
        "Entertainment", "Bills", "Health",
        "Education", "Other"
    ];

    async function loadBudgets() {
        const [budgetData, summaryData] = await Promise.all([
            getBudgets(),
            getBudgetSummary()
        ]);

        setBudgets(budgetData);
        setSummary(summaryData);
    }

    useEffect(() => {
        loadBudgets().catch(error => setMessage(error.message));
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await addBudget({
                category,
                limit: Number(limit),
                month
            });

            setLimit("");
            setMessage("Budget created successfully!");
            await loadBudgets();
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <div className="page-content">
            <h1>Monthly Budgets</h1>
            <p>Set spending limits and monitor your expenses.</p>

            <form className="transaction-form" onSubmit={handleSubmit}>
                <h2>Create Budget</h2>

                <select value={category}
                    onChange={e => setCategory(e.target.value)}>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Monthly limit (₹)"
                    value={limit}
                    onChange={e => setLimit(e.target.value)}
                    required
                />

                <input
                    type="month"
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    required
                />

                <button type="submit">Create Budget</button>
                {message && <p>{message}</p>}
            </form>

            <div className="budget-grid">
                {summary.map(budget => {
                    const percentage = Math.min(
                        (budget.spent / budget.limit) * 100, 100
                    );

                    return (
                        <div className="budget-card" key={budget.id}>
                            <h3>{budget.category}</h3>
                            <p>Month: {budget.month}</p>

                            <h2>
                                ₹{budget.spent.toLocaleString("en-IN")}
                            </h2>

                            <p>
                                of ₹{budget.limit.toLocaleString("en-IN")}
                            </p>

                            <div className="progress-track">
                                <div
                                    className={`progress-fill ${
                                        budget.exceeded ? "overspent" : ""
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <p>
                                {budget.remaining >= 0
                                    ? `₹${budget.remaining.toLocaleString("en-IN")} remaining`
                                    : `₹${Math.abs(budget.remaining).toLocaleString("en-IN")} over budget`}
                            </p>

                            {budget.exceeded && (
                                <strong className="warning">
                                    Budget exceeded!
                                </strong>
                            )}
                        </div>
                    );
                })}
            </div>

            {budgets.length === 0 && <p>No budgets created yet.</p>}
        </div>
    );
}

export default Budgets;
