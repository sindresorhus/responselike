import {Buffer} from 'node:buffer';
import Response from './index.js';

// eslint-disable-next-line no-new
new Response({
	statusCode: 200,
	headers: {},
	body: Buffer.from(''),
	url: 'https://sindresorhus.com',
});
