"use strict";

// 
const account1 = {
  owner: "Nikita Lisicyn",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-01-29T17:01:17.194Z",
    "2023-01-31T23:36:17.929Z",
    "2023-02-02T10:51:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
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
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (value, index) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const operation = value > 0? "зачисление" : "снятие";
    const date = new Date(acc.movementsDates[index])
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0)
    const day = `${date.getDate()}`.padStart(2, 0)
    const hours = `${date.getHours()}`.padStart(2, 0)
    const minutes = `${date.getMinutes()}`.padStart(2, 0)
    const displayDate = `${day}/${month}/${year} ${hours}:${minutes}`

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${operation}
          </div>
          <div class="movements__date">${displayDate}</div>
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
  displayMovements(accs);
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


    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0)
    const day = `${now.getDate()}`.padStart(2, 0)
    const hours = `${now.getHours()}`.padStart(2, 0)
    const minutes = `${now.getMinutes()}`.padStart(2, 0)
    labelDate.textContent = day + "/" + (month) + "/" + year

    console.log(currentAccount);
    updateUI(currentAccount);
  }
})

// перевод денег между акккаунтами
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => {return acc.logIn === inputTransferTo.value}) 
  const amount = +inputTransferAmount.value;
  if(reciveAcc && amount >0 && currentAccount.balance >= amount && reciveAcc.logIn !== currentAccount.logIn) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString)
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
  }
});

// функция закрытия аккаунта
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.logIn && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex((acc) => {
      return acc.logIn === currentAccount.logIn
    })
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }}
);


// функция внесения денег
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString)
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
})

// вывод общего количества денег у всех пользователей
const allBalance = accounts.map((acc) => acc.movements).flat().reduce((acc, cur) => acc + cur, 0);
console.log(allBalance);


let sorted = false;
// кнопка сортировки
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
})

/// 
// const arr = [1,2, 3, 4, 5];
// arr.fill(1);
// console.log(arr);

// const str = '12345'
// console.log(Array.from(str, (val, index) => {return 'Число ' + val}))

// смена Р на RUb при клике на баланс (юзлес но прикольно)
labelBalance.addEventListener('click', () => {
  Array.from(document.querySelectorAll('.movements__value'), (val, i) => {
    return val.innerText = val.textContent.replace('₽', ' RUB')
  });
})