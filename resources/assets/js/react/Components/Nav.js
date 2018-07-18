import React, {Component} from 'react';
import {Input, Menu, Segment} from 'semantic-ui-react';


export default class MenuExamplePointing extends Component {
    constructor(props) {
        super(props);
        this.state = {activeItem: 'home'};

        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            activeItem: this.props.history.location.pathname.replace('/', '') // to make the menu point correctly!
        })
    }


    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
        this.props.history.replace(`/${name}`);
    }

    render() {
        const {activeItem} = this.state;

        return (
            <Menu pointing>
                <Menu.Item name='home' active={activeItem === 'home'}
                           onClick={this.handleItemClick}/>
                <Menu.Item
                    name='messages'
                    active={activeItem === 'messages'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='friends'
                    active={activeItem === 'friends'}
                    onClick={this.handleItemClick}
                />

                {
                    !this.props.signedIn ?
                        <Menu.Menu position='right'>
                            <Menu.Item
                                name='login'
                                active={activeItem === 'login'}
                                onClick={this.handleItemClick}
                            />
                            < Menu.Item
                                name='register'
                                active={activeItem === 'register'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item>
                                <Input icon='search' placeholder='Search...'/>
                            </Menu.Item>
                        </Menu.Menu>
                        :
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Input icon='search' placeholder='Search...'/>
                            </Menu.Item>
                        </Menu.Menu>
                }
            </Menu>
        )
    }
}