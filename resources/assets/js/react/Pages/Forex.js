import React from 'react';
import {Table, Transition, Grid, Dropdown, Header, Container} from 'semantic-ui-react'


export default class Forex extends React.PureComponent {
    constructor(props) {
        super(props);
        this.onSelectChanged = this.onSelectChanged.bind(this);
    }

    componentWillMount() {
        this.props.echo.private('forex').listen('ForexChanged', ({currencies}) => {
            this.props.updateStore({currencies});
        });
    }

    onSelectChanged(e, {value}) {
        this.props.updateStore({filter: value});
    }

    render() {

        return (
            <Grid columns='equal'>
                <Grid.Column width={6}>
                    <Container textAlign='center'>
                        <Header as='h4'>Select the Currencies you want to keep on watching!</Header>
                        <Dropdown placeholder='Currency' fluid multiple search selection
                                  onChange={this.onSelectChanged}
                                  defaultValue={this.props.filter}
                                  options={this.props.currencies.map((c) => {
                                      return {
                                          key: c.id,
                                          value: c.name,
                                          text: c.name
                                      };
                                  })}/>
                    </Container>
                </Grid.Column>
                <Grid.Column width={9}>
                    <Header as='h5'>The refresh rate is 1 minute , and it based on USD!</Header>
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
                                this.props.currencies.filter(value => -1 !== this.props.filter.indexOf(value.name))
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
            </Grid>
        );
    }
}