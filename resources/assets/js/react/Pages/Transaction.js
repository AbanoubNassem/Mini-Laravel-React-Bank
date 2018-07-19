import React from 'react';
import {Table, Label, Grid, Header} from 'semantic-ui-react'

export default class Transaction extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }
    }

    componentWillMount() {
        if (this.props.sent)
            this.props.api.getSentTransactions()
                .then(({data}) => {
                    this.setState({transactions: data});
                });
        else {
            this.props.api.getReceivedTransactions()
                .then(({data}) => {
                    this.setState({transactions: data});
                });
        }
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>

                </Grid.Column>
                <Grid.Column width={8}>
                    <Header as='h1'>
                        {
                            this.props.sent ?
                                'Transactions Sent'
                                :
                                'Transactions Received'
                        }
                    </Header>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{
                                    this.props.sent ?
                                        'To' :
                                        'From'
                                }</Table.HeaderCell>
                                <Table.HeaderCell>Account Id</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                this.state.transactions.map((u) => {
                                    return (
                                        <Table.Row key={u.id}>
                                            <Table.Cell>
                                                <Label ribbon>{
                                                    this.props.sent ?
                                                        u.to.name :
                                                        u.from.name
                                                }</Label>
                                            </Table.Cell>
                                            <Table.Cell>{u.account_id}</Table.Cell>

                                            <Table.Cell>{(u.amount * this.props.user.currency.rate).format(2, 3, '.', ',')} {this.props.user.currency.symbol}</Table.Cell>


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