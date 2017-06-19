import test from 'ava';
import Response from '../';

test('Response is a function', t => {
	t.is(typeof Response, 'function');
});

test('Response cannot be invoked without \'new\'', t => {
	t.throws(() => Response()); // eslint-disable-line new-cap
	t.notThrows(() => new Response());
});
