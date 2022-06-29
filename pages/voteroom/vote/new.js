import React, { Component } from 'react';
import { Form, Button, Message, Input, Checkbox } from 'semantic-ui-react';
import VoteRoom from '../../../ethereum/voteRoom';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class NewVote extends Component {
  state = {
    description: '',
    minimumVotes: 0,
    isPublic: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmit = async event => {
    event.preventDefault();

    const voteRoom = VoteRoom(this.props.address);
    const { description, minimumVotes, isPublic } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.requestAccounts();
      await voteRoom.methods
        .createVote(description, minimumVotes, isPublic)
        .send({ from: accounts[0] });

      Router.pushRoute(`/voteroom/${this.props.address}/votes`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/voteroom/${this.props.address}/votes`}>
          <a>Back</a>
        </Link>
        <h3>Create a new Vote</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              required
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Minimum Amount of Voters</label>
            <Input
              value={this.state.minimumVotes}
              onChange={event => this.setState({ minimumVotes: event.target.value })}
            />
          </Form.Field>

          <Form.Field>
            <label>Publicly Accessible?</label>
            <Checkbox
              toggle
              checked={this.state.isPublic}
              onChange={event =>
                this.setState({ isPublic: event.target.value })}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewVote;
