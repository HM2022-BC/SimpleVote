import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class VoteRoomOverview extends Component {
  static async getInitialProps() {
    const voteRooms = await factory.methods.getAllVoteRooms().call();

    return { voteRooms };
  }

  renderVoteRooms() {
    const items = this.props.voteRooms.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/voteroom/${address}`}>
            <a>View Room</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
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

          {this.renderVoteRooms()}
        </div>
      </Layout>
    );
  }
}
export default VoteRoomOverview;
