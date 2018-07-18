import React from 'react';
import {Route} from "react-router-dom";

import Store from '../Store';
import Home from '../Pages/Home';
import Register from "../Pages/Register";
import Login from "../Pages/Login";

export default () => (
    <Store.Consumer>
        {
            (state) => (
                <div>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/register" render={(props) => <Register {...props} {...state}/>}/>
                    <Route exact path="/login" render={(props) => <Login {...props} {...state}/>}/>
                </div>
            )
        }
    </Store.Consumer>
);