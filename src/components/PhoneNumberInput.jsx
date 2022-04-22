import InputMask from "react-input-mask";
import React from "react";
import { InputBase } from "@material-ui/core";

const PhoneNumberInput = ({
  value,
  onChange,
  disabled = false,
  placeholder = "",
  ...props
}) => (
  <InputMask
    mask="**999999999"
    disabled={disabled}
    maskChar=""
    value={value}
    formatChars={{
      9: "[0-9]",
      a: "[A-Za-z]",
      "*": ".",
    }}
    onChange={onChange}
    {...props}
  >
    {(inputProps) => (
      <InputBase
        style={{
          fontSize: "18px",
          padding: "6px 10px",
          height: "auto",
        }}
        placeholder={placeholder}
        className="MuiInputBase-input"
        {...inputProps}
        type="tel"
      />
    )}
  </InputMask>
);
export default PhoneNumberInput;
