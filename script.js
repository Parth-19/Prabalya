function createRandomSpan() {
  const newDigit = document.createElement("span");
  return newDigit;
}

function getRandom(nonZero) {
  return nonZero
    ? Math.floor(Math.random() * 9) + 1
    : Math.floor(Math.random() * 10);
}

function createRandomNumbersTo(parentNode) {
  if (!parentNode) {
    throw new Error("Must be a valid parent node");
  }
  return function (digits, nextDigitTimeGap, digitSettledTime) {
    let isValid = (number) => Number.isSafeInteger(+number) && +number > 0;

    if (
      !isValid(digits) ||
      !isValid(nextDigitTimeGap) ||
      !isValid(digitSettledTime)
    ) {
      throw new Error("Arguments must be positive integer");
    }

    if (digitSettledTime <= 10) {
      throw new Error("digitSettledTime must be greater than 10 milliseconds");
    }

    return new Promise((resolve, reject) => {
      function getFinalNumber() {
        parentNode.classList.add("random-resolved");
        let number = parentNode.innerText;
        parentNode.innerHTML = number;
        if (!Number.isSafeInteger(+number)) {
          resolve(BigInt(number));
          return;
        }
        resolve(+number);
      }

      function gerenateNumber(speed, endTime, nonZero = false) {
        let newDigit = createRandomSpan();
        parentNode.prepend(newDigit);
        let digitId = setInterval(() => {
          if (shouldStop()) {
            clearInterval(digitId);
            return;
          }
          endTime -= speed;
          let randomNumber = getRandom(nonZero);
          if (endTime > 0) {
            newDigit.textContent = randomNumber;
            return;
          }
          newDigit.classList.add("random-resolved");
          clearInterval(digitId);
        }, speed);
      }
      let digit = 1;
      let isLastDigit = () => digit === digits;

      function generateDigit() {
        if (shouldStop()) {
          clearInterval(genRandomNumberId);
          return;
        }
        if (isLastDigit()) {
          gerenateNumber(10, digitSettledTime, true);
          setTimeout(() => {
            getFinalNumber();
          }, digitSettledTime);
          clearInterval(genRandomNumberId);
          return;
        }
        gerenateNumber(10, digitSettledTime);
        digit++;
      }

      let genRandomNumberId = setInterval(generateDigit, nextDigitTimeGap);
      generateDigit(); //remove first interval delay
    });
  };
}

function prependRandomNumbersTo(selector) {
  if (typeof selector !== "string" || !selector.length) {
    throw new Error("Selector should be non-empty string");
  }
  const element = document.querySelector(selector);
  return createRandomNumbersTo(element);
}

function shouldStop() {
  return stop;
}
function resetAll() {
  stop = true;
  let numbers = [...document.querySelectorAll(".number")];
  numbers.forEach((number) => {
    number.textContent = "";
    number.classList.remove("random-resolved");
  });
  setTimeout(() => {
    main();
  }, 1000);
}

function main() {
  stop = false;
  //   prependRandomNumbersTo(".very-slow")(5, 1000, 1200).then((n) =>
  //     console.log(`resolved (very slow):`, n)
  //   );
  prependRandomNumbersTo(".slow")(7, 500, 1000).then((n) =>
    console.log(`resolved (slow):`, n)
  );
  //   prependRandomNumbersTo(".medium-slow")(10, 250, 1100).then((n) =>
  //     console.log(`resolved (medium slow):`, n)
  //   );
  //   prependRandomNumbersTo(".medium")(15, 100, 1000).then((n) =>
  //     console.log(`resolved (medium):`, n)
  //   );
  //   prependRandomNumbersTo(".medium-fast")(20, 70, 200).then((n) =>
  //     console.log(`resolved (medium fast):`, n)
  //   );
  //   prependRandomNumbersTo(".fast")(25, 50, 50).then((n) =>
  //     console.log(`resolved (fast):`, n)
  //   );
  //   prependRandomNumbersTo(".very-fast")(30, 15, 20).then((n) =>
  //     console.log(`resolved (very fast):`, n)
  //   );
}

let stop = false;

main();
