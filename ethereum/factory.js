import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0xdA4f81243f08cF743e3587c52265670389EBa71A";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;