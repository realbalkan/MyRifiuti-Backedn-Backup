const MapController = require('../MapController'); // Assuming the file is in the same directory
const Marker = require('../../models/Marker');
const Zone = require('../../models/Zone');

// Mock Marker and Zone models
jest.mock('../../models/Marker', () => ({
  find: jest.fn(),
  save: jest.fn(),
}));

jest.mock('../../models/Zone', () => ({
  zones: [{ name: 'Zone 1' }, { name: 'OLTREFERSINA' }],
}));

describe('MapController', () => {
  describe('getMarker', () => {
    it('should return markers', async () => {
      const mockMarkers = [{ label: 'Marker 1' }, { label: 'Marker 2' }];
      Marker.find.mockResolvedValue(mockMarkers);

      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await MapController.getMarker(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMarkers);
    });

   /* it('should handle error when no markers are found', async () => {
        const mockError = new Error('No markers found');
  
        // Mock the find method of Marker model to reject with mockError
        Marker.find.mockRejectedValue(mockError);
  
        const req = {};
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await MapController.getMarker(req, res);
  
        expect(Marker.find).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('No markers found');
      });*/
  });

  describe('putMarker', () => {
    /*it('should add a new marker successfully', async () => {
        const mockReqBody = { label: 'New Marker' };
        const mockSavedMarker = { _id: '123', label: 'New Marker' };
        
        // Mock the save method of Marker model to resolve with mockSavedMarker
        Marker.save.mockResolvedValue(mockSavedMarker);
  
        const req = { body: mockReqBody };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  
        await MapController.putMarker(req, res);
  
        expect(Marker.save).toHaveBeenCalledWith(mockReqBody);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('Marker added succesfully');
      });*/

   /* it('should handle error when failed to save new marker', async () => {
        const mockReqBody = { label: 'New Marker' };
        const mockError = new Error('Failed to save new marker');
  
        // Mock the save method of Marker model to reject with mockError
        Marker.save.mockRejectedValue(mockError);
  
        const req = { body: mockReqBody };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        await MapController.putMarker(req, res);
  
        expect(Marker.save).toHaveBeenCalledWith(mockReqBody);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith('Error saving new marker in database');
      });*/
  });

});
