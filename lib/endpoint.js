const express = require('express')
const axios = require('axios')

const db = require('../lib/db')
const apiKey = require('../config').currency.apiKey

const endpoints = express.Router()

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.post('/project/budget/currency', (req, res) => {
  const { currency, projectName, year } = req.body || {};
  const findBudgetSql = `
    SELECT * FROM project
    WHERE projectName = '${projectName}'
    AND year = ${year}
  `

  db.query(findBudgetSql, async (err, results) => {
    if (err) return console.error('Error finding budget details for projects with specified name within specified year:', err)

    const exchangeRatesRes = await axios({ 'method': 'GET', 'url': `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD` })
    const data = results.map(result => {
      // Converted to TTD
      const finalBudgetTtd = exchangeRatesRes?.data?.conversion_rates[currency] * result.finalBudgetUsd
      return { ...result, finalBudgetTtd }
    })

    res.status(200).json({ success: true, data })
  })
})

module.exports = endpoints
