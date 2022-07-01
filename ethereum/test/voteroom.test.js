const RoomCreator = artifacts.require('./RoomCreator.sol');
const VoteRoom = artifacts.require('./VoteRoom.sol');
const truffleAssert = require('truffle-assertions');

contract('VoterRoom', (accounts) => {

	let roomCreator;
	let roomAddresses;
	let voteRoom;
	const VOTERS = [accounts[0], accounts[1], accounts[2]];
	const NEW_VOTERS = [accounts[3], accounts[4], accounts[5]];
	const DESCRIPTION = 'test SimpleVote dApp';

	beforeEach(async () => {
		roomCreator = await RoomCreator.new()
		await roomCreator.createRoom(DESCRIPTION, VOTERS);

		roomAddresses = await roomCreator.getAllVoteRooms.call();
		voteRoom = await VoteRoom.at(roomAddresses[0]);
	});

	describe('creation', () => {
		it('should have created a new room', async () => {
			assert.ok(roomAddresses);
		});

		it('should have the right description', async () => {
			const description = await voteRoom.voteRoomDescription.call();
			assert.equal(description, 'test SimpleVote dApp');
		});

		it('should have the correct managerAddress', async () => {
			const managerAddress = await voteRoom.manager.call();
			assert.equal(managerAddress, accounts[0]);
		});

		it('should have the three invited voters', async () => {
			const voterCount = await voteRoom.voterCount.call();

			assert.equal(voterCount, 3);
			assert.ok(await voteRoom.invitedVoters.call(VOTERS[0]));
			assert.ok(await voteRoom.invitedVoters.call(VOTERS[1]));
			assert.ok(await voteRoom.invitedVoters.call(VOTERS[2]));
		});
	});

	describe('invite new voters', () => {
		it('should not add invited voters twice', async () => {
			await voteRoom.inviteVoters(VOTERS);

			const voterCount = await voteRoom.voterCount.call();

			assert.equal(voterCount, 3);
		});

		it('should not allow a non manager inviting new voters', async () => {
			// Call is reverted by the EVM
			await truffleAssert.reverts(voteRoom.inviteVoters(NEW_VOTERS, { from: accounts[9] }));

			const voterCount = await voteRoom.voterCount.call();

			assert.equal(voterCount, 3);
		});

		it('should add new voters', async () => {
			await voteRoom.inviteVoters(NEW_VOTERS);

			const voterCount = await voteRoom.voterCount.call();

			assert.equal(voterCount, 6);
			assert.ok(await voteRoom.invitedVoters.call(NEW_VOTERS[0]));
			assert.ok(await voteRoom.invitedVoters.call(NEW_VOTERS[1]));
			assert.ok(await voteRoom.invitedVoters.call(NEW_VOTERS[2]));
		});
	});

	describe('manager vote actions', () => {
		it('should create new vote with default data', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);

			const voteNumber = await voteRoom.getNumberOfVotes.call();
			const vote = await voteRoom.votes.call(0);

			assert.equal(vote.description, description);
			assert.equal(vote.minimumVotes, minimumVotes);
			assert.equal(vote.isPublic, isPublic);
			assert.equal(vote.isFinalized, false);
			assert.equal(vote.inFavor, 0);
			assert.equal(vote.against, 0);
			assert.equal(vote.abstain, 0);
			assert.equal(voteNumber, 1);
		});

		it('should not allow a non manager creating new votes', async () => {
			await truffleAssert.reverts(voteRoom.createVote('wont work', true, { from: accounts[9] }));

			const numberOfVotes = await voteRoom.getNumberOfVotes.call();

			assert.equal(numberOfVotes, 0);
		});

		it('should only allow finalization with minimum votes', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await truffleAssert.reverts(voteRoom.finalizeVote(0));

			const isFinalized = (await voteRoom.getResult.call(0)).isFinalized;

			assert.equal(isFinalized, false);
		});

		it('should only allow the manager to finalize', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await truffleAssert.reverts(voteRoom.finalizeVote(0, { from: NEW_VOTERS[0] }));

			const isFinalized = (await voteRoom.getResult.call(0)).isFinalized;

			assert.equal(isFinalized, false);
		});
	});

	describe('voter vote actions', () => {
		it('should vote in favor', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteInFavor(0);

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 1);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
		});

		it('should vote against', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteAgainst(0);

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 0);
			assert.equal(result.against, 1);
			assert.equal(result.abstain, 0);
		});

		it('should vote abstain', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteAbstain(0);

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 0);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 1);
		});

		it('should only allow invited voters to vote non-public votes', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = false;

			await voteRoom.createVote(description, minimumVotes, isPublic);

			await truffleAssert.reverts(voteRoom.voteInFavor(0, { from: accounts[9] }));
			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 0);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
			assert.equal(result.isFinalized, false);
		});

		it('should allow anyone to vote on public votes', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteInFavor(0, { from: accounts[9] });
			await voteRoom.voteInFavor(0, { from: VOTERS[0] });

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 2);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
			assert.equal(result.isFinalized, false);
		});

		it('should dissalow voting on finalized votes', async () => {
			const description = 'test vote';
			const minimumVotes = 0;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.finalizeVote(0);

			await truffleAssert.reverts(voteRoom.voteInFavor(0, { from: accounts[9] }));

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 0);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
			assert.equal(result.isFinalized, true);
		});

		it('should dissalow voting twice', async () => {
			const description = 'test vote';
			const minimumVotes = 0;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteInFavor(0);
			await truffleAssert.reverts(voteRoom.voteInFavor(0));

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 1);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
			assert.equal(result.isFinalized, false);
		});
	});

	describe('helper methods', () => {
		it('should return the result of a vote', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteInFavor(0);

			const result = await voteRoom.getResult.call(0);

			assert.equal(result.inFavor, 1);
			assert.equal(result.against, 0);
			assert.equal(result.abstain, 0);
			assert.equal(result.isFinalized, false);
		});

		it('should return the vote count', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.voteInFavor(0);
			await voteRoom.voteAbstain(0, { from: accounts[9] });

			const result = await voteRoom.getVoteCount.call(0);

			assert.equal(result, 2);
		});

		it('should get the number of votes', async () => {
			const description = 'test vote';
			const minimumVotes = 1;
			const isPublic = true;

			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.createVote(description, minimumVotes, isPublic);
			await voteRoom.createVote(description, minimumVotes, isPublic);

			const result = await voteRoom.getNumberOfVotes.call();

			assert.equal(result, 3);
		});
	});
});
