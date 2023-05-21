import React from "react";
import { Button, Text } from "../atom";
import "../../Styles/style.css";
import { btn_round, txt_h6, txt_p } from "../../Constants/VariantConstant";
import { AiOutlineSearch, AiFillDelete } from "react-icons/ai";

//location, timestamp, onRevisit, onRemove
const SearchHistoryItem = React.forwardRef((props, ref) => {
  return (
    <div className="searchHistoryItem">
      <div className="searchHistoryItem-left">
        <Text
          variant={txt_h6}
          text={props.location}
          style={{
            fontWeight: 100,
          }}
        />
        <Text
          variant={txt_p}
          text={props.timestamp}
          style={{
            fontWeight: 100,
          }}
        />
      </div>
      <div className="searchHistoryItem-right">
        <div className="searchHistoryItem-right-button">
          <Button
            variant={btn_round}
            hasIcon
            icon={<AiOutlineSearch size={25} />}
            text=""
            onClick={props.onRevisit}
            title="Revisit"
          />
        </div>
        <div className="searchHistoryItem-right-button">
          <Button
            variant={btn_round}
            hasIcon
            icon={<AiFillDelete size={25} />}
            text=""
            onClick={props.onRemove}
            title="Remove"
          />
        </div>
      </div>
    </div>
  );
});

export default SearchHistoryItem;
