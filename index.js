const port = require('./config').server.port
const { name } = require('./package.json')
require('productionize')(name)

const PORT = port || 1337

require('./lib/app').listen(PORT, () => {
  console.log(`${name} listening on port ${PORT}`)
})
