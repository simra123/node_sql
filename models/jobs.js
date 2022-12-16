const mongoose = require('mongoose')

const jobsSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'please provide a company'],
        maxLength: 50
    },
    position: {
        type: String,
        required: [true, 'please provide a position'],
        maxLength: 100
    },
    status: {
        type: String,
        enum: ['pending', 'interview', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.SchemaTypes.String,
        ref: 'User',
        required: [true, 'please provide user']
    }
}, { timestamps: true })

module.exports = mongoose.model('jobs', jobsSchema)