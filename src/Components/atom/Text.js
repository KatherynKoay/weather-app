import React from "react";
import * as text from "../../Constants/VariantConstant"; //txt_......

const Text = React.forwardRef((props, ref) => {
  switch (props.variant) {
    case text.txt_h1: {
      return (
        <h1>
          {props.text}
          {props.value}
        </h1>
      );
      break;
    }
    case text.txt_h2: {
      return (
        <h2>
          {props.text}
          {props.value}
        </h2>
      );
      break;
    }
    case text.txt_h3: {
      return (
        <h3>
          {props.text}
          {props.value}
        </h3>
      );
      break;
    }
    case text.txt_h4: {
      return (
        <h4>
          {props.text}
          {props.value}
        </h4>
      );
      break;
    }
    case text.txt_h5: {
      return (
        <h5>
          {props.text}
          {props.value}
        </h5>
      );
      break;
    }
    case text.txt_h6: {
      return (
        <h6>
          {props.text}
          {props.value}
        </h6>
      );
      break;
    }
    case text.txt_p: {
      return (
        <p>
          {props.text}
          {props.value}
        </p>
      );
      break;
    }
    default: {
      return null;
      break;
    }
  }
});

export default Text;
