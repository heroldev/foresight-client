import React from 'react'

import foresight_logo from '../../img/foresight_shadowed.png'

import "../LoginPage/LoginPage.css"
import "./PageNotFound.css"

const PageNotFound = () => {

  return (

    <div className="page-not-found">
      <img className="foresight-login-logo" style={{ maxWidth: '100%', height: 'auto', padding: '15px' }} src={foresight_logo} alt="Welcome to Foresight!" width="492" height="99"></img>
      <div className="foresight-login-container">
        <span className="foresight-login-text"><strong>ERROR 404</strong></span>
        <span className="foresight-login-text">page not found</span>
        <span className="foresight-login-text">how did you even get here?</span>
      </div>
    </div>

  )

}

export default PageNotFound