import "./style.css";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localePl from "air-datepicker/locale/pl";

let datePicker: AirDatepicker;
let timePicker: AirDatepicker;

const minTime = new Date();
minTime.setDate(minTime.getDate() - 7);
const minDate = new Date();
minDate.setDate(minDate.getDate() - 7);
minDate.setHours(0);
minDate.setMinutes(0);
minDate.setSeconds(0);
minDate.setMilliseconds(0);
const maxTime = new Date();
maxTime.setHours(maxTime.getHours() + 1);
const maxDate = new Date();
maxDate.setHours(0);
maxDate.setMinutes(0);
maxDate.setSeconds(0);
maxDate.setMilliseconds(0);
console.log(minDate.toISOString(), maxDate.toISOString());

function changeTimePicker(time: Date, t1: Date, t2: Date) {
  timePicker.update({
    minHours: t1.getHours(), // Minimalna godzina
    minMinutes: t1.getMinutes(), // Minimalna minuta
    maxHours: t2.getHours(), // Maksynmalna godzina
    maxMinutes: t2.getMinutes(), // Maksynmalna minuta
  });

  timePicker.viewDate.setHours(time.getHours());
  timePicker.viewDate.setMinutes(time.getMinutes());
  if (timePickerElement)
    timePickerElement.value =
      time.getHours().toString().padStart(2, "0") +
      ":" +
      time.getMinutes().toString().padStart(2, "0");
}
const todayButton = {
  content: "Dzisiaj",
  className: "custom-button-classname",
  onClick: (dp: AirDatepicker) => {
    const date = new Date();
    dp.selectDate(date);
    dp.setViewDate(date);
  },
};

const selectButton = {
  content: "Wybierz",
  className: "custom-button-classname",
  onClick: (dp: AirDatepicker) => {
    console.log(dp.viewDate);
    dp.hide();
  },
};

const datePickerElement: HTMLInputElement | null = htmlNode.querySelector(
  "#air-datepicker-date"
);
if (datePickerElement) {
  datePicker = new AirDatepicker(datePickerElement, {
    container: htmlNode.lastElementChild as HTMLDivElement,
    minDate: minDate,
    maxDate: maxDate,
    firstDay: 1,
    locale: localePl,
    buttons: [todayButton, selectButton],
    onSelect(data) {
      if (data.date && !Array.isArray(data.date)) {
        const selectedDate = data.date.getDate();
        if (
          // wybrana data == koniec SKU i != dzisiaj
          selectedDate == minDate.getDate() &&
          selectedDate != maxDate.getDate()
        ) {
          changeTimePicker(minTime, minTime, new Date("1970-01-01T23:59"));
        } else if (
          // wybrana data == dzisijszy dzień i != koniec SKU
          selectedDate == maxDate.getDate() &&
          selectedDate != minDate.getDate()
        ) {
          changeTimePicker(maxTime, new Date("1970-01-01T00:00"), maxTime);
        } else if (
          // wybrana data != dzisiejszy dzien i != koniec SKU
          selectedDate != maxDate.getDate() &&
          selectedDate != minDate.getDate()
        ) {
          changeTimePicker(
            timePicker.viewDate,
            new Date("1970-01-01T00:00"),
            new Date("1970-01-01T23:59")
          );
        } else {
          // wybrana data == dzisiejszy dzień i == koniec SKU
          timePicker.update({
            minHours: minTime.getHours(), // Minimalna godzina
            maxHours: maxTime.getHours(), // Maksynmalna godzina
          });
          if (timePickerElement)
            timePickerElement.value =
              new Date().getHours().toString().padStart(2, "0") +
              ":" +
              new Date().getMinutes().toString().padStart(2, "0");
        }
      }
    },
  });
  // ustawienie startowaj daty na aktualną
  const currentTime = new Date();
  datePicker.selectDate(currentTime);
  datePickerElement.value = new Date().toISOString().slice(0, 10);
} else {
  console.error("Element with id 'date-picker' not found.");
}

const timePickerElement: HTMLInputElement | null = htmlNode.querySelector(
  "#air-datepicker-time"
);
if (timePickerElement) {
  timePicker = new AirDatepicker(timePickerElement, {
    container: htmlNode.lastElementChild as HTMLDivElement,
    onlyTimepicker: true,
    timepicker: true,
    timeFormat: "HH:mm",
    locale: localePl,
    buttons: [selectButton],
  });
  timePickerElement.value = new Date().toISOString().slice(11, 16);
} else {
  console.error("Element with id 'date-picker' not found.");
}

if (timePickerElement) {
  timePickerElement.addEventListener("click", function () {
    const rangeInputH = document.querySelector(
      "div:nth-child(1) > input[type=range]"
    );
    const rangeInputM = document.querySelector(
      "div:nth-child(2) > input[type=range]"
    );

    rangeInputH?.addEventListener("click", function () {
      if (rangeInputH instanceof HTMLInputElement) {
        // minimalna godzina wybrana
        if (rangeInputH.value == String(minTime.getHours())) {
          const t = minTime.getMinutes();
          timePicker.update({
            minMinutes: t, // Minimalna minuta
          });
          if (rangeInputM instanceof HTMLInputElement)
            rangeInputM.min = t.toString().padStart(2, "0");
        } else {
          // inna niż minimalna
          const t = new Date("1970-01-01T00:00").getMinutes();
          timePicker.update({
            minMinutes: t, // Minimalna minuta
          });
          if (rangeInputM instanceof HTMLInputElement)
            rangeInputM.min = t.toString().padStart(2, "0");
        }
        // maksymalna godzina wybrana
        if (rangeInputH.value == String(maxTime.getHours())) {
          const t = maxTime.getMinutes();
          timePicker.update({
            maxMinutes: t, // maksymalna minuta
          });
          if (rangeInputM instanceof HTMLInputElement)
            rangeInputM.max = t.toString().padStart(2, "0");
        } else {
          // inna niż maksymalna
          const t = new Date("1970-01-01T23:59").getMinutes();
          timePicker.update({
            maxMinutes: t,
          });
          if (rangeInputM instanceof HTMLInputElement)
            rangeInputM.max = t.toString().padStart(2, "0");
        }
      }
      const finalTime = new Date();
      if (rangeInputH instanceof HTMLInputElement) {
        finalTime.setHours(Number.parseInt(rangeInputH.value));
        timePicker.viewDate.setHours(finalTime.getHours());
      }
      if (rangeInputM instanceof HTMLInputElement) {
        finalTime.setMinutes(Number.parseInt(rangeInputM.value));
        timePicker.viewDate.setMinutes(finalTime.getMinutes());
      }
      timePicker.viewDate.setSeconds(0);
    });
    rangeInputM?.addEventListener("click", function () {
      const finalTime = new Date();
      if (rangeInputH instanceof HTMLInputElement) {
        finalTime.setHours(Number.parseInt(rangeInputH.value));
        timePicker.viewDate.setHours(finalTime.getHours());
      }
      if (rangeInputM instanceof HTMLInputElement) {
        finalTime.setMinutes(Number.parseInt(rangeInputM.value));
        timePicker.viewDate.setMinutes(finalTime.getMinutes());
      }
      timePicker.viewDate.setSeconds(0);
    });
  });
}
