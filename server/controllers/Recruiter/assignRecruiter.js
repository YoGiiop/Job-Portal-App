import Recruiter from '../../models/Recruiter.js';
import User from '../../models/User.js';
import Job from '../../models/Job.js';

const assignRecruiter = async (req, res) => {
    const { jobID, recruiterID, feedbackForm = [] } = req.body;

    if (!jobID || !recruiterID) {
        return res.status(400).json({
            success: false,
            message: 'jobID and recruiterID are required'
        });
    }

    let markedAssigned = false;

    try {
        const job = await Job.findById(jobID);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const existingAssignmentForJob = await Recruiter.findOne({ jobID });
        if (existingAssignmentForJob) {
            return res.status(409).json({
                success: false,
                message: 'A recruiter is already assigned to this job'
            });
        }

        const existingRecruiterAssignment = await Recruiter.findOne({ recruiterID });
        if (existingRecruiterAssignment) {
            return res.status(409).json({
                success: false,
                message: 'This recruiter is already assigned to another job'
            });
        }

        const recruiterUser = await User.findOneAndUpdate(
            { _id: recruiterID, role: 'recruiter', isAssigned: { $ne: true } },
            { $set: { isAssigned: true } },
            { new: true }
        );

        if (!recruiterUser) {
            const recruiter = await User.findById(recruiterID);

            if (!recruiter) {
                return res.status(404).json({
                    success: false,
                    message: 'Recruiter not found'
                });
            }

            if (recruiter.role !== 'recruiter') {
                return res.status(400).json({
                    success: false,
                    message: 'Selected user is not a recruiter'
                });
            }

            return res.status(409).json({
                success: false,
                message: 'Recruiter is already assigned'
            });
        }

        markedAssigned = true;

        const sanitizedFeedbackForm = Array.isArray(feedbackForm)
            ? feedbackForm
                .filter((item) => typeof item === 'string')
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
            : [];

        const assignment = await Recruiter.create({
            jobID,
            recruiterID,
            feedbackForm: sanitizedFeedbackForm
        });

        return res.status(201).json({
            success: true,
            message: 'Recruiter assigned successfully',
            data: assignment
        });
    } catch (error) {
        if (markedAssigned) {
            await User.findByIdAndUpdate(recruiterID, { $set: { isAssigned: false } });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to assign recruiter',
            error: error.message
        });
    }
};

export { assignRecruiter };
