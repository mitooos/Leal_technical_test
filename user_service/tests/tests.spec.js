const request = require('supertest')
const app = require('../app.js')
const db = require('../db/db.js')
const {User} = require('../models/user.js') 
const md5 = require('md5')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


let server


const setup = async() => {
  process.env.SECRET = 'jwt secret'
  await db.connectToDb()
  server = await app.listen(3000, () => console.log('server listening on port 3000'))
}

beforeAll(() => setup())


afterAll(() => {
  server.close()
})


describe('first test', () => {
  it('should sum correctly', () => {
    expect(1+1).toEqual(2)
  })
})

const newUser = {
    password: 'pwd',
    email: 'example@email.com',
    name: 'John',
    lastname: 'Doe',
    birthday: '1982-01-07'
  }

describe('Register user', () => {
  
  it('should create the user and store it in the DB', async () => {
       const res = await request(server)
      .post('/users')
      .send(newUser)

    expect(res.status).toEqual(200)
    
    let storedUser = await User.findByPk(res.body.user_id)

    let storedUserData = {
          password: storedUser.dataValues.password,
          email: storedUser.dataValues.email,
          name: storedUser.dataValues.name,
          lastname: storedUser.dataValues.lastname,
          birthday: storedUser.dataValues.birth_date.toString()
    }

    const matchPasswords = await bcrypt.compare(newUser.password, storedUserData.password)
    expect(matchPasswords).toBe(true)

    newUser.birthday = new Date(newUser.birthday).toString()
    storedUserData.password = newUser.password
    
    expect(storedUserData).toEqual(newUser)
  })
  it('should return status 422 if email is taken', async () => {
    const res = await request(server)
      .post('/users')
      .send(newUser)

    expect(res.status).toEqual(422)
  }) 
  it('should return status 400 if a field is missing', async () => {
    newUser.lastname = undefined
    const res = await request(server)
      .post('/users')
      .send(newUser)

    expect(res.status).toEqual(400)
  })
})

describe('login', () => {
  it('should authenticate the user if thre credentials are correct', async () => {
    let credentials = {
      email: newUser.email,
      password: newUser.password
    }

    const res = await request(server)
      .post('/users/auth/login')
      .send(credentials)

    expect(res.status).toEqual(200)

    let token = res.body.token

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err){
        throw new Error('token is invalid')
      }
      expect(decoded.email).toEqual(credentials.email)
    })
  })

  it('should return 400 status if all fields are not provided', async () => {
    let credentials = {
      email: newUser.email,
    }

    const res = await request(server)
      .post('/users/auth/login')
      .send(credentials)

    expect(res.status).toEqual(400)
  })
  it('should return 401 status if there is no user with the given email', async () => {
    let credentials = {
      email: newUser.email + 'abc',
      password: newUser.password
    }

    const res = await request(server)
      .post('/users/auth/login')
      .send(credentials)

    expect(res.status).toEqual(401)
    }
  )
   it('should return 401 status if the password is incorrect', async () => {
    let credentials = {
      email: newUser.email, 
      password: newUser.password + 'abc'
    }

    const res = await request(server)
      .post('/users/auth/login')
      .send(credentials)

    expect(res.status).toEqual(401)
    })
 
})


