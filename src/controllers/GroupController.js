const Group = require('../models/Group')

module.exports = {
  async createGroup(req, res) {
    try{
      const {userId, role} = req.body

      if(!role){
        return res.status(405).json({ error: 'Ruolo è richiesto'})
      }

      const newgroup = new Group({
        members: [{ userId, role }]
      })

      await newgroup.save();

      res.status(201).json({ message: 'Group created successfully'});

    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  async addMember(req, res) {
    try {
      const {groupId, userId, role} = req.body

      if(!groupId || !role) {
        return res.status(405).json({ error: 'Compilare tutti i campi'} )
      }

      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Gruppo non trovato' });
      }
      const isMember = group.members.some(member => member.userId.toString() === userId);
      if (isMember) {
        return res.status(405).json({ error: 'Utente già nel gruppo' });
      }
      group.members.push({ userId, role });
      await group.save();
  
      res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },
  async getGroup(req, res) {
    try {
      const userId = req.query.userId;

      const groups = await Group.find({ 'members.userId' : userId });

      if (!groups.length) {
        return res.status(404).json({ error: 'Group not found' });
      }


      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },
  async removeMember(req, res){
    try {
      const {groupId, userId} = req.body
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      const memberIndex = group.members.findIndex(member => member.userId === userId);
      if (memberIndex === -1) {
        return res.status(404).json({ error: 'Member not found in group' });
      }
      group.members.splice(memberIndex, 1);

      if(!group.members.length){
        await Group.findByIdAndDelete(groupId);
        return res.status(200).json({ message: 'Group deleted as it has no members left' });
      }

      await group.save();

      res.status(200).json({ message: 'Member removed successfully' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}