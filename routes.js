const routes = require('next-routes')();

routes
  .add('/voteRoom/newVoteroom', '/voteRoom/newVoteroom')
  .add('/voteRoom/:address', '/voteRoom/show')
  .add('/voteRoom/:address/vote', '/voteRoom/vote/index')
  .add('/voteRoom/:address/vote/new', '/voteRoom/vote/new');

module.exports = routes;