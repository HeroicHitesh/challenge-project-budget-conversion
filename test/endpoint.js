process.env.NODE_ENV = 'test'

const http = require('http')
const test = require('tape')
const servertest = require('servertest')
const app = require('../lib/app')

const server = http.createServer(app)

test('GET /health should return 200', function (t) {
  servertest(server, '/health', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.end()
  })
})

test('GET /api/ok should return 200', function (t) {
  servertest(server, '/api/ok', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.ok(res.body.ok, 'Should return a body')
    t.end()
  })
})

test('GET /nonexistent should return 404', function (t) {
  servertest(server, '/nonexistent', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 404, 'Should return 404')
    t.end()
  })
})

test('POST /api/project/budget/currency should return 200 and data', function (t) {
  const opts = {
    encoding: 'json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const data = {
    currency: 'TTD',
    projectName: 'Humitas Hewlett Packard',
    year: 2024
  }

  servertest(server, '/api/project/budget/currency', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.ok(res.body.success, 'Should return success')
    t.ok(Array.isArray(res.body.data), 'Should return data array')
    t.end()
  }).end(JSON.stringify(data))
})

test('GET /api/project/budget/:id should return 200 and project data', function (t) {
  const projectId = '1'

  servertest(server, `/api/project/budget/${projectId}`, { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.ok(res.body.projectId, 'Should return project data')
    t.end()
  })
})

test('POST /api/project/budget should return 201', function (t) {
  const opts = {
    encoding: 'json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const data = {
    projectId: 10001,
    projectName: 'Humitas Hewlett Packard',
    year: 2024,
    currency: 'EUR',
    initialBudgetLocal: 316974.5,
    budgetUsd: 233724.23,
    initialScheduleEstimateMonths: 13,
    adjustedScheduleEstimateMonths: 12,
    contingencyRate: 2.19,
    escalationRate: 3.46,
    finalBudgetUsd: 247106.75
  }

  servertest(server, '/api/project/budget', opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 201, 'Should return 201')
    t.end()
  }).end(JSON.stringify(data))
})

test('PUT /api/project/budget/:id should return 200', function (t) {
  const projectId = '10001'
  const opts = {
    encoding: 'json',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const data = {
    projectName: 'Humitas Hewlett Packard',
    year: 2025,
    currency: 'EUR',
    initialBudgetLocal: 316974.5,
    budgetUsd: 233724.23,
    initialScheduleEstimateMonths: 13,
    adjustedScheduleEstimateMonths: 12,
    contingencyRate: 2.19,
    escalationRate: 3.46,
    finalBudgetUsd: 247106.75
  }

  servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.end()
  }).end(JSON.stringify(data))
})

test('DELETE /api/project/budget/:id should return 200', function (t) {
  const projectId = '10001'
  const opts = {
    encoding: 'json',
    method: 'DELETE'
  }

  servertest(server, `/api/project/budget/${projectId}`, opts, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.end()
  })
})
