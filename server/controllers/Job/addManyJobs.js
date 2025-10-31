import Job from "../../models/Job.js";

export const addManyJobs = async (req, res) => {
  try {
    // Expect an array of job objects
    const jobs = req.body;

    if (!Array.isArray(jobs)) {
      return res.status(400).json({ message: "Expected an array of jobs" });
    }

    const result = await Job.insertMany(jobs);
    res.status(201).json({
      message: `${result.length} jobs added successfully`,
      jobs: result,
    });
  } catch (error) {
    console.error("Error inserting jobs:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
