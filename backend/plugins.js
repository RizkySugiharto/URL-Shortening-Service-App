const { Forbidden } = require('http-errors')

async function loadPlugins(fastify) {
    fastify.register(require('@fastify/cors'), {
        origin: process.env.ALLOWED_ORIGINS.split(' '),
        credentials: true,
        exposedHeaders: ['X-Ratelimit-Reset', 'Retry-After']
    })

    fastify.decorate('shorter', {
        charlist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        counter: 0,
        maxLength: Number(process.env.SHORTER_MAX_LENGTH),
        encode(value) {
            let shortCode = ''

            for (let i = 0; i < this.maxLength; i++) {
                const index = Math.floor(value / Math.pow(this.charlist.length, i)) % this.charlist.length
                shortCode += this.charlist[index]
            }

            return shortCode;
        },
        decode(shortCode) {
            let result = 0;

            for (let i = 0; i < this.maxLength; i++) {
                const index = this.charlist.indexOf(shortCode[i]) % this.charlist.length
                result += index
            }

            return result
        },
        getSourceCode() {
            this.counter++
            return this.encode(this.counter)
        },
        async loadCounter() {
            const [rows, result] = await fastify.mysql.query('SELECT source FROM urls ORDER BY source DESC LIMIT 1')
            if (rows.length < 1) return
            
            fastify.log.info(`Current last short / source code : ${rows[0].source}`)
            this.counter = this.decode(rows[0].source)
            fastify.log.info(`Current shorter's counter : ${this.counter}`)
        }
    })
    fastify.decorate('authenticate', (req, reply, next) => {
        if (!req.headers['x-user-id']) {
            reply.code(403).send(Forbidden('Incomplete user identification'))
        }
        next()
    })
    
    await fastify.register(require('@fastify/rate-limit'), {
        max: Number(process.env.ALLOWED_REQUEST_PER_MINUTE),
        timeWindow: 60 * 1000,
        hook: 'preHandler',
        keyGenerator: (req) => req.headers['x-user-id']
    })

    await fastify.register(require('@fastify/mysql'), {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT),
        promise: true
    })
    fastify.register(require('@fastify/formbody'))
    fastify.register(require('@fastify/compress'))
}

module.exports = {
    loadPlugins
}