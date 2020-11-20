const { User } = require('../models/user.js')
const md5 = require('md5')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports.login = async (req, res) => {
  if(!req.body.email || !req.body.password){
    res.status(400).send({
      message: 'email and password are required'
    })
    return
  }

  let user = await User.findOne({
    where:{
      email: req.body.email
     }
  })


  if(!user){
    res.status(401).send({
      message: 'incorrect credentials'
    })
    return
  }
  
  const matchPasswords = await bcrypt.compare(req.body.password, user.password)

  if(!matchPasswords){
    res.status(401).send({
      message: 'incorrect credentials'
    })
    return
  }
  
  const token = jwt.sign({email: user.email}, process.env.SECRET, {expiresIn: '24h'})
  
  res.send({
    message: 'success',
    token: token
  })
}
