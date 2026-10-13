const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

test("GET / informa que a API está funcionando", async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.status, "online");
  } finally {
    server.close();
  }
});

test("rota inexistente retorna 404", async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/nao-existe`);
    assert.equal(response.status, 404);
  } finally {
    server.close();
  }
});
