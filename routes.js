const routes = require('next-routes')();

routes
  .add('/voteroom/newvoteroom', '/voteroom/newvoteroom')
  .add('/voteroom/:address', '/voteroom/show')
  .add('/voteroom/:address/vote', '/voteroom/vote/index')
  .add('/voteroom/:address/vote/new', '/voteroom/vote/new');

module.exports = routes;