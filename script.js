const API_KEY = '<YOUR_API_KEY';
const CITY = '<YOUR_CITY>,<YOUR COUNTRY 2-symbol name>';
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&lang=ru&units=metric&appid=${API_KEY}`;

function getWindArrow(deg) {
    const arrows = ["⬆", "↗", "➡", "↘", "⬇", "↙", "⬅", "↖"];
    return arrows[Math.round(deg / 45) % 8];
}

function formatTime(utcSeconds, timezoneOffset) {
    const date = new Date((utcSeconds + timezoneOffset) * 1000);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function hPaToMmHg(hPa) {
    return (hPa * 0.75006).toFixed(1);
}

async function fetchWeather() {
    try {
        const response = await fetch(URL);
        const data = await response.json();

        document.getElementById('description').innerText = data.weather[0].description;
        document.getElementById('feels_like').innerText = data.main.feels_like.toFixed(1);
        document.getElementById('humidity').innerText = data.main.humidity;

        const iconCode = data.weather[0].icon;date
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Wind
        document.getElementById('wind-speed').innerText = data.wind.speed;
        document.getElementById('wind-arrow').innerText = getWindArrow(data.wind.deg);
        document.getElementById('wind-gust').innerText = data.wind.gust;

        // Sun
        document.getElementById('sunrise').innerText
            = formatTime(data.sys.sunrise, data.timezone);
        document.getElementById('sunset').innerText
            = formatTime(data.sys.sunset, data.timezone);

    } catch (error) {
        console.error('ERROR: Unable to load weather data:', error);
    }
}

function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').innerText = `${hours}:${minutes}`;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = now.toLocaleDateString('ru-RU', options);
    document.getElementById('date').innerText = formattedDate;
}

function updateBackground() {
    const hour = new Date().getHours();
    let bgColor;

    if (hour >= 6 && hour < 12) {
        bgColor = 'linear-gradient(to bottom, #87CEEB, #FFD700)'; // Morning
    } else if (hour >= 12 && hour < 18) {
        bgColor = 'linear-gradient(to bottom, #4682B4, #FFA500)'; // Day
    } else if (hour >= 18 && hour < 22) {
        bgColor = 'linear-gradient(to bottom, #191970, #FF4500)'; // Evening
    } else {
        bgColor = 'linear-gradient(to bottom, #000000, #191970)'; // Nigth
    }

    document.body.style.background = bgColor;
}

setInterval(fetchWeather, 3600000);   // every 60 minutes
setInterval(updateBackground, 60000); // every 10 minutes
setInterval(updateClock, 60000);      // every 1 minute

fetchWeather();
updateClock();
updateBackground();
