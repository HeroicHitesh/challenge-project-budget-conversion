// External dependencies
const express = require('express')
const axios = require('axios')

// Internal dependencies
const db = require('../lib/db')
const apiKey = require('../config').currency.apiKey

// Constants and other setup
const endpoints = express.Router()

// Exports
module.exports = endpoints

// Functions
endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.post('/project/budget/currency', async (req, res) => {
  try {
    const { currency, projectName, year } = req.body || {}
    const results = await findBudgetByProjectAndYear(projectName, year)
    const exchangeRates = await fetchExchangeRates(apiKey)
    const data = results.map(result => convertToCurrency(result, currency, exchangeRates))

    res.status(200).json({ success: true, data })
  } catch (err) {
    handleServerError(res, 'Error finding budget details for projects with specified name within specified year', err)
  }
})

endpoints.get('/project/budget/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return handleClientError(res, 'Invalid Request, id missing')

    const result = await findBudgetById(id)
    res.status(200).json(result)
  } catch (err) {
    handleServerError(res, "Error getting project's budget data by id", err)
  }
})

endpoints.post('/project/budget', async (req, res) => {
  try {
    await insertProjectBudget(req.body)
    res.status(201).json({ success: true })
  } catch (err) {
    handleServerError(res, 'Error adding project budget data to the database', err)
  }
})

endpoints.put('/project/budget/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return handleClientError(res, 'Invalid Request, id missing')

    await updateProjectBudget(id, req.body)
    res.status(200).json({ success: true })
  } catch (err) {
    handleServerError(res, 'Error updating project budget data in the database', err)
  }
})

endpoints.delete('/project/budget/:id', async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return handleClientError(res, 'Invalid Request, id missing')

    await deleteProjectBudget(id)
    res.status(200).json({ success: true })
  } catch (err) {
    handleServerError(res, 'Error deleting project budget data from the database', err)
  }
})

// Helper Functions
async function executeQuery (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.executeQuery(sql, params, (err, results) => {
      if (err) return reject(err)
      resolve(results)
    })
  })
}

async function fetchExchangeRates (apiKey) {
  const response = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
  return response.data.conversion_rates
}

async function findBudgetByProjectAndYear (projectName, year) {
  const sql = `
    SELECT * FROM project
    WHERE projectName = ?
    AND year = ?
  `
  return executeQuery(sql, [projectName, year])
}

async function findBudgetById (id) {
  const sql = `
    SELECT * FROM project
    WHERE projectId = ?
  `
  const results = await executeQuery(sql, [id])
  return results[0]
}

async function insertProjectBudget (budget) {
  const sql = `
    INSERT INTO project
    (
      projectId,
      projectName,
      year,
      currency,
      initialBudgetLocal,
      budgetUsd,
      initialScheduleEstimateMonths,
      adjustedScheduleEstimateMonths,
      contingencyRate,
      escalationRate,
      finalBudgetUsd
    )
    VALUES(?)
  `
  return executeQuery(sql, [Object.values(budget)])
}

async function updateProjectBudget (id, budget) {
  const sql = `
    UPDATE project
    SET 
      projectName = ?,
      year = ?,
      currency = ?,
      initialBudgetLocal = ?,
      budgetUsd = ?,
      initialScheduleEstimateMonths = ?,
      adjustedScheduleEstimateMonths = ?,
      contingencyRate = ?,
      escalationRate = ?,
      finalBudgetUsd = ?
    WHERE projectId = ?
  `
  return executeQuery(sql, [...Object.values(budget), id])
}

async function deleteProjectBudget (id) {
  const sql = `
    DELETE FROM project
    WHERE projectId = ?
  `
  return executeQuery(sql, [id])
}

function convertToCurrency (result, currency, exchangeRates) {
  const finalBudgetTtd = exchangeRates[currency] * result.finalBudgetUsd
  return { ...result, finalBudgetTtd }
}

function handleServerError (res, message, error) {
  console.error(message, error)
  res.status(500).json({ success: false, message: 'Internal Server Error' })
}

function handleClientError (res, message) {
  console.error(message)
  res.status(400).json({ success: false, message })
}
