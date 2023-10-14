import Job from '../models/JobModel.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs';

// Get all jobs
export const getAllJobs = async (req, res) => {
  // console.log(req.user);
  // const jobs = await Job.find({ createdBy: req.user.userId });
  // res.status(StatusCodes.OK).json({ jobs });
  const { search, jobStatus, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  // search based on position or company
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }
  // add status and jobType Search
  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  // sort
  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };
  const sortKey = sortOptions[sort] || sortOptions.newest;

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

// Create job
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// Get single job
export const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById({ _id: id });
  // if (!job) {
  //   throw new NotFoundError(`no job with id ${id}`);
  // }
  res.status(StatusCodes.OK).json({ job });
};

// Update single job
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // if (!updatedJob) {
  //   throw new NotFoundError(`no job with id ${id}`);
  // }

  res.status(StatusCodes.OK).json({ msg: 'job modified', jobs: updatedJob });
};

// Delete single job
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const removeJob = await Job.findByIdAndDelete({ _id: id });
  // if (!removeJob) {
  //   // return res.status(404).json({ msg: `no job with id ${id}` });
  //   throw new NotFoundError(`no job with id ${id}`);
  // }
  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removeJob });
};

// stats route
export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((total, curr) => {
    const { _id: title, count } = curr;
    total[title] = count;
    return total;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const { year, month } = item._id;
      const { count } = item;
      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date: date, count: count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
