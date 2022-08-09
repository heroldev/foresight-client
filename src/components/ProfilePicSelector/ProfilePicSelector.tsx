import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import AvatarViewer from "../AvatarViewer/AvatarViewer";
import "./ProfilePicSelector.css"
import { IProfilePicSelectorProps } from "./types";

const ProfilePicSelector = (props: IProfilePicSelectorProps) => {

  const { labelText, formData } = props;

  const [avatar, setAvatar] = useState('/pub_img/pfp_icon/hilbert.png')

  const handleAvatarChoose = (event: any) => {
    setAvatar(event.target.value)
    formData.avatar = event.target.value;
  }

  const avatarIcons = new Map([
    ["Hilbert (BW)", '/pub_img/pfp_icon/hilbert.png'],
    ["Hilda (BW)", '/pub_img/pfp_icon/hilda.png'],
    ["Steven (ORAS)", '/pub_img/pfp_icon/steven_oras.png'],
    ["Lyra (HGSS)", '/pub_img/pfp_icon/lyra_hgss.png'],
    ["Ethan (HGSS)", '/pub_img/pfp_icon/ethan_hgss.png'],
    /*
    ["Dawn (PT)", '/pfp_icon/dawn_pt.png'],
    */
    ["Lucas (PT)", '/pub_img/pfp_icon/lucas_pt.png'],
  ]);

  const getAvatarKeys = () => {
    return Array.from(avatarIcons.keys())
  }

  return (
    <div className="avatar-chooser-container">
      <AvatarViewer profilePicture={avatar} width={170} height={170} padding={true} />
      <div className="avatar-label-select">
        <span className="foresight-avatar-label-text">{labelText}</span>
        <FormControl fullWidth>
          <InputLabel id="avatar-chooser-input-label">Avatar</InputLabel>
          <Select
            labelId="avatar-chooser-select-label"
            id="avatar-chooser-select"
            value={avatar}
            label="Avatar"
            onChange={handleAvatarChoose}
          >
            {
              getAvatarKeys().map(key => (
                <MenuItem value={avatarIcons.get(key)}>{key}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
    </div>

  )

}

export default ProfilePicSelector