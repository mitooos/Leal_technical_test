const request = require('supertest')
const app = require('../app.js')
const db = require('../db/db.js')
const {Transaction} = require('../models/transaction.js') 

let server
let transactions

const populateDb = async () => {
  const transaction1 = Transaction.build({
    user_id: 'aba',
    created_date: Date(),
    value: 100.21,
    points: Math.floor(100.21  * 0.05),
    status: true
  })
  const transaction2 = Transaction.build({
        user_id: 'abc',
        created_date: Date(),
        value: 100.21,
        points: Math.floor(100.21  * 0.05),
        status: true
      })
  const transaction3 = Transaction.build({
        user_id: 'abc',
        created_date: Date(),
        value: 100.21,
        points: Math.floor(100.21  * 0.05),
        status: true
      })
  const transaction4 = Transaction.build({
        user_id: 'aba',
        created_date: Date(),
        value: 100.21,
        points: Math.floor(100.21  * 0.05),
        status: false
      })
  const transaction5 = Transaction.build({
        user_id: 'aba',
        created_date: Date(),
        value: 100.21,
        points: Math.floor(100.21  * 0.05),
        status: true
      })

  await transaction1.save()
  await transaction2.save()
  await transaction3.save()
  await transaction4.save()
  await transaction5.save()
  transactions = [transaction1, transaction2, transaction3, transaction4, transaction5]
}

const setup = async() => {
  await db.connectToDb()
  server = await app.listen(3000, () => console.log('server listening on port 3000'))
    await populateDb()
}

beforeAll(() => setup())


afterAll(() => {
  server.close()
})


describe('create transaction', () => {
  it('should create the transaction and store it on the db', async () => {
    const newTransaction = {
      user_id: 'aba',
      value: 122
    }

    const res = await request(server)
      .post('/transactions')
      .send(newTransaction)

    expect(res.status).toBe(200)

    const storedTransaction = await Transaction.findOne({
      where:{
        id: res.body.id
      }
    })

    expect(newTransaction.user_id).toEqual(storedTransaction.dataValues.user_id)
    expect(newTransaction.value).toEqual(storedTransaction.dataValues.value)
    expect(Math.floor(newTransaction.value * 0.05)).toEqual(storedTransaction.dataValues.points)
    transactions.push(storedTransaction)
  })

  it('should return 400 status if a field is missing', async () => {
      const newTransaction = {
        user_id: 'aba',
      }

      const res = await request(server)
        .post('/transactions')
        .send(newTransaction)
      
    expect(res.status).toBe(400)
  })
})

describe('get users transactions', () => {
  it('should return all users transactions', async () => {
    const res = await request(server) 
      .get(`/transactions/${transactions[0].user_id}`)
      .send()

    expect(res.status).toEqual(200)
    
    for(i in res.body){
      res.body[i].created_date = new Date(res.body[i].created_date)
      res.body[i].createdAt = new Date(res.body[i].createdAt)
      res.body[i].updatedAt = new Date(res.body[i].updatedAt)
    }

    dataValues = transactions.map(transaction => transaction.dataValues)

        
    expect(res.body).toEqual(dataValues.filter(element => element.user_id === transactions[0].user_id))
  })

  it('should return an empty array if the id doesnt match with any records on the DB', async () => {
    const res = await request(server)
      .get('/transactions/abcd')
      .send()

    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })
  
})

describe('Get users points', () => {
  it('should give the sum of the user active transactions points', async () => {
    let userId = transactions[0].dataValues.user_id
    const res = await request(server)
      .get(`/transactions/points/${userId}`)
      .send()

    expect(res.status).toBe(200)
    expect(res.body.user_id).toEqual(userId)

    let points = 0
    let currentTransaction
    for(i in transactions){
      currentTransaction = transactions[i].dataValues
      if(currentTransaction.status && currentTransaction.user_id === userId){
        points += currentTransaction.points
      }
    }
    expect(res.body.points).toEqual(points)
  })
})

describe('invalidate transaction', () => {
  it('should invalidate transaction', async () => {
    let transactionToInvalidate = transactions[1].dataValues

    let res = await request(server)
      .put(`/transactions/${transactionToInvalidate.id}`)
      .send()

    let storedTransaction = await Transaction.findByPk(transactionToInvalidate.id)

    expect(res.status).toEqual(200)
    expect(storedTransaction.dataValues.status).toBe(false)
    transactions[1] = storedTransaction
  })

  it('should return 404 status if id doesnt exist', async () =>{
    let res = await request(server)
      .put('/transactions/100')
      .send()

    expect(res.status).toEqual(404)

  })
})

describe('Excel report', () => {
  it('should return an excel with all the transactions', async () => {
    let res = await request(server)
      .get('/transactions/report')
      .send()

    expect(res.status).toEqual(200)
    expect(res.text).toBeTruthy()
  })
}) 
