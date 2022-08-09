import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import "./AvatarHandle.css"
import IAvatarHandleProps from './types'

const AvatarHandle = (props: IAvatarHandleProps) => {

  const { username, profilePicture } = props

  return (
    <div className="avatar-handle-container">
      <Button
        className="foresight-avatar-button"
        style={{
          color: "#6a6a6a",
          textTransform: "none",
          fontFamily: "UDKakugo_SmallM",
          fontSize: "18pt",
          fontWeight: "normal",
        }}
        component={Link}
        to={"/settings"}
      >
        <div className="avatar-handle-pfp-outline">
          <div className="avatar-handle-pfp">
            <img src={profilePicture} alt="pfp" width="100%" height="100%" style={{ borderRadius: "50%" }}></img>
          </div>
        </div>
        <div className="avatar-handle-username">
          <span>{username}</span>
        </div>
      </Button>
    </div>
  )
}

export default AvatarHandle