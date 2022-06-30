import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0xAf2A688288a790e684E3876062566aA782b2C262";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;