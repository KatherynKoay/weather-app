import { React, createContext, useState } from "react";
import { Button, Text } from "./Components/atom";
import "./Styles/style.css";
import { btn_square, txt_h1, txt_h5 } from "./Constants/VariantConstant";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import SunImg from "./Images/sun.png";
import SearchHistoryItem from "./Components/molecule/SearchHistoryItem";
import axios from "axios";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    //use ternary conditional operator to toggle between dark and light theme
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const [data, setData] = useState({});
  const [city, setCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1fb2bc21dd9aaabaf07e1c4d4ad0901d`;

  // Current Date
  const today = new Date();
  // Get the current date
  const currentDate = `${today.getDate()}-${
    today.getMonth() + 1 // getMonth() method of the Date object returns the zero-based index of the month. 0 is Jan, 1 is Feb etc... hence getMonth() +1
  }-${today.getFullYear()}`;
  // Current Time
  function formatTimeAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  // Get the current time
  const currentTime = formatTimeAMPM(new Date());
  //DateTime when searching
  const timestampOnSearch = currentDate + " " + currentTime;

  const handleSearchClick = () => {
    //only executes when the searchbox is not empty
    if (city !== "") {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setErrorMsg("");
          // Check if the city already exists in the history, not existed only add to history
          const cityExists = history.some((item) => item.city === city);
          if (!cityExists) {
            setHistory((prevHistory) => [
              ...prevHistory,
              { city, data: response.data, timestampOnSearch },
            ]);
          }
        })
        //add error message when search not found
        .catch((error) => {
          setData({});
          setErrorMsg("City not found. Please try again.");
        });
      setCity("");
    }
  };

  const handleRevisitHistory = (city) => {
    setCity(city); // Set the city in the search box
    handleSearchClick(); // Trigger the search functionality
  };

  const handleRemoveHistory = (city) => {
    const updatedHistory = history.filter((item) => item.city !== city);
    setHistory(updatedHistory);
  };

  const historyItems = history.map((item, index) => (
    <SearchHistoryItem
      key={index}
      location={item.data?.name + ", " + item.data?.sys?.country}
      timestamp={item.timestampOnSearch}
      onRevisit={() => handleRevisitHistory(item.city)} // Call handleRevisitHistory with the city parameter
      onRemove={() => handleRemoveHistory(item.city)} // Call handleRemoveHistory with the city parameter
    />
  ));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="page-wrapper" id={theme}>
        <div className="page-container">
          {/* SearchBox */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Please enter a city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              autoFocus
            />
            <Button
              variant={btn_square}
              hasIcon
              icon={<AiOutlineSearch color="white" size={25} />}
              text=""
              onClick={() => handleSearchClick(city)}
            />
          </div>

          {/* Error Message */}
          {errorMsg && <span className="search-errorMsg">{errorMsg}</span>}

          {/* WeatherContainer */}
          <div className="weather-container">
            <img className="imageSun" src={SunImg} alt="sun" />
            <div className="weather-top-section-TodayWeather">
              <div className="weather-top-sectionLeft">
                <Text
                  variant={txt_h5}
                  text="Today's Weather"
                  style={{
                    fontWeight: "bolder",
                  }}
                />
                <Text
                  variant={txt_h1}
                  text={Math.round(data?.main?.temp) + "°"}
                />
                <Text
                  variant={txt_h5}
                  text={
                    "H: " +
                    Math.round(data?.main?.temp_max) +
                    "° L: " +
                    Math.round(data?.main?.temp_min) +
                    "°"
                  }
                  style={{ fontWeight: 100 }}
                />
                <div className="groupColorText">
                  <Text
                    variant={txt_h5}
                    text={data?.name + ", " + data?.sys?.country}
                    style={{
                      fontWeight: 700,
                    }}
                  />
                </div>
                <div className="weather-top-sectionRight groupColorText">
                  <Text variant={txt_h5} text={data?.weather?.[0]?.main} />
                  <Text
                    variant={txt_h5}
                    text={"Humidity: " + data?.main?.humidity + "%"}
                  />
                  <Text variant={txt_h5} text={timestampOnSearch} />
                </div>
              </div>
            </div>

            {/* Search History */}
            <div className="weather-bottom-section-SearchHistory">
              <div className="searchHistory-title">
                <Text
                  variant={txt_h5}
                  text="Search History"
                  style={{
                    fontWeight: "regular",
                  }}
                />
              </div>
              <div className="searchHistoryItem-container">{historyItems}</div>
            </div>
          </div>
        </div>

        {/* ThemeButton */}
        <div className="themeButton">
          <Button
            variant={btn_square}
            hasIcon
            icon={
              theme === "light" ? (
                <MdOutlineDarkMode color="white" size={25} />
              ) : (
                <MdOutlineLightMode color="white" size={25} />
              )
            }
            text=""
            onClick={toggleTheme}
          />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
