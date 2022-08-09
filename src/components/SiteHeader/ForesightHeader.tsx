import React from 'react'
import shallow from 'zustand/shallow'
import "./ForesightHeader.css"
import foresight_logo from '../../img/foresight_logo.png'

import AvatarHandle from '../AvatarHandle/AvatarHandle'
import { useStore } from '../../state/store'
import { IHeaderProps } from './types'
import Box from '@mui/material/Box'
import { Link } from 'react-router-dom'
import MediaPlayer from '../MediaPlayer/MediaPlayer'

const ForesightHeader = (props: IHeaderProps) => {

  const {userInfo} = props;

  return (
    <div className="foresight-main-header">
      <Box component={Link} to={'/main'}>
        <img src={foresight_logo} alt="Welcome to Foresight!" width="264" height="40" style={{ padding: '29px' }}></img>
      </Box>
      {/*
      <a href="/main">
        <img src={foresight_logo} alt="Welcome to Foresight!" width="264" height="40" style={{ padding: '29px' }}></img>
      </a>
  */}
      <AvatarHandle username={userInfo.screenName} profilePicture={userInfo.profileIcon} />
    </div>
  )

}

export default ForesightHeader