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
