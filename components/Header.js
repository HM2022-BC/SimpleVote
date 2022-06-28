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
          <a className="item">Votes</a>
        </Link>

        <Link route="/votes/votes_new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
