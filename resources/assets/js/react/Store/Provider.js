import React, {Component} from 'react';
import {createBrowserHistory} from 'history';
import Context from './Context';


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
            history: createBrowserHistory(),
            updateStore: this.updateStore.bind(this)
        });
    }

    componentDidMount() {
        if (this.state.access_token) {
            //lets make sure it's valid one!
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.state.access_token;
            axios.post('/api/refresh')
                .then(res => {
                    if (res.headers.Authorization) {
                        this.updateStore({access_token: res.headers.Authorization});
                    }
                    this.setState({loaded: true});
                })
                .catch(err => {
                    localStorage.clear();
                    this.setState({});
                    this.setState({loaded: true})
                });
        } else {
            this.setState({loaded: true})
        }
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
