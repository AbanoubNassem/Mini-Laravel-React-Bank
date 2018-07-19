import React from 'react';
import {Route} from "react-router-dom";

import Store from '../Store';
import Home from '../Pages/Home';
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Transfer from "../Pages/Transfer";


export default () => (
    <Store.Consumer>
        {
            (state) => (
                <div>
                    <Route exact path="/" render={(props) => <Home {...props} {...state}/>}/>
                    <Route exact path="/home" render={(props) => <Home {...props} {...state}/>}/>
                    <Route exact path="/register" render={(props) => <Register {...props} {...state}/>}/>
                    <Route exact path="/login" render={(props) => <Login {...props} {...state}/>}/>
                    <Route exact path="/transfer" render={(props) => <Transfer {...props} {...state}/>}/>
                </div>
            )
        }
    </Store.Consumer>
);