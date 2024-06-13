const User = require('../../models/User');
const Ente = require('../../models/Ente');
const jwt = require('jsonwebtoken');
const AuthenticationController = require('../../controllers/AuthenticationController');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcryptjs');
const config = require('../../config/config');
const { validationResult } = require('express-validator');

jest.mock('../../models/User');
jest.mock('../../models/Ente');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('express-validator', () => ({
    validationResult: jest.fn()
  }));

describe('AuthenticationController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });
  
    afterAll(() => {
      console.error.mockRestore();
    });
  
    it('should register a new user', async () => {
      const req = httpMocks.createRequest({
        body: {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          zone: 'OLTREFERSINA'
        }
      });
      const res = httpMocks.createResponse();
      User.prototype.save = jest.fn().mockResolvedValue({});
  
      await AuthenticationController.register(req, res);
  
      expect(res.statusCode).toBe(201);
      expect(res._getData()).toBe('User created successfully.');
    });
  
    it('should return 500 if registration fails', async () => {
      const req = httpMocks.createRequest({
        body: {
          name: 'John',
          surname: 'Doe',
          email: 'john@example.com',
          password: 'password123',
          zone: 'OLTREFERSINA'
        }
      });
      const res = httpMocks.createResponse();
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Error'));
  
      await AuthenticationController.register(req, res);
  
      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Error registering new user.' });
    });

    it('should return 500 if password is too short', async () => {
        const req = httpMocks.createRequest({
          body: {
            name: 'John',
            surname: 'Doe',
            email: 'john@example.com',
            password: '123',  // short password
            zone: 'Zone1'
          }
        });
        const res = httpMocks.createResponse();
      
        // Mock validation result
        validationResult.mockReturnValue({
          isEmpty: () => false,
          array: () => [{ msg: 'Password must be at least 6 characters long' }]
        });
      
        await AuthenticationController.register(req, res);
      
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({ error: 'Error registering new user.' });
    });      
  });
  
  describe('login', () => {
    it('should login a user and return a token', async () => {
      const req = httpMocks.createRequest({
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      });
      const res = httpMocks.createResponse();
      const mockUser = {
        email: 'john@example.com',
        password: 'hashedpassword',
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ email: 'john@example.com' })
      };
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue('token123');

      await AuthenticationController.login(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getData()).toEqual({
        user: { email: 'john@example.com' },
        token: 'token123'
      });
    });

    it('should return 403 if login information is incorrect', async () => {
      const req = httpMocks.createRequest({
        body: {
          email: 'john@example.com',
          password: 'wrongpassword'
        }
      });
      const res = httpMocks.createResponse();
      const mockUser = {
        email: 'john@example.com',
        password: 'hashedpassword',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      await AuthenticationController.login(req, res);

      expect(res.statusCode).toBe(403);
      expect(res._getData()).toEqual({
        error: 'The login information was incorrect'
      });
    });

    it('should return 500 if an error occurs during login', async () => {
      const req = httpMocks.createRequest({
        body: {
          email: 'john@example.com',
          password: 'password123'
        }
      });
      const res = httpMocks.createResponse();
      User.findOne = jest.fn().mockRejectedValue(new Error('Error'));

      await AuthenticationController.login(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getData()).toEqual({
        error: 'An error has occured trying to log in'
      });
    });
  });

  describe('getUserName', () => {
    it('should return the username of a user', async () => {
      const userId = 'someUserId';
      const userName = 'JohnDoe';
      const user = { name: userName };
      User.findById = jest.fn().mockResolvedValue(user);
  
      const req = httpMocks.createRequest({ query: { userId } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.getUserName(req, res);
  
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ username: userName });
    });
  
    it('should return 404 if user is not found', async () => {
      const userId = 'someNonExistentUserId';
      User.findById = jest.fn().mockResolvedValue(null);
  
      const req = httpMocks.createRequest({ query: { userId } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.getUserName(req, res);
  
      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'User not found' });
    });
  
    it('should return 500 if an error occurs', async () => {
      const userId = 'someUserId';
      User.findById = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const req = httpMocks.createRequest({ query: { userId } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.getUserName(req, res);
  
      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Server error' });
    });
  });

  describe('updateUserZone', () => {
    it('should update the zone of a user', async () => {
      const userId = 'someUserId';
      const newZone = 'NewZone';
      const updatedUser = { _id: userId, zone: newZone };
      User.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);
  
      const req = httpMocks.createRequest({ body: { userId, zone: newZone } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.updateUserZone(req, res);
  
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ zone: newZone });
    });
  
    it('should return 404 if user is not found', async () => {
      const userId = 'someNonExistentUserId';
      const newZone = 'NewZone';
      User.findOneAndUpdate = jest.fn().mockResolvedValue(null);
  
      const req = httpMocks.createRequest({ body: { userId, zone: newZone } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.updateUserZone(req, res);
  
      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'User not found' });
    });
  
    it('should return 500 if an error occurs', async () => {
      const userId = 'someUserId';
      const newZone = 'NewZone';
      User.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const req = httpMocks.createRequest({ body: { userId, zone: newZone } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.updateUserZone(req, res);
  
      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({ error: 'Server error' });
    });
  });

  describe('getEmail', () => {
    it('should return the email of a user', async () => {
      const userId = 'someUserId';
      const userEmail = 'john@example.com';
      const user = { email: userEmail };
      User.findById = jest.fn().mockResolvedValue(user);
  
      const req = httpMocks.createRequest({ query: { userId } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.getEmail(req, res);
  
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ email: userEmail });
    });
  
    it('should return 404 if user is not found', async () => {
      const userId = 'someNonExistentUserId';
      User.findById = jest.fn().mockResolvedValue(null);
  
      const req = httpMocks.createRequest({ query: { userId } });
      const res = httpMocks.createResponse();
  
      await AuthenticationController.getEmail(req, res);
  
      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toEqual({ error: 'User not found' });
    });
  
    it('should return 500 if an error occurs', async () => {
        const userId = 'someUserId';
        User.findById = jest.fn().mockRejectedValue(new Error('Database error'));
    
        const req = httpMocks.createRequest({ query: { userId } });
        const res = httpMocks.createResponse();
    
        await AuthenticationController.getEmail(req, res);
    
        expect(res.statusCode).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({ error: 'Server error' }); // Fix the typo here
      });
  });
  
  describe('loginEnte', () => {
    it('should login an entity and return a token', async () => {
        const username = 'someUsername';
        const password = 'somePassword';
        const token = 'token123'; // Update the expected token here
        const ente = { toJSON: () => ({ username }), comparePassword: jest.fn().mockResolvedValue(true) };
        Ente.findOne = jest.fn().mockResolvedValue(ente);
        jwtSignUser = jest.fn().mockReturnValue(token);
    
        const req = httpMocks.createRequest({ body: { username, password } });
        const res = httpMocks.createResponse();
    
        await AuthenticationController.loginEnte(req, res);
    
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toEqual({ ente: { username }, token }); // Remove JSON.parse from here
      });
  
      it('should return 403 if login information is incorrect', async () => {
        const username = 'someUsername';
        const password = 'incorrectPassword';
        const errorResponse = { error: 'The login information was incorrect' };
        const ente = { comparePassword: jest.fn().mockResolvedValue(false) };
        Ente.findOne = jest.fn().mockResolvedValue(ente);
    
        const req = httpMocks.createRequest({ body: { username, password } });
        const res = httpMocks.createResponse();
    
        await AuthenticationController.loginEnte(req, res);
    
        expect(res.statusCode).toBe(403);
        expect(JSON.stringify(res._getData())).toEqual(JSON.stringify(errorResponse)); // Ensure response is JSON.stringify
      });
  
      it('should return 500 if an error occurs during login', async () => {
        const username = 'someUsername';
        const password = 'correctPassword';
        const errorResponse = { error: 'An error has occured trying to log in' };
        Ente.findOne = jest.fn().mockRejectedValue(new Error('An error occurred'));
    
        const req = httpMocks.createRequest({ body: { username, password } });
        const res = httpMocks.createResponse();
    
        await AuthenticationController.loginEnte(req, res);
    
        expect(res.statusCode).toBe(500);
        expect(JSON.stringify(res._getData())).toEqual(JSON.stringify(errorResponse)); // Ensure response is JSON.stringify
      });
  });

});
