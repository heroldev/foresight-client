import React from 'react'
import "./DisclaimerModal.css"
import "../../bootstrap/global.css"
import { IDisclaimerModalProps } from './types'
import { Button } from '@mui/material'

const DisclaimerModal = (props: IDisclaimerModalProps) => {

  const { onClose } = props;

  return (
    <div className="foresight-modal-container">
      <div className="foresight-modal-background">
        <div className="foresight-modal-foreground">
          <div className="foresight-modal-content">
            <span className="modal-header-text">disclaimer</span>
            <p className="modal-medium-text">Foresight is in no way affiliated with Nintendo, Creatures, GAME FREAK, or The Pokemon Company International.</p>
            <p className="modal-medium-text">All copyrighted material used in this app is provided under "fair use" in accordance with the Digital Millenium Copyright Act (DMCA) under United States law.</p>
            <span className="modal-large-text" style={{ paddingBottom: "12px" }}><strong>All rights belong to their respective owners.</strong></span>
            <div className="foresight-modal-footer">
              <div className="footer-button-container">
                <Button variant="contained" style={{ backgroundColor: "#6a6a6a" }} onClick={onClose} size={"medium"}>
                  I Understand
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )


}

export default DisclaimerModal