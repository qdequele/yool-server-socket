/*
 * Bundle: Helpers - rethinkdb.js
 * Project: Yool - Server - Socket
 * Author: Quentin de Quelen <quentin@dequelen.me>
 */

const r				= require("rethinkdb");
const config	= require("config");

class RethinkdbHelper {
	constructor(app) {
		this._app = app;
	}

	find(table_name, id) {
		return r.table(table_name)
			.get(id)
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	findAll(table_name) {
		return r.table(table_name)
			.run(this._app.rdb)
			.then((cursor) => {
				return Promise.resolve(cursor.toArray());
			});
	}

	findBy(table_name, field_name, value) {
		return r.table(table_name)
			.filter(r.row(field_name).eq(value))
			.orderBy(r.asc("created_at"))
			.run(this._app.rdb)
			.then((cursor) => {
				return Promise.resolve(cursor.toArray());
			});
	}

	findIndexed(table_name, query, index) {
		return r.table(table_name)
			.getAll(query, {
				index: index
			})
			.run(this._app.rdb)
			.then((cursor) => {
				return Promise.resolve(cursor.toArray());
			});
	}

	findAllContain(table_name, field, attribute) {
		return r.table(table_name)
			.filter((item) => {
				return item[field].contains(attribute);
			})
			.run(this._app.rdb)
			.then((cursor) => {
				return Promise.resolve(cursor.toArray());
			});
	}

	populate(table_name, table_name_2, key) {
		return r.table(table_name)
			.eqJoin(key, r.table(table_name_2))
			.map((row) => {
				return row("left").merge({
					[key]: row("right")
				});
			})
			.run(this._app.rdb)
			.then((cursor) => {
				return Promise.resolve(cursor.toArray());
			});
	}

	save(table_name, object) {
		return r.table(table_name)
			.insert(object)
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	edit(table_name, id, object) {
		return r.table(table_name)
			.get(id).update(object)
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	is_updated(table_name, id) {
		return r.table(table_name)
			.get(id)
			.update({
				updated_at: Date.now()
			})
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	append(table_name, id, key, value) {
		return r.table(table_name)
			.get(id)
			.update({
				[key]: r.row(key).append(value)
			})
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	delete_at_index(table_name, id, key, index) {
		return r.table(table_name)
			.get(id)
			.update({
				[key]: r.row(key).deleteAt(index)
			})
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}

	destroy(table_name, id) {
		return r.table(table_name)
			.get(id)
			.delete()
			.run(this._app.rdb)
			.then((result) => {
				return Promise.resolve(result);
			});
	}
}

module.exports = RethinkdbHelper;
