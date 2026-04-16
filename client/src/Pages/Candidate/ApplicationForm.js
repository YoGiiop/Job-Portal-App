import React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export const ApplicationForm = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const [candidateId, setCandidateId] = useState("");
    const [userRole, setUserRole] = useState("");

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            candidateID: "",
            jobID: job._id,
            applicationStatus: "active",
            applicationForm: [{
                question: "",
                answer: ""
            }],
            candidateFeedback: [{
                question: "",
                answer: ""
            }]
        }
    })

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const normalizedUser = Array.isArray(storedUser) ? storedUser[0] : storedUser;
        if (normalizedUser && normalizedUser._id) {
            setCandidateId(normalizedUser._id);
            setUserRole(normalizedUser.role);
        }
    }, []);

    const onSubmit = async (data) => {
        if (!candidateId) {
            toast.error("Please login as candidate to apply");
            return;
        }

        if (userRole && userRole !== 'candidate') {
            toast.error('Only candidate accounts can apply for jobs');
            return;
        }

        const newData = { ...data, jobID: id, candidateID: candidateId, applicationStatus: "active" };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/application/post-application`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(newData),
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message || "Failed to apply to job");
                return;
            }

            toast.success("Applied to job successfully");
            setTimeout(() => {
                navigate('/my-jobs');
            }, 800);
        } catch (error) {
            // console.log(error);
            toast.error("Failed to apply to job");
        }
    };

    useEffect(() => {
        try {
            fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`).then((res) => res.json()).then((data) => setJob(data))
        } catch (error) {
            // console.log(error);
        }
    }, [id]);

    return (
        <div className='container mx-auto mt-2 w-full max-w-screen-lg px-4 sm:px-6 xl:px-24'>
            <div className='mx-auto rounded-2xl bg-[#e7e7e7] px-4 py-6 sm:px-6 md:px-12'>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className='flex flex-col lg:flex-row  gap-8'>

                        {/* JOB POSTING DETAILS */}
                        <div className='w-full'>
                            <div>
                                <h1 className='text-xl my-1 font-bold text-center'>Application Form</h1>
                                <h1 className='text-md mb-2 font-bold text-center text-gray-700'>{job.jobTitle} Role</h1>
                            </div>
                            <h1 className='text-sm italic mt-4'>Answer below questions to proceed</h1>

                            {/* {job.applicationForm.question.map((question, index) => (
                                <RenderQuestion key={index} question={question} />
                            ))} */}
                            {job.applicationForm?.question?.length > 0 ? job.applicationForm.question.map((question, index) => (
                                <RenderQuestion key={index} index={index} question={question} register={register} />

                            )) : (
                                <p className='mt-4 text-sm text-gray-600'>No application questions were configured for this job.</p>
                            )}

                        </div>

                    </div>

                    <div className='my-8 flex justify-center'>
                        <button className='submit submit-btn block w-full rounded-md bg-primary px-16 py-3 text-md text-white sm:w-auto'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function RenderQuestion({ index, question, register }) {
    return (
        <div className='grid grid-cols-1 gap-2 pt-3 md:grid-cols-2 md:items-center'>
            <label className='m-1 mt-2 block text-sm leading-6'>{index + 1}. {question}</label>
            <input type='hidden' value={question} {...register(`applicationForm.${index}.question`)} />
            <div>
                <input
                    {...register(`applicationForm.${index}.answer`, { required: true })}
                    type='text'
                    placeholder='Write your answer'
                    className='create-job-input placeholder:text-xs md:placeholder:text-sm'
                />
            </div>
        </div>
    );
}
