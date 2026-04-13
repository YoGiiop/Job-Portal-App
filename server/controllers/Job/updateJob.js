import Job from '../../models/Job.js'

const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { jobId, jobTitle, employmentType, location, salary, description, applicationForm, applicants } = req.body;

        const targetJobId = id || jobId;

        if (!targetJobId) {
            return res.status(400).json({ message: 'Job id is required' });
        }

        const updatedJob = await Job.findByIdAndUpdate(targetJobId, {
            jobTitle,
            employmentType,
            location,
            salary,
            description,
            applicationForm,
            applicants
        }, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export { updateJob };