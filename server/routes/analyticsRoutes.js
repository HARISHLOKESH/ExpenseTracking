
const express = require("express");
const router = express.Router();

const { transactions } = require("../data");

// GET financial analytics
router.get("/", (req, res) => {

    const { month } = req.query;

    // Validate optional month filter
    if (
        month &&
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)
    ) {
        return res.status(400).json({
            message: "Invalid month format. Use YYYY-MM"
        });
    }

    // Filter transactions by month if provided
    const filteredTransactions = month
        ? transactions.filter(t => t.date.startsWith(month))
        : transactions;

    // Calculate total income
    const totalIncome = filteredTransactions
        .filter(t => t.type === "income")
        .reduce((total, t) => total + t.amount, 0);

    // Calculate total expenses
    const totalExpenses = filteredTransactions
        .filter(t => t.type === "expense")
        .reduce((total, t) => total + t.amount, 0);

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    // Group expenses by category
    const categoryBreakdown = {};

    filteredTransactions
        .filter(t => t.type === "expense")
        .forEach(t => {
            categoryBreakdown[t.category] =
                (categoryBreakdown[t.category] || 0) + t.amount;
        });

    // Group transactions by month
    const monthlyBreakdown = {};

    filteredTransactions.forEach(t => {
        const transactionMonth = t.date.slice(0, 7);

        if (!monthlyBreakdown[transactionMonth]) {
            monthlyBreakdown[transactionMonth] = {
                income: 0,
                expenses: 0
            };
        }

        if (t.type === "income") {
            monthlyBreakdown[transactionMonth].income += t.amount;
        } else {
            monthlyBreakdown[transactionMonth].expenses += t.amount;
        }
    });

    res.json({
        totalIncome,
        totalExpenses,
        balance,
        categoryBreakdown,
        monthlyBreakdown
    });

});

module.exports = router;
