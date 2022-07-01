import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import VoteRoom from '../../../ethereum/voteRoom';
import VoteRow from '../../../components/VoteRow';

class VoteIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const voteRoom = VoteRoom(address);
    const voteNumber = await voteRoom.methods.getNumberOfVotes().call();
    const managerAddress = await voteRoom.methods.manager().call();

    const votes = await Promise.all(
      Array(parseInt(voteNumber))
        .fill()
        .map((_, index) => {
          return voteRoom.methods.votes(index).call();
        })
    );

    return { address, votes, voteRoom, voteNumber, managerAddress };
  }

  renderRows() {
    return this.props.votes.map((vote, index) => ({ ...vote, index })).sort((a, b) => Number(a.isFinalized) - Number(b.isFinalized))
      .map(vote => {
        return (
          <VoteRow
            address={this.props.address}
            key={vote.index}
            id={vote.index}
            vote={vote}
          />
        );
      });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Votes</h3>
        <Link route={`/voteroom/${this.props.address}/votes/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              Add Vote
            </Button>
          </a>
        </Link>
        <Table celled selectable>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Minimum Votes</HeaderCell>
              <HeaderCell>In Favor</HeaderCell>
              <HeaderCell>Against</HeaderCell>
              <HeaderCell>Abstained</HeaderCell>
              <HeaderCell>Is Public</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.voteNumber} votes.</div>
      </Layout>
    );
  }
}

export default VoteIndex;
