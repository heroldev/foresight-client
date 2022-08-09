import { Close } from '@mui/icons-material'
import { Box, Fab, Fade, Modal } from '@mui/material'
import Backdrop from '@mui/material/Backdrop';
import React from 'react'
import AvatarViewer from '../../components/AvatarViewer/AvatarViewer'
import ClearUserDataModal from '../../components/ClearUserDataModal/ClearUserDataModal';
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer';
import ProfilePicSelector from '../../components/ProfilePicSelector/ProfilePicSelector'
import ForesightHeader from '../../components/SiteHeader/ForesightHeader'
import { useStore } from '../../state/store'
import './SettingsView.css'

const SettingsView = () => {

  const { user } = useStore(state => ({ user: state.user }))

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  return (
    <div className="main-view">
      <Modal
        open={showDeleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showDeleteModal} >
          <div>
            <ClearUserDataModal onClose={handleCloseDeleteModal}/>
          </div>
        </Fade>
      </Modal>
      <ForesightHeader userInfo={user} />
      <div className="settings-content-container">
        <div className="avatar-username-container">
          <AvatarViewer width={270} height={270} profilePicture={user.profileIcon} padding={false} />
          <span className="foresight-username-text" style={{ fontWeight: 600, fontSize: "48px", paddingBottom: "10px", paddingTop: "5px" }}>
            {user.screenName}
          </span>
          <span className="foresight-username-text" style={{ fontSize: "14px", paddingBottom: "5px" }}>
            member since
          </span>
          <span className="foresight-username-text" style={{ fontSize: "24px", paddingBottom: "15px" }}>
            {new Date(user.createdDate).toDateString()}
          </span>
          <Fab className="delete-data-button" variant="extended" onClick={handleOpenDeleteModal} style={{ backgroundColor: '#D22323', color: '#FFFFFF', textTransform: 'capitalize', fontFamily: 'Roboto', fontSize: '13pt', fontWeight: 'normal', whiteSpace: 'nowrap' }}><Close sx={{ mr: 1 }} />Clear User Data</Fab>
        </div>
      </div>
    </div>
  )

}

export default SettingsView