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
function celsiusToKelvin(temp_c) {
    return temp_c + 273.15;
}
function kelvinToHexColor(temperatureKelvin, date) {
    var hour = date.getHours();
    // Define temperature range for color gradient
    var minTemperature = 184; // Cool colors
    var maxTemperature = 327; // Warm colors
    // Ensure the input temperature is within the defined range
    var temperature = Math.max(minTemperature, Math.min(temperatureKelvin, maxTemperature));
    // Calculate the color ratio within the range
    var ratio = (temperature - minTemperature) / (maxTemperature - minTemperature);
    // Define RGB values for cool and warm colors
    var coolColor = [0, 128, 255]; // Cool blue
    var warmColor = [255, 0, 0]; // Warm red
    // Interpolate between cool and warm colors based on the temperature ratio
    var interpolatedColor = coolColor.map(function (coolValue, index) {
        var warmValue = warmColor[index];
        var interpolatedValue = Math.round(coolValue + ratio * (warmValue - coolValue));
        return Math.min(255, Math.max(0, interpolatedValue)); // Ensure the value is within the valid RGB range
    });
    // Adjust brightness based on the time of day (daytime vs nighttime)
    var isDaytime = hour >= 6 && hour < 18; // Assuming daytime is between 6 AM and 6 PM
    var brightnessFactor = isDaytime ? 0.8 : 0.6;
    // Apply brightness adjustment to each RGB component
    var adjustedColor = interpolatedColor.map(function (value) { return Math.round(value * brightnessFactor); });
    // Convert RGB values to hex color
    var hexColor = adjustedColor.map(function (value) { return value.toString(16)
        .padStart(2, '0'); })
        .join('');
    return "#".concat(hexColor);
}
function getContrastText(hexColor) {
    // Convert hex color to RGB
    var hexToRgb = function (hex) { return hex.match(/[A-Za-z0-9]{2}/g).map(function (v) { return parseInt(v, 16); }); };
    var _a = hexToRgb(hexColor), r = _a[0], g = _a[1], b = _a[2];
    // Calculate relative luminance (perceived brightness) using the formula for sRGB
    var luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
    // Determine the appropriate text color based on luminance
    var textColor = luminance > 0.5 ? '#000000' : '#ffffff';
    return textColor;
}
var page = (function () {
    var celsius = false;
    var locale = "Boston";
    function toggleCelsius() {
        celsius = !celsius;
    }
    function locationDisplay() {
        var display = document.createElement('h1');
        display.classList.add("location-display");
        display.textContent = locale;
        return display;
    }
    function locationInput() {
        var form = document.createElement('form');
        form.classList.add("location-input-form");
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
        button.classList.add('btn', 'btn-submit', 'invisible-btn');
        button.textContent = '🔍';
        button.dataset.text = '🔍';
        button.addEventListener('click', function (e) { return updateLocation(e); });
        form.append(locationInput, button);
        return form;
    }
    function currentWeatherDisplay(curr) {
        var display = document.createElement('div');
        display.classList.add('curr-weather-container');
        var temperatureContainer = document.createElement('div');
        temperatureContainer.classList.add('temperature-container', 'sub-container');
        var temperature = document.createElement('p');
        temperature.classList.add("temperature");
        temperature.textContent = celsius ? "".concat(curr.temp_c) : "".concat(curr.temp_f);
        var sup_c = function () {
            var c = document.createElement('sup');
            c.textContent = '°C';
            return c;
        };
        var sup_f = function () {
            var f = document.createElement('sup');
            f.textContent = '°F';
            return f;
        };
        if (celsius)
            temperature.appendChild(sup_c());
        else
            temperature.appendChild(sup_f());
        var feelsLike = document.createElement('p');
        feelsLike.classList.add('feels-like');
        feelsLike.textContent = celsius ? "Feels like ".concat(curr.feelslike_c) : "Feels like ".concat(curr.feelslike_f);
        if (celsius)
            feelsLike.appendChild(sup_c());
        else
            feelsLike.appendChild(sup_f());
        temperatureContainer.append(temperature, feelsLike);
        var conditionContainer = document.createElement('div');
        conditionContainer.classList.add('condition-container', 'sub-container');
        var conditionText = document.createElement('p');
        conditionText.classList.add('condition-text');
        conditionText.textContent = curr.condition.text;
        var conditionIcon = document.createElement('img');
        conditionIcon.classList.add('condition-icon');
        conditionIcon.src = "https:" + curr.condition.icon;
        conditionContainer.append(conditionText, conditionIcon);
        var detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container', 'sub-container');
        var windSpeedAndDir = document.createElement('p');
        windSpeedAndDir.classList.add('wind-speed-dir');
        windSpeedAndDir.innerText = celsius ? "".concat(curr.wind_kph, " kph ").concat(curr.wind_dir) : "".concat(curr.wind_mph, " mph ").concat(curr.wind_dir);
        var humidity = document.createElement('p');
        humidity.classList.add('humidity');
        humidity.innerText = "".concat(curr.humidity, "% humidity");
        detailsContainer.append(windSpeedAndDir, humidity);
        var last_updated = document.createElement('p');
        var last_date = new Date(curr.last_updated);
        last_updated.classList.add('last-updated');
        last_updated.textContent = "Last updated ".concat(last_date.toLocaleString());
        var containersContainer = document.createElement('div');
        containersContainer.classList.add('containers-container');
        containersContainer.append(temperatureContainer, conditionContainer, detailsContainer);
        display.append(containersContainer, last_updated);
        var temp_k = celsiusToKelvin(curr.temp_c);
        var color = kelvinToHexColor(temp_k, last_date);
        var textColor = getContrastText(color);
        display.style.backgroundColor = color;
        display.style.color = textColor;
        document.body.style.backgroundColor = textColor;
        return display;
    }
    function unitToggle() {
        var toggle = document.createElement('button');
        var setting = celsius ? 'btn-us' : 'btn-eu';
        toggle.classList.add('btn', 'btn-units', setting);
        toggle.textContent = celsius ? 'F' : 'C';
        function changeToggle(e) {
            e.preventDefault();
            toggleCelsius();
            render();
        }
        toggle.addEventListener('click', function (e) { return changeToggle(e); });
        return toggle;
    }
    function render() {
        return __awaiter(this, void 0, void 0, function () {
            var res, currWeather, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getThreeDayForecast(locale)];
                    case 1:
                        res = _a.sent();
                        currWeather = res.current;
                        locale = res.location.name;
                        body = document.querySelector('body');
                        body.replaceChildren(locationDisplay(), currentWeatherDisplay(currWeather), locationInput(), unitToggle());
                        return [2 /*return*/, body];
                }
            });
        });
    }
    return { render: render };
})();
page.render();
