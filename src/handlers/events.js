/*
 * Bundle: Handlers - events.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */

const r			= require("rethinkdb");

class EventsHandler {
	/**
	 * Constructor
	 */
	constructor(app) {
		this._app = app;
	}

	/**
	 * @description [description]
	 * @public
	 * @param  {Socket} socket
	 * @param  {Integer} distance
	 * @param  {Float} latitude
	 * @param  {Float} longitude
	 * @return {Event}
	 */
	geo_all(socket, distance, latitude, longitude) {
		let circle = r.circle([latitude, longitude], parseInt(distance), {
			unit : "km"
		});

		return r.table("events")
		.getIntersecting(circle, {
			index : "location"
		})
		.filter({
			is_private : false
		})
		.changes()
		.run(socket.rdb)
		.then((changeCursor) => {
			socket.event.geo = changeCursor;
			this._app.helper.emitter.send_change(socket, "event.geo.", changeCursor);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	/**
	 * @description [description]
	 * @public
	 * @param  {Socket} socket
	 * @param  {Integer} dist distance
	 * @param  {Float} lat latitude
	 * @param  {Float} long longitude
	 * @param  {String} k key
	 * @param  {String} v value
	 * @return  {Event}
	 */
	geo_contain(socket, dist, lat, long, k, v) {
		let circle = r.circle([lat, long], parseInt(dist), {
			unit : "km"
		});

		return r.table("events")
		.getIntersecting(circle, {
			index : "location"
		})
		.filter({
			is_private : false
		})
		.filter((item) => {
			return item(k).contains(v);
		})
		.changes()
		.run(socket.rdb)
		.then((changeCursor) => {
			socket.event.hashtag = changeCursor;
			this._app.helper.emitter.send_change(socket,
				"event.hashtag.", changeCursor);
		})
		.catch((err) => {
			console.log(err);
		});
	}

	/**
	 * @description [description]
	 * @public
	 * @param {Socket} socket
	 * @param {String} key
	 * @param {String} value
	 * @return {Event}
	 */
	contain(socket, key, value) {
		return r.table("events")
		.filter({
			is_private : false
		})
		.filter((item) => {
			return item(key).contains(value);
		})
		.changes()
		.run(socket.rdb)
		.then((changeCursor) => {
			socket.event.key = changeCursor;
			this._app.helper.emitter.send_change(socket, "event.key.", changeCursor);
		})
		.catch((err) => {
			console.log(err);
		});
	}
}

module.exports = EventsHandler;
