import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UpdateJob = () => {
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            jobTitle: "",
            employmentType: "",
            location: "",
            salary: "",
            description: "",
            applicationForm: {
                question: [""]
            }
        }
    });

    const [questions, setQuestions] = useState([{ question: '' }]);
    const [questionSize, setQuestionSize] = useState(0);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`)
            .then((res) => res.json())
            .then((result) => {
                const questionList = result?.applicationForm?.question?.length
                    ? result.applicationForm.question
                    : [""];

                reset({
                    jobTitle: result.jobTitle || "",
                    employmentType: result.employmentType || "",
                    location: result.location || "",
                    salary: result.salary || "",
                    description: result.description || "",
                    applicationForm: {
                        question: questionList
                    }
                });

                setQuestions(questionList.map((question) => ({ question })));
                setQuestionSize(Math.max(questionList.length - 1, 0));
            })
            .catch((error) => {
                console.log(error);
                toast.error('Failed to load job details');
            });
    }, [id, reset]);

    const onSubmit = (data) => {
        fetch(`${process.env.REACT_APP_API_URL}/jobs/update-job/${id}`, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ ...data, jobId: id })
        })
            .then((res) => res.json())
            .then((result) => {
                if (result?._id) {
                    toast.success("Job Updated Successfully");
                    window.location.href = '/all-jobs';
                    return;
                }

                toast.error(result?.message || "Failed to update job");
            })
            .catch((error) => {
                console.log(error);
                toast.error("Failed to update job");
            });
    };

    const addQuestion = () => {
        setQuestionSize((prev) => prev + 1);
        setQuestions((prev) => [...prev, { question: '' }]);
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions.length > 0 ? newQuestions : [{ question: '' }]);
        setQuestionSize((prev) => Math.max(prev - 1, 0));
    };

    return (
        <div className='max-w-scren-2xl container mt-2 mx-auto xl:px-24 px-4 '>
            <div className='bg-[#e7e7e7] py-6 px-4 lg:px-16 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex flex-col lg:flex-row gap-8'>
                        <div className='lg:w-1/2 w-full'>
                            <div><h1 className='text-xl font-bold text-center'>Update Job Details</h1></div>
                            <div>
                                <label className='block m-1 text-md'>Job Title</label>
                                <input type='text' required {...register("jobTitle")} placeholder='Ex: Full Stack Developer' className='create-job-input placeholder:text-xs md:placeholder:text-sm' />
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Employment Type</label>
                                <input type='text' required {...register("employmentType")} placeholder='Ex: Internship, Part Time, Full Time' className='create-job-input placeholder:text-xs md:placeholder:text-sm' />
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Location</label>
                                <input type='text' required {...register("location")} placeholder='Ex: Hyderabad' className='create-job-input placeholder:text-xs md:placeholder:text-sm' />
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Expected Salary <span className='text-sm'>(in LPA)</span></label>
                                <input type='text' required {...register("salary")} placeholder='Ex: 20' className='create-job-input placeholder:text-xs md:placeholder:text-sm' />
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Job Description</label>
                                <textarea className='create-job-input placeholder:text-xs md:placeholder:text-sm' rows={4} placeholder='Job Description and Requirements' required {...register("description")} />
                            </div>
                        </div>

                        <div className='lg:w-1/2 w-full'>
                            <div><h1 className='text-xl font-bold text-center'>Candidate Form</h1></div>
                            <div>
                                {questions.map((question, index) => (
                                    <div key={index}>
                                        <label className='block m-1 text-md'>Question {`${index + 1}`}</label>
                                        <div className='mb-2 text-lg grid grid-cols-1 md:grid-cols-2 items-center'>
                                            <input type='text' required {...register(`applicationForm.question.${index}`)} placeholder={`Question ${index + 1}`} className='create-job-input placeholder:text-xs md:placeholder:text-sm' />

                                            <div className='flex justify-end md:justify-center my-2 md:my-0'>
                                                <div onClick={() => handleDeleteQuestion(index)}>
                                                    <box-icon size='sm' name='trash' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type='button' onClick={addQuestion} className={`${questionSize === 4 ? `hidden` : ``} block border border-black bg-transparent text-black text-xs md:text-md py-3 px-12 md:px-16 rounded-md mt-4 md:mt-8 mx-auto`}>Add More Questions</button>
                        </div>
                    </div>

                    <div className='flex justify-center my-8'>
                        <button className='block bg-primary text-white text-md py-4 px-16 rounded-md'>Update Job</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
