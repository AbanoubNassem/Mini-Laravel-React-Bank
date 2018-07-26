import React, {Component} from 'react';
import {Input, Menu, Dropdown, Select, Icon} from 'semantic-ui-react';


export default class MenuExamplePointing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home',
        };

        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            activeItem: this.props.history.location.pathname.replace('/', '') // to make the menu point correctly!
        })
    }

    mapCurrencies() {
        let arr = [];


        this.props.currencies.forEach((c) => {
            arr.push({
                key: c.id,
                text: c.name,
                value: c.id
            });
        });

        return arr;
    }


    handleItemClick(e, {name}) {
        this.setState({activeItem: name});
        this.props.history.replace(`/${name}`);
    }

    changeCurrency(id) {
        this.setState({value: id});
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
                            < Menu.Item
                                name='forex'
                                active={activeItem === 'forex'}
                                onClick={this.handleItemClick}
                            />

                            <Dropdown
                                item
                                icon={<Icon name='bell' color={this.props.notifications.length ? 'red' : 'grey'}/>}
                                compact
                                pointing
                                label={{color: 'red', empty: true, circular: true}}
                                text={String(this.props.notifications.length || '')}
                            >
                                <Dropdown.Menu>
                                    {
                                        this.props.notifications.map((notification) => {
                                            return (
                                                <Dropdown.Item key={notification.id}>
                                                    {notification.data.message}
                                                </Dropdown.Item>
                                            )
                                        })
                                    }

                                    <Dropdown.Divider/>

                                    <Dropdown.Item onClick={() => this.props.api.markNotificationsAsRead()
                                        .then(() => this.props.updateStore({notifications: []}))}>
                                        Mark as read
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {
                                this.props.currencies && this.props.currencies.length ?

                                    <Select
                                        className={'top-select'}
                                        search
                                        options={this.mapCurrencies()}
                                        value={this.props.user.currency.id}
                                        onChange={(e, {value}) => this.changeCurrency(value)}
                                    />


                                    : null
                            }

                            <Dropdown item
                                      text={`${this.props.user.name} ${(this.props.user.balance * this.props.user.currency.rate).format(2, 3, '.', ',')} ${this.props.user.currency.symbol}`}>
                                <Dropdown.Menu>
                                    <Dropdown.Item name="transfer"
                                                   onClick={this.handleItemClick}>Transfer</Dropdown.Item>
                                    <Dropdown.Item name="transactions_sent" onClick={this.handleItemClick}>Transactions
                                        Sent</Dropdown.Item>
                                    <Dropdown.Item name="transactions_received" onClick={this.handleItemClick}>Transactions
                                        Received</Dropdown.Item>
                                    <Dropdown.Item onClick={() => {
                                        toastr.info('You have logged out');
                                        this.props.clearStore();
                                    }}>Logout</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>


                        </Menu.Menu>
                }
            </Menu>
        )
    }
}