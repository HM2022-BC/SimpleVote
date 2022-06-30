import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import VoteRoom from '../ethereum/voteRoom';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class VoteRoomOverview extends Component {
  static async getInitialProps() {
    const voteRooms = await factory.methods.getAllVoteRooms().call();
    const voteRoomsWithDetails = await Promise.all(
      voteRooms.map(async address => {
        const voteRoom = VoteRoom(address);
        const description = await voteRoom.methods.voteRoomDescription().call();
        const voterCount = await voteRoom.methods.voterCount().call();
        const manager = await voteRoom.methods.manager().call();
        const voteNumber = await voteRoom.methods.getNumberOfVotes().call();
        return { address, description, voterCount, manager, voteNumber };
      })
    );

    return { voteRoomsWithDetails };
  }

  renderVoteRooms() {
    return this.props.voteRoomsWithDetails.map(({ address, description, voterCount, voteNumber }) => {
      return <Card raised={true} style={{ minWidth: '600px' }
      } centered={true} >
        <Card.Content>
          <Card.Header textAlign='center'>{address}</Card.Header>
          <Card.Description textAlign='center'>{description}</Card.Description>
          <Card.Meta textAlign='center'>{voterCount}👤   |   {voteNumber} 🗳️</Card.Meta>
        </Card.Content>
        <Card.Content extra >
          <div className="ui two buttons" style={{ justifyContent: 'center' }}>
            <Link route={`/voteroom/${address}`} >
              <a style={{ marginRight: '20px' }}>
                <Button primary >Show Room</Button>
              </a>
            </Link>
            <Link route={`/voteroom/${address}/votes`}>
              <a style={{ marginLeft: '20px' }}>
                <Button primary floated='right'>View Votes</Button>
              </a>
            </Link>
          </div>
        </Card.Content>
      </Card >;
    });
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open VoteRooms</h3>

          <Link route="/voteroom/newvoteroom">
            <a>
              <Button
                floated="right"
                content="Create VoteRoom"
                icon="add circle"
                primary
              />
            </a>
          </Link>

          <Card.Group>
            {this.renderVoteRooms()}
          </Card.Group>
        </div>
      </Layout>
    );
  }
}
export default VoteRoomOverview;
