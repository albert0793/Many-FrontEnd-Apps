const budget = document.querySelector("#budget");
const nameExpensive = document.querySelector("#name__expensive");
const expensive_total = document.querySelector("#expensive__total");
const budgetElement = document.querySelector(".budget");
const balanceElement = document.querySelector(".balance__total");
const expenseName = document.querySelector(".expense__name");
const expenseAmount = document.querySelector("#amount__expensive");
let total = 0;
let balance = 0;
let editing = false;
let uniqueId = 1;
let expenseObject = {
  id: undefined,
  item: "",
  amount: 0,
};
let expenseList = [];
// Buttons

const btnCreateBudget = document.querySelector("#create__budget");
const btnAddExpensive = document.querySelector("#add__expensive");

// Error Elements
const errorElements = document.querySelectorAll(".error__message");

// Create Budget
function createBudget() {
  const errorElement = document.querySelector("#budget__message");
  if (budget.value == "") {
    errorElement.innerHTML = "Please select a budget";
    errorElement.style.display = "block";
    return;
  }
  if (isNaN(budget.value)) {
    errorElement.style.display = "block";
    errorElement.innerHTML = "Please use only numbers (0-9)";
  } else {
    total = budget.value;
    balance = budget.value;
    expensive_total.textContent = total;
    errorElement.style.display = "block";
    balanceElement.innerHTML = balance;
    errorElement.textContent = "Budget created successfully";
  }
  // errorElement.style.display = 'none';
}

function idGenerator() {
  uniqueId += 1;
  return uniqueId;
}

// Add Expensive
function addExpensive() {
  const messageExpensiveNameElement = document.getElementById(
    "name__expensive__msg"
  );
  const amountExpensiveElement = document.getElementById("expensive__message");
  let item = "";
  let amount = 0;
  if (nameExpensive.value == "" && expenseAmount.value == "") {
    messageExpensiveNameElement.textContent = "Expensive name is required";
    amountExpensiveElement.textContent = "Expensive value is required";
    amountExpensiveElement.style.display = "block";
    messageExpensiveNameElement.style.display = "block";
  } else if (nameExpensive.value == "") {
    messageExpensiveNameElement.textContent = "Expensive name is required";
    messageExpensiveNameElement.style.display = "block";
  } else if (expenseAmount.value == "") {
    amountExpensiveElement.textContent = "Expensive value is required";
    amountExpensiveElement.style.display = "block";
  } else {
    if (isNaN(expenseAmount.value)) {
      amountExpensiveElement.textContent = "Please enter a valid amount";
      amountExpensiveElement.style.display = "block";
    }
    item = nameExpensive.value;
    amount = Number(expenseAmount.value);
    total = total - amount;
    balance = total;
    balanceElement.innerHTML = parseInt(balance);
    amountExpensiveElement.style.display = "none";
    const innerHTML = ` 
            <div class="expense" id="${idGenerator()}">
                <h4 class="expense__name">${item}</h4>
                <span>Total</span>
                <span class="expense__amount">${amount}</span>
                <div class="options">
                    <i class="uil uil-trash" onclick="deleteData(this)"></i>
                    <i class="uil uil-pen" onclick="editData(this)"></i>
                </div>
            </div>`;
    renderHTML(innerHTML, "expense__list");
  }
  expenseObject = {
    id: uniqueId,
    item: item,
    amount: amount,
  };
  expenseList.push(expenseObject);
  // // amounExpensiveElement.style.display = 'block';
  saveIntoLocalStorage("items", expenseList);
}
function resetValues() {
  budget.value = "";
  expenseAmount.value = "";
  nameExpensive.value = "";
  return false;
}

function renderHTML(data, id) {
  if ((data && id !== undefined) || (data && id !== null)) {
    try {
      const root = document.getElementById(id);
      if (editing) {
        root.innerHTML = data;
      } else {
        root.innerHTML += data;
      }
      resetValues();
      editing = false;
    } catch (error) {
      console.error(error);
    }
  }
}

function deleteData(e) {
  const id = e.parentElement.parentNode.getAttribute("id");
  const parent = document.getElementById(id);
  balance = parseInt(
    total + parseInt(parent.querySelector(".expense__amount").textContent)
  );
  total = balance;
  balanceElement.innerHTML = balance;
  document.getElementById(id).remove();
  return true;
}

// Save in the local storage
function saveIntoLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showFromLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  uniqueId = value.length;
  expenseList = value;
  value.map((item) => {
    let data = `<div class="expense" id="${item.id}">
        <h4 class="expense__name">${item.item}</h4>
        <span>Total</span>
        <span class="expense__amount">${item.amount}</span>
        <div class="options">
            <i class="uil uil-trash" onclick="deleteData(this)"></i>
            <i class="uil uil-pen" onclick="editData(this)"></i>
        </div>
    </div>`;
    uniqueId = expenseList.length;
    renderHTML(data, "expense__list");
  });
}

// Us define this variables for change data when editing
let data = undefined;
let id = undefined;
let itemName = undefined;
let itemAmount = undefined;
let objNew = {};
function editData(e) {
  editing = true;
  id = e.parentElement.parentNode.getAttribute("id");
  const parent = document.getElementById(id);
  const form = document.getElementById("expensive__container");
  const nameInput = form.querySelector("#name__expensive");
  const amountInput = form.querySelector("#amount__expensive");
  itemAmount = parent.querySelector(".expense__amount").textContent;
  itemName = parent.querySelector(".expense__name").textContent;
  nameInput.value = itemName;
  amountInput.value = itemAmount;
}
// Events Listener

btnCreateBudget.addEventListener("click", createBudget);
btnAddExpensive.addEventListener("click", () => {
  if (editing) {
    itemName = nameExpensive.value;
    itemAmount = expenseAmount.value;
    objNew = {
        id: id,
        item: itemName,
        amount: itemAmount,
      };
      expenseList.push(objNew);
      localStorage.removeItem("items");
      saveIntoLocalStorage('items', expenseList);
    data = `<h4 class="expense__name">${itemName}</h4>
    <span>Total</span>
    <span class="expense__amount">${itemAmount}</span>
    <div class="options">
    <i class="uil uil-trash" onclick="deleteData(this)"></i>
    <i class="uil uil-pen" onclick="editData(this)"></i>
    </div>`;
    renderHTML(data, id);
  } else {
    saveIntoLocalStorage("items", expenseList);
    addExpensive();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  showFromLocalStorage("items");
//   localStorage.removeItem('items');
});
