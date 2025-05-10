// currency symbols - add more if you want lmao
const currencySymbols = {
  PHP: '₱',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£',
  AUD: 'A$',
  SGD: 'S$'
};

// initialize local storage with default values if not exist
if (!localStorage.getItem('budget')) {
  localStorage.setItem('budget', '0');
  localStorage.setItem('expenses', JSON.stringify([]));
  localStorage.setItem('currency', 'PHP');
}

// initial currency
let currentCurrency = localStorage.getItem('currency') || 'PHP';
document.getElementById('currency').value = currentCurrency;

// load data from local storage
let budget = parseFloat(localStorage.getItem('budget')) || 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// update display on load
document.addEventListener('DOMContentLoaded', function() {
  updateBudgetDisplay();
  renderExpenses();
});

function setBudget() {
  const budgetInput = document.getElementById('budget-input');
  const newBudget = parseFloat(budgetInput.value);
  
  if (isNaN(newBudget) || newBudget < 0) {
      alert('Please enter a valid budget amount');
      return;
  }

  budget = newBudget;
  localStorage.setItem('budget', budget.toString());
  updateBudgetDisplay();
  budgetInput.value = '';
}

function addExpense() {
  const date = document.getElementById('expense-date').value;
  const description = document.getElementById('expense-description').value;
  const category = document.getElementById('expense-category').value;
  const amount = parseFloat(document.getElementById('expense-amount').value);

  if (!date || !description || isNaN(amount) || amount <= 0) {
      alert('Please fill all fields with valid values');
      return;
  }

  const expense = {
      id: Date.now(),
      date,
      description,
      category,
      amount
  };

  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  
  // clear form
  document.getElementById('expense-date').value = '';
  document.getElementById('expense-description').value = '';
  document.getElementById('expense-amount').value = '';
  
  updateBudgetDisplay();
  renderExpenses();
}

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  updateBudgetDisplay();
  renderExpenses();
}

function resetBudget() {
  if (!confirm('Are you sure you want to reset your budget and all expenses? This cannot be undone!')) {
      return;
  }
  
  budget = 0;
  expenses = [];
  localStorage.setItem('budget', '0');
  localStorage.setItem('expenses', JSON.stringify([]));
  updateBudgetDisplay();
  renderExpenses();
}

function getCurrencySymbol() {
  return currencySymbols[currentCurrency];
}

function changeCurrency() {
  const newCurrency = document.getElementById('currency').value;
  currentCurrency = newCurrency;
  localStorage.setItem('currency', newCurrency);
  updateBudgetDisplay();
  renderExpenses();
}

function formatAmount(amount) {
  return `${getCurrencySymbol()}${amount.toFixed(2)}`;
}

function updateBudgetDisplay() {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = budget - totalSpent;

  document.getElementById('total-budget').textContent = formatAmount(budget);
  document.getElementById('total-spent').textContent = formatAmount(totalSpent);
  document.getElementById('remaining-budget').textContent = formatAmount(remaining);
}

function renderExpenses() {
  const expenseList = document.getElementById('expense-list');
  expenseList.innerHTML = '';

  expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(expense => {
      const expenseElement = document.createElement('div');
      expenseElement.className = 'expense-item';
      expenseElement.innerHTML = `
          <div>
              <strong>${expense.date}</strong> - 
              ${expense.description} (${expense.category})
          </div>
          <div>
              <span>${formatAmount(expense.amount)}</span>
              <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
          </div>
      `;
      expenseList.appendChild(expenseElement);
  });
}