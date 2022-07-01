import React from 'react';
import { Card, Button, Dimmer, Loader } from 'semantic-ui-react';
import VoteRoom from '../ethereum/voteRoom';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

const VoteRoomOverview = () => {
  const [state, setState] = React.useState({
    voteRooms: [],
    loading: false,
    voteRoomsWithDetails: [],
  });

  React.useEffect(() => {
    setState({ ...state, loading: true });
    async function loadVoteRooms() {
      const voteRooms = await factory.methods.getAllVoteRooms().call();
      const voteRoomsWithDetails = await Promise.all(
        voteRooms.map(async address => {
          const voteRoom = VoteRoom(address);
          const description = await voteRoom.methods.voteRoomDescription().call();
          const voterCount = await voteRoom.methods.voterCount().call();
          const manager = await voteRoom.methods.manager().call();
          const voteNumber = await voteRoom.methods.getNumberOfVotes().call();
          return { address, description, voterCount, manager, voteNumber };

        }));
      setState({ loading: false, voteRoomsWithDetails, voteRooms });
    }
    loadVoteRooms();
  }, []);


  const renderVoteRooms = () => {
    return state.voteRoomsWithDetails.map(({ address, description, voterCount, voteNumber }) => {
      return <Card raised={true} style={{ minWidth: '600px' }
      } centered={true} key={address}>
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
  };

  const renderLoading = () => (
    <Card raised={true} style={{ minWidth: '600px', minHeight: '170px' }} centered={true}>
      <Card.Content>
        <Card.Header textAlign='center'>
          <Dimmer active inverted>
            <Loader inverted>Fetching Blockchain Data...</Loader>
          </Dimmer>
        </Card.Header>
      </Card.Content>

    </Card>
  );

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
          {state.loading ? renderLoading() : renderVoteRooms()}
        </Card.Group>
      </div>
    </Layout>
  );
}
export default VoteRoomOverview;
