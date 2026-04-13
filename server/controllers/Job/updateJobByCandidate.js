import Job from '../../models/Job.js'

const updateJobByCandidate = async (req, res) => {
    try {
        const { jobID, candidateID, status } = req.body;

        const job = await Job.findById(jobID);

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const existingApplicant = job.applicants.find(
            (applicant) => applicant.applicant.toString() === candidateID.toString()
        );

        if (existingApplicant) {
            existingApplicant.status = status;
        } else {
            job.applicants.push({ applicant: candidateID, status });
        }

        await job.save();

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job by candidate' });
    }
}

export { updateJobByCandidate };