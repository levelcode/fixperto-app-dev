const io = require('socket.io-client');
const socket = io("https://api.fixperto.com", { transports: ["websocket"] });
export { socket };