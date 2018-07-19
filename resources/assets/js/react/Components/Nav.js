import React, {Component} from 'react';
import {Input, Menu, Dropdown} from 'semantic-ui-react';


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

    changeCurrency(id) {
        this.props.api.changeCurrency(id)
            .then(({data}) => {
                let user = this.props.user;
                user['currency'] = data.data;
                this.props.updateStore({user: user}, true);
            });
    }

    render() {
        const {activeItem} = this.state;

        return (
            <Menu pointing>
                <Menu.Item name='home' active={activeItem === 'home'}
                           onClick={this.handleItemClick}/>
                <Menu.Item
                    name='about'
                    active={activeItem === 'about'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='more'
                    active={activeItem === 'more'}
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

                            {
                                this.props.currencies ?
                                    <Dropdown item
                                              text="Currencies">
                                        <Dropdown.Menu>
                                            {
                                                this.props.currencies.map((c) => {
                                                    return (
                                                        <Dropdown.Item key={c.id}
                                                                       onClick={() => this.changeCurrency(c.id)}>
                                                            {`${c.name}(${c.symbol})`}
                                                        </Dropdown.Item>
                                                    )
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    : null
                            }

                            <Dropdown item
                                      text={`${this.props.user.name} ${(this.props.user.balance * this.props.user.currency.rate).format(2, 3, '.', ',')} ${this.props.user.currency.symbol}`}>
                                <Dropdown.Menu>
                                    <Dropdown.Item>Transfer</Dropdown.Item>
                                    <Dropdown.Item>Transactions</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        toastr.info('You have logged out');
                                        this.props.clearStore();
                                    }}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Menu.Item>
                                <Input icon='search' placeholder='Search...'/>
                            </Menu.Item>
                        </Menu.Menu>
                }
            </Menu>
        )
    }
}