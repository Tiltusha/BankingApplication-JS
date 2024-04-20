"use strict";

// 
const account1 = {
  owner: "Nikita Lisicyn",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// получение всех элементов
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");


/// добавление операций из массива в html 
function displayMovements(movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (value, index) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const operation = value > 0? "зачисление" : "снятие";
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${operation}
          </div>
          <div class="movements__date">3 дня назад</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `
    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
};

//функция создает логин из первых 2 букв имени и фамилии
function createLogIn(accs) {
  accs.forEach(acc => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map(val => {
        return val[0]
      })
      .join("")
  })
}

createLogIn(accounts);
// функция считает баланс и выводит в html
function calculateBalance(acc) {
    acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
    labelBalance.innerHTML = acc.balance + '₽';
};

// функция выводит прибыль, убыток и выводит их сумму в html
function sumIn(movements) {
  let sumIn = 0, sumOut = 0;
  movements.forEach(move => {move > 0 ? sumIn+=move : sumOut+=move})
  labelSumIn.innerHTML = sumIn + '₽';
  labelSumOut.innerHTML = sumOut + '₽';
  labelSumInterest.innerHTML = (sumIn + sumOut);
}


// функция обновляет интерфейс при изменении состояния аккаунта
function updateUI(accs) {
  displayMovements(accs.movements);
  calculateBalance(accs);
  sumIn(accs.movements);
}


// реализация логина в акккаунт
let currentAccount;
btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.logIn === inputLoginUsername.value;
  });
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = "";
    console.log(currentAccount);
    updateUI(currentAccount);
  }
})

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => {return acc.logIn === inputTransferTo.value}) 
  const amount = +inputTransferAmount.value;
  if(reciveAcc && amount >0 && currentAccount.balance >= amount && reciveAcc.logIn !== currentAccount.logIn) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
})