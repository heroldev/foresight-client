import React, { useState } from 'react';
import { Redirect, Route, RouteProps } from 'react-router';
import { useStore } from '../../state/store';
import Login from '../LoginPage/LoginPage'
import MainView from '../MainView/MainView'
import Welcome from '../WelcomePage/Welcome';

interface ProtectedRouteProps extends RouteProps {
    needsAuthentication: boolean,
}

/*
* ProtectedRoute
* Originally provided by @alevi22
*/

/**
 * Route component that determines how to route the user based on whether they are authenticated
 * to the application
 */
const ProtectedRoute = (props: ProtectedRouteProps) => {

    const { needsAuthentication } = props;

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token") !== null)

    if (isAuthenticated === needsAuthentication) {
        // If the user's authentication status matches the needed authentication status, route to the requested page
        return (
            <React.Fragment>
                <Route {...props}>
                    {props.children}
                </Route>
            </React.Fragment>
        )
    } else {
        if (needsAuthentication) {
            /**
                 * If the user is not authenticated but needs to be, show the login page on the requested route
                 * (so that when the user logs in, they will be shown the correct component for the route they were on
                 * rather than being redirected to the home page)
                 */
            return (
                <Route {...props} component={undefined} render={undefined}>
                    <Login redirectURL={props.location?.pathname} />
                </Route>
            );
        } else {
            /**
                 * If the user is authenticated but needs to not be, redirect to the home page
                 * (This would happen if the user is logged in and tries to go to the login or
                 * create account pages)
                 */
            return (
                <Route path="/" component={Welcome} />
            );
        }

    }


}

export default ProtectedRoute