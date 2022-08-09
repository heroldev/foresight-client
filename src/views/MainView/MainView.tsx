import React from 'react'
import "./MainView.css"
import MainTile from "../../components/MainTile/MainTile"
import ForesightHeader from '../../components/SiteHeader/ForesightHeader'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import { useStore } from '../../state/store'
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer'

const MainView = () => {

  const { user } = useStore(state => ({ user: state.user }))

  return (
    <div className="main-view">
      <ForesightHeader userInfo={user} />
      <div className="view-content-container">
        <MainTile />
      </div>
    </div>
  )
}

export default MainView