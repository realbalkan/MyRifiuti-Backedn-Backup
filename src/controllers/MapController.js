const Marker = require('../models/Marker');
const Zone = require('../models/Zone')

module.exports = { 
  async getMarker (req, res) {
    try{
      Marker.find()
      .then((result) => {
          res.status(200).json(result)
      })
      .catch((error) => {
          res.status(500).json('No markers found')
      })
    } catch(err) {
      res.status(501).json('Error retrieving data from database')
    }
  },
  async getCRM (req, res) {
    try{
      Marker.find({ label : /CRM/i }).exec()
      .then((result) => {
          res.status(200).json(result)
      })
      .catch((error) => {
          res.status(500).json('No markers found')
      })
    } catch(err) {
      res.status(501).json('Error retrieving data from database')
    }
  },
  async getCestini (req, res) {
    try{
      Marker.find({ label : /cestino/i }).exec()
      .then((result) => {
          res.status(200).json(result)
      })
      .catch((error) => {
          res.status(500).json('No markers found')
      })
    } catch(err) {
      res.status(501).json('Error retrieving data from database')
    }
  },
  async getZone (req, res) {
    try{
      res.status(200).json(Zone.zones)
    } catch(err){
      res.status(501).json('Error')
    }
  },
  async putMarker(req, res){
    try{
      const newMarker = new Marker(req.body);
      await newMarker.save();
      res.status(200).send('Marker added succesfully');
    } catch (err){
      res.status(500).json('Error saving new marker in database')
    }
  }
}