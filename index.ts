const API_KEY = "4196d93d11fa4ba084241415230909"

async function getWeather(location: string) {
    const data = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`, { mode : "cors" });
    console.log(data);
}

getWeather('Boston');