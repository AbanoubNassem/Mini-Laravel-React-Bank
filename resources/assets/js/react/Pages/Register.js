import React, {PureComponent} from 'react';
import {Button, Grid, Form} from 'semantic-ui-react'
import utlis from '../Utilities';

export default class Register extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            submitting: false
        };

        this.inputChanged = this.inputChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    submit() {
        this.setState({submitting: true});
        this.props.api.register(this.state).then(res => {
                this.setState({submitting: false});
                this.props.updateStore({
                    user: res.data.user,
                    access_token: res.data.access_token,
                    signedIn: true
                }, true).then(() => {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.access_token;
                    this.props.init();
                    this.props.history.replace('/');
                    toastr.success('You have made new account');
                });
            },
            ({response: {data}}) => {
                utlis.toastErrors(data.errors);

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
                        <Form.Input required label='Name' type='text' name="name" onChange={this.inputChanged}/>
                        <Form.Input required label='Email' type='email' name="email" onChange={this.inputChanged}/>
                        <Form.Input required label='Password' type='password' name="password"
                                    onChange={this.inputChanged}/>
                        <Form.Input required label='Confirm Password' type='password' name="password_confirmation"
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