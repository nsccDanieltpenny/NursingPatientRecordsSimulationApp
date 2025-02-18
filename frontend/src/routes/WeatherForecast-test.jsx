import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherForecast = () => {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Attempting to fetch weather data...');
                const response = await axios.get('http://localhost:5232/WeatherForecast');
                console.log('Response:', response);
                setWeatherData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Axios error config:', error.config);
                console.error('Axios error request:', error.request);
                console.error('Axios error response:', error.response);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Weather Forecast</h1>
            <ul>
                {weatherData.map((forecast, index) => (
                    <li key={index}>
                        Date: {forecast.date}, Temperature: {forecast.temperatureC}°C, Summary: {forecast.summary}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeatherForecast;
