
const API_URL = "/api";
// Reusable function to communicate with Express
async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// Transaction APIs
export const getTransactions = (filters = "") =>
    request(`/transactions${filters}`);

export const addTransaction = (transaction) =>
    request("/transactions", {
        method: "POST",
        body: JSON.stringify(transaction)
    });

export const updateTransaction = (id, transaction) =>
    request(`/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(transaction)
    });

export const deleteTransaction = (id) =>
    request(`/transactions/${id}`, {
        method: "DELETE"
    });

// Budget APIs
export const getBudgets = () =>
    request("/budgets");

export const addBudget = (budget) =>
    request("/budgets", {
        method: "POST",
        body: JSON.stringify(budget)
    });

export const getBudgetSummary = () =>
    request("/budgets/summary");

// Analytics API
export const getAnalytics = (month = "") => {
    const query = month
        ? `?month=${encodeURIComponent(month)}`
        : "";

    return request(`/analytics${query}`);
};
