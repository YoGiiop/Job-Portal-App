import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

export const CandidateProfile = () => {
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      _id: "",
      candidateID: "",
      jobID: "",
      applicationStatus: "",
      applicationForm: [
        {
          question: "",
          answer: "",
        },
      ],
      candidateFeedback: [
        {
          question: "",
          answer: "",
        },
      ],
    },
  });

  const { id } = useParams();
  const [application, setApplicaton] = useState();
  const [candidate, setCandidate] = useState();
  const [recruiter, setRecruiter] = useState();
  const [job, setJob] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedUser?._id) {
        setLoading(false);
        return;
      }

      try {
        const [allRecruitersRes, candidateRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/recruiter/all-recruiter`),
          fetch(`${process.env.REACT_APP_API_URL}/users/user/${id}`),
        ]);

        const [allRecruiters, candidateData] = await Promise.all([
          allRecruitersRes.json(),
          candidateRes.json(),
        ]);

        const assignedRecruiter = allRecruiters.find(
          (item) => item.recruiterID === loggedUser._id
        );

        if (!assignedRecruiter) {
          setLoading(false);
          return;
        }

        const [jobRes, applicationsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${assignedRecruiter.jobID}`),
          fetch(`${process.env.REACT_APP_API_URL}/application/all-application/`),
        ]);

        const [jobData, applicationsData] = await Promise.all([
          jobRes.json(),
          applicationsRes.json(),
        ]);

        const candidateApplication = applicationsData.find(
          (item) => item.candidateID === id && item.jobID === assignedRecruiter.jobID
        );

        setCandidate(candidateData);
        setRecruiter(assignedRecruiter);
        setJob(jobData);
        setApplicaton(candidateApplication);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const onSubmit = (data) => {
    if (!application || !candidate || !job || !recruiter) {
      return;
    }

    const newData = {
      candidateID: candidate._id,
      jobID: job._id,
      applicationStatus: data.applicationStatus,
      applicationForm: application.applicationForm || [],
      candidateFeedback: recruiter.feedbackForm.map((q, index) => ({
        answer: data?.candidateFeedback?.[index]?.answer || "",
        question: q,
      })),
    };

    fetch(`${process.env.REACT_APP_API_URL}/application/post-application`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        window.location.href = '/recruiter/review';
      });
  };

  const handleShortlistOrReject = (status) => {
    setValue("applicationStatus", status);
    handleSubmit(onSubmit)(); // manually trigger form submit
  };

  return (
    <div className="max-w-scren-2xl  w-full md:w-4/6 lg:w-6/8 container mt-2 mx-auto xl:px-24 px-4 ">
      <div className=" bg-[#efefef] mx-auto py-12 md:px-14 px-8 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row  gap-8">
            {/* JOB POSTING DETAILS */}

            <div className="lg:w-1/2 w-full">
              <div>
                {candidate && job && (
                  <div>
                    <div>
                      <div>
                        <h1 className="text-xl md:text-2xl font-bold">
                          {candidate.userName}
                        </h1>
                      </div>
                      <div className="px-1">
                        <h2 className="mt-4 mb-2 font-bold">
                          Candidate Details
                        </h2>
                        <p className="text-sm md:text-base text-justify ">
                          Email: {candidate.userEmail}
                        </p>
                        <p className="text-sm md:text-base text-justify ">
                          Gender: {candidate.gender}
                        </p>
                        <p className="text-sm md:text-base text-justify ">
                          Address: {candidate.address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="px-1">
                        <h2 className="mt-2 mb-2 font-bold">Job Details</h2>
                        <p className="text-sm md:text-base text-justify ">
                          Job Role: {job.employmentType}
                        </p>
                        <p className="text-sm md:text-base text-justify ">
                          Location: {job.location}
                        </p>
                        <p className="text-sm md:text-base text-justify ">
                          Salary: {job.salary}
                        </p>
                        <p className="text-sm md:text-base text-justify ">
                          Description: {job.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {application && application.applicationForm && (
                <div className="px-1">
                  <h2 className="mt-2 mb-2 font-bold">Application Form (R1)</h2>
                  {application && (
                    <div className="px-1">
                      {application.applicationForm.map((question, index) => (
                          <div key={index}>
                            <p className="text-sm md:text-base text-justify">
                              Q{index + 1}: {question.question}
                            </p>
                            <p className="text-sm md:text-base text-justify">
                              Response:{" "}
                              <span className="font-semibold">
                                {question.answer}
                              </span>
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CANDIDATE FORM */}
            <div className="lg:w-1/2 w-full">
              <div>
                <h1 className="text-xl font-bold text-center">Feedback Form</h1>
              </div>

              {/* DYNAMIC BLOCK */}
              <div>
                {recruiter &&
                  recruiter.feedbackForm.map((question, index) => {
                    return (
                      <RenderQuestion
                        key={index}
                        index={index}
                        register={register}
                        setValue={setValue}
                        question={question}
                      />
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <button
              type="button"
              className="block bg-red-500 text-white text-md py-4 px-16 rounded-md"
              onClick={() => handleShortlistOrReject("reject")}
            >
              Reject
            </button>

            <button
              type="button"
              className="block bg-green-500 text-white text-md py-4 px-16 rounded-md"
              onClick={() => handleShortlistOrReject("shortlist")}
            >
              Shortlist
            </button>
          </div>
        </form>

        {loading && <p className="text-center mt-4">Loading candidate review...</p>}
        {!loading && !application && <p className="text-center mt-4">No application found for this candidate in your assigned job.</p>}

        {/* <div className='text-center'>
                    <p className='hover:underline text-xs md:text-sm mt-8'>By applying to above job, you agree to our terms and conditions.</p>
                </div> */}
      </div>
    </div>
  );
};

function RenderQuestion({ index, question, register }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center pt-2 md:my-0">
      <label className="block mt-2 m-1 text-sm">
        {index + 1}. {question}
      </label>
      <div>
        <textarea
          {...register(`candidateFeedback.${index}.answer`, {
            required: true,
          })}
          placeholder="Write your feedback"
          rows={3}
          className="create-job-input resize-none"
        />
      </div>
    </div>
  );
}
