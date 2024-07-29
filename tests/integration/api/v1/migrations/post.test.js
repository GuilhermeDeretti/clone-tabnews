import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;")
});

test("POST to /api/v1/migrations should return 201", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'});
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);
  //response greater that 0 meaning More than zero migrations were executed
});

test("POST to /api/v1/migrations should return 200", async () => {
  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'});
  expect(response2.status).toBe(200);
  console.log(response2.statusText);
  const response2Body = await response2.json();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
  //response zero as they have been executed before, and should not be executed again
});

test("POST to /api/v1/migrations should return 405", async () => {
  const response3 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'PATCH'});
  expect(response3.status).toBe(405);
});
