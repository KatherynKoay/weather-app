import { React, createContext, useState } from "react";
import { Button, Text } from "./Components/atom";
import "./Styles/style.css";
import { btn_square, txt_h1, txt_h5 } from "./Constants/VariantConstant";
import { AiOutlineSearch } from "react-icons/ai";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import SunImg from "./Images/sun.png";
import SearchHistoryItem from "./Components/molecule/SearchHistoryItem";
import axios from "axios";
import deepEqual from "deep-equal";

export const ThemeContext = createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    //use ternary conditional operator to toggle between dark and light theme
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const [data, setData] = useState({});
  const [keyword, setKeyword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${keyword}&units=metric&appid=1fb2bc21dd9aaabaf07e1c4d4ad0901d`;

  // Search Sugesstion to improve the user friendliness
  // get to know that the only access to a full list of location (city name, country) names OpenWeatherMap offer is a zipped JSON, there’s no api call, so I decided to make use of it
  const searchSuggestionData = require("./SearchSugesstionData.json");

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
    if (keyword !== "") {
      axios
        .get(url)
        .then((response) => {
          setData(response.data);
          setErrorMsg("");
          // Check if the record already exists in the history, not existed only add to history
          // using deep-equal comparison check
          const searchExists = history.some((item) =>
            //JSON.stringify(item.data) === JSON.stringify(response.data)
            //JSON.stringify comparison will still result duplicated record in SearchHistory, hence decided to use deep-equal for better comparison
            //deep-equal is more effective than JSON.stringify as it considers the content and structure of the objects rather than just their stringified versions
            //and deep-equal is lightweight in package and more sensitive to symbols compared to lodash.isEqual (like "" , '')
            //if the records seem to get duplicated again, it is because of some changes in the number indicators in the weather compared to previous searches (see console log of "Details of previous data" after clicking Revisit button)
            deepEqual(item.data, response.data)
          );
          if (!searchExists) {
            setHistory((prevHistory) => [
              { keyword, data: response.data, timestampOnSearch }, //New search
              ...prevHistory, // Add the previous history items after the new search, so that the most recent search is always on top
            ]);
          }
          console.log("isIdentical:", searchExists); //false: into history list; true: not into history list
        })
        //add error message when search not found
        .catch((error) => {
          setData({});
          setErrorMsg("Not found. Please try again.");
        });
      setKeyword("");
    }
  };

  //click to revisit the previous history record
  const handleRevisitHistory = (keyword) => {
    const previousSearch = history.find((item) => item.keyword === keyword);
    if (previousSearch) {
      setData(previousSearch.data);
      setErrorMsg("");
      console.log("Details of previous data: ", previousSearch.data);
    }
  };

  const handleRemoveHistory = (keyword) => {
    const updatedHistory = history.filter((item) => item.keyword !== keyword);
    setHistory(updatedHistory);
  };

  const historyItems =
    // show No Records when there is no history
    history.length === 0 ? (
      <span className="searchHistoryItem-noRecord">No Record</span>
    ) : (
      history.map((item, index) => (
        <SearchHistoryItem
          key={index}
          location={item.data?.name + ", " + item.data?.sys?.country}
          timestamp={item.timestampOnSearch}
          onRevisit={() => handleRevisitHistory(item.keyword)} // Call handleRevisitHistory with the keyword parameter
          onRemove={() => handleRemoveHistory(item.keyword)} // Call handleRemoveHistory with the keyword parameter
        />
      ))
    );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="page-wrapper" id={theme}>
        <div className="page-container">
          {/* SearchBox */}
          <div className="search-box">
            <input
              type="text"
              placeholder='You may try with "Singapore" or "Singapore, SG"'
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              autoFocus
            />
            <Button
              variant={btn_square}
              hasIcon
              icon={<AiOutlineSearch color="white" size={25} />}
              text=""
              onClick={() => handleSearchClick(keyword)}
            />
          </div>

          {/* Search Sugesstion */}
          <div className="search-dropdown">
            {searchSuggestionData
              .filter((item) => {
                //make it lowercase for easier comparison
                const searchTerm = keyword.toLowerCase();
                const name = (item.name + ", " + item.country).toLowerCase();
                return (
                  //if searchTerm (keyword) in input
                  searchTerm &&
                  //and matches with name
                  name.startsWith(searchTerm) &&
                  //and if name exactly the same as searchTerm, also dont want it to show as "suggestion"
                  name !== searchTerm
                  //will return to show the suggestion list, else will be filtered
                );
              })
              .slice(0, 5) //control the suggestion list to have maximum 5 listing (else it will get too long)
              //I noticed in the json file there is more than one object having the same name and country,
              //in this accessment I wish to have a more clean SearchSuggestion experience,
              //so I would like to always take the one with the smallest id
              .reduce((findings, currentItem) => {
                // Find the existing suggestion with the same name and country
                const existingSuggestion = findings.find(
                  (item) =>
                    item.name === currentItem.name &&
                    item.country === currentItem.country
                );

                if (existingSuggestion) {
                  // If the existing suggestion has a larger id, replace it with the current suggestion
                  if (currentItem.id < existingSuggestion.id) {
                    const index = findings.indexOf(existingSuggestion);
                    findings[index] = currentItem;
                  }
                } else {
                  // Add the current suggestion if it doesn't exist in the findings (if only have one findings)
                  findings.push(currentItem);
                }

                return findings;
              }, [])
              .map((item) => (
                <div
                  className="search-dropdown-row"
                  //when click from the dropdown, add it to the input field
                  onClick={() => setKeyword(item.name + ", " + item.country)} // <= API format for search city and country separates by comma: Johor, MY
                  key={item.id}
                >
                  {item.name + ", " + item.country}
                </div>
              ))}
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
