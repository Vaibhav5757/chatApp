const mongoose = require("mongoose");
const AutoIncrementFactory = require('mongoose-sequence')(mongoose);



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 3
    }

});

userSchema.plugin(AutoIncrementFactory, {inc_field: 'id'});//auto-increment id field

module.exports = mongoose.model('userModel',userSchema);

