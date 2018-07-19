import React, {PureComponent} from 'react';
import {Button, Grid, Form} from 'semantic-ui-react'
import utlis from '../Utilities';

export default class Transfer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            account_id: '',
            amount: '',
            submitting: false
        };

        this.inputChanged = this.inputChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    submit() {
        this.setState({submitting: true});
        this.props.api.transferTo(this.state.account_id, this.state.amount)
            .then(res => {
                this.props.user.balance = ((this.props.user.balance * this.props.user.currency.rate) - this.state.amount) / this.props.user.currency.rate;

                this.props.updateStore({
                    user: this.props.user
                }, true).then(() => {
                    toastr.success(res.data.message);
                });

                this.setState({submitting: false});
            })
            .catch(err => {
                toastr.error(err.response.data.message);

                this.setState({submitting: false});
            });
    };

    inputChanged(e, target) {
        this.state[target.name] = target.value;
        this.setState(this.state);
    }

    render() {
        return (
            <Grid columns='equal'>
                <Grid.Column>
                </Grid.Column>
                <Grid.Column width={8}>
                    <Form>
                        <Form.Input required label='Account Id' type='number' name="account_id"
                                    onChange={this.inputChanged}/>
                        <Form.Input required label='Amount' type='number' name="amount"
                                    onChange={this.inputChanged}/>
                        <Button loading={this.state.submitting} primary type='submit'
                                onClick={this.submit}>Submit</Button>
                    </Form>

                </Grid.Column>
                <Grid.Column>
                </Grid.Column>
            </Grid>

        );
    }
}