const mongoose = require("mongoose");

mongoose.set('useCreateIndex', true);

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

module.exports = mongoose.model('userModel',userSchema);

