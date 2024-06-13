const { body, validationResult } = require('express-validator');
const User = require('../models/Report');

module.exports = {
    validate: [
        body('reportType').notEmpty().withMessage('Il tipo di segnalazione è richiesto.'),
        body('reportTitle').notEmpty().withMessage('Il titolo è richiesto.'),
        body('reportRoad').notEmpty().withMessage('La via è richiesta.'),
        body('reportRoadNumber').notEmpty().withMessage('Il civico è richiesto.'),
        body('reportCap').notEmpty().withMessage('IL CAP è richiesto.'),
        body('reportZone').notEmpty().withMessage('La zona è richiesta.'),
        body('reportDescription').notEmpty().withMessage('La descrizione è richiesta.'),
        body('reportDescription').isLength({ max: 200 }).withMessage('La descrizione supera i 200 caratteri.'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        }
    ]
};
