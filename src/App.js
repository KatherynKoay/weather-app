import { React, useState } from "react";
import { Button, Text } from "./Components/atom";
import "./Styles/style.css";
import { btn_square, txt_h1, txt_h5 } from "./Constants/VariantConstant";
import { AiOutlineSearch } from "react-icons/ai";
import theme from "./Styles/theme";
import SunImg from "./Images/sun.png";
import SearchHistoryItem from "./Components/molecule/SearchHistoryItem";
import axios from "axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=1fb2bc21dd9aaabaf07e1c4d4ad0901d`;

  const searchLocation = () => {
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
    setLocation("");
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Country"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          <Button
            variant={btn_square}
            hasIcon
            icon={<AiOutlineSearch color="white" size={25} />}
            text=""
            style={{
              background: theme["lightTheme-primary-color"],
            }}
            onClick={() => searchLocation(location)}
          />
        </div>
        <div className="weather-container">
          <img className="imageSun" src={SunImg} alt="sun" />
          <div className="weather-top-section-TodayWeather">
            <div className="weather-top-sectionLeft">
              <Text
                variant={txt_h5}
                text="Today's Weather"
                style={{
                  color: theme["darkTheme-primary-color"],
                  fontWeight: 100,
                }}
              />
              <Text
                variant={txt_h1}
                text={Math.round(data.main.temp) + "°"}
                style={{ color: theme["lightTheme-primary-color"] }}
              />
              <Text
                variant={txt_h5}
                text={
                  "H: " +
                  Math.round(data.main.temp_max) +
                  "° L: " +
                  Math.round(data.main.temp_min) +
                  "°"
                }
                style={{
                  color: theme["darkTheme-primary-color"],
                  fontWeight: 100,
                }}
              />
              <Text
                variant={txt_h5}
                text={data.name + ", " + data.sys.country}
                style={{
                  color: theme["lightTheme-gray-color"],
                  fontWeight: 700,
                }}
              />
            </div>
            <div className="weather-top-sectionRight">
              <Text
                variant={txt_h5}
                text={data.weather[0].main}
                style={{
                  color: theme["lightTheme-gray-color"],
                }}
              />
              <Text
                variant={txt_h5}
                text={"Humidity: " + data.main.humidity + "%"}
                style={{
                  color: theme["lightTheme-gray-color"],
                }}
              />
              <Text
                variant={txt_h5}
                text="01-09-2022 09:41am"
                style={{
                  color: theme["lightTheme-gray-color"],
                }}
              />
            </div>
          </div>
          <div className="weather-bottom-section-SearchHistory">
            <div className="searchHistory-title">
              <Text
                variant={txt_h5}
                text="Search History"
                style={{
                  color: theme["darkTheme-primary-color"],
                  fontWeight: 100,
                }}
              />
            </div>
            <div className="searchHistoryItem-container">
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
              <SearchHistoryItem
                location="Johor, MY"
                timestamp="01-09-2022 09:41am"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
