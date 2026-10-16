const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

async function rewrites(env) {
  const source = readFileSync('next.config.ts', 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = { exports: {}, process: { env } };
  vm.runInNewContext(code, context);
  return context.exports.default.rewrites();
}

test('public OAuth and MCP endpoints forward to the backend without the excluded API prefix', async () => {
  const routes = await rewrites({ NEXT_PUBLIC_API_URL: 'https://backend.example/api/' });
  for (const path of ['/oauth/authorize', '/oauth/authorize/complete', '/oauth/token',
    '/oauth/register', '/.well-known/oauth-authorization-server',
    '/.well-known/oauth-protected-resource/mcp', '/mcp']) {
    assert.equal(routes.find(route => route.source === path)?.destination,
      `https://backend.example${path}`);
  }
  assert.equal(routes.some(route => route.source === '/oauth/consent'), false);
});

test('server-only backend override takes precedence', async () => {
  const routes = await rewrites({ BACKEND_URL: 'https://backend.example/', NEXT_PUBLIC_API_URL: '/api' });
  assert.equal(routes[0].destination, 'https://backend.example/oauth/authorize');
});

test('unconfigured builds do not forward requests to localhost', async () => {
  assert.equal((await rewrites({})).length, 0);
});

 test('server-only override also removes the REST API prefix', async () => {
  const routes = await rewrites({ BACKEND_URL: 'https://backend.example/api///' });
  assert.equal(routes[0].destination, 'https://backend.example/oauth/authorize');
});
