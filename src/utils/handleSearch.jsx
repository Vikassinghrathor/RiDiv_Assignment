const handleSearch = async (searchTerm, setWeatherData, setForecastData, setError) => {
  try {
    const apiKey = "a1c24f9ef9bb705299a22d8524be3474";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`;
    
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const weatherData = await response.json();
    setWeatherData(weatherData);
    setError(null);

    // Fetch forecast data using coordinates from weatherData
    const { coord } = weatherData;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error("Failed to fetch forecast data");
    }
    
    const forecastData = await forecastResponse.json();
    setForecastData(forecastData);
    console.log(forecastData)
  } catch (error) {
    console.error("Error fetching data:", error);
    setError("Failed to fetch weather data. Please try again.");
    setWeatherData(null);
    setForecastData(null);
  }
};

export default handleSearch;

