
import { createContext, useContext, useEffect, useState } from "react";

import {
    getTransactions,
    getBudgets,
    getAnalytics,
    addTransaction as createTransaction,
    updateTransaction as editTransaction,
    deleteTransaction as removeTransaction
} from "../services/api";

const BudgetContext = createContext();

export function BudgetProvider({ children }) {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        categoryBreakdown: {},
        monthlyBreakdown: {}
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function refreshData() {
        try {
            setError("");

            const [transactionData, budgetData, analyticsData] =
                await Promise.all([
                    getTransactions(),
                    getBudgets(),
                    getAnalytics()
                ]);

            setTransactions(transactionData);
            setBudgets(budgetData);
            setAnalytics(analyticsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refreshData();
    }, []);

    async function addTransaction(transaction) {
        await createTransaction(transaction);
        await refreshData();
    }

    async function updateTransaction(id, transaction) {
        await editTransaction(id, transaction);
        await refreshData();
    }

    async function deleteTransaction(id) {
        await removeTransaction(id);
        await refreshData();
    }

    return (
        <BudgetContext.Provider
            value={{
                transactions,
                budgets,
                analytics,
                loading,
                error,
                refreshData,
                addTransaction,
                updateTransaction,
                deleteTransaction
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
}

export function useBudget() {
    return useContext(BudgetContext);
}
