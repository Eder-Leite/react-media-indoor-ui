/* eslint-disable no-unused-vars */
import React from 'react';
import App from '../src/pages/app';
import Login from '../src/pages/login';
import AccessDenied from '../src/pages/access-denied';
import PageNotFound from '../src/pages/page-not-found';
import { isAuthenticated } from '../src/services/Auth';//uses JWT
import ResetPassword from '../src/pages/reset-password';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            isAuthenticated() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                )
        )} />
);

const Routes = () => (
    <BrowserRouter basename='/#'>
        <Switch>
            <Route exact path='/' component={Login} />
            <Route path='/app' component={App} />
            <Route exact path='/access-denied' component={AccessDenied} />
            <Route exact path='/reset-password' component={ResetPassword} />

            <Route path='*' component={PageNotFound} />
        </Switch>
    </BrowserRouter>
);

export default Routes;