import React from 'react';
import { Button, Table, Card, Dimmer, Loader } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import VoteRoom from '../../../ethereum/voteRoom';
import VoteRow from '../../../components/VoteRow';

const VoteIndex = (props) => {
  const [state, setState] = React.useState({
    address: '',
    votes: [],
    voteRoom: {},
    voteNumber: 0,
    loading: true,
    errorMessage: '',
  });

  React.useEffect(() => {
    const getData = async () => {
      const address = props.url.query.address;
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
      setState({
        ...state,
        loading: false,
        address,
        voteRoom,
        voteNumber,
        managerAddress,
        votes,
      });
    };
    getData();
  }, [state.loading]);

  const rerender = () => {
    setState({ ...state, loading: true });
  };

  const renderRows = () => {
    return state.votes.map((vote, index) => ({ ...vote, index })).sort((a, b) => Number(a.isFinalized) - Number(b.isFinalized))
      .map(vote => {
        return (
          <VoteRow
            address={state.address}
            key={vote.index}
            id={vote.index}
            vote={vote}
            rerender={rerender}
          />
        );
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
  )

  const { Header, Row, HeaderCell, Body } = Table;

  return (
    <Layout>
      <h3>Votes</h3>
      <Link route={`/voteroom/${state.address}/votes/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Vote
          </Button>
        </a>
      </Link>
      {state.loading ? renderLoading() :
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
          <Body>{renderRows()}</Body>
        </Table>
      }
      <div>Found {state.voteNumber} votes.</div>
    </Layout>
  );
}

export default VoteIndex;
