// src/controllers/tests/ReportController.test.js

const ReportController = require('../ReportController');
const Report = require('../../models/Report');
const ReportType = require('../../models/ReportTypes');
const Status = require('../../models/ReportStatus');
const Caps = require('../../models/ReportCaps');
const Zones = require('../../models/Zone');

jest.mock('../../models/Report');


beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

describe('ReportController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('sendReport', () => {
    beforeEach(() => {
      req.body = {
        reportType: 'Type A',
        reportTitle: 'Report Title',
        reportRoad: 'Report Road',
        reportRoadNumber: 123,
        reportCap: '12345',
        reportZone: 'Zone 1',
        reportDescription: 'Description',
        reportUserId: 'user123',
      };
    });

    it('should add a new report successfully', async () => {
      Report.prototype.save = jest.fn().mockResolvedValue({
        type: 'Type A',
        title: 'Report Title',
        road: 'Report Road',
        roadNumber: 123,
        cap: '12345',
        zone: 'Zone 1',
        description: 'Description',
        user: 'user123',
        status: Status[0],
      });

      await ReportController.sendReport(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        type: 'Type A',
        title: 'Report Title',
      }));
    });

    it('should handle validation errors when adding a new report', async () => {
      const validationError = {
        errors: {
          reportTitle: { message: 'Title is required' },
          reportRoad: { message: 'Road is required' },
        },
      };

      Report.prototype.save = jest.fn().mockRejectedValue(validationError);

      await ReportController.sendReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [
          { path: 'reportTitle', msg: 'Title is required' },
          { path: 'reportRoad', msg: 'Road is required' },
        ],
      });
    });

    it('should handle general errors when adding a new report', async () => {
      Report.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.sendReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Error while saving the report');
    });
  });

  describe('getReportTypes', () => {
    it('should return report types', async () => {
      await ReportController.getReportTypes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(ReportType);
    });
  });

  describe('getAllReports', () => {
    it('should return all reports', async () => {
      Report.find.mockResolvedValue([{ title: 'Report 1' }, { title: 'Report 2' }]);

      await ReportController.getAllReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ title: 'Report 1' }, { title: 'Report 2' }]);
    });

    it('should handle errors when getting all reports', async () => {
      Report.find.mockRejectedValue(new Error('Database error'));

      await ReportController.getAllReports(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while sending the report');
    });
  });

  describe('getStatusTypes', () => {
    it('should return status types', async () => {
      await ReportController.getStatusTypes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Status);
    });
  });

  describe('getReportCaps', () => {
    it('should return report caps', async () => {
      await ReportController.getReportCaps(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(Caps);
    });
  });

  describe('saveReportStatus', () => {
    it('should save report status', async () => {
      Report.findOneAndUpdate = jest.fn().mockResolvedValue({
        _id: '123',
        status: 'In Progress',
      });

      req.body = {
        _id: '123',
        status: 'In Progress',
      };

      await ReportController.saveReportStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        _id: '123',
        status: 'In Progress',
      });
    });

    it('should handle errors when saving report status', async () => {
      Report.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.saveReportStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while saving status of the report');
    });
  });

  describe('getNumberOfAllReports', () => {
    it('should return the number of all reports', async () => {
      Report.countDocuments = jest.fn().mockResolvedValue(10);

      await ReportController.getNumberOfAllReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 10 });
    });

    it('should handle errors when getting the number of all reports', async () => {
      Report.countDocuments = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.getNumberOfAllReports(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while retrieving number of reports');
    });
  });

  describe('getNumberByStatusOfReports', () => {
    it('should return the number of reports by status', async () => {
      Report.aggregate = jest.fn().mockResolvedValue([{ _id: 'Open', count: 5 }]);

      req.query = { status: 'Open' };

      await ReportController.getNumberByStatusOfReports(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: [{ _id: 'Open', count: 5 }] });
    });

    it('should handle errors when getting the number of reports by status', async () => {
      Report.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.getNumberByStatusOfReports(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while retrieving number of reports filtered by status');
    });
  });

  describe('getAllZonesStatuses', () => {
    it('should return all zones statuses', async () => {
      Report.aggregate = jest.fn().mockResolvedValue([
        { _id: { zone: 'Zone 1', status: 'APERTA' }, count: 3 },
        { _id: { zone: 'Zone 2', status: 'RISOLTA' }, count: 2 },
      ]);

      Zones.zones = ['Zone 1', 'Zone 2'];

      await ReportController.getAllZonesStatuses(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        zoneStatusCounts: {
          'Zone 1': { 'APERTA': 3, 'IN CORSO': 0, 'RISOLTA': 0 },
          'Zone 2': { 'APERTA': 0, 'IN CORSO': 0, 'RISOLTA': 2 },
        },
      });
    });

    it('should handle errors when getting all zones statuses', async () => {
      Report.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.getAllZonesStatuses(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while retrieving number of reports for each status for each zone');
    });
  });

  describe('getNumberZones', () => {
    it('should return the number of zones', async () => {
      Zones.zones = ['Zone 1', 'Zone 2'];

      await ReportController.getNumberZones(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ nZones: 2 });
    });

    it('should handle errors when getting the number of zones', async () => {
      Zones.zones = undefined;

      await ReportController.getNumberZones(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while retriving number of zones');
    });
  });

  describe('getNumerReportsForZones', () => {
    it('should return the number of reports for each zone', async () => {
      Report.aggregate = jest.fn().mockResolvedValue([
        { _id: { zone: 'Zone 1' }, count: 3 },
        { _id: { zone: 'Zone 2' }, count: 2 },
      ]);

      Zones.zones = ['Zone 1', 'Zone 2'];

      await ReportController.getNumerReportsForZones(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        zoneCounts: {
          'Zone 1': 3,
          'Zone 2': 2,
        },
      });
    });

    it('should handle errors when getting the number of reports for each zone', async () => {
      Report.aggregate = jest.fn().mockRejectedValue(new Error('Database error'));

      await ReportController.getNumerReportsForZones(req, res);

      expect(res.status).toHaveBeenCalledWith(501);
      expect(res.json).toHaveBeenCalledWith('Error while retrieving number of reports for each zone');
    });
  });
});

afterAll(() => {
    jest.restoreAllMocks();
  });
