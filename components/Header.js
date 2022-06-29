import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link route="/">
        <a className="item">SimpleVote</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Voterooms</a>
        </Link>

        <Link route="/voteRoom/newVoteroom">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
