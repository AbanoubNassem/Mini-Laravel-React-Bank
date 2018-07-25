import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import Context from './Context';
import API from '../API';
import Echo from "laravel-echo";


export default class Store extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let state = {};
        for (let i = 0, len = localStorage.length; i < len; ++i) {
            state[localStorage.key(i)] = JSON.parse(localStorage.getItem(localStorage.key(i)));
        }
        this.setState({
            ...state,
            history: createBrowserHistory({basename: shared.basename}),
            updateStore: this.updateStore.bind(this),
            clearStore: this.clearStore.bind(this),
            api: {...API},
            init: this.init.bind(this),
            currencies: [],
            echo: {}
        });
    }

    componentDidMount() {
        if (this.state.access_token) {
            //lets make sure it's valid one!
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.access_token;
            axios.post(to('/refresh'))
                .then(res => {
                    if (res.headers.Authorization) {
                        this.updateStore({access_token: res.headers.Authorization});
                    }

                    this.updateStore({user: res.data}, true).then(() => this.init());
                })
                .catch(err => {
                    localStorage.clear();
                    this.setState({});
                    this.setState({loaded: true});
                    this.state.history.replace('/');
                    location.reload();
                });
        } else {
            this.setState({loaded: true})
        }
    }

    clearStore() {
        this.state.history.replace('/');
        location.reload();
        this.setState(null);
        localStorage.clear();

    }

    updateStore(object, andSave = false) {
        return new Promise((resolve, reject) => {

            this.setState({...object}, () => {
                if (andSave) {
                    for (var key in object) {
                        if (object.hasOwnProperty(key)) {
                            localStorage.setItem(key, JSON.stringify(object[key]));
                        }
                    }
                }
                resolve()
            });
        })
    }

    init() {
        this.state.api.getCurrencies().then(res => {
            this.updateStore({currencies: res.data})
        });


        this.setState({
            echo: new Echo({
                auth: {
                    headers: {
                        Authorization: 'Bearer ' + this.state.access_token
                    }
                },
                broadcaster: 'pusher',
                key: process.env.MIX_PUSHER_APP_KEY,
                cluster: process.env.MIX_PUSHER_APP_CLUSTER,
                encrypted: true
            })
        });

        this.state.echo.private('forex').listen('ForexChanged', ({currencies}) => {
            this.setState({currencies});
        });

        this.setState({loaded: true});
    }

    render() {
        return (
            <Context.Provider value={
                this.state
            }
            >
                {this.props.children}
            </Context.Provider>
        );
    }
}
