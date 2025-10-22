// main.js
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const form = document.getElementById("transactionForm");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const chartCanvas = document.getElementById("expenseChart");
let expenseChart;

// Load data from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter a text and amount");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  addTransactionDOM(transaction);
  updateValues();
  updateLocalStorage();
  updateChart();

  text.value = "";
  amount.value = "";
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "expense" : "income");

  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>
    <button onclick="removeTransaction(${transaction.id})">❌</button>
  `;

  list.prepend(item);
}

// Update balance, income, expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeTotal = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expenseTotal = (
    amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  income.textContent = `₹${incomeTotal}`;
  expense.textContent = `₹${expenseTotal}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

// Update localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Chart.js - Pie chart for expenses
function updateChart() {
  const incomeTotal = transactions.filter(t => t.amount > 0)
    .reduce((acc, val) => acc + val.amount, 0);
  const expenseTotal = transactions.filter(t => t.amount < 0)
    .reduce((acc, val) => acc + Math.abs(val.amount), 0);

  const data = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  if (expenseChart) {
    expenseChart.destroy();
  }

  expenseChart = new Chart(chartCanvas, {
    type: "pie",
    data,
  });
}

// Init app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

form.addEventListener("submit", addTransaction);

init();
