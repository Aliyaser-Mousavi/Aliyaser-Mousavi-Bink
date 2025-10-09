"use strict";
const account1 = {
  owner: "Aliyaser Mousavi",
  movements: [100],
  interestRate: 1.2,
  pin: 1010,
  movementsDates: ["2025-09-28T10:31:17.178Z"],
  currency: "AFN",
  locale: "fa-AF",
};
const account2 = {
  owner: "Mahdi Mousavi",
  movements: [100],
  interestRate: 1.5,
  pin: 6431,
  movementsDates: ["2025-09-25T09:15:33.035Z"],
  currency: "EUR",
  locale: "de-DE",
};
const account3 = {
  owner: "Mohammad Ali",
  movements: [100],
  interestRate: 0.7,
  pin: 4200,
  movementsDates: ["2025-09-26T11:15:33.035Z"],
  currency: "USD",
  locale: "en-US",
};
const account4 = {
  owner: "Alisina Chen",
  movements: [100],
  interestRate: 1.1,
  pin: 1234,
  movementsDates: ["2025-09-20T09:15:33.035Z"],
  currency: "CNY",
  locale: "zh-CN",
};
const account5 = {
  owner: "Reza Tanaka",
  movements: [100],
  interestRate: 0.9,
  pin: 1111,
  movementsDates: ["2025-09-19T08:15:33.035Z"],
  currency: "JPY",
  locale: "ja-JP",
};
const account6 = {
  owner: "Fatima Mousavi",
  movements: [100],
  interestRate: 0.9,
  pin: 2244,
  movementsDates: ["2025-09-19T08:15:33.035Z"],
  currency: "IRR",
  locale: "fa-IR",
};
const accounts = [account1, account2, account3, account4, account5, account6];

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
const saveAccounts = function () {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};
const loadAccounts = function () {
  const data = localStorage.getItem("accounts");
  if (data) {
    const parsed = JSON.parse(data);
    accounts.length = 0;
    parsed.forEach((acc) => accounts.push(acc));
  }
};
loadAccounts();
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const formatMovementDate = function (date, locale) {
  const calcDayspassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDayspassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const testFormat = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
  }).formatToParts(new Date());

  const is12Hour = testFormat.some((part) => part.type === "dayPeriod");

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: is12Hour,
  };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = acc.movements.map((mov, i) => ({
    value: mov,
    date: acc.movementsDates[i],
  }));

  const sortedMovs = sort
    ? movs.slice().sort((a, b) => a.value - b.value)
    : movs;

  sortedMovs.forEach(function (mov, i) {
    const type = mov.value > 0 ? "deposit" : "withdrawal";
    const date = new Date(mov.date);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov.value, acc.locale, acc.currency);

    const giftMessage = mov.value === 100 && i === 0 ? "🎁 Gift given!" : "";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
        <div class="movements__gift">${giftMessage}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accu, mov) => accu + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outs = acc.movements
    .filter((mov) => mov < 0)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(outs), acc.locale, acc.currency);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((accu, int) => accu + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(" ")[0];
  });
};
createUsernames(accounts);
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = new Intl.NumberFormat(currentAccount.locale, {
      minimumIntegerDigits: 2,
    }).format(Math.trunc(time / 60));

    const sec = new Intl.NumberFormat(currentAccount.locale, {
      minimumIntegerDigits: 2,
    }).format(time % 60);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timerIMP);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
      alert("You have been logged out due to inactivity!");
    }

    time--;
  };
  tick();
  timerIMP = setInterval(tick, 1000);
  return timerIMP;
};

let currentAccount, timerIMP;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value.toLowerCase()
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    function updateFullDateTime(locale) {
      const now = new Date();
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      const formatted = new Intl.DateTimeFormat(locale, options).format(now);
      labelDate.textContent = formatted;
    }
    updateFullDateTime(currentAccount.locale);
    setInterval(() => updateFullDateTime(currentAccount.locale), 1000);
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timerIMP) clearInterval(timerIMP);
    timerIMP = startLogOutTimer();
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value.toLowerCase()
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timerIMP);
    timerIMP = startLogOutTimer();
    saveAccounts();
  }
});
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timerIMP);
      timerIMP = startLogOutTimer();
    }, 2500);
    saveAccounts();
  }
  inputLoanAmount.value = "";
});
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    alert("You have logged out successfully!");

    currentAccount = null;
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  } else {
    alert("Incorrect username or PIN!");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
