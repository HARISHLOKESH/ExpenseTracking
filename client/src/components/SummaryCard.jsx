
function SummaryCard({ title, amount, color, symbol }) {
    return (
        <div className="summary-card">
            <p>{title}</p>
            <h2 style={{ color }}>
                {symbol} {Number(amount).toLocaleString("en-IN")}
            </h2>
        </div>
    );
}

export default SummaryCard;
