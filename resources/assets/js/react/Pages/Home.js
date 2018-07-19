import React from 'react';
import {Table, Label, Grid , Header} from 'semantic-ui-react'

export default class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            accounts: []
        }
    }

    componentWillMount() {
        this.props.api.getAccounts()
            .then(({data}) => {
                this.setState({accounts: data});
            });
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>

                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h1'>Only for testing ofc!</Header>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Account Name</Table.HeaderCell>
                                <Table.HeaderCell>Account Id</Table.HeaderCell>
                                <Table.HeaderCell>Balance</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                this.state.accounts.map((u) => {
                                    return (
                                        <Table.Row key={u.id}>
                                            <Table.Cell>
                                                <Label ribbon>{u.name}</Label>
                                            </Table.Cell>
                                            <Table.Cell>{u.account_id}</Table.Cell>
                                            {
                                                this.props.user ?
                                                    <Table.Cell>{(u.balance * this.props.user.currency.rate).format(2, 3, '.', ',')} {this.props.user.currency.symbol}</Table.Cell>
                                                    :
                                                    <Table.Cell>{(+u.balance).format(2, 3, '.', ',')} $</Table.Cell>

                                            }

                                        </Table.Row>
                                    );
                                })
                            }


                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>
        );
    }
}