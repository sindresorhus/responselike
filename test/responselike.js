import test from 'ava';
import Response from '../';

test('Response is a function', t => {
	t.is(typeof Response, 'function');
});
