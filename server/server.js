
const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

// Custom CORS middleware
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "http://localhost:5173"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// Import routes
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Register routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/analytics", analyticsRoutes);

// Welcome route
app.get("/", (req, res) => {
    res.send("BudgetIssueTracker Backend is Running!");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
