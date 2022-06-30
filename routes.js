const routes = require('next-routes')();

routes
  .add('/voteroom/newvoteroom', '/voteroom/newvoteroom')
  .add('/voteroom/:address', '/voteroom/show')
  .add('/voteroom/:address/votes', '/voteroom/vote/index')
  .add('/voteroom/:address/votes/new', '/voteroom/vote/new')
  .add('/voteroom/:address/addvoters', '/voteroom/addvoters');

module.exports = routes;