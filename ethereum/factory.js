import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0xDA84c102c60e9419505C4ABd7ca1794BA2eE9620";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;