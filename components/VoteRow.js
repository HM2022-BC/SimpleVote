import React from 'react';
import { Table, Button } from 'semantic-ui-react';
import { Router } from '../routes';
import web3 from '../ethereum/web3';
import VoteRoom from '../ethereum/voteRoom';

const VoteRow = (props) => {
  const [loading, setLoading] = React.useState(false);

  const act = async (action) => {
    setLoading(true);
    const vote = VoteRoom(props.address);

    const accounts = await web3.eth.requestAccounts();

    try {
      if (action === 'inFavor')
        await vote.methods.voteInFavor(props.id).send({ from: accounts[0] });
      else if (action === 'against')
        await vote.methods.voteAgainst(props.id).send({ from: accounts[0] });
      else if (action === 'abstain')
        await vote.methods.voteAbstain(props.id).send({ from: accounts[0] });
      else if (action === 'finalize')
        await vote.methods.finalizeVote(props.id).send({ from: accounts[0] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      props.rerender();
      // Router.pushRoute(`/voteroom/${props.address}/votes`);
    }
  };

  const { Row, Cell } = Table;
  const { id, vote } = props;
  const readyToFinalize = parseInt(vote.inFavor) + parseInt(vote.against) + parseInt(vote.abstain) >= parseInt(vote.minimumVotes);
  const max = Math.max(parseInt(vote.inFavor), parseInt(vote.against), parseInt(vote.abstain));
  const minVotesColor = readyToFinalize ? vote.isFinalized ? '' : 'green' : 'red';

  return (
    <Row
      disabled={vote.isFinalized}
      positive={vote.inFavor > vote.against}
      negative={vote.inFavor < vote.against}
    >
      <Cell>{id}</Cell>
      <Cell>{vote.description}</Cell>
      <Cell style={{ color: minVotesColor }} textAlign='center'>{vote.minimumVotes}</Cell>
      <Cell>
        <Cell style={{ color: max === parseInt(vote.inFavor) ? "green" : '' }}>{vote.inFavor}</Cell>
        <Cell style={{ color: max === parseInt(vote.against) ? "red" : '' }}>{vote.against}</Cell>
        <Cell style={{ color: max === parseInt(vote.abstain) ? "brown" : '' }}>{vote.abstain}</Cell>
      </Cell>

      <Cell textAlign='center'>{vote.isPublic ? '✔️' : '❌'}</Cell>
      <Cell textAlign='center'>
        {vote.isFinalized ? null : (
          <Button.Group>
            <Button color="green" loading={loading} onClick={() => act('inFavor')}>
              In Favor
            </Button>
            <Button.Or />
            <Button color="red" loading={loading} onClick={() => act('against')}>
              Against
            </Button>
            <Button.Or />
            <Button color="brown" loading={loading} onClick={() => act('abstain')}>
              Abstain
            </Button>
            {readyToFinalize ? (
              <>
                <Button.Or />
                <Button color="teal" floated='right' loading={loading} onClick={() => act('finalize')} >
                  Finalize
                </Button>
              </>
            ) : null}
          </Button.Group>

        )}
      </Cell>
    </Row >
  );
}

export default VoteRow;
