import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import User from '../../models/User.js';

const addApplication = async (req, res) => {
    const { jobID, candidateID, applicationStatus = 'active', applicationForm = [], candidateFeedback = [] } = req.body;

    if (!jobID || !candidateID) {
        return res.status(400).json({ message: 'jobID and candidateID are required' });
    }

    try {
        const [job, candidate] = await Promise.all([
            Job.findById(jobID),
            User.findById(candidateID)
        ]);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        let application = await Application.findOne({ jobID, candidateID });

        if (application) {
            application.applicationStatus = applicationStatus;
            application.applicationForm = applicationForm;
            application.candidateFeedback = candidateFeedback;
            await application.save();
        } else {
            application = await Application.create({
                jobID,
                candidateID,
                applicationStatus,
                applicationForm,
                candidateFeedback
            });
        }

        const existingApplicantEntry = job.applicants.find(
            (entry) => entry.applicant.toString() === candidateID.toString()
        );

        if (existingApplicantEntry) {
            existingApplicantEntry.status = applicationStatus;
        } else {
            job.applicants.push({ applicant: candidateID, status: applicationStatus });
        }

        const existingUserApplication = candidate.applications.find(
            (entry) => entry.jobId.toString() === jobID.toString()
        );

        if (existingUserApplication) {
            existingUserApplication.status = applicationStatus;
        } else {
            candidate.applications.push({ jobId: jobID, status: applicationStatus });
        }

        await Promise.all([job.save(), candidate.save()]);

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {addApplication};
