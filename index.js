const apiKey = '8676c13afb5f4db0b86115203240912';
const cityHeader = document.getElementsByClassName('citu')

// Функция для получения данных о погоде по названию города
async function weatherFn(cityName) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(cityName)}&days=7&aqi=no&alerts=no`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        
        const data = await response.json();
        weatherShowFn(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('City not found. Please try again.');
    }
}

// Функция для отображения данных о погоде
function weatherShowFn(data) {
    $('.week-forecast').empty(); // Очищаем контейнер перед добавлением новых данных
    console.log(data);
    $('.citu').append(`${data.location.name}`)
    

    // Обработка общей информации о погоде на неделю
    for (let i = 0; i < data.forecast.forecastday.length; i++) {
        const forecastDay = data.forecast.forecastday[i];
        const date = moment(forecastDay.date).format('dddd, MMMM Do');
        const iconUrl = `https:${forecastDay.day.condition.icon}`;
        const tempC = forecastDay.day.avgtemp_c;
        const condition = forecastDay.day.condition.text;
        const windKph = forecastDay.day.maxwind_kph;
        const humidity = forecastDay.day.avghumidity; // Добавляем влажность

        // Создаем карточку для каждого дня
        const dayCard = `
            <div class="day-card animate__animated animate__zoomIn">
                <p class="date">${date}</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p class="temperature">${tempC}°C</p>
                <p class="condition">${condition}</p>
                <p class="wind-speed">Wind Speed: ${windKph} km/h</p>
                <p class="humidity">Humidity: ${humidity}%</p>
                <ul class="hourly-list">
                    <!-- Почасовая информация будет добавлена ниже -->
                </ul>
            </div>
        `;


        // Добавляем карточку дня в сетку
        $('.week-forecast').append(dayCard);

        // Ищем список для почасового прогноза текущего дня уже после добавления карточки
        const hourlyList = $('.week-forecast .day-card:last-child .hourly-list');

        // Перебор часов для данного дня
        for (let j = 0; j < forecastDay.hour.length; j++) {
            const hourData = forecastDay.hour[j];
            const time = hourData.time.slice(-5); // Получаем время в формате "HH:mm"
            const iconUrlHour = `https:${hourData.condition.icon}`;
            const tempCHour = hourData.temp_c;
            const humidityHour = hourData.humidity; // Добавляем влажность

            // Добавление элемента в список с почасовым прогнозом
            $(hourlyList).append(`
                <li class="hourly-item">
                    <span class="time">${time}</span>
                    <img src="${iconUrlHour}" alt="Weather Icon">
                    <span class="temperature">${tempCHour}°C</span>
                </li>
            `);
        }
    }

    $('#weather-info').fadeIn();
}