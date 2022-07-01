import React from 'react';
import { Form, Button, Message, Input, Checkbox } from 'semantic-ui-react';
import VoteRoom from '../../ethereum/voteRoom';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';

const InviteVoter = (props) => {
  const [state, setState] = React.useState({
    address: '',
    newVoters: [],
    errorMessage: '',
  });

  React.useEffect(() => {
    setState({ ...state, address: props.url.query.address });
  }, []);

  const onSubmit = async event => {
    event.preventDefault();
    setState({ ...state, loading: true, errorMessage: '' });

    const voteRoom = VoteRoom(state.address);

    try {
      state.newVoters.forEach((address) => {
        if (!web3.utils.isAddress(address.trim())) {
          throw new Error(`Invalid address: ${address}`);
        }
      })
      const accounts = await web3.eth.requestAccounts();
      await voteRoom.methods
        .inviteVoters(state.newVoters.map(e => e.trim()))
        .send({ from: accounts[0] });

      Router.pushRoute(`/voteroom/${state.address}`);
    } catch (err) {
      console.error(err);
      setState({ ...state, errorMessage: err.message });
    }

    setState({ ...state, loading: false });
  };

  return (
    <Layout>
      <Link route={`/voteroom/${state.address}/`}>
        <a>Back</a>
      </Link>
      <h3>Add new Voters</h3>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Field>
          <label>Invite Voters</label>
          <div style={{ fontSize: '10px', color: 'gray' }}>Comma Separated</div>
          <Input
            value={state.newVoters}
            onChange={event =>
              setState({ newVoters: event.target.value.split(',') })}
            label="Addresses"
            labelPosition="left"
            placeholder="0x... , 0x..."
          />
        </Form.Field>

        <Message error header="Oops!" content={state.errorMessage} />
        <Button primary loading={state.loading}>
          Invite!
        </Button>
      </Form>
    </Layout>
  );
}

export default InviteVoter;
