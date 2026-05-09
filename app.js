/* ================================================================
   SkyCast — OpenWeather Version
   ================================================================ */

/* ضع مفتاح OpenWeather هنا */
const API_KEY = 'f86a454742764fa966d61a9771517773';

/* ── State ── */
let state = {
  unit: 'metric',
  lat: null,
  lng: null,
  cityLabel: '',
  countryLabel: ''
};

/* ── DOM Refs ── */
const cityInput      = document.getElementById('city-input');
const searchBtn      = document.getElementById('search-btn');
const locationBtn    = document.getElementById('location-btn');
const btnCelsius     = document.getElementById('btn-celsius');
const btnFahrenheit  = document.getElementById('btn-fahrenheit');
const errorMsg       = document.getElementById('error-msg');
const errorText      = document.getElementById('error-text');
const loadingEl      = document.getElementById('loading');
const weatherContent = document.getElementById('weather-content');
const welcomeState   = document.getElementById('welcome-state');
const liveClock      = document.getElementById('live-clock');

/* ================================================================
   CLOCK
   ================================================================ */
function updateClock() {
  const now = new Date();

  liveClock.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

updateClock();
setInterval(updateClock, 1000);

/* ================================================================
   PARTICLES
   ================================================================ */
(function initParticles() {

  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let W, H;
  let particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();

  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -(Math.random() * 0.4 + 0.1),
      o: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {

    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {

      ctx.beginPath();

      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(148,163,184,${p.o})`;

      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -5) {
        p.y = H + 5;
        p.x = Math.random() * W;
      }

      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });

    requestAnimationFrame(draw);
  }

  draw();

})();

/* ================================================================
   HELPERS
   ================================================================ */
function unitLabel() {
  return state.unit === 'metric' ? '°C' : '°F';
}

function speedUnit() {
  return state.unit === 'metric' ? 'm/s' : 'mph';
}

function formatDate(d) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function countryCodeToFlag(code) {

  if (!code || code.length !== 2) return '';

  return code
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

/* ================================================================
   WEATHER ICONS
   ================================================================ */
function getWeatherIcon(main) {

  switch(main) {

    case 'Clear':
      return '☀️';

    case 'Clouds':
      return '☁️';

    case 'Rain':
      return '🌧️';

    case 'Thunderstorm':
      return '⛈️';

    case 'Snow':
      return '❄️';

    case 'Drizzle':
      return '🌦️';

    case 'Mist':
    case 'Fog':
    case 'Haze':
      return '🌫️';

    default:
      return '🌡️';
  }
}

/* ================================================================
   SEARCH CITY
   ================================================================ */
async function searchCity(city) {

  if (!city.trim()) return;

  showLoading();

  try {

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${state.unit}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('City not found');
    }

    const currentData = await res.json();

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${state.unit}`;

    const forecastRes = await fetch(forecastUrl);

    const forecastData = await forecastRes.json();

    state.lat = currentData.coord.lat;
    state.lng = currentData.coord.lon;
    state.cityLabel = currentData.name;
    state.countryLabel = currentData.sys.country;

    renderCurrent(currentData);
    renderForecast(forecastData);

    showWeather();

  } catch(err) {

    showError(err.message);
  }
}

/* ================================================================
   LOCATION SEARCH
   ================================================================ */
async function searchByCoords(lat, lng) {

  showLoading();

  try {

    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=${state.unit}`;

    const res = await fetch(url);

    const currentData = await res.json();

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=${state.unit}`;

    const forecastRes = await fetch(forecastUrl);

    const forecastData = await forecastRes.json();

    renderCurrent(currentData);
    renderForecast(forecastData);

    showWeather();

  } catch(err) {

    showError(err.message);
  }
}

/* ================================================================
   RENDER CURRENT
   ================================================================ */
function renderCurrent(data) {

  const weather = data.weather[0];

  const icon = getWeatherIcon(weather.main);

  document.getElementById('city-name').textContent =
    data.name;

  document.getElementById('country-name').textContent =
    data.sys.country;

  document.getElementById('country-flag').textContent =
    countryCodeToFlag(data.sys.country);

  document.getElementById('current-date').textContent =
    formatDate(new Date());

  document.getElementById('weather-icon-main').textContent =
    icon;

  document.getElementById('weather-icon-hero').textContent =
    icon;

  document.getElementById('temp-main').textContent =
    Math.round(data.main.temp);

  document.getElementById('temp-unit-label').textContent =
    unitLabel();

  document.getElementById('weather-desc').textContent =
    weather.description;

  document.getElementById('feels-like').textContent =
    `Feels like ${Math.round(data.main.feels_like)}${unitLabel()}`;

  document.getElementById('mini-humidity').textContent =
    `${data.main.humidity}%`;

  document.getElementById('mini-wind').textContent =
    `${Math.round(data.wind.speed)} ${speedUnit()}`;

  document.getElementById('mini-pressure').textContent =
    `${data.main.pressure} hPa`;

  document.getElementById('mini-visibility').textContent =
    `${(data.visibility / 1000).toFixed(1)} km`;

  document.getElementById('humidity').textContent =
    `${data.main.humidity}%`;

  document.getElementById('wind-speed').textContent =
    `${Math.round(data.wind.speed)} ${speedUnit()}`;

  document.getElementById('visibility').textContent =
    `${(data.visibility / 1000).toFixed(1)} km`;

  document.getElementById('dew-point').textContent =
    `${Math.round(data.main.temp_min)}${unitLabel()}`;

  document.getElementById('uv-index').textContent =
    '--';

  document.getElementById('sunrise-time').textContent =
    new Date(data.sys.sunrise * 1000).toLocaleTimeString();

  document.getElementById('sunset-time').textContent =
    new Date(data.sys.sunset * 1000).toLocaleTimeString();
}

/* ================================================================
   RENDER FORECAST
   ================================================================ */
function renderForecast(data) {

  const grid = document.getElementById('forecast-cards');

  grid.innerHTML = '';

  const daily = data.list.filter(item =>
    item.dt_txt.includes('12:00:00')
  );

  daily.slice(0, 5).forEach((day, i) => {

    const date = new Date(day.dt * 1000);

    const icon =
      getWeatherIcon(day.weather[0].main);

    const card = document.createElement('div');

    card.className =
      `forecast-card${i === 0 ? ' fc-today' : ''}`;

    card.innerHTML = `
      <div class="fc-day">
        ${i === 0 ? 'Today' :
        date.toLocaleDateString('en-US', { weekday:'short' })}
      </div>

      <span class="fc-icon">${icon}</span>

      <div class="fc-temps">
        <span class="fc-high">
          ${Math.round(day.main.temp_max)}${unitLabel()}
        </span>

        <span class="fc-low">
          ${Math.round(day.main.temp_min)}${unitLabel()}
        </span>
      </div>

      <div class="fc-desc">
        ${day.weather[0].description}
      </div>

      <div class="fc-bar"></div>
    `;

    grid.appendChild(card);
  });
}

/* ================================================================
   UI HELPERS
   ================================================================ */
function showLoading() {

  hide(errorMsg);
  hide(weatherContent);
  hide(welcomeState);

  show(loadingEl);
}

function showWeather() {

  hide(loadingEl);
  hide(errorMsg);
  hide(welcomeState);

  show(weatherContent);
}

function showError(msg) {

  hide(loadingEl);
  hide(weatherContent);

  show(welcomeState);

  errorText.textContent = msg;

  show(errorMsg);
}

function show(el) {
  el.classList.remove('hidden');
}

function hide(el) {
  el.classList.add('hidden');
}

/* ================================================================
   UNIT SWITCH
   ================================================================ */
async function switchUnit(unit) {

  if (state.unit === unit) return;

  state.unit = unit;

  btnCelsius.classList.toggle(
    'active',
    unit === 'metric'
  );

  btnFahrenheit.classList.toggle(
    'active',
    unit === 'imperial'
  );

  if (state.cityLabel) {
    searchCity(state.cityLabel);
  }
}

/* ================================================================
   EVENTS
   ================================================================ */
searchBtn.addEventListener('click', () => {
  searchCity(cityInput.value);
});

cityInput.addEventListener('keydown', e => {

  if (e.key === 'Enter') {
    searchCity(cityInput.value);
  }
});

locationBtn.addEventListener('click', () => {

  if (!navigator.geolocation) {

    showError('Geolocation not supported');

    return;
  }

  navigator.geolocation.getCurrentPosition(

    pos => {

      searchByCoords(
        pos.coords.latitude,
        pos.coords.longitude
      );
    },

    () => {
      showError('Location access denied');
    }
  );
});

btnCelsius.addEventListener('click', () => {
  switchUnit('metric');
});

btnFahrenheit.addEventListener('click', () => {
  switchUnit('imperial');
});

/* ================================================================
   CITY CHIPS
   ================================================================ */
document.querySelectorAll('.city-chip').forEach(btn => {

  btn.addEventListener('click', () => {

    const city = btn.dataset.city;

    cityInput.value = city;

    searchCity(city);
  });
});