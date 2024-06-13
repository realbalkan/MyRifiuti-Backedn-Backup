const Calendar = require('../models/Calendar')

module.exports = {
    async calendarAll(req, res) {
        try {
            const zone = req.query.zone;
            const zoneDays = await Calendar.findOne({zone: zone});
        
            if (!zoneDays) {
                return res.status(404).json({ error: 'Zone not found' });
            }
            res.status(200).json({
                        organic: zoneDays.organic,
                        plastic: zoneDays.plastic,
                        paper: zoneDays.paper,
                        residue: zoneDays.residue,
                        glass: zoneDays.glass
                    });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    },

    async getWasteDayNumber(req, res) {
        try {
            const zone = req.query.zone;
            const wasteType = req.query.wasteType;

            const wasteDayNumber = await Calendar.findOne({ zone: zone });
        
            if (!wasteDayNumber) {
                return res.status(404).json({ error: 'Waste day number not found' });
            }
            
            // Extract days for wasteTyoe
            const weekdayNumber = wasteDayNumber[wasteType];

            // WasteType valid
            if (weekdayNumber === undefined) {
                return res.status(400).json({ error: 'Invalid waste type' });
            }

            res.status(200).json({
                weekdayNumber: weekdayNumber,
                wasteType: wasteType
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}
