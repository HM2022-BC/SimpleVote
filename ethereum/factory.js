import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0x693d413208831C55bdD2a6221C811feDaC0098B7";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;