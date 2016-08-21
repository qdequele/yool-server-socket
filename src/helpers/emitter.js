/*
 * Bundle: Helpers - emiter.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */

class EmitterHelper {
	constructor(app) {
		this._app = app;
	}

	_typeOfChange(change) {
		if(change.old_val === null) {
			return "created";
		} else if(change.new_val === null) {
			return "deleted";
		} else {
			return "updated";
		}
		return "something";
	}

	send_change(socket, event, changeCursor) {
		changeCursor.each((err, change) => {
			if(err) {
				console.log(err);
			} else {
				let type = this._typeOfChange(change);

				if (type == "created" || type == "updated") {
					socket.emit(event + type, change.new_val);
				} else {
					socket.emit(event + type, change.old_val);
				}
			}
		});
	}
}

module.exports = EmitterHelper;
