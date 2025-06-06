const dotenv = require('dotenv')
const ENV_DIR = './'

function loadConfig() {
    dotenv.config({
        path: ENV_DIR + '.env',
        override: false
    })
}

module.exports = {
    loadConfig
}