import React from 'react'

// Import routing components
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'

// Import styling for application
import "./ViewPort.css"

// Import pages for application
import MainView from '../MainView/MainView'
import PageNotFound from '../PageNotFound/PageNotFound';
import Welcome from '../WelcomePage/Welcome';
import LoginPage from '../LoginPage/LoginPage';
import SettingsView from '../SettingsView/SettingsView';
import CreateEditDeck from '../CreateEditDeck/CreateEditDeck';
import CreateNewDeck from '../CreateNewDeck/CreateNewDeck';

// Import music lel
import MediaPlayer from '../../components/MediaPlayer/MediaPlayer';

// Import application state
import { load } from "../../state/store";

const ViewPort = () => {

  window.addEventListener('load', (event) => {
    load()
    console.log("loaded")
  });

  return (
    <div className="foresight-view-port">
      <BrowserRouter>
        <Switch>
          <ProtectedRoute exact path="/" component={Welcome} needsAuthentication={false} />
          <ProtectedRoute exact path="/register" component={LoginPage} needsAuthentication={false} />
          <ProtectedRoute exact path="/settings" component={SettingsView} needsAuthentication={true} />
          <ProtectedRoute exact path='/main' component={MainView} needsAuthentication={true} />
          <ProtectedRoute exact path='/edit' component={CreateEditDeck} needsAuthentication={true} />
          <ProtectedRoute exact path='/create' component={CreateNewDeck} needsAuthentication={true} />

          <Route path="*" component={PageNotFound} />
        </Switch>
      </BrowserRouter>
      {/*
      <MediaPlayer />
  */}
    </div>
  )

}

export default ViewPort