import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router-dom';
import {Dimmer, Loader} from 'semantic-ui-react';


import Store from './Store';
import Routes from './Routes';
import Header from './Components/Header';
import Footer from './Components/Footer';

export default class App extends Component {
    render() {
        return (
            <Store.Provider>
                <Store.Consumer>
                    {
                        (state) => {
                            return state.loaded ?
                                <Router basename="bank" history={state.history}>
                                    <div>
                                        <Header/>
                                        <Routes/>
                                        <Footer/>
                                    </div>
                                </Router>
                                :
                                <Dimmer active>
                                    <Loader>Loading</Loader>
                                </Dimmer>
                        }

                    }
                </Store.Consumer>
            </Store.Provider>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App/>, document.getElementById('app'));
}
