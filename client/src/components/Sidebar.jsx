
function Sidebar({ activePage, onNavigate }) {
    const links = [
        { id: "dashboard", label: "Dashboard" },
        { id: "transactions", label: "Transactions" },
        { id: "budgets", label: "Budgets" },
        { id: "analytics", label: "Analytics" }
    ];

    return (
        <aside className="sidebar">
            <h2>BudgetIssueTracker</h2>

            <nav>
                {links.map(link => (
                    <button
                        key={link.id}
                        className={activePage === link.id ? "active" : ""}
                        onClick={() => onNavigate(link.id)}
                    >
                        {link.label}
                    </button>
                ))}
            </nav>

            <p className="sidebar-footer">
                Personal Finance Manager
            </p>
        </aside>
    );
}

export default Sidebar;
