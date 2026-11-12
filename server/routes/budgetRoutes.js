
const express = require("express");
const router = express.Router();

const { budgets, transactions } = require("../data");

// GET all budgets
router.get("/", (req, res) => {
    res.json(budgets);
});

// POST a new budget
router.post("/", (req, res) => {
    const { category, limit, month } = req.body;

    if (
        !category ||
        typeof limit !== "number" ||
        !Number.isFinite(limit) ||
        limit <= 0 ||
        !/^\d{4}-\d{2}$/.test(month || "") ||
        Number(month.split("-")[1]) < 1 ||
        Number(month.split("-")[1]) > 12
    ) {
        return res.status(400).json({
            message: "Please provide valid budget details"
        });
    }

    const existingBudget = budgets.find(
        budget =>
            budget.category === category &&
            budget.month === month
    );

    if (existingBudget) {
        return res.status(409).json({
            message: "Budget already exists for this category and month"
        });
    }

    const newBudget = {
        id: budgets.length > 0
            ? Math.max(...budgets.map(b => b.id)) + 1
            : 1,
        category,
        limit,
        month
    };

    budgets.push(newBudget);

    res.status(201).json({
        message: "Budget created successfully",
        budget: newBudget
    });
});

// GET budget spending summary
router.get("/summary", (req, res) => {
    const summary = budgets.map(budget => {
        const spent = transactions
            .filter(transaction =>
                transaction.type === "expense" &&
                transaction.category === budget.category &&
                transaction.date.startsWith(budget.month)
            )
            .reduce((total, transaction) =>
                total + transaction.amount, 0
            );

        return {
            ...budget,
            spent,
            remaining: budget.limit - spent,
            exceeded: spent > budget.limit
        };
    });

    res.json(summary);
});

module.exports = router;
