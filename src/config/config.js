const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    },
    mailsenderkey: process.env.MAILSENDER_API_KEY
}
