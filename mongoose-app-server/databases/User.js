const mongoose = require("mongoose");

// const mongoPort = process.env.MongoDBPort;
// const mongoName = process.env.MongoDBName;

// const mongoUri = `mongodb://localhost:${mongoPort}/${mongoName}`;
// const mongoOptions = {};
// mongoose.connect(mongoUri, mongoOptions, (err) => {
//     if(err){
//         console.log('Mongo Connection Error:', err);
//     }
// })

const { Schema } = mongoose;
const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    isCertified: Boolean,
});
const User = mongoose.model('User', UserSchema);

module.exports = User;