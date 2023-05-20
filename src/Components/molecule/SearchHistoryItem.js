import React from "react";
import { Button, Text } from "../atom";
import "../../Styles/style.css";
import { btn_round, txt_h6, txt_p } from "../../Constants/VariantConstant";
import { AiOutlineSearch, AiFillDelete } from "react-icons/ai";
import theme from "../../Styles/theme";

//location, timestamp, onRevisit, onRemove
const SearchHistoryItem = React.forwardRef((props, ref) => {
  return (
    <div className="searchHistoryItem">
      <div className="searchHistoryItem-left">
        <Text
          variant={txt_h6}
          text={props.location}
          style={{
            color: theme["darkTheme-primary-color"],
            fontWeight: 100,
          }}
        />
        <Text
          variant={txt_p}
          text={props.timestamp}
          style={{
            color: theme["darkTheme-primary-color"],
            fontWeight: 100,
          }}
        />
      </div>
      <div className="searchHistoryItem-right">
        <div className="searchHistoryItem-right-button">
          <Button
            variant={btn_round}
            hasIcon
            icon={
              <AiOutlineSearch
                color={theme["lightTheme-gray-color"]}
                size={25}
              />
            }
            text=""
            style={{
              background: "white",
            }}
            onClick={props.onRevisit}
          />
        </div>
        <div className="searchHistoryItem-right-button">
          <Button
            variant={btn_round}
            hasIcon
            icon={
              <AiFillDelete color={theme["lightTheme-gray-color"]} size={25} />
            }
            text=""
            style={{
              background: "white",
            }}
            onClick={props.onRemove}
          />
        </div>
      </div>
    </div>
  );
});

export default SearchHistoryItem;
