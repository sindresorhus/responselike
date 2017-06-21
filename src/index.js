'use strict';

const Readable = require('stream').Readable;

class Response extends Readable {
	constructor(statusCode, headers, body, url) {
		headers = headers || {};

		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}
		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}

		super();
		this.statusCode = statusCode;
		this.headers = headers;
		this.body = body;
		this.url = url;
	}

	_read() {
		this.push(this.body);
		this.push(null);
	}
}

module.exports = Response;
