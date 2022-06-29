import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
//import factory from '../../ethereum/factory';
//import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class VoteNew extends Component {
  state = {
    voteroomName: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.requestAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution, "Test creating campaign")
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a new Voteroom</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Name of the Voteroom</label>
            <Input
              value={this.state.voteroomName}
              onChange={event =>
                this.setState({ voteroomName: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create Voteroom
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default VoteNew;
