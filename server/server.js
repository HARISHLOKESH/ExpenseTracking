
const express = require("express");

const app = express();

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        "http://localhost:5173",
        process.env.CLIENT_URL
    ].filter(Boolean);

    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

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

// Export Express app for Vercel
module.exports = app;

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}
