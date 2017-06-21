import test from 'ava';
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
