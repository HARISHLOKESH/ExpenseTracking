
const transactions = [
    {
        id: 1,
        title: "Monthly Salary",
        amount: 30000,
        type: "income",
        category: "Salary",
        date: "2026-11-01"
    },
    {
        id: 2,
        title: "Grocery Shopping",
        amount: 2500,
        type: "expense",
        category: "Food",
        date: "2026-11-03"
    },
    {
        id: 3,
        title: "Petrol",
        amount: 1500,
        type: "expense",
        category: "Transport",
        date: "2026-11-05"
    },
    {
        id: 4,
        title: "Freelance Work",
        amount: 5000,
        type: "income",
        category: "Freelance",
        date: "2026-11-07"
    },
    {
        id: 5,
        title: "Movie Tickets",
        amount: 600,
        type: "expense",
        category: "Entertainment",
        date: "2026-11-09"
    }
];

const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Salary",
    "Freelance",
    "Other"
];

const budgets = [
    {
        id: 1,
        category: "Food",
        limit: 5000,
        month: "2026-11"
    },
    {
        id: 2,
        category: "Transport",
        limit: 3000,
        month: "2026-11"
    },
    {
        id: 3,
        category: "Entertainment",
        limit: 2000,
        month: "2026-11"
    }
];

module.exports = {
    transactions,
    categories,
    budgets
};
