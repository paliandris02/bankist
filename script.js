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
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2022-08-31T08:33:06.386Z',
    '2022-08-30T14:43:26.374Z',
    '2022-08-28T18:49:59.371Z',
    '2022-08-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

let currentAccount;
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  weekday: 'long',
  month: 'long',
  year: 'numeric',
};
labelDate.textContent = new Intl.DateTimeFormat('hu-HU', options).format(now);

//fake logged in
currentAccount = account2;
containerApp.style.opacity = 100;

//FUNCTIONS

//---------------------------------------------
const formatMovementDate = date => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / 1000 / 60 / 60 / 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
//---------------------------------------------
const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//---------------------------------------------
const createUsernames = accs => {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name.charAt(0))
      .join('');
  });
};
//---------------------------------------------
const calcDisplayBalance = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const expenses = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(expenses).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};
//---------------------------------------------
const calcAndPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  //display balance
  calcDisplayBalance(currentAccount);
  //display summary
  calcAndPrintBalance(currentAccount);
};
//---------------------------------------------
createUsernames(accounts);
updateUI(currentAccount);
//eventhandlers

//LOGIN

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

    //Create current date and time
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    containerApp.style.opacity = 100;
    //display movements
    updateUI(currentAccount);
  }
});

//TRANSFER

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

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

//LOAN

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
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

//SORTING

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
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
/*
labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

*/
//CODING CHALLENGE #4
/*
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//1
dogs.forEach(element => {
  element.recommendedFood = Math.trunc(element.weight ** 0.75 * 28);
});
//2
const SarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(
  SarahDog.recommendedFood > SarahDog.curFood ? 'Underfed' : 'Overfed'
);
//3
const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recommendedFood);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs.filter(
  dog => dog.curFood < dog.recommendedFood
);
console.log(ownersEatTooLittle);
//4

let arr1 = [];
ownersEatTooMuch.forEach(element => {
  arr1 = arr1.concat(element.owners);
});
let str1 = arr1.join(' and ');
console.log(`${str1}'s dogs eat too much.`);

let arr2 = [];
ownersEatTooLittle.forEach(element => {
  arr2 = arr2.concat(element.owners);
});
let str2 = arr2.join(' and ');
console.log(`${str2}'s dogs eat too little.`);
//5
let state = false;

dogs.forEach(dog => {
  if (dog.curFood === dog.recommendedFood) {
    state = true;
  }
});
console.log(state);

console.log(dogs.some(dog => dog.curFood === dog.recFood));
//6
console.log(
  dogs.some(
    dog => dog.curFood < dog.curFood * 1.1 || dog.curFood > dog.curFood * 0.9
  )
);
//7
const dogsEatingOkay = dogs.filter(
  dog => dog.curFood < dog.curFood * 1.1 || dog.curFood > dog.curFood * 0.9
);

console.log(dogsEatingOkay);
//8
console.log('-----------------8---------------');
const dogsCopy = dogs.slice();
dogsCopy.sort((a, b) => a.curFood - b.curFood);
console.log(dogsCopy);
*/
/*
console.log(Math.sqrt(2));
console.log(8 ** (1 / 3));
console.log(Math.max(5, 234, 1, 4, 12, 3));
console.log(Math.min(5, 234, 1, 4, 12, 3));

console.log(Math.PI * Number.parseFloat('10px') ** 2);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

console.log(randomInt(1, 8));
console.log(Math.round(2.4));
console.log(Math.round(2.6));

console.log(Math.trunc(-23.2));
console.log(Math.floor(-23.2));

console.log((2.7).toFixed(4));
console.log(+(2.2552).toFixed(2));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered';
    }
    if (i % 3 === 0) {
      row.style.backgroundColor = 'blue';
    }
  });
});
*/
//
/*
const diameter = 287_460_000_000;
console.log(diameter);
*/
/*
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(192784761728647812766711782478127n);
console.log(BigInt(471277));

console.log(10000n + 10000n);
console.log(
  249289184798127487198758917578971627864781n +
    213681562856215654652761547512645712n
);

const regular = 24;
const huge = 7249718274978129784976127964791267967194n;
console.log(BigInt(regular) + huge);

console.log(20n > 15);
console.log(20n === 20);
console.log(20n == 20);
console.log(typeof 20n);
*/

//Create a date
/*
const now = new Date();
console.log(
  now.getFullYear(),
  now.getDate(),
  now.getMonth() + 1,
  now.getDay(),
  now.getHours(),
  now.getMinutes(),
  now.getSeconds()
);
console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date('December 23, 2015'));
console.log(new Date(2102, 10, 19, 15, 23, 5));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth() + 1);
console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.getMilliseconds());

console.log(future.toISOString());
//timestamp -- milliseconds passed since 1970 jan 1
console.log(future.getTime());

console.log(Date.now());
future.setFullYear(2040);
console.log(future);
*/
/*
const future = new Date(2037, 10, 19, 15, 23);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 8, 23));

console.log(days1 / 1000 / 60 / 60 / 24);
*/
