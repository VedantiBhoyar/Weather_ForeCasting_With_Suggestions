import React from 'react';
import './App.css';
import MainWeatherWindow from './components/MainWeatherWindow';
import CityInput from './components/CityInput';
import WeatherBox from './components/WeatherBox';
import WeatherDetailModal from './components/WeatherDetailModal'; // NEW

class App extends React.Component {
  state = {
    city: undefined,
    suggestions: "",
    days: new Array(14),
    selectedDay: null // NEW: for modal
  };

  updateState = data => {
    const city = data.city.name;
    const suggestions = data.suggestions || "";
    const days = [];
    const dayIndices = this.getDayIndices(data);

    for (let i = 0; i < 5; i++) {
      days.push({
        date: data.list[dayIndices[i]].dt_txt,
        weather_desc: data.list[dayIndices[i]].weather[0].description,
        icon: data.list[dayIndices[i]].weather[0].icon,
        temp: data.list[dayIndices[i]].main.temp,
        humidity: data.list[dayIndices[i]].main.humidity,
        wind: data.list[dayIndices[i]].wind.speed,
        sunrise: data.city.sunrise,
        sunset: data.city.sunset,
        timezone: data.city.timezone,
        country: data.city.country,
        coord: data.city.coord
      });
    }

    this.setState({
      city: city,
      days: days,
      suggestions: suggestions
    });
  };

  makeApiCall = async city => {
    try {
      const api_data = await fetch(
        `http://localhost:5000/api/weather/${city}`
      ).then(resp => resp.json());

      if (api_data.cod === '200') {
        await this.updateState(api_data);

        return true;
      } else return false;

    } catch (error) {
      console.error("Error fetching weather data:", error);
      return false;
    }

  };


  getDayIndices = data => {
    try {
      let dayIndices = [];
      dayIndices.push(0);

      let index = 0;
      let tmp = data.list[index].dt_txt.slice(8, 10);

      for (let i = 0; i < 4; i++) {
        while (
          tmp === data.list[index].dt_txt.slice(8, 10) ||
          data.list[index].dt_txt.slice(11, 13) !== '15'
        ) {
          index++;
        }
        dayIndices.push(index);
        tmp = data.list[index].dt_txt.slice(8, 10);
      }
      return dayIndices;

    } catch (error) {
      console.error("Error processing day indices:", error);
      return
    }

  };

  // NEW: handle day click for modal
  handleDayClick = (day) => {
    this.setState({ selectedDay: day });
  };

  // NEW: close modal
  handleCloseModal = () => {
    this.setState({ selectedDay: null });
  };

  render() {
    const WeatherBoxes = () => {
      const weatherBoxes = this.state.days.slice(1).map((day, idx) => (
        <li key={idx}>
          <div onClick={() => this.handleDayClick(day)}>
            <WeatherBox {...day} />
          </div>
        </li>
      ));

      return <ul className='weather-box-list'>{weatherBoxes}</ul>;
    };

    return (
      <div className='App'>
        <header className='App-header'>
          <MainWeatherWindow data={this.state.days[0]} city={this.state.city} suggestions={this.state.suggestions} >
            <CityInput city={this.state.city} makeApiCall={this.makeApiCall.bind(this)} />
            <WeatherBoxes />
          </MainWeatherWindow>
          {this.state.selectedDay && (
            <WeatherDetailModal day={this.state.selectedDay} onClose={this.handleCloseModal} />
          )}
        </header>
      </div>
    );
  }
}

export default App;