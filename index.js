/*
 * Bundle: index.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */

"use strict";

if (process.env.NODE_ENV && process.env.NODE_ENV == "production") {
	require("newrelic");
}

const config						= require("config");
const r									= require("rethinkdb");
const io								= require("socket.io")(3001);

const EmitterHelper			= require("./src/helpers/emitter");
const RethinkdbHelper		= require("./src/helpers/rethinkdb");

const AuthHandler				= require("./src/handlers/auth");
const EventsHandler			= require("./src/handlers/events");
const MessagesHandler		= require("./src/handlers/messages");

class App {
	constructor() {
		this.environment			= (process.env.NODE_ENV || "development");
		this.dirname					= __dirname;

		this.helper						= {};
		this.helper.emitter		= new EmitterHelper(this);
		this.helper.rethinkdb	= new RethinkdbHelper(this);

		this.handler					= {};
		this.handler.auth			= new AuthHandler(this);
		this.handler.events		= new EventsHandler(this);
		this.handler.messages	= new MessagesHandler(this);

		io.on("connection", (socket) => {
			this.socket = socket;
			r.connect(config.get("databases").rethinkdb).then((conn) => {
				this.socket.rdb = conn;
			});
		});

		this._init_auth();
		this._init_events();
		this._init_close_event();
		this._init_message();
	}

	_init_auth() {
		this.socket.on("auth", (token) => {
			this.handler.auth.auth(this.socket, token);
		});
	}

	_init_events() {
		this.socket.on("event.geo", (data) => {
			this.handler.events.geo_all(this.socket,
				data.distance, data.latitude, data.longitude);
		});
		this.socket.on("event.hashtag", (data) => {
			this.handler.events.geo_contain(this.socket,
				data.distance, data.latitude, data.longitude, data.key, data.value);
		});
		this.socket.on("event.key", (data) => {
			this.handler.events.contain(this.socket, data.key, data.value);
		});
	}

	_init_close_event() {
		this.socket.on("close.event.geo", () => {
			this.socket.event.geo.close();
		});
		this.socket.on("close.event.hashtag", () => {
			this.socket.event.hashtag.close();
		});
		this.socket.on("close.event.key", () => {
			this.socket.event.key.close();
		});
	}

	_init_message() {
		this.socket.on("message.join", (data) => {
			this.handler.messages.join(this.socket, data.conversation_id);
		});
		this.socket.on("message.push", (data) => {
			this.handler.messages.push(this.socket,
				data.conversation_id, data.message);
		});
		this.socket.on("message.quit", (data) => {
			this.socket.leave(data.conversation_id);
		});
	}
}

new App();
