
import { useState } from "react";
import { useBudget } from "../context/BudgetContext";

function Transactions() {
    const {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction
    } = useBudget();

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "expense",
        category: "Food",
        date: new Date().toISOString().slice(0, 10)
    });

    const [editingId, setEditingId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");

    const categories = [
        "Food", "Transport", "Shopping",
        "Entertainment", "Bills", "Health",
        "Education", "Salary", "Freelance", "Other"
    ];

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const transaction = {
                ...form,
                amount: Number(form.amount)
            };

            if (editingId !== null) {
                await updateTransaction(editingId, transaction);
                setMessage("Transaction updated successfully!");
            } else {
                await addTransaction(transaction);
                setMessage("Transaction added successfully!");
            }

            setEditingId(null);

            setForm({
                title: "",
                amount: "",
                type: "expense",
                category: "Food",
                date: new Date().toISOString().slice(0, 10)
            });

        } catch (error) {
            setMessage(error.message);
        }
    }

    function handleEdit(transaction) {
        setEditingId(transaction.id);

        setForm({
            ...transaction,
            amount: String(transaction.amount)
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        if (!window.confirm("Are you sure you want to delete this transaction?")) {
            return;
        }

        try {
            await deleteTransaction(id);
            setMessage("Transaction deleted successfully!");
        } catch (error) {
            setMessage(error.message);
        }
    }

    function cancelEdit() {
        setEditingId(null);

        setForm({
            title: "",
            amount: "",
            type: "expense",
            category: "Food",
            date: new Date().toISOString().slice(0, 10)
        });
    }

    // Apply all filters
    const filteredTransactions = transactions.filter(t => {
        const matchesType =
            filter === "all" || t.type === filter;

        const matchesCategory =
            categoryFilter === "all" ||
            t.category === categoryFilter;

        const matchesStart =
            !startDate || t.date >= startDate;

        const matchesEnd =
            !endDate || t.date <= endDate;

        return matchesType &&
            matchesCategory &&
            matchesStart &&
            matchesEnd;
    });

    // Export filtered transactions as CSV
    function exportCSV() {
        const headers = [
            "ID", "Title", "Amount",
            "Type", "Category", "Date"
        ];

        const escapeCSV = value => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        };

        const rows = filteredTransactions.map(t => [
            t.id,
            t.title,
            t.amount,
            t.type,
            t.category,
            t.date
        ]);

        const csv = [
            headers.map(escapeCSV).join(","),
            ...rows.map(row => row.map(escapeCSV).join(","))
        ].join("\n");

        const blob = new Blob(
            ["\uFEFF" + csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "BudgetIssueTracker_Transactions.csv";
        link.click();

        URL.revokeObjectURL(url);
    }

    return (
        <div className="transactions-page">

            <h1>Transactions</h1>
            <p>Manage your income and expenses.</p>

            {/* Add or Edit Transaction */}
            <form className="transaction-form" onSubmit={handleSubmit}>

                <h2>
                    {editingId !== null
                        ? "Edit Transaction"
                        : "Add Transaction"}
                </h2>

                <input
                    name="title"
                    placeholder="Transaction title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                <input
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                />

                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                >
                    {categories.map(category => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editingId !== null
                        ? "Update Transaction"
                        : "Add Transaction"}
                </button>

                {editingId !== null && (
                    <button type="button" onClick={cancelEdit}>
                        Cancel Edit
                    </button>
                )}

                {message && <p>{message}</p>}

            </form>

            {/* Transaction List */}
            <div className="transaction-list">

                <div className="transaction-heading">
                    <h2>All Transactions</h2>

                    <div className="transaction-actions">

                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expenses</option>
                        </select>

                        <button type="button" onClick={exportCSV}>
                            Export CSV
                        </button>

                    </div>
                </div>

                {/* Date and Category Filters */}
                <div className="filter-controls">

                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        aria-label="Start date"
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        min={startDate || undefined}
                        aria-label="End date"
                    />

                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">All Categories</option>

                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => {
                            setFilter("all");
                            setCategoryFilter("all");
                            setStartDate("");
                            setEndDate("");
                        }}
                    >
                        Clear Filters
                    </button>

                </div>

                <p>
                    Showing {filteredTransactions.length} transactions
                </p>

                <div className="table-container">

                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredTransactions.map(t => (
                                <tr key={t.id}>
                                    <td>{t.title}</td>
                                    <td>{t.category}</td>
                                    <td>{t.date}</td>
                                    <td>{t.type}</td>

                                    <td>
                                        ₹{Number(t.amount).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(t)}
                                        >
                                            Edit
                                        </button>

                                        {" "}

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}

export default Transactions;
