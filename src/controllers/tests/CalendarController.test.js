const Calendar = require('../../models/Calendar'); 
const CalendarController = require('../../controllers/CalendarController'); 
const httpMocks = require('node-mocks-http');

beforeAll(() => {
  jest.spyOn(global.console, 'error').mockImplementation(() => {});
});

describe('CalendarController', () => {
  describe('calendarAll', () => {
    it('should return zone waste days', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'Zone1' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockResolvedValue({
        organic: 'Monday',
        plastic: 'Tuesday',
        paper: 'Wednesday',
        residue: 'Thursday',
        glass: 'Friday'
      });

      await CalendarController.calendarAll(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        organic: 'Monday',
        plastic: 'Tuesday',
        paper: 'Wednesday',
        residue: 'Thursday',
        glass: 'Friday'
      });
    });

    it('should return 404 if zone not found', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'NonExistingZone' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockResolvedValue(null);

      await CalendarController.calendarAll(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Zone not found' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'ZoneWithError' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await CalendarController.calendarAll(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Server error' });
    });
  });

  describe('getWasteDayNumber', () => {
    it('should return weekday number for a specific waste type', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'Zone1', wasteType: 'organic' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockResolvedValue({
        organic: 'Monday'
      });

      await CalendarController.getWasteDayNumber(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        weekdayNumber: 'Monday',
        wasteType: 'organic'
      });
    });

    it('should return 404 if waste day number not found', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'NonExistingZone', wasteType: 'organic' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockResolvedValue(null);

      await CalendarController.getWasteDayNumber(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Waste day number not found' });
    });

    it('should return 400 if waste type is invalid', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'Zone1', wasteType: 'invalidType' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockResolvedValue({
        organic: 'Monday'
      });

      await CalendarController.getWasteDayNumber(req, res);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Invalid waste type' });
    });

    it('should return 500 if an error occurs', async () => {
      const req = httpMocks.createRequest({
        query: { zone: 'ZoneWithError', wasteType: 'organic' }
      });
      const res = httpMocks.createResponse();

      Calendar.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await CalendarController.getWasteDayNumber(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Server error' });
    });
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});