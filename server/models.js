const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

const carSchema = new mongoose.Schema({
  year: Number,
  make: String,
  model: String,
  price: Number,
  personId: mongoose.Schema.Types.ObjectId,
});

const Person = mongoose.model('Person', personSchema);
const Car = mongoose.model('Car', carSchema);

module.exports = { Person, Car };
