import React from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

const NewVoteRoom = () => {
  const [state, setState] = React.useState({
    description: '',
    errorMessage: '',
    loading: false,
    invitedVoters: [],
  });


  const handleSubmit = async event => {
    event.preventDefault();

    setState({ ...state, loading: true, errorMessage: '' });

    try {
      state.invitedVoters.forEach((address) => {
        if (!web3.utils.isAddress(address.trim())) {
          throw new Error(`Invalid address: ${address}`);
        }
      })
      const accounts = await web3.eth.requestAccounts();

      await factory.methods
        .createRoom(state.description, state.invitedVoters.map(e => e.trim()))
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (err) {
      console.error(err);
      setState({ ...state, errorMessage: err.message });
    }

    setState({ ...state, loading: false });
  };

  return (
    <Layout>
      <h3>Create a new VoteRoom</h3>

      <Form onSubmit={handleSubmit} error={!!state.errorMessage}>
        <Form.Field required>
          <label>Description</label>
          <Input
            value={state.description}
            onChange={event =>
              setState({ ...state, description: event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Invite Voters</label>
          <div style={{ fontSize: '10px', color: 'gray' }}>Comma Separated</div>
          <Input
            value={state.invitedVoters}
            onChange={event =>
              setState({ ...state, invitedVoters: event.target.value.split(',') })}
            label="Addresses"
            labelPosition="left"
            placeholder="0x... , 0x..."
          />
        </Form.Field>

        <Message error header="Oops!" content={state.errorMessage} />
        <Button loading={state.loading} primary>
          Create Voteroom
        </Button>
      </Form>
    </Layout >
  );
}

export default NewVoteRoom;
