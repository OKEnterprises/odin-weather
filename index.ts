interface APIData {
    location: WeatherLocation,
    current: CurrentWeather,
    forecast: Forecast
}

interface WeatherLocation {
    name: string,
    region: string,
    country: string,
    lat: number,
    long: number,
    tz_id: string,
    localtime_epoch: number,
    localtime: string
}

interface CurrentWeather {
    last_updated_epoch: number,
    last_updated: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: WeatherCondition,
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    vis_km: number,
    vis_miles: number,
    uv: number,
    gust_mph: number,
    gust_kph: number
}

interface WeatherCondition {
    text: string,
    icon: string,
    code: number
}

interface Forecast {
    forecastday: ForecastDay[]
}

interface ForecastDay {
    astro: Astro,
    date: string,
    date_epoch: number,
    day: WeatherDay,
    hour: WeatherHour[]
}

interface Astro {
    is_moon_up: number,
    is_sun_up: number,
    moon_illumination: number,
    moon_phase: string,
    moonrise: string,
    moonset: string,
    sunrise: string,
    sunset: string,
}

interface WeatherDay {
    maxtemp_c: number,
    maxtemp_f: number,
    mintemp_c: number,
    mintemp_f: number,
    avgtemp_c: number,
    avgtemp_f: number,
    maxwind_mph: number,
    maxwind_kph: number,
    totalprecip_mm: number,
    totalprecip_in: number,
    totalsnow_cm: number,
    avgvis_km: number,
    avgvis_miles: number,
    avghumidity: number,
    daily_will_it_rain: number,
    daily_chance_of_rain: number,
    daily_will_it_snow: number,
    daily_chance_of_snow: number,
    condition: WeatherCondition,
    uv: number
}

interface WeatherHour {
    time_epoch: number,
    time: string,
    temp_c: number,
    temp_f: number,
    is_day: number,
    condition: WeatherCondition,
    wind_mph: number,
    wind_kph: number,
    wind_degree: number,
    wind_dir: string,
    pressure_mb: number,
    pressure_in: number,
    precip_mm: number,
    precip_in: number,
    humidity: number,
    cloud: number,
    feelslike_c: number,
    feelslike_f: number,
    windchill_c: number,
    windchill_f: number,
    heatindex_c: number,
    heatindex_f: number,
    dewpoint_c: number,
    dewpoint_f: number,
    will_it_rain: number,
    chance_of_rain: number,
    will_it_snow: number,
    chance_of_snow: number,
    vis_km: number,
    vis_miles: number,
    gust_mph: number,
    gust_kph: number,
    uv: number
}

const API_KEY = "4196d93d11fa4ba084241415230909";

async function getThreeDayForecast(location: string): Promise<APIData> {
    const data = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`, { mode: "cors" });
    console.log(data.json());
    return data.json();
}

getThreeDayForecast('Boston');