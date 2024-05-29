mongoose = require('mongoose')



mongoose.connect(`mongodb+srv://${process.env["dbUsername"]}:${process.env["dbPassword"]}@internshiptracker.l0rlwsm.mongodb.net/?retryWrites=true&w=majority&appName=InternshipTracker`)


const { Schema, model } = mongoose;

const user = new Schema({
  email: {type:String, unique:true},
  password: String,
  sessions: [String],
});

const User = model('User', user);
exports.User = User
