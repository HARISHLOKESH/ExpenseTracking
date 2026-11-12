
import { useBudget } from "../context/BudgetContext";
import SummaryCard from "../components/SummaryCard";

function Dashboard() {
    const { transactions, analytics, loading, error } = useBudget();

    if (loading) return <h2>Loading dashboard...</h2>;
    if (error) return <h2>Error: {error}</h2>;

    return (
        <div className="page-content">

            <header className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome to your personal finance overview.</p>
                </div>

                <span>{new Date().toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric"
                })}</span>
            </header>

            <section className="summary-grid">

                <SummaryCard
                    title="Total Balance"
                    amount={analytics.balance}
                    color="#2563eb"
                    symbol="₹"
                />

                <SummaryCard
                    title="Total Income"
                    amount={analytics.totalIncome}
                    color="#16a34a"
                    symbol="+"
                />

                <SummaryCard
                    title="Total Expenses"
                    amount={analytics.totalExpenses}
                    color="#dc2626"
                    symbol="-"
                />

            </section>

            <section className="transactions-section">

                <h2>Recent Transactions</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.slice(-5).reverse().map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{transaction.title}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.type}</td>
                                    <td>
                                        ₹{Number(transaction.amount).toLocaleString("en-IN")}
                                    </td>
                                </tr>
                            ))}

                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5">No transactions available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </section>

        </div>
    );
}

export default Dashboard;
