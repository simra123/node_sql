const Jobs = require('../models/jobs')
const { StatusCodes } = require('http-status-codes')
const { BadRequest, NotFound } = require('../errors')
//--unhandled-rejections=strict
const getAllJobs = async (req, res) => {
    const jobs = await Jobs.find({ createdBy: req.Users.name }).sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}
const getAJob = async (req, res, next) => {
    const { id } = req.params
    const { name } = req.Users
    const jobs = await Jobs.findOne({ _id: id, createdBy: name })
    if (!jobs) {
        return next(new NotFound(`No job was found with the id of ${ id }`))
    }
    res.status(StatusCodes.OK).json({ jobs })
}
const createJob = async (req, res) => {
    req.body.createdBy = req.Users.name
    console.log(req.Users)
    const job = await Jobs.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
}
const updateJob = async (req, res, next) => {
    const { name } = req.Users
    const { id } = req.params
    const { company, position } = req.body
    if (company === "" || position === "") {
        return next(new BadRequest(`company and positive can not be empty`))
    }
    const jobs = await Jobs.findOneAndUpdate({ _id: id, createdBy: name },
        req.body,
        { new: true, runValidators: true }
    )
    if (!jobs) {
        return next(new NotFound(`No job was found with the id of ${ id }`))
    }
    res.status(StatusCodes.OK).json({ jobs })

}
const deleteJob = async (req, res, next) => {
    const { name } = req.Users
    const { id } = req.params
    const jobs = await Jobs.findOneAndDelete({ _id: id, createdBy: name })
    if (!jobs) {
        return next(new NotFound(`No job was found with the id of ${ id }`))
    }
    else{
        console.log('error')
    }
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length, success: true, msg: "deleted job ", })

}

module.exports = {
    getAJob,
    getAllJobs,
    createJob,
    updateJob,
    deleteJob
}