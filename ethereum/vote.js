import web3 from './web3';
import VoteRoom from './build/contracts/VoteRoom.json';

export default address => {
    return new web3.eth.Contract(VoteRoom.abi, address);
};