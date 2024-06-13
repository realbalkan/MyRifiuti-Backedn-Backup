const User = require('../models/User')
const Ente = require('../models/Ente')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

function jwtSignUser (user){
    const ONE_MONTH = 60 * 60 * 24 * 30
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: ONE_MONTH
    })
}

//Declare Endopoints

module.exports={
    async register (req, res){
        try {
          // Hash password in Model

          // New user
          const newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            zone: req.body.zone
          });
      
          //Debug New User
          /*if(true){
            console.log(`Name: ${newUser.name}`);
            console.log(`Surname: ${newUser.surname}`);
            console.log(`Email: ${newUser.email}`);
          }*/

          // Save new User
          await newUser.save();
          res.status(201).send('User created successfully.');
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error registering new user.' });
        }

        /*
        res.send({
          message: `Hi ${req.body.email}! Your account was registered!`
        })*/
    },

    async login (req, res) {
      try {
        const {email, password} = req.body
        const user = await User.findOne({ email });
  
        if (!user) {
          return res.status(403).send({
            error: 'The login information was incorrect'
          })
        }
  
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
          return res.status(403).send({
            error: 'The login information was incorrect'
          })
        }
  
        const userJson = user.toJSON()
        res.status(200).send({
          user: userJson,
          token: jwtSignUser(userJson)
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
    },

    async getUserZone(req, res) {
      try {
          const userId = req.query.userId;
          const user = await User.findById(userId);
      
          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }
          res.status(200).json({ zone: user.zone });
      } catch (error) {
          res.status(500).json({ error: 'Server error' });
      }
    },
    async getUserName(req, res) {
      try {
        const userId = req.query.userId;

        const user = await User.findById(userId);
    
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ username: user.name });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    },

    async getEmail(req, res) {
      try {
        const userId = req.query.userId;
        const user = await User.findById(userId);
        if(!user){
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ email: user.email });
      } catch(error){
        res.status(500).json({ error: 'Server error'});
      }
    },
    
    async updateUserZone(req, res) {
      try {
          console.log(req.body.userId)
          console.log(req.body.zone)
          
          const user = await User.findOneAndUpdate({ _id: req.body.userId }, 
                                                     { zone: req.body.zone });

          if (!user) {
              return res.status(404).json({ error: 'User not found' });
          }

          res.status(200).json({ zone: user.zone });
      } catch (error) {
          res.status(500).json({ error: 'Server error' });
      }
    },
    

    // ---------------  ENTE  --------------- //
    async loginEnte (req, res) {
      try {
        const {username, password} = req.body
        const ente = await Ente.findOne({ username });
  
        if (!ente) {
          return res.status(403).send({
            error: 'The login information was incorrect'
          })
        }
  
        const isPasswordValid = await ente.comparePassword(password)
        if (!isPasswordValid) {
          return res.status(403).send({
            error: 'The login information was incorrect'
          })
        }
  
        const enteJson = ente.toJSON()
        res.status(200).send({
          ente: enteJson,
          token: jwtSignUser(enteJson)
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
    },

}