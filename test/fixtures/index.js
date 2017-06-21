const statusCode = 200;
const headers = { Foo: "Bar"};
const bodyText = 'Hi.';
const body = Buffer.from(bodyText);
const url = 'https://example.com';

module.exports = {
  statusCode,
  headers,
  bodyText,
  body,
  url
}
