import React from 'react'

import "../../views/LoginPage/LoginPage.css"

const InvalidDeck = () => {

  return (
    <div className="foresight-login-container">
        <span className="foresight-login-text"><strong>INVALID DECK ID</strong></span>
        <span className="foresight-login-text">you're trying to edit a deck that doesn't exist!</span>
        <span className="foresight-login-text">go <a href='/main'>create a deck</a> first! :)</span>
      </div>
  )

}

export default InvalidDeck