/*
 * Bundle: Handlers - messages.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */


class MessagesHandler {
	constructor(app) {
		this._app = app;
	}

	join(socket, conversation_id) {
		let find_conversation = (conversation_id) => {
			return socket.rdb.find("conversations", conversation_id);
		};

		let add_to_conversation = (conv) => {
			conv = conv[0];
			if (conv.users.indexOf(socket.user_id) == -1) {
				conv.users.push(socket.user_id);
				socket.rdb.append("conversations", conversation_id,
					"users", socket.user_id);
			}

			return Promise.resolve();
		};

		let socket_join = () => {
			socket.join(conversation_id);
		};

		find_conversation(conversation_id)
			.then(add_to_conversation)
			.then(socket_join)
			.catch((err) => {
				console.log(err);
			});
	}

	push(socket, conversation_id, content) {

		let create_message = () => {
			return new Promise((resolve, reject) => {
				let message = {
					user_id: socket.user_id,
					conversation_id: conversation_id,
					content: content,
					"created_at" : Date.now(),
					"updated_at" : Date.now()
				};

				socket.rdb.save("messages", message)
					.then(() => {
						resolve(message);
					})
					.catch((err) => {
						reject(err);
					});
			});
		};

		let socket_broadcast = (message) => {
			socket.broadcast.to(conversation_id).emit("message.push", message);

			return Promise.resolve();
		};

		create_message()
			.then(socket_broadcast)
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = MessagesHandler;
