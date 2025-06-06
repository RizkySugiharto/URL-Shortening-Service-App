const utils = require('../../utils')
const { Conflict } = require('http-errors')

module.exports = function (fastify, opts, done) {
    fastify.post('/save', {
        preHandler: [fastify.authenticate]
    }, async (req, reply) => {
        try {
            const source = fastify.shorter.getSourceCode()
            const result = (await fastify.mysql.query('INSERT INTO urls (source, destination) VALUES (?, ?)', [source, req.body.destination]))[0]

            if (result.affectedRows !== 1) {
                throw Conflict('Failed to save the url data')
            }

            return reply.code(201).send({
                source: source
            })
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}