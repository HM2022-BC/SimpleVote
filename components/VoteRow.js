import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import VoteRoom from '../ethereum/voteRoom';

class VoteRow extends Component {

  act = async (action) => {
    const vote = VoteRoom(this.props.address);

    const accounts = await web3.eth.requestAccounts();

    if (action === 'inFavor')
      await vote.methods.voteInFavor(this.props.id).send({ from: accounts[0] });
    else if (action === 'against')
      await vote.methods.voteAgainst(this.props.id).send({ from: accounts[0] });
    else if (action === 'abstain')
      await vote.methods.voteAbstain(this.props.id).send({ from: accounts[0] });
    else if (action === 'finalize')
      await vote.methods.finalizeVote(this.props.id).send({ from: accounts[0] });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, vote } = this.props;
    const readyToFinalize = vote.inFavor + vote.against + vote.abstain >= vote.minimumVotes;

    return (
      <Row
        disabled={vote.isFinalized}
        positive={vote.inFavor > vote.against}
        negative={vote.inFavor < vote.against}
      >
        <Cell>{id}</Cell>
        <Cell>{vote.description}</Cell>
        <Cell style={{ color: readyToFinalize ? "green" : "red" }}>{vote.minimumVotes}</Cell>
        <Cell style={{ color: "green" }}>{vote.inFavor}</Cell>
        <Cell style={{ color: "red" }}>{vote.against}</Cell>
        <Cell style={{ color: "brown" }}>{vote.abstain}</Cell>
        <Cell>{vote.isPublic ? '✔️' : '❌'}</Cell>
        <Cell>
          {vote.isFinalized ? null : (
            <Button color="green" basic onClick={() => this.act('inFavor')}>
              In Favor
            </Button>
          )}
          {vote.isFinalized ? null : (
            <Button color="red" basic onClick={() => this.act('against')}>
              Against
            </Button>
          )}
          {vote.isFinalized ? null : (
            <Button color="brown" basic onClick={() => this.act('abstain')}>
              Abstain
            </Button>
          )}
          {!vote.isFinalized && readyToFinalize ? (
            <Button color="teal" basic onClick={() => this.act('finalize')}>
              Finalize
            </Button>
          ) : null}
        </Cell>
      </Row>
    );
  }
}

export default VoteRow;
