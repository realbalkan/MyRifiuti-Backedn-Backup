const express = require('express');
const router = express.Router();
const AuthenticationController = require('./controllers/AuthenticationController');
const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const CalendarController = require('./controllers/CalendarController');
const MapController = require('./controllers/MapController');
const ReportController = require('./controllers/ReportController')
const ReportControllerPolicy = require('./policies/ReportControllerPolicy')
const AuthenticationValidator = require('./policies/AuthenticationValidator')
const GroupController = require('./controllers/GroupController');
const MailController = require('./controllers/MailController')




// Definitions of Routes
router.post('/register',
    AuthenticationControllerPolicy.register,
    AuthenticationController.register
);

router.post('/login',
    AuthenticationController.login
);

router.get('/getUserZone',
    //AuthenticationValidator.validator, NEED FIX FOR TOKEN not foundamental
    AuthenticationController.getUserZone
);

router.get('/getUserName',
    AuthenticationController.getUserName
)
router.get('/getEmail', 
    AuthenticationController.getEmail
)
router.post('/updateUserZone',
    AuthenticationController.updateUserZone
);

router.post('/loginEnte',
    AuthenticationController.loginEnte
);

router.get('/calendarAll',
    CalendarController.calendarAll
)

router.get('/getWasteDayNumber',
    CalendarController.getWasteDayNumber
)

router.get('/marker',
    MapController.getMarker
);

router.get('/crm',
    MapController.getCRM
)

router.get('/cestini',
    MapController.getCestini
)

router.get('/zone',
    MapController.getZone
);

router.post('/putMarker',
    MapController.putMarker
);

/* router.get('/getMembers',
    GroupController.getGroupMembers
); */

router.post('/addMember',
    GroupController.addMember
)
router.post('/createGroup',
    GroupController.createGroup
)
router.get('/getGroup',
    GroupController.getGroup
)
router.post('/removeMember',
    GroupController.removeMember
)
router.post('/sendEmail',
    MailController.sendEmail
)
router.post('/sendReport',
    ReportControllerPolicy.validate,
    ReportController.sendReport
);

router.get('/getReportTypes',
    ReportController.getReportTypes
)

router.get('/getAllReports',
    ReportController.getAllReports
);

router.get('/getStatusTypes',
    ReportController.getStatusTypes
);

router.get('/getReportCaps',
    ReportController.getReportCaps
);

router.post('/saveReportStatus',
    ReportController.saveReportStatus
);

router.get('/getNumberOfAllReports',
    ReportController.getNumberOfAllReports
);

router.get('/getNumberByStatusOfReports',
    ReportController.getNumberByStatusOfReports
);

router.get('/getAllZonesStatuses',
    ReportController.getAllZonesStatuses
)

router.get('/getNumberZones',
    ReportController.getNumberZones
)

router.get('/getNumerReportsForZones',
    ReportController.getNumerReportsForZones
)


module.exports = router;
