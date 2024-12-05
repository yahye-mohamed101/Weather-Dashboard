import { Router } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data

router.post('/', async (req, res) => {
  const { cityName } = req.body; // Destructure cityName from req.body

  
  try {
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' }); // Return if cityName is missing
    }
    const weatherData = await WeatherService.getWeatherForCity(cityName); // Use cityName directly
    await HistoryService.addCity(cityName); // Add city to history
    return res.status(200).json(weatherData); // Return weather data
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Error retrieving weather data' }); // Return on error
  }
});
  // TODO: GET weather data from city name

  // TODO: save city to search history
  router.get('/:city', async (req, res) => {
    const city: string = req.body.city;
    try {
      const weatherData = await WeatherService.getWeatherForCity(city);
      await HistoryService.addCity(city);
      res.status(200).json(weatherData);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({error: 'Error retrieving weather data'});
    }
  })
  


// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Error retrieving search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params; // Extract city ID from request parameters

  try {
    await HistoryService.removeCity((id)); // Remove city using its ID
    res.status(204).send(); // Respond with no content status
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    res.status(500).json({ error: 'Error deleting city from search history' });
  }
});

export default router;