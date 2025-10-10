/* eslint-disable promise/prefer-await-to-then */
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
const options = {
	statusCode, headers, body, url,
};

test('Response is a function', t => {
	t.is(typeof Response, 'function');
});

test('Response cannot be invoked without \'new\'', t => {
	t.throws(() => {
		// eslint-disable-next-line new-cap
		Response({
			statusCode, headers, body, url,
		});
	});

	t.notThrows(() => {
		// eslint-disable-next-line no-new
		new Response({
			statusCode, headers, body, url,
		});
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

test('response works with delayed listener attachment', async t => {
	const response = new Response(options);

	// Simulate delayed listener attachment like Got does
	const result = await new Promise((resolve, reject) => {
		setImmediate(() => {
			getStream(response).catch(reject).then(resolve);
		});
	});

	t.is(result, bodyText);
});

test('response works when piped through transform streams', async t => {
	const {PassThrough} = await import('node:stream');

	const response = new Response(options);
	const passThrough = new PassThrough();

	response.pipe(passThrough);

	const result = await getStream(passThrough);
	t.is(result, bodyText);
});

test('response works with decompress-response', async t => {
	const {gzip} = await import('node:zlib');
	const {promisify} = await import('node:util');
	const decompressResponseModule = await import('decompress-response');
	const decompressResponse = decompressResponseModule.default;

	const gzipAsync = promisify(gzip);
	const compressedBody = await gzipAsync(bodyText);

	const response = new Response({
		statusCode,
		headers: {...headers, 'content-encoding': 'gzip'},
		body: compressedBody,
		url,
	});

	const decompressed = decompressResponse(response);
	const result = await getStream(decompressed);

	t.is(result, bodyText);
});

test('response works with decompress-response and delayed listeners', async t => {
	const {gzip} = await import('node:zlib');
	const {promisify} = await import('node:util');
	const decompressResponseModule = await import('decompress-response');
	const decompressResponse = decompressResponseModule.default;

	const gzipAsync = promisify(gzip);
	const compressedBody = await gzipAsync(bodyText);

	const response = new Response({
		statusCode,
		headers: {...headers, 'content-encoding': 'gzip'},
		body: compressedBody,
		url,
	});

	const decompressed = decompressResponse(response);

	// Simulate delayed listener attachment
	const result = await new Promise((resolve, reject) => {
		setImmediate(() => {
			getStream(decompressed).catch(reject).then(resolve);
		});
	});

	t.is(result, bodyText);
});
