import User from '../../models/User.js'

const updateUserByCandidate = async (req, res) => {
    try {
        const { jobID, candidateID, status } = req.body;

        const user = await User.findById(candidateID);

        if (!user) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const existingApplication = user.applications.find(
            (application) => application.jobId.toString() === jobID.toString()
        );

        if (existingApplication) {
            existingApplication.status = status;
        } else {
            user.applications.push({ jobId: jobID, status });
        }

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update job by candidate' });
    }
}

export { updateUserByCandidate };