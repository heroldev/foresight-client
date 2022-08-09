import React from "react";
import "./AvatarViewer.css"
import { IAvatarViewerProps } from "./types";

const AvatarViewer = (props: IAvatarViewerProps) => {

  const {profilePicture, width, height, padding} = props;

  let outerHeight = height + "px"
  let outerWidth = width + "px"

  let innerHeight = (height - 20) + "px"
  let innerWidth = (width - 20) + "px"

  return (
    <div className="avatar-viewer-container" style={padding ? {paddingRight: "25px"} : {}}>
      <div className="avatar-viewer-pfp-outline" style={{width: outerWidth, height: outerHeight}}>
        <div className="avatar-viewer-pfp" style={{width: innerWidth, height: innerHeight}}>
            <img src={profilePicture} alt="pfp" width="100%" height="100%" style={{borderRadius: "50%"}}></img>
        </div>
      </div>
    </div>
  )

}

export default AvatarViewer