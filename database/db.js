import mysql2 from 'mysql2'

const connector = mysql2.createConnection({
  host: 'database',
  port: '3306',
  user: 'root',
  password: 'CorvusDDoSKrom',
  database: 'app'
})

connector.connect(err => {
  if (err) {
    console.log('Connection error is: ' + err)
    return
  }
  console.log('Successfully Connected!')
})

export default connector
