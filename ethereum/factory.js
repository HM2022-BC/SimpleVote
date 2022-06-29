import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0x3d5e6943F082e458da230385542309FBa9d14ab5";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;