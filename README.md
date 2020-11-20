# Leal Technical Test

## Usage:
### in each microservice:
- Rename .env.example to .env
- Replace variables with your variables
- execute npm install
- execute npm start to run
#### Endpoints:

- Register user:  
post: '/users'  
body: { 
    password: 'pwd',
    email: 'example@email.com',
    name: 'John',
    lastname: 'Doe',
    birthday: '1982-01-07'
  }

- Login:  
post: '/users/auth/login'  
body: {
  password: 'pwd',
  email: 'example@email.com',
}

- Register transaction:  
post: '/transactions'  
body: {
  user_id: 'abcdfgh',
  value: 122.33
}

- Get users transactions:  
get: '/transactions/<user_id>

- Get users points:
get: '/transactions/points/<user_id>

- Inavlidate transaction:  
put: '/transactions/<transaction_id>

- Get excel reports:  
get: '/transactions/report'

#### Testing:
- run npm test
