import React from 'react';
import { Form, Button, Message, Input, Checkbox } from 'semantic-ui-react';
import VoteRoom from '../../../ethereum/voteRoom';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

const NewVote = (props) => {
  const [state, setState] = React.useState({
    address: '',
    description: '',
    minimumVotes: 0,
    errorMessage: '',
    isPublic: false,
    loading: false,
  });

  React.useEffect(() => {
    setState({ ...state, address: props.url.query.address });
  }, []);

  const onSubmit = async event => {
    setState({ ...state, loading: true, errorMessage: '' });
    event.preventDefault();

    const voteRoom = VoteRoom(state.address);
    const { description, minimumVotes, isPublic } = state;

    try {
      const accounts = await web3.eth.requestAccounts();
      await voteRoom.methods
        .createVote(description, minimumVotes, isPublic)
        .send({ from: accounts[0] });

      Router.pushRoute(`/voteroom/${state.address}/votes`);
    } catch (err) {
      console.error(err);
      setState({ ...state, errorMessage: err.message });
    }

    setState({ ...state, loading: false });
  };

  return (
    <Layout>
      <Link route={`/voteroom/${state.address}/votes`}>
        <a>Back</a>
      </Link>
      <h3>Create a new Vote</h3>
      <Form onSubmit={onSubmit} error={!!state.errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            required
            value={state.description}
            onChange={event =>
              setState({ ...state, description: event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Minimum Amount of Voters</label>
          <Input
            value={state.minimumVotes}
            onChange={event => setState({ ...state, minimumVotes: event.target.value })}
          />
        </Form.Field>

        <Form.Field>
          <label>Publicly Accessible?</label>
          <Checkbox
            toggle
            checked={state.isPublic}
            onChange={event =>
              setState({ ...state, isPublic: !state.isPublic })}
          />
        </Form.Field>

        <Message error header="Oops!" content={state.errorMessage} />
        <Button primary loading={state.loading}>
          Create!
        </Button>
      </Form>
    </Layout>
  );
}

export default NewVote;
