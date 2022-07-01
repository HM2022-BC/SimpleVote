import React from 'react';
import { Card, Grid, Button, Dimmer, Loader } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import VoteRoom from '../../ethereum/voteRoom';
import { Link } from '../../routes';

const VoteRoomShow = (props) => {
  const [state, setState] = React.useState({
    address: '',
    description: '',
    voterCount: '',
    voteNumber: '',
    manager: '',
    loading: false,
    errorMessage: '',
    votes: [],
    openVotes: 0,
    closedVotes: 0,
  });

  React.useEffect(() => {
    setState({ ...state, loading: true });
    const address = props.url.query.address;
    const voteRoom = VoteRoom(address);


    const loadData = async (address, voteroom) => {
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

      setState({
        loading: false,
        address,
        voteRoom,
        description,
        voterCount,
        manager,
        voteNumber,
        openVotes: openVotes.length,
        publicOpenVotes: publicOpenVotes.length,
      });
    };
    loadData(address, voteRoom);
  }, []);

  const renderCards = () => {
    const {
      manager,
      description,
      voterCount,
      voteNumber,
      openVotes,
      publicOpenVotes,
    } = state;

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
        header: `${openVotes} (${publicOpenVotes} public)`,
        meta: 'Open Votes',
        description:
          'Number of open votes.'
      }
    ];

    return <Card.Group items={items} />;
  }

  const renderLoading = () => (
    <Dimmer active inverted>
      <Loader inverted>Fetching Blockchain Data...</Loader>
    </Dimmer>
  );

  return (
    <Layout>
      <h3>VoteRoom Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column >{state.loading ?
            renderLoading()
            : renderCards()}</Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/voteroom/${state.address}/votes`}>
              <a>
                <Button primary>View Votes</Button>
              </a>
            </Link>
          </Grid.Column>
          <Grid.Column style={{ marginLeft: '20px' }}>
            <Link route={`/voteroom/${state.address}/addvoters`}>
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

export default VoteRoomShow;
