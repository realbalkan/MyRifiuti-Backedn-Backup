const Report = require('../models/Report')
const ReportType = require('../models/ReportTypes')
const Status = require('../models/ReportStatus')
const Caps = require('../models/ReportCaps')
const Zones = require('../models/Zone')


module.exports = {
    async sendReport (req, res) {
        try{
            // New report
            const newReport = new Report({
                type: req.body.reportType,
                title: req.body.reportTitle,
                road: req.body.reportRoad,
                roadNumber: req.body.reportRoadNumber,
                cap: req.body.reportCap,
                zone: req.body.reportZone,
                description: req.body.reportDescription,
                user: req.body.reportUserId,
                status: Status[0] // 0 Aperta - 1 In Corso - 2 Risolta
            });

            // Save new Report
            await newReport.save()
                .then((result) => {
                    res.status(200).json(result); 
                })
                .catch((error) => {
                    // Handle validation errors from Mongoose
                    if (error.errors) {
                        const validationErrors = Object.keys(error.errors).map(key => ({
                            path: key,
                            msg: error.errors[key].message
                        }));
                        res.status(400).json({ errors: validationErrors });
                        console.log(validationErrors)
                    } else {
                        res.status(500).json('Error while saving the report');
                    }
                });
        } catch(err) {
            res.status(501).json('Error while sending the report')
        }
    },

    async getReportTypes (req, res) {
        try{
            const reportType = ReportType;
            res.status(200).json(reportType)
        } catch(err) {
            res.status(501).json('Error while sending the report types')
        }
    },

    async getAllReports (req, res) {
        try{
            const reports = await Report.find();
            res.status(200).json(reports);
        } catch(err) {
            res.status(501).json('Error while sending the report')
        }
    },
    
    async getStatusTypes (req, res) {
        try{
            const statusType = Status;
            res.status(200).json(statusType);
        } catch(err) {
            res.status(501).json('Error while sending the report')
        }
    },

    async getReportCaps (req, res) {
        try{
            const caps = Caps;
            res.status(200).json(caps);
        } catch(err) {
            res.status(501).json('Error while sending the CAPS')
        }
    },

    async saveReportStatus (req, res) {
        try{

            const report = await Report.findOneAndUpdate({ _id: req.body._id }, 
                                                         { status: req.body.status })
            res.status(200).json(report);
        } catch(err) {
            res.status(501).json('Error while saving status of the report')
        }
    },

    async getNumberOfAllReports (req, res) {
        try{
            const nReports = await Report.countDocuments();
            res.status(200).json({count: nReports});
        } catch(err) {
            res.status(501).json('Error while retrieving number of reports')
        }
    },

    async getNumberByStatusOfReports (req, res) {
        try{
            const { status } = req.query;
            const query = status ? { status } : {};
            const counts = await Report.aggregate([
                { $match: query }, 
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            //Manage no found because MONGODB aggregation logic
            if(counts.length === 0){
                res.status(200).json({
                    count:
                        [{
                            _id: status,
                            count: 0
                        }]
                })
            }else{
                res.status(200).json({count: counts});
            }
        } catch(err) {
            res.status(501).json('Error while retrieving number of reports filtered by status')
        }
    },

    async getAllZonesStatuses (req, res) {
        try {
            // Aggregate counts of reports by zone and status
            const counts = await Report.aggregate([
                {
                    $group: {
                        _id: { zone: "$zone", status: "$status" },
                        count: { $sum: 1 }
                    }
                }
            ]);
    
            // Create Zones object and Statuses Object
            const zoneStatusCounts = {}
            const statusesCouts = {}

            // Assign Statuses to object initialized with count 0
            Status.forEach( status => {
                statusesCouts[status] = 0;
            })

            // Assign Statuses object to each Zone
            Zones.zones.forEach( zone => {
                zoneStatusCounts[zone] = {...statusesCouts}; // New statusesCouts instance for each Zone
            })

            // Assign counts to Zone's statuses from previus querry on DB
            counts.forEach( count => {
                for (let zone in zoneStatusCounts) {
                    for (let status in zoneStatusCounts[zone]) {
                        if (count._id.zone === zone && count._id.status === status) {
                            zoneStatusCounts[zone][status] = count.count;
                        }
                    }
                }
            })

            res.status(200).json({ zoneStatusCounts });
        } catch (err) {
            console.error("Error details:", err); // Log the error details for debugging purposes
            res.status(501).json('Error while retrieving number of reports for each status for each zone');
        }
    },

    async getNumberZones (req, res) {
        try {
            const nZones = Zones.zones.length;
            res.status(200).json({ nZones });
        } catch(error) {
            res.status(501).json("Error while retriving number of zones");
        }
    },

    async getNumerReportsForZones (req, res) {
        try {
            // Aggregate counts of reports by zone and status
            const counts = await Report.aggregate([
                {
                    $group: {
                        _id: { zone: "$zone"},
                        count: { $sum: 1 }
                    }
                }
            ]);

            // Create Zones object
            const zoneCounts = {}

            // Assign 0 to each Zone
            Zones.zones.forEach( zone => {
                zoneCounts[zone] = 0;
            })
        
            // Assign counts to Zone's from previus querry on DB
            counts.forEach( count => {
                for (let zone in zoneCounts) {
                    if (count._id.zone === zone){
                        zoneCounts[zone] += count.count;
                    }        
                }
            })
            
            res.status(200).json({ zoneCounts });
        } catch (err) {
            console.error("Error details:", err); // Log the error details for debugging purposes
            res.status(501).json('Error while retrieving number of reports for each zone');
        }
    },
}