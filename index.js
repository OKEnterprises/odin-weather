var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var API_KEY = "4196d93d11fa4ba084241415230909";
function getThreeDayForecast(location) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://api.weatherapi.com/v1/forecast.json?key=".concat(API_KEY, "&q=").concat(location, "&days=2&aqi=no&alerts=no"), { mode: "cors" })];
                case 1:
                    data = _a.sent();
                    if (!data.ok) {
                        throw new Error("Failed to fetch data: ".concat(data.status, " ").concat(data.statusText));
                    }
                    return [2 /*return*/, data.json()];
            }
        });
    });
}
var page = (function () {
    var celsius = false;
    var locale = "Boston";
    function toggleCelsius() {
        celsius = !celsius;
    }
    function locationInput() {
        var form = document.createElement('form');
        var locationInputLabel = document.createElement('label');
        locationInputLabel.htmlFor = "location-input";
        locationInputLabel.textContent = "Location";
        var locationInput = document.createElement('input');
        locationInput.classList.add('location-input');
        locationInput.type = "text";
        locationInput.id = "location-input";
        locationInput.name = "location-input";
        function updateLocation(e) {
            e.preventDefault();
            locale = locationInput.value;
            render();
        }
        locationInput.addEventListener('submit', function (e) { return updateLocation(e); });
        var button = document.createElement('button');
        button.classList.add('btn', 'btn-submit');
        button.addEventListener('click', function (e) { return updateLocation(e); });
        form.append(locationInput, button);
        return form;
    }
    function currentWeatherDisplay(curr) {
        var display = document.createElement('div');
        display.classList.add('curr-weather-container');
        var last_updated = document.createElement('p');
        last_updated.classList.add('last-updated');
        last_updated.innerText = curr.last_updated;
        var temperatureContainer = document.createElement('div');
        temperatureContainer.classList.add('temperature-container');
        var temperature = document.createElement('p');
        temperature.classList.add("temperature");
        temperature.innerText = celsius ? "".concat(curr.temp_c, "\u00B0C") : "".concat(curr.temp_f, "\u00B0F");
        var feelsLike = document.createElement('p');
        feelsLike.classList.add('feels-like');
        feelsLike.innerText = celsius ? "Feels like ".concat(curr.feelslike_c, "\u00B0C") : "Feels like ".concat(curr.feelslike_f, "\u00B0F");
        temperatureContainer.append(temperature, feelsLike);
        var _a = curr.condition, text = _a.text, icon = _a.icon, code = _a.code;
        var conditionContainer = document.createElement('div');
        conditionContainer.classList.add("condition-container");
        var conditionText = document.createElement('p');
        conditionText.classList.add('condition-text');
        conditionText.innerText = text;
        var conditionIcon = document.createElement('img');
        conditionIcon.classList.add('condition-icon');
        conditionIcon.src = "https:" + icon;
        conditionContainer.append(conditionText, conditionIcon);
        var windSpeedAndDir = document.createElement('p');
        windSpeedAndDir.classList.add("wind-speed-dir");
        windSpeedAndDir.innerText = celsius ? "".concat(curr.wind_kph, " kph ").concat(curr.wind_dir) : "".concat(curr.wind_mph, " mph ").concat(curr.wind_dir);
        var humidity = document.createElement('p');
        humidity.classList.add('humidity');
        humidity.innerText = "".concat(curr.humidity, "%");
        display.append(temperatureContainer, conditionContainer, windSpeedAndDir);
        return display;
    }
    function render() {
        return __awaiter(this, void 0, void 0, function () {
            var currWeather, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getThreeDayForecast(locale)];
                    case 1:
                        currWeather = (_a.sent()).current;
                        body = document.querySelector('body');
                        body.replaceChildren(currentWeatherDisplay(currWeather), locationInput());
                        return [2 /*return*/, body];
                }
            });
        });
    }
    return { currentWeatherDisplay: currentWeatherDisplay, render: render };
})();
page.render();
