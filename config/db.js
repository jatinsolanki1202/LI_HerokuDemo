const mongoose = require('mongoose')

const dbConnection = async () => {
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log('Error connecting to DB: ', err.message))
}

module.exports = dbConnection