import Recruiter from '../../models/Recruiter.js'
import Job from '../../models/Job.js'
import User from '../../models/User.js'

const allRecruiter = async (req, res) => {
    try {
        const [assignments, jobs, users] = await Promise.all([
            Recruiter.find(),
            Job.find({}, '_id'),
            User.find({ role: 'recruiter' }, '_id')
        ]);

        const validJobIds = new Set(jobs.map((job) => String(job._id)));
        const validRecruiterIds = new Set(users.map((user) => String(user._id)));

        const invalidAssignmentIds = assignments
            .filter((assignment) => {
                const isValidJob = validJobIds.has(String(assignment.jobID));
                const isValidRecruiter = validRecruiterIds.has(String(assignment.recruiterID));
                return !isValidJob || !isValidRecruiter;
            })
            .map((assignment) => assignment._id);

        if (invalidAssignmentIds.length > 0) {
            await Recruiter.deleteMany({ _id: { $in: invalidAssignmentIds } });
        }

        const recruiter = await Recruiter.find();
        res.status(200).json(recruiter);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export {allRecruiter};