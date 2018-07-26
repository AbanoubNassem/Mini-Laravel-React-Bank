import React from 'react';
import {Table, Transition, Grid, Header} from 'semantic-ui-react'


export default class Forex extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filter: ['ALL', 'EUR', 'AED', 'EGP'],

        }
    }

    componentWillMount()
    {
        this.props.echo.private('forex').listen('ForexChanged', ({currencies}) => {
            this.props.updateStore({currencies});
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
                        {/*<Table.Header>*/}
                        {/*<Table.Row>*/}
                        {/*<Table.HeaderCell>Account Name</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>Account Id</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>Balance</Table.HeaderCell>*/}
                        {/*</Table.Row>*/}
                        {/*</Table.Header>*/}

                        <Table.Body>
                            {
                                this.props.currencies//.filter(value => -1 !== this.state.filter.indexOf(value.name))
                                    .map((currency) => {
                                        return (
                                            <Table.Row key={currency.id}>
                                                <Table.Cell>
                                                    {currency.name}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Transition animation='slide up' duration={500}>
                                                        <span>{currency.rate}</span>
                                                    </Transition>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
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