/*
 * Bundle: Handlers - auth.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */

const config	= require("config");
const moment	= require("moment");
const jwt			= require("jwt-simple");

class AuthHandler {
	constructor(app) {
		this._app		= app;
		this.secret	= process.env.TOKEN_SECRET;
	}

	auth(socket, token) {
		let decoded = jwt.decode(token, this.secret);

		if(decoded.exp <= moment().format("x")) {
			socket.emit("token_expired");
			socket.close();
		} else {
			socket.user_id = decoded.user;
			console.log(socket.user_id);
		}
	}
}

module.exports = AuthHandler;
