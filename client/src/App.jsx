
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";

function App() {
    const [activePage, setActivePage] = useState("dashboard");

    const pages = {
        dashboard: <Dashboard />,
        transactions: <Transactions />,
        budgets: <Budgets />,
        analytics: <Analytics />
    };

    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={setActivePage}
            />

            <main className="dashboard">
                {pages[activePage]}
            </main>
        </div>
    );
}

export default App;
