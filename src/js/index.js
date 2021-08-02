import timerMarkup from '../templates/timer.hbs';

const refs = {
  calendar: document.querySelector('#date-input'),
  dateWarn: document.querySelector('.date-warning'),
  startBtn: document.querySelector('[data-action=start]'),
  stopBtn: document.querySelector('[data-action=stop]'),
  clearBtn: document.querySelector('[data-action=clear]'),
};

// document.querySelectorAll('.control-button').disabled
//   ? document.querySelector('.control-button').classList.add('.disabled')
//   : document.querySelector('.control-button').classList.remove('.disabled');

const today = new Date();
refs.calendar.min = dateFormatType__YYYY_MM_DD(today);
refs.dateWarn.insertAdjacentHTML('beforebegin', timerMarkup());
let targetDate = null;
// let timerId = null;

refs.calendar.addEventListener('change', onCalendarChange);

refs.startBtn.addEventListener('click', onStartBtnClick);

refs.stopBtn.addEventListener('click', onStopBtnClick);

refs.clearBtn.addEventListener('click', onClearBtnClick);

const timerSettings = {
  targetDate: getTargetDate,
  selector: 'timer-1',
  datePad,
  markupUpdate: timerMarkupUpdating,
};

class CountdownTimer {
  constructor({ targetDate, selector, datePad, markupUpdate }) {
    this.targetDate = targetDate;
    this.selector = selector;
    this.timerId = null;
    this.datePad = datePad;
    this.markupUpdate = markupUpdate;
  }

  start() {
    this.timerIdPromise(this.targetDate().valueAsNumber).then(this.onResolveTimer);
  }

  stop() {
    clearInterval(this.timerId);
  }

  timerIdPromise = date => {
    return new Promise(resolve => {
      resolve(
        setInterval(() => {
          let timeDiff = date - Date.now();
          if (timeDiff > 0) {
            this.markupUpdate(this.getDividedTime(timeDiff), this.selector);
          } else {
            clearInterval(this.timerId);
            document.querySelector('.date-warning').textContent = 'Time is expired!';
            refs.stopBtn.disabled = true;
          }
        }, 1000),
      );
    });
  };

  onResolveTimer = timerID => (this.timerId = timerID);

  getDividedTime(timeDiff) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = datePad(Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const mins = datePad(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = datePad(Math.floor((timeDiff % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }
}

const timer1 = new CountdownTimer(timerSettings);

function onCalendarChange() {
  refs.startBtn.disabled = false;
  const datePromise = getDatePromise();
  datePromise.then(onResolveDate).catch(onRejectDate);
}

function onStartBtnClick() {
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = false;
  refs.calendar.disabled = true;
  timer1.start();
  //   timerIdPromise(targetDate).then(onResolveTimer);
}

function onStopBtnClick() {
  //   clearInterval(timerId);
  timer1.stop();
  refs.startBtn.disabled = false;
  refs.calendar.disabled = false;
}

function onClearBtnClick() {
  refs.calendar.value = '';
  timer1.stop();
  //   clearInterval(timerId);
  document.querySelector('.date-warning').textContent = '';
  timerMarkupUpdating({}, timer1.selector);
  refs.calendar.disabled = false;
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = true;
}

function datePad(value) {
  return String(value).padStart(2, '0');
}

function dateFormatType__YYYY_MM_DD(date) {
  return `${date.getFullYear()}-${datePad(date.getMonth() + 1)}-${datePad(date.getDate())}`;
}

function getTargetDate() {
  const value = refs.calendar.value;
  let valueAsNumber = refs.calendar.valueAsNumber;
  const timeZoneOffSet = new Date(valueAsNumber).getTimezoneOffset();
  valueAsNumber += timeZoneOffSet * 60000;
  return { value, valueAsNumber };
}

function getDatePromise() {
  return new Promise((resolve, reject) => {
    document.querySelector('.date-warning').textContent = '';
    const { value, valueAsNumber } = getTargetDate();
    value !== dateFormatType__YYYY_MM_DD(today)
      ? resolve(valueAsNumber)
      : reject((document.querySelector('.date-warning').textContent = 'Choose another DATE!'));
  });
}

const onResolveDate = date => (targetDate = date);

const onRejectDate = () => {
  refs.startBtn.disabled = true;
  refs.stopBtn.disabled = true;
  console.warn('Choose another DATE!');
};

// const timerIdPromise = date => {
//   return new Promise(resolve => {
//     resolve(
//       setInterval(() => {
//         let timeDiff = date - Date.now();
//         if (timeDiff > 0) {
//           timerMarkupUpdating(getDividedTime(timeDiff));
//         } else {
//           clearInterval(timerId);
//           document.querySelector('.date-warning').textContent = 'Time is expired!';
//           refs.stopBtn.disabled = true;
//         }
//       }, 1000),
//     );
//   });
// };

// const onResolveTimer = timerID => (timerId = timerID);

// function getDividedTime(timeDiff) {
//   const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
//   const hours = datePad(Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
//   const mins = datePad(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)));
//   const secs = datePad(Math.floor((timeDiff % (1000 * 60)) / 1000));

//   return { days, hours, mins, secs };
// }

function timerMarkupUpdating({ days, hours, mins, secs }, selector) {
  const timerRef = document.querySelector('.timer');
  timerRef.setAttribute('id', selector);
  const daysRef = document.querySelector('[data-value=days]');
  daysRef.textContent = days;
  const hoursRef = document.querySelector('[data-value=hours]');
  hoursRef.textContent = hours;
  const minutesRef = document.querySelector('[data-value=mins]');
  minutesRef.textContent = mins;
  const secondsRef = document.querySelector('[data-value=secs]');
  secondsRef.textContent = secs;
}
