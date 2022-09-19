const mongoose = require('mongoose');
const { stringify } = require('querystring');

const goalSchema = mongoose.Schema(
    {
        text: {
            type: string,
            required: [true, 'Please add a text value'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Goal', goalSchema)