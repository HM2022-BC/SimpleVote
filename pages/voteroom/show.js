import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import VoteRoom from '../../ethereum/voteRoom';
import { Link } from '../../routes';

class VoteRoomShow extends Component {
  static async getInitialProps(props) {
    const voteRoom = VoteRoom(props.query.address);

    const description = await voteRoom.methods.voteRoomDescription().call();
    const voterCount = await voteRoom.methods.voterCount().call();
    const manager = await voteRoom.methods.manager().call();
    const voteNumber = await voteRoom.methods.getNumberOfVotes().call();

    const votes = await Promise.all(
      Array(parseInt(voteNumber))
        .fill()
        .map((_, index) => {
          return voteRoom.methods.votes(index).call();
        })
    );

    const openVotes = votes.filter(vote => vote.isFinalized === false);
    const publicOpenVotes = openVotes.filter(vote => vote.isPublic === true);

    return {
      address: props.query.address,
      description,
      manager,
      voterCount,
      voteNumber,
      openVotes,
      publicOpenVotes,
    };
  }

  renderCards() {
    const {
      manager,
      description,
      voterCount,
      voteNumber,
      openVotes,
      publicOpenVotes,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Manager Address',
        description:
          'The manager created this campaign, can create new votes and finalize them.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: description,
        meta: 'Description',
        description:
          'Description of the VoteRoom (set by the manager).'
      },
      {
        header: voterCount,
        meta: 'Voters',
        description:
          'Number of whitelisted voters.'
      },
      {
        header: voteNumber,
        meta: 'Votes',
        description:
          'Number of total votes.'
      },
      {
        header: `${openVotes.length} (${publicOpenVotes.length} public)`,
        meta: 'Open Votes',
        description:
          'Number of open votes.'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>VoteRoom Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column >{this.renderCards()}</Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/voteroom/${this.props.address}/votes`}>
                <a>
                  <Button primary>View Votes</Button>
                </a>
              </Link>
            </Grid.Column>
            <Grid.Column style={{ marginLeft: '20px' }}>
              <Link route={`/voteroom/${this.props.address}/addvoters`}>
                <a>
                  <Button primary>Invite Voters</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default VoteRoomShow;
