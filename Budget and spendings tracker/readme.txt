1. Project Summary
    The project is a budget and spending tracker web application designed to help users manage their finances effectively. It features a visually appealing, diary-like interface with a fall color theme, allowing users to input and track their budgets, add spending entries, and view their spending history. The application now supports multiple currencies, with Philippine Peso set as the default, enhancing usability for users with diverse financial needs. Recent enhancements include a reset budget feature and a new savings goals page.

2. Project Module Description
    Budget Input: Users can set their monthly budget in various currencies.
    Expense Entry: Allows adding expenses with details such as date, description, category, amount, and currency.
    Spending History : Displays a history of all expenses with options to delete entries.
    Remaining Budget Calculation : Automatically calculates and updates the remaining budget based on expenses.
    Currency Selector : Users can choose their preferred currency from a dropdown menu.
    Local Storage : Ensures data persistence across sessions, including currency preferences.
    Reset Budget : A button to clear all budget and spending data, with a confirmation dialog.
    Savings Goals : A separate page for users to set and track multiple savings goals, including progress visualization.

3. Directory Tree
    ```
    html_template/
    ├── index.html          # Main structure and forms for the budget tracker, including currency selection    and reset button
    ├── goals.html          # New page for managing savings goals
    ├── style.css          # Stylesheet for the diary-like design with fall colors and currency selector styling
    ├── script.js          # JavaScript for budget tracking logic, currency handling, local storage, and reset functionality
    ├── goals.js           # JavaScript for managing savings goals logic and local storage
    └── goals.css          # Additional styles for the savings goals page
```

4. File Description Inventory

  index.html : Contains the HTML structure and forms for user interaction, including the currency selector and reset button.

  goals.html : Structure for the savings goals page, allowing users to add and track goals.
  style.css : Implements the visual design, including the fall color theme, diary-like appearance, and styles for the currency selector.

  script.js : Manages the application's logic, including budget tracking, currency handling, local storage, and reset functionality.

  goals.js : Handles the logic for savings goals, including adding, updating, and deleting goals.

  goals.css : Styles specific to the savings goals features.

5. Technology Stack
    HTML
    CSS
    JavaScript

6. Usage
    1. Open the `index.html` file in a web browser.
    2. Set your monthly budget using the currency selector.
    3. Add expenses with the date, description, category, amount, and selected currency.
    4. Use the reset button to clear all budget data, confirming the action when prompted.
    5. Navigate to the savings goals page to add multiple savings goals, set target amounts, and track progress.
    6. Refresh the page to verify that your data and currency preferences persist.
