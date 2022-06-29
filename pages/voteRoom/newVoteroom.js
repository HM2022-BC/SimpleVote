import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class NewVoteRoom extends Component {
  state = {
    description: '',
    invitedVoters: [],
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });

    try {
      this.state.invitedVoters.forEach((address) => {
        if (!web3.utils.isAddress(address.trim())) {
          throw new Error(`Invalid address: ${address}`);
        }
      })
      const accounts = await web3.eth.requestAccounts();

      await factory.methods
        .createRoom(this.state.description, this.state.invitedVoters)
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
        <h3>Create a new VoteRoom</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field required>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Invite Voters</label>
            <div style={{ fontSize: '10px', color: 'gray' }}>Comma Separated</div>
            <Input
              value={this.state.invitedVoters}
              onChange={event =>
                this.setState({ invitedVoters: event.target.value.split(',') })}
              label="Addresses"
              labelPosition="left"
              placeholder="0x..."
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create Voteroom
          </Button>
        </Form>
      </Layout >
    );
  }
}

export default NewVoteRoom;
