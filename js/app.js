const budget = document.querySelector("#budget");
const nameExpensive = document.querySelector("#name__expensive");
const expenseAmount = document.querySelector("#amount__expensive");
const expensive_total = document.querySelector("#expensive__total");
const budgetElement = document.querySelector(".budget");
const balanceElement = document.querySelector(".balance__total");
const expenseName = document.querySelector(".expense__name");
let total = 0;
let balance = 0;
let uniqueId = 0;
let editing = false;
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
const alertElement = document.querySelector("#alert");
const alertErrorEl = document.querySelector("#alert__message");

// Message Handler
function messageHandler(message, type, cascade = true) {
  message = message.toUpperCase();
  if (cascade) {
    alertElement.classList = "alert";
    alertElement.classList.add(type);
    alertErrorEl.innerHTML = message;
  } else {
    alertElement.classList.add(type);
    alertErrorEl.innerHTML = message;
  }
}

// Create Budget
function createBudget() {
  if (budget.value == "" || parseInt(budget.value) <= 0) {
    messageHandler("Please create a valid budget", "danger");
    setTimeout(() => {
      messageHandler("Please create a valid budget", "hidden");
      budget.value = "";
    }, 1000);
    return;
  }
  if (isNaN(budget.value)) {
    messageHandler("Please use only numbers (0-9)", "danger");
    return;
  } else {
    total = parseInt(budget.value);
    balance = parseInt(budget.value);
    expensive_total.textContent = total;
    balanceElement.innerHTML = balance;
    messageHandler("Budget created successfully", "success");
    setTimeout(() => {
      messageHandler("Budget created successfully", "hidden");
      budget.value = "";
    }, 1000);
    saveIntoLocalStorage("budget", total);
  }
  // errorElement.style.display = 'none';
}

function idGenerator() {
  uniqueId += 1;
  return uniqueId;
}

// Add Expensive
function addExpensive() {
  let item = "";
  let amount = 0;
  if (nameExpensive.value == "" && expenseAmount.value == "") {
    messageHandler("All Fields Are Required", "danger");
    setTimeout(() => {
      messageHandler("All Fields Are Required", "hidden");
    }, 2000);
    return;
  } else if (nameExpensive.value == "") {
    messageHandler("Expensive name is required", "danger");
    setTimeout(() => {
      messageHandler("Expensive name is required", "hidden");
    }, 2000);
    return;
  } else if (expenseAmount.value == "") {
    messageHandler("Expensive Amount is required", "danger");
    setTimeout(() => {
      messageHandler("Expensive Amount is required", "hidden");
    }, 2000);
    return;
  } else {
    if (isNaN(expenseAmount.value)) {
      messageHandler("Please enter a valid amount", "danger");
      setTimeout(() => {
        messageHandler("Please enter a valid amount", "hidden");
      }, 2000);
      return;
    } else {
      item = nameExpensive.value;
      amount = Number(expenseAmount.value);
      balance = balance - amount;
      balanceElement.innerHTML = parseInt(balance);
      const innerHTML = ` 
              <div class="expense" id="${idGenerator()}">
                  <h4 class="expense__name">${item}</h4>
                  <span>Total</span>
                  <span class="expense__amount">${amount}</span>
                  <div class="options">
                      <i class="uil uil-trash" onclick="deleteData(this)"></i>
                      <i class="uil uil-pen" onclick="prepareEdition(this)"></i>
                  </div>
              </div>`;
      messageHandler("Success", "success");
      setTimeout(() => {
        messageHandler("success", "hidden");
      }, 500);
      renderHTML(innerHTML, "expense__list");
    }
  }
  expenseObject = {
    id: uniqueId,
    item: item,
    amount: amount,
  };
  expenseList.push(expenseObject);
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
  if (editing) {
    resetValues();
  } else {
    const id = e.parentElement.parentNode.getAttribute("id");
    let idx = expenseList.findIndex((item) => item.id == id);
    balance = balance + parseInt(expenseList[idx].amount);
    balanceElement.innerHTML = balance;
    expenseList.splice(idx, 1);
    saveIntoLocalStorage("items", expenseList);
    document.getElementById(id).remove();
    return true;
  }
}

// Save into local storage
function saveIntoLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function showFromLocalStorage(key) {
  const value = JSON.parse(localStorage.getItem(key));
  let budgetLocal = 0;
  let balanceLocal = 0;
  expenseList = value.length ? value : [];
  uniqueId = expenseList.length && value.length  ? value.length : 0;
  uniqueId = value.length ? value.length : 0;
  // Showing balance and budget from local storage
  if (expenseList.length && parseInt(localStorage.getItem("budget")) > 0) {
    budgetLocal = parseInt(localStorage.getItem("budget"));
    balanceLocal = expenseList.reduce(
      (acc, expense) => parseInt(expense.amount) + parseInt(acc),
      0
    );
    total = budgetLocal;
    balance = total - balanceLocal;
    expensive_total.textContent = total;
    balanceElement.textContent = balance;
  } else if (parseInt(localStorage.getItem("budget")) > 0) {
    budgetLocal = parseInt(localStorage.getItem("budget"));
    balanceLocal = expenseList.reduce(
      (acc, expense) => parseInt(expense.amount) + parseInt(acc),
      0
    );
    total = budgetLocal;
    balance = total - balanceLocal;
    expensive_total.textContent = total;
    balanceElement.textContent = balance;
  }
  value.map((item, index) => {
    let data = `<div class="expense" id="${item.id}">
        <h4 class="expense__name">${item.item}</h4>
        <span>Total</span>
        <span class="expense__amount">${item.amount}</span>
        <div class="options">
            <i class="uil uil-trash" onclick="deleteData(this)"></i>
            <i class="uil uil-pen" onclick="prepareEdition(this)"></i>
        </div>
    </div>`;
    renderHTML(data, "expense__list");
  });
}
// Us define this variables for change data when editing
let itemId;
let dataEdited = {};
let nameItem;
let itemAmount;
function prepareEdition(e) {
  editing = true;
  itemId = event.target.parentElement.parentNode.getAttribute('id');
  nameItem = event.target.parentElement.parentNode.children[0].innerHTML;
  itemAmount = event.target.parentElement.parentNode.children[2].innerHTML;
  nameExpensive.value = nameItem;
  expenseAmount.value = itemAmount;
}

    
function editData(id) {
  editing = false;
  if(expenseList.length > 0) {
    let idx = expenseList.findIndex((item) => item.id === parseInt(id));
    let itemNew = expenseList[idx];
    itemNew.item = nameExpensive.value;
    itemNew.amount = expenseAmount.value;
    expenseList.splice(idx, 1);
    expenseList.push(itemNew);
    let balaceLocal = expenseList.reduce((acc, item) => parseInt(item.amount) + parseInt(acc), 0)
    balance = total - balaceLocal; 
    // console.log(balance)
    balanceElement.innerHTML = balance;
    saveIntoLocalStorage('items', expenseList);
    let data = `<div class="expense" id="${itemNew.id}">
        <h4 class="expense__name">${itemNew.item}</h4>
        <span>Total</span>
        <span class="expense__amount">${itemNew.amount}</span>
        <div class="options">
            <i class="uil uil-trash" onclick="deleteData(this)"></i>
            <i class="uil uil-pen" onclick="prepareEdition(this)"></i>
        </div>
    </div>`;
    document.getElementById(itemNew.id).innerHTML = '';
    renderHTML(data, itemNew.id);
    resetValues();
  }
}

// Event Listener
btnCreateBudget.addEventListener("click", createBudget);
btnAddExpensive.addEventListener("click", (e) => {
  if (editing) {
    editData(itemId)
  } else {
    addExpensive();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  showFromLocalStorage("items");
});
