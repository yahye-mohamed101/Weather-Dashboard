import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties

class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {

  // TODO: Define a read method that reads from the searchHistory.json file

  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+',
      encoding: 'utf8',
    });
  }
 
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(city: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(city, null, '\t'));
  }
   
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects

  async getCities() {
 return await this.read().then((cities) => {
      let parsedCity: City[];

      try {
        parsedCity = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCity = [];
      }

      return parsedCity;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    if(!city) {
      throw new Error('City cannot be blank')
    }

    const newCity: City = { name: city, id: uuidv4() };

        // Get all cities, add the new city, write all the updated cities, return the newCity
        return await this.getCities()
        .then((cities) => {
          if (cities.find((index) => index.name === city)) {
            return cities;
          }
          return [...cities, newCity];
        })
        .then((updatedCity) => this.write(updatedCity))
        .then(() => newCity);

  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
 async removeCity(id: string) {
  return await this.getCities()
    .then((cities)=> cities.filter((city) => city.id !== id))
    .then ((filterdCities) => this.write(filterdCities));
 }
}
export default new HistoryService();