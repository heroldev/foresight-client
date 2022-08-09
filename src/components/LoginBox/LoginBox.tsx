import React, { FC } from "react";
import "./LoginBox.css";
import { ILoginBoxProps } from "./types";

const LoginBox: FC<ILoginBoxProps> = ({ type, hintText, value, onChange }) => {
  return (
    <div className="login-box-container">
      <div className="login-box-background">
        <div className="login-box-foreground">
          <input
            value={value}
            onChange={(e) => onChange(e.currentTarget.value)}
            className="login-field"
            type={type}
            placeholder={hintText}
          />
        </div>
      </div>
    </div>
  );
};
export default LoginBox;
