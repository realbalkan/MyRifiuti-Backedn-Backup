const Group = require('../../models/Group');
const GroupController = require('../../controllers/GroupController');

beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

describe('GroupController', () => {
  describe('createGroup', () => {
   /* it('should create a new group', async () => {
      const req = {
        body: {
          userId: '6640c110aee384d142d19d4e',
          role: 'Carta'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GroupController.createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Group created successfully' });
    }, 10000);
*/
    it('should handle missing role', async () => {
      const req = {
        body: {
          userId: '6640c110aee384d142d19d4e'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await GroupController.createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ruolo è richiesto' });
    });

    it('should handle server error', async () => {
      const req = {
        body: {
          userId: '6640c110aee384d142d19d4e',
          role: 'Carta'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Group.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      await GroupController.createGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });

    it('should handle server error during group creation', async () => {
        const req = {
          body: {
            userId: '6640c110aee384d142d19d4e',
            role: 'Carta'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await GroupController.createGroup(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
  });

  describe('addMember', () => {
  /*   it('should add a member to the group', async () => {
        const req = {
          body: {
            groupId: '6667fe51234b382ed8608aad',
            userId: '6640c110aee384d142d19d4e',
            role: 'Carta'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockResolvedValue({
          members: []
        });
        Group.prototype.save = jest.fn();
  
        await GroupController.addMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Member added successfully' });
      });
  */
      it('should handle missing groupId or role', async () => {
        const req = {
          body: {
            userId: '6640c110aee384d142d19d4e'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        await GroupController.addMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Compilare tutti i campi' });
      });
  
      it('should handle group not found', async () => {
        const req = {
          body: {
            groupId: 'dad3522rta2',
            userId: '6640c110aee384d142d19d4e',
            role: 'Carta'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockResolvedValue(null);
  
        await GroupController.addMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Gruppo non trovato' });
      });
  
      it('should handle user already in the group', async () => {
        const req = {
          body: {
            groupId: '6667fe51234b382ed8608aad',
            userId: '6640c110aee384d142d19d4e',
            role: 'Carta'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockResolvedValue({
          members: [{ userId: '6640c110aee384d142d19d4e' }]
        });
  
        await GroupController.addMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({ error: 'Utente già nel gruppo' });
      });
  
      it('should handle server error during member addition', async () => {
        const req = {
          body: {
            groupId: '6667fe51234b382ed8608aad',
            userId: '6640c110aee384d142d19d4e',
            role: 'Carta'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await GroupController.addMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
  });

  describe('getGroup', () => {
    it('should return groups for a user', async () => {
        const req = {
          query: {
            userId: '6640c110aee384d142d19d4e'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.find = jest.fn().mockResolvedValue([{ groupName: 'Group1' }, { groupName: 'Group2' }]);
  
        await GroupController.getGroup(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ groupName: 'Group1' }, { groupName: 'Group2' }]);
      });
  
      it('should handle group not found for a user', async () => {
        const req = {
          query: {
            userId: 'dasgzsdfgzsgz243tyaa'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.find = jest.fn().mockResolvedValue([]);
  
        await GroupController.getGroup(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Group not found' });
      });
  
      it('should handle server error during getting group', async () => {
        const req = {
          query: {
            userId: '6640c110aee384d142d19d4e'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.find = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await GroupController.getGroup(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
  });

  describe('removeMember', () => {
 /*   it('should remove a member from the group', async () => {
        const req = {
          body: {
            groupId: '6667fe51234b382ed8608aad',
            userId: '6640c110aee384d142d19d4e'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockResolvedValue({
          members: [{ userId: '6640c110aee384d142d19d4e' }]
        });
        Group.prototype.save = jest.fn();
  
        await GroupController.removeMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Member removed successfully' });
      });
*/  
      it('should handle server error during member removal', async () => {
        const req = {
          body: {
            groupId: '6667fe51234b382ed8608aad',
            userId: '6640c110aee384d142d19d4e'
          }
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
  
        Group.findById = jest.fn().mockRejectedValue(new Error('Database error'));
  
        await GroupController.removeMember(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
  });
});

afterAll(() => {
    jest.restoreAllMocks();
  });