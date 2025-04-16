'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Mohammad Masham',
  movements: [10000, 20000, -6500, -18700, -2000, 27000, 5900, -3500],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-11-18T21:31:17.178Z',
    '2024-12-23T07:42:02.383Z',
    '2024-01-28T09:15:04.904Z',
    '2024-04-01T10:17:24.185Z',
    '2024-05-08T14:11:59.604Z',
    '2024-05-27T17:01:17.194Z',
    '2025-01-11T23:36:17.929Z',
    '2025-02-24T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
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

const account3 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [20000, 4500, -4000, 30000, -6500, -1300, 700, 13000];

/////////////////////////////////////////////////
/*
const arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr);
arr.splice(2);
console.log(arr);
// arr.splice(2, 1);
// console.log(arr);
// arr.splice(-2);
// console.log(arr);
*/

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  switch (daysPassed) {
    case 0:
      return 'today';
    case 1:
      return 'yesterday';
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
      return `${daysPassed} days ago`;
    default:
      return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formattedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const combinedMovsDates = acc.movements.map((mov, i) => {
    return { movement: mov, movementDate: acc.movementsDates.at(i) };
  });
  // console.log(combinedMovsDates);

  if (sort) combinedMovsDates.sort((a, b) => a.movement - b.movement);
  // const movs = sort
  //   ? acc.movements.slice().sort((a, b) => a - b)
  //   : acc.movements;

  combinedMovsDates.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(movementDate);

    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formattedCur(movement, acc.locale, acc.currency);

    new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(movement);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div> 
    <div class="movements__value">${formattedMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = `${formattedCur(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  // INTEREST -- 1.2% which is made on each deposits
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 100)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formattedCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

// calcDisplaySummary(account1);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(elem => elem[0])
      .join('');
  });
};

createUsernames(accounts);
// console.log(accounts);

const euroToInr = 89.1;
const usdToInr = 86.5;
const movementsINR = movements.map(current => current / euroToInr);

const deposits = movements.filter(mov => mov > 0);
const withdrawals = movements.filter(mov => mov < 0);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formattedCur(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// PIPELINE

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov / usdToInr)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(currentAccount);

  calcDisplaySummary(currentAccount);
};

const startLogOutTimer = function () {
  // Set time to 10min
  let time = 600;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(Math.trunc(time % 60)).padStart(2, '0');
    // log to the ui the timer every second
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 second left logout user and stop timer
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // decrease 1 s from the time
    time--;
  };
  // Callback function every 1 second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// LOG-IN

let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => inputLoginUsername.value === acc.username
  );

  const now = new Date();

  const options = {
    hour: 'numeric',
    minutes: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  const locale = navigator.language;
  // console.log(locale);

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';
    console.log('login');

    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiverAcc?.username != currentAccount.username) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    setTimeout(() => {
      updateUI(currentAccount);
    }, 2500);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    +inputClosePin.value === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    console.log(index, inputCloseUsername.value);

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // console.log('Loan Granted');
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 2500);
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputLoanAmount.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const overallBalance = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

///////////////////////////////////////
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/
/*
const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

// 1.
const huskyWeight = breeds.find(obj => obj.breed === 'Husky').averageWeight;
console.log(huskyWeight);

// 2.
const dogBothActivities = breeds.find(
  obj => obj.activities.includes('running') && obj.activities.includes('fetch')
).breed;
console.log(dogBothActivities);

// 3.
const allActivities = breeds.flatMap(obj => obj.activities);
console.log(allActivities);

// 4.
const uniqueActivities = [...new Set(allActivities)];
console.log(uniqueActivities);

// 5.
const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(breed => breed.activities)
  ),
];

// 6.
console.log(breeds.every(obj => obj.averageWeight >= 10));

// 7.
console.log(breeds.some(obj => obj.activities.length >= 3));

// BONUS
console.log(
  Math.max(
    ...breeds
      .filter(obj => obj.activities.includes('fetch'))
      .map(obj => obj.averageWeight)
  )
);

console.log(movements);
movements.sort((a, b) => a - b);
console.log(movements);

//  this is a nice title --> This Is a Nice Title

*/

///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
GOOD LUCK 😀
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.
dogs.forEach((dog, ind) => (dog.recFood = dog.weight ** 0.75 * 28));
console.log(dogs);

// 2.
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
if (dogSarah.curFood > dogSarah.recFood * 0.1 + dogSarah.recFood) {
  console.log("Sarah's Dog is eating too much");
} else if (dogSarah.curFood < dogSarah.recFood - dogSarah.recFood * 0.1) {
  console.log("Sarah's Dog is eating too less");
} else {
  console.log("Sarah's Dog is eating okay amount");
}
// 3.
const { ownersTooMuch, ownersTooLittle } = dogs.reduce(
  (obj, dog) => {
    if (dog.curFood > dog.recFood + dog.recFood * 0.1) {
      obj.ownersTooMuch.push(...dog.owners);
    } else if (dog.curFood < dog.recFood - dog.recFood * 0.1) {
      obj.ownersTooLittle.push(...dog.owners);
    }
    return obj;
  },
  { ownersTooMuch: new Array(), ownersTooLittle: new Array() }
);
console.log(ownersTooMuch);
console.log(ownersTooLittle);

// Matilda and Alice and Bob's dogs eat too much!
// 4.
// dogs.forEach()
dogs.forEach(dog => {
  if (dog.curFood > dog.recFood + dog.recFood * 0.1) {
    console.log(`${dog.owners.join(' and ')}'s Dogs eat too much!`);
  } else if (dog.curFood < dog.recFood - dog.recFood * 0.1) {
    console.log(`${dog.owners.join(' and ')}'s Dogs eat too less!`);
  } else {
    console.log(`${dog.owners.join(' and ')}'s Dogs eat okay amount!`);
}
});
console.log(`------------------------------`);

// 5.
dogs.forEach(dog => {
  if (
    dog.curFood >= dog.recFood + dog.recFood * 0.1 &&
    dog.curFood <= dog.recFood - dog.recFood * 0.1
  ) {
    // console.log(`${dog.owners.join(' and ')}'s Dogs eat okay amount!`);
  }
});

// 6.
// console.log(`--------------------`);
// console.log(
  //   `Are All dogs eating in okay amount : ${dogs.every(
    //     dog =>
      //       dog.curFood <= dog.recFood + dog.recFood * 0.1 &&
    //       dog.curFood >= dog.recFood - dog.recFood * 0.1
    //   )}`
    // );
    
    // 7.
    const dogEatingOkay = dogs.filter(
      dog =>
        dog.curFood <= dog.recFood + dog.recFood * 0.1 &&
      dog.curFood >= dog.recFood - dog.recFood * 0.1
    );
    // console.log(dogEatingOkay);
    // console.log(`--------------------`);
    // 8.
    
    const { tooMuch, tooLittle, Exact } = Object.groupBy(dogs, dog => {
      if (dog.curFood >= dog.recFood + dog.recFood * 0.1) {
        return 'tooMuch';
      } else if (dog.curFood <= dog.recFood - dog.recFood * 0.1) {
        return 'tooLittle';
      } else {
        return 'Exact';
    }
});
// console.log(tooMuch);
// console.log(tooLittle);
// console.log(Exact);

// 9.
const dogOwnerGroup = dogs.reduce(
  (accObj, dog) => {
    if (dog.owners.length === 1) {
      accObj.one.push(dog);
    } else if (dog.owners.length === 2) {
      accObj.two.push(dog);
    } else if (dog.owners.length === 3) {
      accObj.three.push(dog);
    } else {
      accObj.moreThanThree.push(dog);
  }
  return accObj;
},
{ one: [], two: [], three: [], moreThanThree: [] }
);
// console.log(dogOwnerGroup);

// 10.
// const dogsSorted = dogs.slice().sort((first,second) =>first.recFood - second.recFood);
const dogsSorted = dogs.toSorted(
  (first, second) => first.recFood - second.recFood
);
// console.log(dogsSorted);
// console.log('-------------------------------------------');
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min - 1)) + min;

const isEven = n => (n % 2 === 0 ? true : false);

const today = new Date();
console.log(today);

const todayA = new Date(2005, 4, 21, 20, 13);
console.log(todayA);

console.log(`my age : ${today.getTime() - todayA.getTime()}`);


const now = new Date();
const day = `${now.getDate()}`.padStart(2, '0');
const month = now.getMonth() + 1;
const year = now.getFullYear();
const hours = now.getHours();
const minutes = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;

*/
