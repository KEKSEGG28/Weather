const inputNode = document.querySelector(".input");
const btnNode = document.querySelector(".findbtn");
const divFormNode = document.querySelector(".form");
const divTempNode = document.querySelector(".temp");
const divErrorNode = document.querySelector(".error");
const API_KEY = "fe194bf539f66e68b10b3ae92c0020f3";
const API_KEY_IP = "at_OxcOgYPTfnYviSSxL9VwSpnw0t8rj";

const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
// let inputValue = "";
const getData = async (url, inputValue) => {
  try {
    const res = await fetch(
      url + `q=${inputValue}&lang=ru&appid=${API_KEY}&units=metric`
    );
    return res.json();
  } catch (e) {
    let error = new Error(
      "Сервер погоды временно недоступен, ожидайте свободного оператора"
    );
    console.log("eeeee");
    errorRender(error.message);
  }
};

let data = {};
async function btnHandler(e) {
  e.preventDefault();

  let inputValue = inputNode.value.trim();
  if (!inputValue) return;
  inputNode.value = "";
  const data = await getData(API_URL, inputValue);
  try {
    divTempNode.innerHTML = `<h2 class="temp-h2">${data.main.temp}°C</h2>
                          <p class="temp-p">${data.weather[0].description} в ${data.name}</p>
                          <button class="temp-btn">Сменить городок</button>`;

    displayn();
    const tempBtnNode = divTempNode.querySelector(".temp-btn");
    tempBtnNode.addEventListener("click", () => tempBtn());
  } catch (e) {
    let error = new Error(
      "Такого города не существует дружок, напиши конкретный Город"
    );
    errorRender(error.message);
  }
}

function tempBtn() {
  displayn();
}
function displayn() {
  divFormNode.classList.toggle("displayn");
  divTempNode.classList.toggle("displayn");
}

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

async function success(pos) {
  let crd = pos.coords;
  const getData = async (url) => {
    const res = await fetch(
      url +
        `lat=${crd.latitude}&lon=${crd.longitude}&lang=ru&appid=${API_KEY}&units=metric`
    );

    return res.json();
  };
  const data = await getData(API_URL);

  divTempNode.innerHTML = `<h2 class="temp-h2">${data.main.temp}°C</h2>
                          <p class="temp-p">${data.weather[0].description} в ${data.name}</p>
                          <button class="temp-btn">Сменить город</button>`;

  displayn();
  const tempBtnNode = divTempNode.querySelector(".temp-btn");
  tempBtnNode.addEventListener("click", () => tempBtn());
}

async function error(err) {
  const getIp = async () => {
    try {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY_IP}`
      );
      return res.json();
    } catch {
      let error = new Error("Повезло, по IP не вычеслил");
      errorRender(error.message);
    }
  };
  const dataIP = await getIp();
  const getData = async (url) => {
    const res = await fetch(
      url +
        `lat=${dataIP.location.lat}&lon=${dataIP.location.lng}&lang=ru&appid=${API_KEY}&units=metric`
    );

    return res.json();
  };
  const data = await getData(API_URL);
  divTempNode.innerHTML = `<h2 class="temp-h2">${data.main.temp}°C</h2>
                          <p class="temp-p">${data.weather[0].description} в ${data.name}</p>
                          <button class="temp-btn">Сменить город</button>`;

  displayn();
  const tempBtnNode = divTempNode.querySelector(".temp-btn");
  tempBtnNode.addEventListener("click", () => tempBtn());
}
try {
  if (navigator.geolocation.getCurrentPosition(success, error, options));
} catch {
  let error = new Error("Повезло, координаты не нашлись, живи");
  errorRender(error.message);
}

function errorOn() {
  divFormNode.classList.toggle("displayn");
  divErrorNode.classList.toggle("displayn");
}
function errorOnOff() {
  errorOn();
}
function errorRender(message) {
  errorOn();
  divErrorNode.innerHTML = `<h2 class="errortitle">Ну и что ты наделал? ГАЛЯ ОТМЕНА </h2>
          <p class="errorsubtitle">Ошибка: ${message}</p>
          <button class="errorbtn">Еще разок</button>`;
  const errorBtnNode = divErrorNode.querySelector(".errorbtn");
  errorBtnNode.addEventListener("click", () => errorOnOff());
}

btnNode.addEventListener("click", btnHandler);
