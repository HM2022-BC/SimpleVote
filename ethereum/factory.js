import web3 from './web3';
import RoomCreator from './build/contracts/RoomCreator.json';

const roomCreatorAddress = "0x3A2F8D3a56eaa38373262FDD43Eb59916A6516b5";

const instance = new web3.eth.Contract(RoomCreator.abi, roomCreatorAddress);

export default instance;