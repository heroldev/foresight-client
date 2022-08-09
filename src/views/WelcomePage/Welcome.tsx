import { Backdrop, Button, Fab, Fade, Modal } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import DisclaimerModal from "../../components/DisclaimerModal/DisclaimerModal";
import foresight_logo from "../../img/foresight_shadowed.png";
import { useStore } from "../../state/store";
import User from "../../types/User";

const Welcome = () => {

  const [isRegister, setIsRegister] = useState(localStorage.getItem("token") !== null)
  const user: User = useStore(state => state.user)

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const handleOpenDisclaimerModal = () => setShowDisclaimerModal(true)
  const handleCloseDisclaimerModal = () => setShowDisclaimerModal(false)

  const handleEnter = () => {
    if (isRegister) {
      window.location.href = '/main'
    } else {
      window.location.href = '/register'
    }
  }

  return (
    <div className="login-tile">
      <Modal
        open={showDisclaimerModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showDisclaimerModal} >
          <div>
            <DisclaimerModal onClose={handleCloseDisclaimerModal} />
          </div>
        </Fade>
      </Modal>
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
          {!isRegister ? "welcome!" : "welcome, " + user.screenName + "!"}
        </span>
        <div className="foresight-login-button-container">
          <Fab
            className="foresight-login-button"
            onClick={handleEnter}
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
            click to enter
          </Fab>
        </div>
        <div className="foresight-register-text">
          <span className="foresight-login-light-text">
            ©2022 heroldev
          </span>
          <div className="foresight-register-button-container">
            <Button
              className="foresight-register-button"
              onClick={handleOpenDisclaimerModal}
              style={{
                color: "#6a6a6a",
                textTransform: "lowercase",
                fontFamily: "UDKakugo_SmallM",
                fontSize: "18pt",
                fontWeight: "normal",
              }}
            >
              <u>disclaimer</u>
            </Button>
          </div>
          <span style={{fontSize: "12pt"}} className="foresight-login-light-text">
            version {import.meta.env.VITE_CLIENT_VERSION}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Welcome