
const express = require("express");
const router = express.Router();

const { transactions } = require("../data");

// GET all transactions with filters
router.get("/", (req, res) => {
    const { startDate, endDate, category, type } = req.query;

    let filteredTransactions = [...transactions];

    // Validate start date
    if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        return res.status(400).json({
            message: "Invalid start date. Use YYYY-MM-DD"
        });
    }

    // Validate end date
    if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        return res.status(400).json({
            message: "Invalid end date. Use YYYY-MM-DD"
        });
    }

    // Validate date range
    if (startDate && endDate && startDate > endDate) {
        return res.status(400).json({
            message: "Start date cannot be after end date"
        });
    }

    // Filter by start date
    if (startDate) {
        filteredTransactions = filteredTransactions.filter(
            t => t.date >= startDate
        );
    }

    // Filter by end date
    if (endDate) {
        filteredTransactions = filteredTransactions.filter(
            t => t.date <= endDate
        );
    }

    // Filter by category
    if (category) {
        filteredTransactions = filteredTransactions.filter(
            t => t.category === category
        );
    }

    // Filter by transaction type
    if (type) {
        if (!["income", "expense"].includes(type)) {
            return res.status(400).json({
                message: "Type must be income or expense"
            });
        }

        filteredTransactions = filteredTransactions.filter(
            t => t.type === type
        );
    }

    res.json(filteredTransactions);
});


// POST a new transaction
router.post("/", (req, res) => {
    const { title, amount, type, category, date } = req.body;

    if (
        !title || !category || !date ||
        !["income", "expense"].includes(type) ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            message: "Please provide valid transaction details"
        });
    }

    const newTransaction = {
        id: transactions.length > 0
            ? Math.max(...transactions.map(t => t.id)) + 1
            : 1,
        title,
        amount,
        type,
        category,
        date
    };

    transactions.push(newTransaction);

    res.status(201).json({
        message: "Transaction added successfully",
        transaction: newTransaction
    });
});


// PUT - Update an existing transaction
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = transactions.findIndex(
        transaction => transaction.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Transaction not found"
        });
    }

    const { title, amount, type, category, date } = req.body;

    if (
        !title || !category || !date ||
        !["income", "expense"].includes(type) ||
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return res.status(400).json({
            message: "Please provide valid transaction details"
        });
    }

    transactions[index] = {
        id,
        title,
        amount,
        type,
        category,
        date
    };

    res.json({
        message: "Transaction updated successfully",
        transaction: transactions[index]
    });
});


// DELETE - Remove a transaction
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = transactions.findIndex(
        transaction => transaction.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Transaction not found"
        });
    }

    const deletedTransaction = transactions.splice(index, 1);

    res.json({
        message: "Transaction deleted successfully",
        transaction: deletedTransaction[0]
    });
});


// GET - Export transactions as CSV
router.get("/export/csv", (req, res) => {

    const headers = [
        "ID",
        "Title",
        "Amount",
        "Type",
        "Category",
        "Date"
    ];

    const escapeCSV = (value) => {
        const text = String(value ?? "");

        // Prevent spreadsheet formula execution
        const safeText = /^[\s]*[=+\-@]/.test(text)
            ? "'" + text
            : text;

        return `"${safeText.replace(/"/g, '""')}"`;
    };

    const rows = transactions.map(transaction => [
        transaction.id,
        transaction.title,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date
    ]);

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\n");

    res.attachment("transactions.csv");
    res.type("text/csv");

    res.send(csvContent);
});

module.exports = router;
