import { useEffect, useState } from "react";
import "./App.css";

// Images
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.png";
import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/humidity.png";
import { CircularProgress } from "@mui/material";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  lon,
  humdity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="">
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div className="">
          <span className="log">longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="" className="icon" />
          <div className="data">
            <div className="humidity-percent">{humdity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="" className="icon" />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

function App() {
  let apiKey = "a5480fa7156543af7140c46432d4ceb7";
  const [text, setText] = useState("Nagano");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humdity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };
  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;

    try {
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setCityNotFound(false);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
    } catch (error) {
      console.error("An error occurred:", error.message);
      setErrorMsg("An error occured while fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);
  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={() => search()}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>

        {loading && (
          <div className="loading-message">
            <CircularProgress />
          </div>
        )}
        {errorMsg && <div className="error-message">{errorMsg}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            lon={lon}
            humdity={humdity}
            wind={wind}
          />
        )}
      </div>
    </>
  );
}

export default App;
