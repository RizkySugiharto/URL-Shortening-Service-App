async function main() {
    const utils = require('./utils')

    // Load environtment configuration
    const config = require('./config')
    config.loadConfig()
    
    // Initialize the app
    const logger = require('./logger')
    const fastify = require('fastify')({
        logger: logger
    })
    
    // Register all plugins
    const plugins = require('./plugins')
    await plugins.loadPlugins(fastify)
    await fastify.shorter.loadCounter()

    // Setup mysql database if not setup yet
    fastify.mysql.query(`
        CREATE TABLE IF NOT EXISTS urls (
            source VARCHAR(?) NOT NULL PRIMARY KEY,
            destination TEXT NOT NULL
        )`, [Number(process.env.SHORTER_MAX_LENGTH)])
        .then(() => {
            fastify.log.info('Database has been successfully setup')
        })
        .catch(err => {
            if (utils.isDevMode()) console.error(err)
            else fastify.log.error(err)
        })
    
    // Register all routes
    fastify.register(require(`./api/v${process.env.API_VERSION}/index`))
    fastify.register(require(`./api/v${process.env.API_VERSION}/urls`), { prefix: `/v${process.env.API_VERSION}/urls` })
    fastify.get('/', async (req, reply) => {
        return "Hello, World"
    })
    
    // Start the app
    fastify.listen({ port: process.env.PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            fastify.log.error(err)
            process.exit(1)
        }

        fastify.log.info(`Environment: [ ${process.env.NODE_ENV} ]`)
        fastify.log.info(`Shorter charlist: ${fastify.shorter.charlist}`)
        fastify.log.info(`App listening on: ${address}`)
    })
}

main()