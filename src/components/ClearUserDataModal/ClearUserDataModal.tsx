import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { deletePkmnDeck, getDeckBox, select, useStore } from '../../state/store';
import './ClearUserDataModal.css'
import { IClearUserDataModalProps } from './types';

const ClearUserDataModal = (props: any) => {

  const {onClose} = props

  const [deleteTimer, setDeleteTimer] = useState(0);

  const [enableDelete, setEnableDelete] = useState(false)

  const clearUserData = useStore(state => state.clearUserData)
  const clearToken = useStore(state => state.clearToken)

  useEffect(() => {
    if (deleteTimer === 0) {
      setEnableDelete(true)
      setDeleteTimer(5)
    }

    // exit early when we reach 0
    if (!deleteTimer) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {

      setDeleteTimer(deleteTimer - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add deleteTimer as a dependency to re-rerun the effect
    // when we update it
  }, [deleteTimer]);

  const handleClearUserData = () => {
    clearToken();
    let deckBox = select(getDeckBox)
    deckBox.forEach(deck => {
      deletePkmnDeck(deck.deckId)
    })
    window.location.href = "/"
    clearUserData()
  }


  return (
    <div className="foresight-modal-container">
      <div className="foresight-modal-background">
        <div className="foresight-modal-foreground">
          <div className="foresight-modal-content">
            <span className="modal-header-text">delete user data?</span>
            <p className="modal-medium-text">Deleting your user data effectively removes any and all presence of your account from Foresight.</p>
            <p className="modal-medium-text">This means that all of your created decks, in-progress decks, and any potentially sentimental data will be <strong>completely deleted.</strong></p>
            <span className="modal-large-text" style={{ paddingBottom: "27px" }}><strong>are you sure you want to do this?</strong></span>
            <div className="foresight-modal-footer">
              <div className="footer-button-container">
                <Button variant="contained" style={{ backgroundColor: "#6a6a6a" }} onClick={onClose} size={"medium"}>
                  No, take me back
                </Button>
                <Button variant="contained" disabled={!enableDelete} onClick={handleClearUserData} style={{ backgroundColor: "#D22323" }} size={"medium"}>
                  Yes, Delete my data 
                  {!enableDelete &&
                    ' (' + deleteTimer + ')'
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )

}

export default ClearUserDataModal


