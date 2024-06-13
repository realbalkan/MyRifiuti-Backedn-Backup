const { body, validationResult } = require('express-validator');
const User = require('../models/User');

module.exports = {
    register: [
        body('name').notEmpty().withMessage('Il nome è richiesto.'),
        body('surname').notEmpty().withMessage('Il cognome è richiesto.'),
        body('email').isEmail().withMessage('Devi inserire un\'email valida.')
            .custom(async (email, { req }) => {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new Error('Email già in uso.');
                }
                return true;
            }),
        body('password').isLength({ min: 6 }).withMessage('La password deve essere di almeno 6 caratteri.'),
        body('zone').notEmpty().withMessage('La zona è richiesta.'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ]
};
