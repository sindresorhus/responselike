import test from 'ava';
import lowercaseKeys from 'lowercase-keys';
import getStream from 'get-stream';
import Response from '../';
import f from './fixtures';

test('Response is a function', t => {
	t.is(typeof Response, 'function');
});

test('Response cannot be invoked without \'new\'', t => {
	t.throws(() => Response(f.statusCode, f.headers, f.body, f.url)); // eslint-disable-line new-cap
	t.notThrows(() => new Response(f.statusCode, f.headers, f.body, f.url));
});

test('new Response() throws on invalid statusCode', t => {
	const error = t.throws(() => new Response(undefined, f.headers, f.body, f.url));
	t.is(error.message, 'Argument `statusCode` should be a number');
});

test('new Response() throws on invalid headers', t => {
	const error = t.throws(() => new Response(f.statusCode, undefined, f.body, f.url));
	t.is(error.message, 'Argument `headers` should be an object');
});

test('new Response() throws on invalid body', t => {
	const error = t.throws(() => new Response(f.statusCode, f.headers, undefined, f.url));
	t.is(error.message, 'Argument `body` should be a buffer');
});

test('new Response() throws on invalid url', t => {
	const error = t.throws(() => new Response(f.statusCode, f.headers, f.body, undefined));
	t.is(error.message, 'Argument `url` should be a string');
});

test('response has expected properties', t => {
	const response = new Response(f.statusCode, f.headers, f.body, f.url);
	t.is(response.statusCode, f.statusCode);
	t.deepEqual(response.headers, lowercaseKeys(f.headers));
	t.is(response.body, f.body);
	t.is(response.url, f.url);
});

test('response headers have lowercase keys', t => {
	const response = new Response(f.statusCode, f.headers, f.body, f.url);
	t.not(JSON.stringify(f.headers), response.headers);
	t.deepEqual(response.headers, lowercaseKeys(f.headers));
});

test('response streams body', async t => {
	const response = new Response(f.statusCode, f.headers, f.body, f.url);
	const responseStream = await getStream(response);
	t.is(responseStream, f.bodyText);
});
