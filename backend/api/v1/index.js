const utils = require('../../utils')
const { NotFound } = require('http-errors')

module.exports = function (fastify, opts, done) {
    fastify.get('/:source', async (req, reply) => {
        try {
            const { destination } = (await fastify.mysql.query('SELECT destination FROM urls WHERE source = ?', [req.params.source]))[0][0]
            if (!destination) {
                throw NotFound('Destination URL not found')
            }

            return reply.code(302).redirect(destination)
        } catch (error) {
            return utils.returnGeneralError(error, reply)
        }
    })

    done()
}