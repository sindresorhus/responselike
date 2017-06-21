# responselike

> A response-like object for mocking a Node.js HTTP response stream

[![Build Status](https://travis-ci.org/lukechilds/responselike.svg?branch=master)](https://travis-ci.org/lukechilds/responselike) [![Coverage Status](https://coveralls.io/repos/github/lukechilds/responselike/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/responselike?branch=master) [![npm](https://img.shields.io/npm/dm/responselike.svg)](https://www.npmjs.com/package/responselike)

## Install

```shell
npm install --save responselike
```

Or if you're just using for testing you'll want:

```shell
npm install --save-dev responselike
```

## Usage

```js
const Response = require('responselike');

const response = new Response(200, { foo: 'bar' }, Buffer.from('Hi!'), 'https://example.com');

response.statusCode;
// 200
response.headers;
// { foo: 'bar' }
response.body;
// <Buffer 48 69 21>
response.url;
// 'https://example.com'

response.pipe(process.stdout);
// Hi!
```

## License

MIT © Luke Childs
