import React, { FC } from "react";
import LoginBox from "../LoginBox/LoginBox";
import { ILoginFormProps } from "./types";

const LoginForm: FC<ILoginFormProps> = ({ formData }) => {
  const [username, setUsername] = React.useState(formData.username);

  function handleChange(value: string, type: string) {
    if (type === "username") {
      setUsername(value);
      formData.username = value;
    }
  }

  return (
    <div className="foresight-login-form">
      <LoginBox
        value={username}
        className="login-username-field"
        hintText="username"
        type="username"
        onChange={(value) => handleChange(value, "username")}
      />
      {
        /*
        <LoginBox
        value={password}
        className="login-password-field"
        hintText="password"
        type="password"
        onChange={(value) => handleChange(value, "password")}
      />
      */
      }
    </div>
  );
};

export default LoginForm;
