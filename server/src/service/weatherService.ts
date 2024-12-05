import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  humidity: number;
  windSpeed: number;

  constructor(temperature: number, humidity: number, windSpeed: number) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}
// TODO: Complete the WeatherService class

class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  
  private baseURL: string = process.env.API_BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';
  cityName: string = '';
  
  constructor() {
    console.log("API Key:", this.apiKey); // Log the API key
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method

  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    if (!response.ok) {
      const errorData = await response.text(); // Get the response text for debugging
      console.error('Fetch Error:', response.status, errorData);
      throw new Error('Failed to fetch location data.');
    }
    const data = await response.json();
    return data;

  }

  // TODO: Create destructureLocationData method

  private destructureLocationData(locationData: any): Coordinates {
    console.log('location data:', locationData[0].lat);
    if (!locationData || locationData.length === 0) {
      throw new Error('Invalid location data received.');
    }
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // TODO: Create buildGeocodeQuery method

  private buildGeocodeQuery(cityName: string): string {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`;
}

  // TODO: Create buildWeatherQuery method

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  // TODO: Create fetchAndDestructureLocationData method

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(this.cityName);
    console.log('Geocode query:', query);
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
}
  // TODO: Create fetchWeatherData method

  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    console.log('Weather query:', query);
    const weatherData = await this.fetchLocationData(query);
    return weatherData;
  }

  // TODO: Build parseCurrentWeather method

  private parseCurrentWeather(response: any) {
    return new Weather(
      response.main.temp,
      response.main.humidity,
      response.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method

  private buildForecastArray(weatherData: any[]) {
    return weatherData.map(data => new Weather(
      data.main.temp,
      data.main.humidity,
      data.wind.speed
    ));
  }

  // TODO: Complete getWeatherForCity method

  async getWeatherForCity(cityName: string) {
    this.cityName = cityName;
    console.log("City Name:", cityName); // Log the city name
    // ...
    try {
      const coordinates = await this.fetchAndDestructureLocationData();
      console.log('Coordinates:', coordinates)
      const weatherData = await this.fetchWeatherData(coordinates);
      console.log("Weather Data:", weatherData);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArray = this.buildForecastArray(weatherData);

      return {
        currentWeather,
        coordinates,
        forecastArray,
      };
    } catch (error) {
      console.error('Error in getWeatherForCity:', error);
      throw new Error('Could not fetch weather data');
    }
  }
}

export default new WeatherService();