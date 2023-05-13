import { useState } from "react";
import Button from "./Components/atom/Button";
import "./Styles/style.css";
import { btn_square } from "./Constants/VariantConstant";
import { AiOutlineSearch } from "react-icons/ai";
import theme from "./Styles/theme";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event) => {
    setValue(event.target.value);
  };
  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="search-box">
          <input
            type="text"
            value={value}
            placeholder="Country"
            onChange={onChange}
          />
          <Button
            variant={btn_square}
            hasIcon
            icon={<AiOutlineSearch color="white" size={25} />}
            text=""
            style={{
              background: theme["lightTheme-primary-color"],
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
