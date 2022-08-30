'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2, 3));
const arr2 = arr.slice(2);
console.log(arr2);
console.log(arr.splice(2));

arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.reverse());

const letters = arr.concat(arr2);
console.log(letters);
console.log(letters.join(' - '));
*/

//FOREACH
/*
for (const movement of movements) {
  if (movement > 0) {
    console.log(`Deposit : ${movement}`);
  } else {
    console.log(`Withdrew : ${Math.abs(movement)}`);
  }
}
*/
/*
element > 0
? console.log(`${index + 1}: Deposit : ${element}`)
: console.log(`${index + 1}: Withdrew : ${Math.abs(element)}`);
});

//

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
currenciesUnique.forEach(value => {
  console.log(`${value}`);
});
*/

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.charAt(0))
      .join('');
  });
};

const calcDisplayBalance = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(expenses)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

createUsernames(accounts);
//eventhandlers

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);
  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcAndPrintBalance(currentAccount);
};

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;
    //display movements
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    //delete account
    accounts.splice(
      accounts.findIndex(acc => acc.username === currentAccount.username),
      1
    );
    //hide ui
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/*
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];
const checkDogs = function (dogsJulia, dogsKate) {
  const dogsKateCopy = dogsKate.slice();
  dogsKateCopy.pop();
  dogsKateCopy.shift();
  const arr = dogsJulia.concat(dogsKateCopy);
  arr.forEach((el, i) => {
    console.log(
      `Dog number ${i + 1} is ${
        el > 2 ? ` is an adult, and is ${el} years old` : ' is still a puppy'
      }`
      );
    });
};
checkDogs(dogsJulia, dogsKate);
*/
/*

const movementsUSD = movements.map(mov => Math.floor(mov * eurToUSD));
console.log(movements, movementsUSD);

const movementsDescriptions = movements.map((mov, i, arr) => {
  if (mov > 0) {
    return `Deposit ${i + 1}: ${mov}`;
  } else {
    return `Withdrew ${i + 1}: ${Math.abs(mov)}`;
  }
});
console.log(movementsDescriptions);
*/
/*
const deposits = movements.filter(mov => mov > 0);

console.log(movements);
console.log(deposits);
const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);
*/
//accumulator => snowball
/*
const aggregatedMovements = movements.reduce((acc, cur, i, arr) => {
  console.log(`${i}: ${acc} + ${cur}`);
  return acc + cur;
}, 0);
console.log(aggregatedMovements);
*/
//maximum value
/*

const max = movements.reduce((acc, mov) => {
  if (acc < mov) return mov;
  return acc;
}, movements[0]);

console.log(max);
*/
/*
const data = [5, 2, 4, 1, 15, 8, 3];
const calcAverageHumanAge = function (arr) {
  return arr
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
};

console.log(calcAverageHumanAge(data));
*/
/*
const eurToUSD = 1.1;
const total = movements
.filter(mov => mov > 0)
.map(mov => mov * eurToUSD)
.reduce((acc, cur) => {
  return acc + cur;
}, 0);
console.log(total);
*/

//FIND METHOD
/*

console.log(movements.find(mov => mov < 0));

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/
/*
const some = movements.some(mov => mov > 0);
console.log(some);

//separate the call back function
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
*/
/*
const arr = [[[1, 2], 3], [4, 5, 6], 7, 8];
console.log(arr.flat(1));
*/
//flat
/*
console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .reduce((acc, mov) => acc + mov, 0)
);
//flatmap
console.log(
  accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0)
);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
//ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

movements.sort((a, b) => a - b);
console.log(movements, 'asc');
movements.sort((a, b) => b - a);
console.log(movements, 'desc');

//descending
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
*/
/*
const x = new Array(7);
console.log(x);

//console.log(x.fill(0));
//console.log(x.fill(2, 2, 4));
console.log(Array.from({ length: 7 }, (_, i) => i + 1));
console.log(
  Array.from({ length: 100 }, (_, i) => {
    return Math.floor(Math.random() * 6 + 1);
  })
);*/

labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});
