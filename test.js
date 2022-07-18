import {Buffer} from 'node:buffer';
import test from 'ava';
import lowercaseKeys from 'lowercase-keys';
import getStream from 'get-stream';
import Response from './index.js';

const statusCode = 200;
const headers = {Foo: 'Bar'};
const bodyText = 'Hi.';
const body = Buffer.from(bodyText);
const url = 'https://example.com';
const options = {statusCode, headers, body, url};

test('Response is a function', t => {
	t.is(typeof Response, 'function');
});

test('Response cannot be invoked without \'new\'', t => {
	t.throws(() => {
		// eslint-disable-next-line new-cap
		Response({statusCode, headers, body, url});
	});

	t.notThrows(() => {
		// eslint-disable-next-line no-new
		new Response({statusCode, headers, body, url});
	});
});

test('new Response() throws on invalid statusCode', t => {
	t.throws(() => {
		// eslint-disable-next-line no-new
		new Response({headers, body, url});
	}, {
		message: 'Argument `statusCode` should be a number',
	});
});

test('new Response() throws on invalid headers', t => {
	t.throws(() => {
		// eslint-disable-next-line no-new
		new Response({statusCode, body, url});
	}, {
		message: 'Argument `headers` should be an object',
	});
});

test('new Response() throws on invalid body', t => {
	t.throws(() => {
		// eslint-disable-next-line no-new
		new Response({statusCode, headers, url});
	}, {
		message: 'Argument `body` should be a buffer',
	});
});

test('new Response() throws on invalid url', t => {
	t.throws(() => {
		// eslint-disable-next-line no-new
		new Response({statusCode, headers, body});
	}, {
		message: 'Argument `url` should be a string',
	});
});

test('response has expected properties', t => {
	const response = new Response(options);
	t.is(response.statusCode, statusCode);
	t.deepEqual(response.headers, lowercaseKeys(headers));
	t.is(response.body, body);
	t.is(response.url, url);
});

test('response headers have lowercase keys', t => {
	const response = new Response(options);
	t.not(JSON.stringify(headers), response.headers);
	t.deepEqual(response.headers, lowercaseKeys(headers));
});

test('response streams body', async t => {
	const response = new Response(options);
	const responseStream = await getStream(response);
	t.is(responseStream, bodyText);
});
