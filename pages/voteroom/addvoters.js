import React, { Component } from 'react';
import { Form, Button, Message, Input, Checkbox } from 'semantic-ui-react';
import VoteRoom from '../../ethereum/voteRoom';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';

class InviteVoter extends Component {
  state = {
    newVoters: [],
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });

    const voteRoom = VoteRoom(this.props.address);

    try {
      this.state.newVoters.forEach((address) => {
        if (!web3.utils.isAddress(address.trim())) {
          throw new Error(`Invalid address: ${address}`);
        }
      })
      const accounts = await web3.eth.requestAccounts();
      await voteRoom.methods
        .inviteVoters(this.state.newVoters.map(e => e.trim()))
        .send({ from: accounts[0] });

      Router.pushRoute(`/voteroom/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/voteroom/${this.props.address}/`}>
          <a>Back</a>
        </Link>
        <h3>Add new Voters</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Invite Voters</label>
            <div style={{ fontSize: '10px', color: 'gray' }}>Comma Separated</div>
            <Input
              value={this.state.newVoters}
              onChange={event =>
                this.setState({ newVoters: event.target.value.split(',') })}
              label="Addresses"
              labelPosition="left"
              placeholder="0x... , 0x..."
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Invite!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default InviteVoter;
