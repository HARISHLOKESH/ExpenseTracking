
import { useBudget } from "../context/BudgetContext";

function Analytics() {
    const { analytics, loading, error } = useBudget();

    if (loading) return <p>Loading analytics...</p>;
    if (error) return <p>{error}</p>;

    const categories = Object.entries(analytics.categoryBreakdown || {});

    const maxAmount = Math.max(
        ...categories.map(([, amount]) => amount),
        1
    );

    return (
        <div className="page-content">
            <h1>Financial Analytics</h1>
            <p>Understand where your money goes.</p>

            <div className="summary-grid">
                <div className="summary-card">
                    <p>Total Income</p>
                    <h2 className="income">
                        ₹{analytics.totalIncome.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="summary-card">
                    <p>Total Expenses</p>
                    <h2 className="expense">
                        ₹{analytics.totalExpenses.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="summary-card">
                    <p>Net Balance</p>
                    <h2>
                        ₹{analytics.balance.toLocaleString("en-IN")}
                    </h2>
                </div>
            </div>

            <section className="chart-section">
                <h2>Category-wise Spending</h2>

                {categories.length === 0 && <p>No expenses recorded.</p>}

                {categories.map(([category, amount]) => (
                    <div className="bar-item" key={category}>
                        <div className="bar-label">
                            <span>{category}</span>
                            <strong>₹{amount.toLocaleString("en-IN")}</strong>
                        </div>

                        <div className="progress-track">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${(amount / maxAmount) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                ))}
            </section>

            <section className="chart-section">
                <h2>Monthly Overview</h2>

                {Object.entries(analytics.monthlyBreakdown || {}).map(
                    ([month, values]) => (
                        <div className="monthly-row" key={month}>
                            <h3>{month}</h3>
                            <p className="income">
                                Income: ₹{values.income.toLocaleString("en-IN")}
                            </p>
                            <p className="expense">
                                Expenses: ₹{values.expenses.toLocaleString("en-IN")}
                            </p>
                        </div>
                    )
                )}
            </section>
        </div>
    );
}

export default Analytics;
