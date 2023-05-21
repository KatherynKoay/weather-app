import React from "react";
import * as button from "../../Constants/VariantConstant"; //btn_......

const Button = React.forwardRef((props, ref) => {
  let variation = "";

  function IconPosition(props) {
    const hasIcon = props.hasIcon;
    if (hasIcon) {
      return (
        <>
          {props.icon}
          {props.text}
        </>
      );
    }
    return <>{props.text}</>;
  }

  switch (props.variant) {
    case button.btn_round: {
      variation = "btn-round";
      break;
    }
    case button.btn_square: {
      variation = "btn-square";
      break;
    }
    default: {
      variation = "";
      break;
    }
  }

  return (
    <button
      className={`${props.className} ${variation}`}
      id={props.id}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
      title={props.title}
    >
      {IconPosition(props)}
    </button>
  );
});

export default Button;
