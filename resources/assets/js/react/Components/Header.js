import React, {Component} from 'react';

import Store from '../Store';
import Nav from './Nav';

export default class Header extends Component {
    render() {
        return (
            <Store.Consumer>
                {
                    (state) => (
                        <Nav {...state}/>
                    )
                }
            </Store.Consumer>
        );
    }
}