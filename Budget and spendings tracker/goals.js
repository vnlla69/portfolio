// goals.js
// Currency symbols mapping (same as in script.js)
const currencySymbols = {
    PHP: '₱',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    AUD: 'A$',
    SGD: 'S$'
};

// Initialize goals in localStorage if not exist
if (!localStorage.getItem('goals')) {
    localStorage.setItem('goals', JSON.stringify([]));
}

let currentCurrency = localStorage.getItem('currency') || 'PHP';
let goals = JSON.parse(localStorage.getItem('goals')) || [];

function getCurrencySymbol() {
    return currencySymbols[currentCurrency];
}

function formatAmount(amount) {
    return `${getCurrencySymbol()}${amount.toFixed(2)}`;
}

function addGoal() {
    const name = document.getElementById('goal-name').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);
    const deadline = document.getElementById('goal-deadline').value;

    if (!name || isNaN(amount) || amount <= 0 || !deadline) {
        alert('Please fill all fields with valid values');
        return;
    }

    const goal = {
        id: Date.now(),
        name,
        targetAmount: amount,
        currentAmount: 0,
        deadline,
        createdAt: new Date().toISOString()
    };

    goals.push(goal);
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
    clearGoalForm();
}

function updateGoalProgress(id, amount) {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newAmount = parseFloat(amount);
    if (isNaN(newAmount)) return;

    goal.currentAmount = Math.min(goal.targetAmount, newAmount);
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    goals = goals.filter(goal => goal.id !== id);
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

function resetGoals() {
    if (!confirm('Are you sure you want to reset all goals? This cannot be undone!')) return;
    goals = [];
    localStorage.setItem('goals', JSON.stringify(goals));
    renderGoals();
}

function clearGoalForm() {
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-amount').value = '';
    document.getElementById('goal-deadline').value = '';
}

function renderGoals() {
    const goalsList = document.getElementById('goals-list');
    goalsList.innerHTML = '';

    goals.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).forEach(goal => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const remainingAmount = goal.targetAmount - goal.currentAmount;
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-header">
                <h3>${goal.name}</h3>
                <button class="delete-btn" onclick="deleteGoal(${goal.id})">Delete</button>
            </div>
            <div class="goal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="progress-stats">
                    <p>Target: ${formatAmount(goal.targetAmount)}</p>
                    <p>Current: ${formatAmount(goal.currentAmount)}</p>
                    <p>Remaining: ${formatAmount(remainingAmount)}</p>
                </div>
                <div class="goal-deadline">
                    <p>${daysLeft} days left (Due: ${new Date(goal.deadline).toLocaleDateString()})</p>
                </div>
            </div>
            <div class="goal-update">
                <input type="number" 
                       placeholder="Update progress" 
                       value="${goal.currentAmount}"
                       onchange="updateGoalProgress(${goal.id}, this.value)">
            </div>
        `;
        goalsList.appendChild(goalElement);
    });
}

document.addEventListener('DOMContentLoaded', renderGoals);