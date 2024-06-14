import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  FormCheck,
  Card,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";

import handleSearch from "../utils/handleSearch";

import { CountryFlag } from "../utils/country";

import { MdDarkMode, MdLightMode, MdSearch } from "react-icons/md";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { GiSunset, GiSunrise } from "react-icons/gi";

import Sun from "../assets/images/sun.png";
import Moon from "../assets/images/moon.png";
import fewSun from "../assets/images/fewcloudsSun.png";
import fewMoon from "../assets/images/fewcloudsMoon.png";
import cloudsDay from "../assets/images/cloudDay.png";
import cloudsNight from "../assets/images/cloudNight.png";
import dayRain from "../assets/images/dayRain.png";
import nightRain from "../assets/images/nightRain.png";
import dayThunder from "../assets/images/dayThunder.png";
import nightThunder from "../assets/images/nightThunder.png";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("recentSearches")) || []
  );

  const [mode, setMode] = useState("light");
  const [tempSearchTerm, setTempSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm) {
        await handleSearch(
          searchTerm,
          setWeatherData,
          setForecastData,
          setError
        );
        updateRecentSearches(searchTerm);
      }
    };
    fetchData();
  }, [searchTerm]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(tempSearchTerm.trim()); // Update the search term with the temporary value
    setTempSearchTerm(""); // Clear the temporary value
    // Search term is updated in useEffect, so no need to handle it here
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setTempSearchTerm(value); // Update the temporary search term
  };

  const updateRecentSearches = (searchTerm) => {
    const updatedSearches = [
      searchTerm,
      ...recentSearches.filter((search) => search !== searchTerm),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleRecentSearchClick = async (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const getWeatherIconUrl = (iconCode) => {
    if (iconCode === "01d") {
      return Sun; // Assuming Sun is the variable holding the custom image URL
    } else if (iconCode === "01n") {
      return Moon;
    } else if (iconCode === "02d") {
      return fewSun;
    } else if (iconCode === "02n") {
      return fewMoon;
    } else if (iconCode === "03d" || iconCode === "04d") {
      return cloudsDay;
    } else if (iconCode === "03n" || iconCode === "04n") {
      return cloudsNight;
    } else if (iconCode === "09d" || iconCode === "10d") {
      return dayRain;
    } else if (iconCode === "09n" || iconCode === "10n") {
      return nightRain;
    } else if (iconCode === "11d") {
      return dayThunder;
    } else if (iconCode === "11n") {
      return nightThunder;
    } else {
      return `http://openweathermap.org/img/wn/${iconCode}.png`;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString([], options);
  };
  function kelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9) / 5 + 32;
  }

  function getTime() {
    const d = new Date();
    const localTime = d.getTime();
    const localOffset = d.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const city = utc + 1000 * weatherData.timezone;
    const nd = new Date(city);
    console.log(nd);
    return nd.toLocaleTimeString();
  }

  function metersToMiles(meters) {
    return meters / 1609.344;
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { day: "numeric", month: "short" };
    return date.toLocaleDateString(undefined, options);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${newMode}-mode`);
  };

  return (
    <Container
      fluid
      className={`h-100 full-container ${
        mode === "dark" ? "dark-mode" : "light-mode"
      }`}
    >
      <Card className="w-100 searchCard mt-3">
        <Row className="mb-3 mt-3 w-100">
          <Col xs={12} sm={8}>
            <Form className="d-flex p-1" onSubmit={handleSubmit}>
              <InputGroup className="w-100">
                <InputGroup.Text>
                  <MdSearch />
                </InputGroup.Text>
                <FormControl
                  type="search"
                  placeholder="Search by City [Orlando] OR City, State Code, Country Code [Orlando, Fl, US]"
                  aria-label="Search"
                  value={tempSearchTerm}
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Form>
          </Col>
          <Col xs={6} sm={2}>
            <DropdownButton
              id="dropdown-basic-button"
              title="Recent Searches"
              className="ms-2 p-1"
            >
              {recentSearches.map((searchTerm, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleRecentSearchClick(searchTerm)}
                >
                  {searchTerm}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          <Col
            xs={6}
            sm={2}
            className="d-flex justify-content-end align-items-center"
          >
            <FormCheck
              type="switch"
              id="custom-switch"
              label={
                mode === "light" ? (
                  <MdLightMode size={20} />
                ) : (
                  <MdDarkMode size={20} style={{ color: "white" }} />
                )
              }
              checked={mode === "dark"}
              onChange={toggleMode}
            />
          </Col>
        </Row>
      </Card>

      {weatherData && (
        <>
          <Row className="pt-2 justify-content-center">
            <Col xs={12} md={6} lg={4} className="mb-3">
              <Card
                className={`h-100 mt-3 ${mode === "dark" ? "dark-card" : ""}`}
                style={{ height: "300px", minWidth: "334px" }}
              >
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <LiaTemperatureHighSolid size={100} />
                    </div>
                    <div className="currentTemp">
                      {kelvinToFahrenheit(weatherData.main.temp).toFixed()}°F
                    </div>
                  </div>
                  <div className="feelsLike text-center ">
                    Feels like:{" "}
                    {kelvinToFahrenheit(weatherData.main.feels_like).toFixed()}
                    °F
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={4} className="mb-3">
              <Card
                className={`h-100 mt-3 ${mode === "dark" ? "dark-card" : ""}`}
                style={{ height: "300px", minWidth: "334px" }}
              >
                <Card.Body className="d-flex flex-column justify-content-between p-0">
                  <div className="text-center">
                    <Card.Title>
                      Today in {weatherData.name}
                      <Card.Img
                        src={getWeatherIconUrl(weatherData.weather[0].icon)}
                        style={{ width: "50px" }}
                      ></Card.Img>
                    </Card.Title>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <Card.Body className="cardText p-0">
                      <Row className="mb-3 mt-0 p-0 pt-0">
                        <Col className="d-flex align-items-center justify-content-center">
                          <WiHumidity size={40} />
                          <Card.Text className="ms-2">
                            {weatherData.main.humidity}%
                          </Card.Text>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">
                          <WiStrongWind size={40} />
                          <Card.Text className="ms-2">
                            {weatherData.wind.speed} mph
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center justify-content-center">
                          <Card.Text>
                            <span className="bold">High: </span>
                            {kelvinToFahrenheit(
                              weatherData.main.temp_max
                            ).toFixed()}
                            °F
                          </Card.Text>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">
                          <Card.Text>
                            <span className="bold">Low: </span>
                            {kelvinToFahrenheit(
                              weatherData.main.temp_min
                            ).toFixed()}
                            °F
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center justify-content-center">
                          <Card.Text>
                            <span className="bold">Atmospheric Pressure: </span>
                            {weatherData.main.pressure} mbs
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col className="d-flex align-items-center justify-content-center">
                          <Card.Text>
                            <span className="bold">Visibility: </span>
                            {metersToMiles(weatherData.visibility).toFixed(
                              2
                            )}{" "}
                            miles
                          </Card.Text>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="d-flex align-items-center justify-content-center">
                          <GiSunrise size={40} />
                          <Card.Text className="ms-2">
                            {formatTime(weatherData.sys.sunrise)}
                          </Card.Text>
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">
                          <GiSunset size={40} />
                          <Card.Text className="ms-2">
                            {formatTime(weatherData.sys.sunset)}
                          </Card.Text>
                        </Col>
                      </Row>
                    </Card.Body>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={4} className="mb-3">
              <Card
                className={`h-100 mt-3 ${mode === "dark" ? "dark-card" : ""}`}
                style={{ height: "300px", minWidth: "334px" }}
              >
                <Card.Body className="d-flex flex-column justify-content-center align-items-center clockText">
                  <Card.Title className="text-center clockText p-3">
                    {weatherData.name}, {weatherData.sys.country}
                  </Card.Title>
                  <CountryFlag
                    countryCode={weatherData.sys.country}
                    className="large-flag"
                  />
                  <Card.Text className="text-center getTime">
                    {getTime()}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="pt-5">
            {forecastData &&
              forecastData.list &&
              forecastData.list
                .filter((item, index) => index % 8 === 0) // Filter to get every 8th item
                .map((forecast, index) => (
                  <Col key={index}>
                    <Card
                      className="mt-3 p-3"
                      style={{ minWidth: "350px", minHeight: "318px" }}
                    >
                      <Card.Body>
                        <Card.Header
                          style={{
                            background: "none",
                            fontWeight: "bold",
                            fontSize: "32px",
                          }}
                          className="text-center"
                        >
                          {formatDate(forecast.dt)}
                        </Card.Header>
                        <Row className="d-flex justify-content-center">
                          <Card.Img
                            src={getWeatherIconUrl(forecast.weather[0].icon)}
                            style={{ width: "115px", paddingTop: "8px" }}
                          ></Card.Img>
                        </Row>
                        <p className="text-center" style={{ fontSize: "32px" }}>
                          {kelvinToFahrenheit(forecast.main.temp).toFixed()} °F
                        </p>
                        <Row className="text-center">
                          <Col>
                            High:{" "}
                            {kelvinToFahrenheit(
                              forecast.main.temp_max
                            ).toFixed()}{" "}
                            °F
                          </Col>
                          <Col>
                            Low:{" "}
                            {kelvinToFahrenheit(
                              forecast.main.temp_min
                            ).toFixed()}{" "}
                            °F
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
          </Row>
          <Row
            style={{
              position: "fixed",
              bottom: "0",
              right: "0",
              fontSize: "16px",
              fontStyle: "italic",
              fontWeight: "200",
              marginRight: "10px",
            }}
          >
            <Col>
              <span className={`${mode === "dark" ? "dark-text" : ""}`}>
                {weatherData.coord.lat}, {weatherData.coord.lon}
              </span>
              <CountryFlag
                countryCode={weatherData.sys.country}
                className="small-flag"
              />
            </Col>
          </Row>
        </>
      )}
      {error && (
        <Row>
          <p className="text-danger mt-3">{error}</p>
        </Row>
      )}
    </Container>
  );
};

export default Home;
