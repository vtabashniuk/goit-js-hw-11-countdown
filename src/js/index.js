const refs = {
  calendar: document.querySelector('#date-input'),
  dateWarn: document.querySelector('.date-warning'),
  startBtn: document.querySelector('[data-action=start]'),
  stopBtn: document.querySelector('[data-action=stop]'),
  clearBtn: document.querySelector('[data-action=clear]'),
};

const today = new Date();
refs.calendar.min = dateFormatType__YYYY_MM_DD(today);

refs.calendar.addEventListener('change', () => {
  const datePromise = getDatePromise();
  datePromise.then(onResolveDate).catch(onRejectDate);
});



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

const onResolveDate = date => {
  refs.startBtn.disabled = false;
  console.log('target DATE >>> ', new Date(date));
};
const onRejectDate = () => {
  refs.startBtn.disabled = true;
  console.warn('Choose another DATE!');
};