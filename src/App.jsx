import { useState, useEffect } from "react";

const COLORS = {
  income: "#00f5a0",
  expense: "#ff4d6d",
  bg: "#0a0a0f",
  card: "#13131a",
  cardBorder: "#1e1e2e",
  accent: "#7c3aed",
  text: "#e2e8f0",
  muted: "#64748b",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, #root {
    background: ${COLORS.bg};
    min-height: 100vh;
    width: 100%;                /* ensure full width so container can center */
    font-family: 'Syne', sans-serif;
    color: ${COLORS.text};
  }

  /* override global body flex from index.css to center the app */
  body {
    display: flex;
    justify-content: center;
  }

  .tracker-root {
    min-height: 100vh;
    width: 100%;                /* take full available width */
    background: ${COLORS.bg};
    background-image:
      radial-gradient(ellipse 60% 40% at 20% 10%, rgba(124,58,237,0.15) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 80% 80%, rgba(0,245,160,0.08) 0%, transparent 60%);
    padding: 2.5rem 1rem;
  }

  .container {
    max-width: 860px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .header h1 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #fff 30%, ${COLORS.accent} 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.1;
  }

  .header p {
    color: ${COLORS.muted};
    margin-top: 0.5rem;
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  /* BALANCE STRIP */
  .balance-strip {
    display: grid;
    grid-template-columns: 1fr 1px 1fr 1px 1fr;
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 2rem;
    position: relative;
  }

  .balance-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 60%);
    pointer-events: none;
  }

  .balance-divider {
    background: ${COLORS.cardBorder};
    width: 1px;
  }

  .stat-cell {
    padding: 1.8rem 1.5rem;
    text-align: center;
    position: relative;
  }

  .stat-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${COLORS.muted};
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .stat-value {
    font-family: 'DM Mono', monospace;
    font-size: clamp(1.2rem, 3vw, 1.7rem);
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  .stat-value.balance { color: #fff; }
  .stat-value.income-val { color: ${COLORS.income}; }
  .stat-value.expense-val { color: ${COLORS.expense}; }

  .stat-icon {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
    display: block;
  }

  /* GRID LAYOUT */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 640px) {
    .main-grid { grid-template-columns: 1fr; }
  }

  /* FORM CARD */
  .form-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 20px;
    padding: 1.8rem;
  }

  .form-card h2 {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${COLORS.muted};
    margin-bottom: 1.4rem;
  }

  .field {
    margin-bottom: 1.1rem;
  }

  .field label {
    display: block;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${COLORS.muted};
    margin-bottom: 0.45rem;
    font-weight: 600;
  }

  .field input, .field select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 10px;
    padding: 0.75rem 1rem;
    color: ${COLORS.text};
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field input:focus, .field select:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
  }

  .field input::placeholder { color: ${COLORS.muted}; }

  .field select option { background: #1a1a2e; }

  /* TYPE TOGGLE */
  .type-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .type-btn {
    padding: 0.65rem;
    border-radius: 10px;
    border: 1.5px solid ${COLORS.cardBorder};
    background: transparent;
    color: ${COLORS.muted};
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    transition: all 0.2s;
  }

  .type-btn.income-active {
    border-color: ${COLORS.income};
    color: ${COLORS.income};
    background: rgba(0,245,160,0.08);
  }

  .type-btn.expense-active {
    border-color: ${COLORS.expense};
    color: ${COLORS.expense};
    background: rgba(255,77,109,0.08);
  }

  .add-btn {
    width: 100%;
    padding: 0.85rem;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, ${COLORS.accent}, #a855f7);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.04em;
    margin-top: 0.5rem;
    transition: opacity 0.2s, transform 0.15s;
    position: relative;
    overflow: hidden;
  }

  .add-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .add-btn:active { transform: translateY(0); }

  .add-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    pointer-events: none;
  }

  /* TRANSACTION LIST */
  .list-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 20px;
    overflow: hidden;
  }

  .list-header {
    padding: 1.5rem 1.8rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${COLORS.cardBorder};
  }

  .list-header h2 {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${COLORS.muted};
  }

  .count-badge {
    background: rgba(124,58,237,0.2);
    color: #a78bfa;
    border-radius: 20px;
    padding: 0.2rem 0.7rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
  }

  .tx-list {
    max-height: 420px;
    overflow-y: auto;
    padding: 0.6rem 0;
    scrollbar-width: thin;
    scrollbar-color: ${COLORS.cardBorder} transparent;
  }

  .tx-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.85rem 1.8rem;
    transition: background 0.15s;
    animation: slideIn 0.25s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .tx-item:hover { background: rgba(255,255,255,0.03); }

  .tx-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .tx-dot.income { background: ${COLORS.income}; box-shadow: 0 0 8px ${COLORS.income}66; }
  .tx-dot.expense { background: ${COLORS.expense}; box-shadow: 0 0 8px ${COLORS.expense}66; }

  .tx-desc {
    flex: 1;
    font-size: 0.95rem;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tx-amount {
    font-family: 'DM Mono', monospace;
    font-size: 0.9rem;
    font-weight: 500;
    flex-shrink: 0;
  }
  .tx-amount.income { color: ${COLORS.income}; }
  .tx-amount.expense { color: ${COLORS.expense}; }

  .del-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: ${COLORS.muted};
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    font-size: 0.9rem;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
  }
  .del-btn:hover { color: ${COLORS.expense}; background: rgba(255,77,109,0.1); }

  .empty-state {
    text-align: center;
    padding: 3rem 1.5rem;
    color: ${COLORS.muted};
  }
  .empty-state .emoji { font-size: 2.5rem; margin-bottom: 0.8rem; display: block; }
  .empty-state p { font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase; }

  .error-msg {
    color: ${COLORS.expense};
    font-size: 0.75rem;
    margin-top: 0.4rem;
    letter-spacing: 0.03em;
  }
`;

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState([
    { id: 1, desc: "Monthly Salary", amount: 5000, type: "income" },
    { id: 2, desc: "Rent Payment", amount: 1200, type: "expense" },
    { id: 3, desc: "Freelance Project", amount: 800, type: "income" },
  ]);

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [errors, setErrors] = useState({});

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const fmt = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

  const validate = () => {
    const e = {};
    if (!desc.trim()) e.desc = "Description is required";
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) e.amount = "Enter a positive number";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setTransactions(prev => [
      { id: Date.now(), desc: desc.trim(), amount: parseFloat(parseFloat(amount).toFixed(2)), type },
      ...prev,
    ]);
    setDesc(""); setAmount(""); setErrors({});
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <style>{styles}</style>
      <div className="tracker-root">
        <div className="container">
          <div className="header">
            <h1>Money Pulse</h1>
            <p>Track every dollar · Stay in control</p>
          </div>

          {/* BALANCE STRIP */}
          <div className="balance-strip">
            <div className="stat-cell">
              <span className="stat-icon">⚡</span>
              <div className="stat-label">Net Balance</div>
              <div className={`stat-value balance`} style={{ color: balance >= 0 ? "#fff" : COLORS.expense }}>
                {fmt(balance)}
              </div>
            </div>
            <div className="balance-divider" />
            <div className="stat-cell">
              <span className="stat-icon">↑</span>
              <div className="stat-label">Total Income</div>
              <div className="stat-value income-val">{fmt(totalIncome)}</div>
            </div>
            <div className="balance-divider" />
            <div className="stat-cell">
              <span className="stat-icon">↓</span>
              <div className="stat-label">Total Expenses</div>
              <div className="stat-value expense-val">{fmt(totalExpense)}</div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="main-grid">
            {/* FORM */}
            <div className="form-card">
              <h2>New Transaction</h2>

              <div className="field">
                <label>Type</label>
                <div className="type-toggle">
                  <button
                    className={`type-btn ${type === "income" ? "income-active" : ""}`}
                    onClick={() => setType("income")}
                  >↑ Income</button>
                  <button
                    className={`type-btn ${type === "expense" ? "expense-active" : ""}`}
                    onClick={() => setType("expense")}
                  >↓ Expense</button>
                </div>
              </div>

              <div className="field">
                <label>Description</label>
                <input
                  type="text"
                  placeholder="e.g. Salary, Groceries…"
                  value={desc}
                  onChange={e => { setDesc(e.target.value); setErrors(v => ({ ...v, desc: "" })); }}
                />
                {errors.desc && <div className="error-msg">{errors.desc}</div>}
              </div>

              <div className="field">
                <label>Amount ($)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setErrors(v => ({ ...v, amount: "" })); }}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                />
                {errors.amount && <div className="error-msg">{errors.amount}</div>}
              </div>

              <button className="add-btn" onClick={handleAdd}>
                + Add Transaction
              </button>
            </div>

            {/* LIST */}
            <div className="list-card">
              <div className="list-header">
                <h2>Transactions</h2>
                <span className="count-badge">{transactions.length}</span>
              </div>

              {transactions.length === 0 ? (
                <div className="empty-state">
                  <span className="emoji">🌑</span>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className="tx-list">
                  {transactions.map(t => (
                    <div key={t.id} className="tx-item">
                      <div className={`tx-dot ${t.type}`} />
                      <div className="tx-desc">{t.desc}</div>
                      <div className={`tx-amount ${t.type}`}>
                        {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                      </div>
                      <button className="del-btn" onClick={() => handleDelete(t.id)} title="Delete">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}