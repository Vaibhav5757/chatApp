const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    conversation: [{
        type: String
    }]
});

module.exports = mongoose.model('messageModel', messageSchema);