import React, { useRef, useState } from "react";
import { ILoginProps } from "./types";
import "./LoginPage.css";
import { Fab, Button } from "@mui/material";
import { Link } from "react-router-dom";

import foresight_logo from "../../img/foresight_shadowed.png";
import LoginForm from "../../components/LoginForm/LoginForm";
import { saveData, useStore } from "../../state/store";
import User from "../../types/User";
import ProfilePicSelector from "../../components/ProfilePicSelector/ProfilePicSelector";

import hilbertPfp from '/pub_img/pfp_icon/hilbert.png'

const LoginPage = (props: ILoginProps) => {

  const setUserData = useStore(state => state.setUserData)
  const setToken = useStore(state => state.setToken)

  let formData = useRef({
    username: '',
    avatar: hilbertPfp
  });

  const handleCreateUser = () => {

    if (formData.current.username.length === 0) {
      formData.current.username = "newUser"
    }

    let newUser = {
      screenName: formData.current.username,
      profileIcon: formData.current.avatar,
      createdDate: new Date()
    } as User
    setUserData(newUser)
    saveData()
    setToken()
    window.location.href = "/main"
  };

  return (
    <div className="login-tile">
      <div className="foresight-login-container">
        <img
          className="foresight-login-logo"
          style={{ maxWidth: "100%", height: "auto", padding: "15px" }}
          src={foresight_logo}
          alt="Welcome to Foresight!"
          width="492"
          height="99"
        ></img>
        <span className="foresight-login-text">
          new user registration
        </span>
        <div className="foresight-user-info-entry">
          <LoginForm formData={formData.current} />
        </div>
        <div className="foresight-avatar-picker">
          <ProfilePicSelector labelText="choose your avatar" formData={formData.current}/>
        </div>
        <div className="foresight-login-button-container">
          <Fab
            className="foresight-login-button"
            onClick={handleCreateUser}
            variant="extended"
            style={{
              backgroundColor: "#C4C4C4",
              color: "#FFFFFF",
              textTransform: "lowercase",
              fontFamily: "UDKakugo_SmallM",
              fontSize: "18pt",
              fontWeight: "normal",
            }}
          >
            register
          </Fab>
        </div>
        {
            /*
        <div className="foresight-register-text">
          <span className="foresight-login-light-text">
            already a user?
          </span>
          <div className="foresight-register-button-container">
            <Button
              className="foresight-register-button"
              style={{
                color: "#6a6a6a",
                textTransform: "lowercase",
                fontFamily: "UDKakugo_SmallM",
                fontSize: "18pt",
                fontWeight: "normal",
              }}
            >
              <u>test button</u>
            </Button>
            
          </div>
            
          
        </div>
        */}
      </div>
    </div>
  );
};

export default LoginPage;
