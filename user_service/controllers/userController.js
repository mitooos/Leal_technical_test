const { User } = require('../models/user.js')
const md5 = require('md5')
const bcrypt = require('bcrypt')

module.exports.registerUser = async (req, res) => {
  if (!req.body.name || !req.body.lastname || !req.body.birthday || !req.body.email || !req.body.password) {
    res.status(400).send({
      message: 'all the fields are required'
    })
    return
  }

  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })

  if (user) {
    res.status(422).send({
      message: 'user with given email already exists'
    })
    return
  }

  const userId = md5(req.body.email)
  const saltRounds = 10
  bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err)
      res.status(500).send({
        success: false,
        message: 'Unable to hash password'
      })
      return
    }
    const newUser = User.build({
      user_id: userId,
      created_date: Date(),
      name: req.body.name,
      lastname: req.body.lastname,
      birth_date: new Date(req.body.birthday),
      email: req.body.email,
      password: hash
    })

    await newUser.save()

    console.log(newUser)

    res.send(newUser)
  })
}
