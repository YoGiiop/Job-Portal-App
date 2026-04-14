import React from 'react'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'


export const PostJob = () => {

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues:{
            jobTitle: "",
            employmentType: "",
            location: "",
            salary: "",
            description: "",
            applicationForm: {
                question: [""]
            }
            
        }
    })

    const onSubmit = async (data) =>{ 
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/post-job`, {
                method: "POST",
                headers: {'content-type' : 'application/json'},
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result?.message || "Failed to post job");
                return;
            }

            toast.success("Job Posted Successfully");
            window.location.href = '/all-jobs';
        } catch (error) {
            // console.log(error);
            toast.error("Failed to post job");
        }
    }

    // DYNAMIC CANDIDATE FORM QUESTION
    const [questions, setQuestions] = useState([{ question: '' }]);
    const [questionSize, setQuestionSize] = useState(0);
    const addQuestion = () => {
        setQuestionSize(questionSize+1);
        setQuestions([...questions, { question: '' }]);
    };
    const handleDeleteQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
        setQuestionSize(questionSize-1);
    };


    return (
        <div className='max-w-scren-2xl container mt-2 mx-auto xl:px-24 px-4 '>
            <div className='bg-[#e7e7e7] py-6 px-4 lg:px-16 rounded-lg'>

                {/* FORM */}
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className='flex flex-col lg:flex-row  gap-8'>

                        {/* JOB POSTING DETAILS */}
                        <div className='lg:w-1/2 w-full'>
                            <div><h1 className='text-xl font-bold text-center'>Job Details</h1></div>
                            <div>
                                <label className='block m-1 text-md'>Job Title</label>
                                <input type='text' required {...register("jobTitle")} placeholder='Ex: Full Stack Developer' className='create-job-input placeholder:text-xs md:placeholder:text-sm'></input>
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Employment Type</label>
                                <input type='text' required {...register("employmentType")} placeholder='Ex: Internship, Part Time, Full Time' className='create-job-input placeholder:text-xs md:placeholder:text-sm'></input>
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Location</label>
                                <input type='text' required {...register("location")} placeholder='Ex: Hyderabad' className='create-job-input placeholder:text-xs md:placeholder:text-sm'></input>
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Expected Salary <span className='text-sm'>(in LPA)</span></label>
                                <input type='text' required {...register("salary")} placeholder='Ex: 20' className='create-job-input placeholder:text-xs md:placeholder:text-sm'></input>
                            </div>
                            <div>
                                <label className='block m-1 text-md'>Job Description</label>
                                <textarea className='create-job-input placeholder:text-xs md:placeholder:text-sm' rows={4} placeholder='Job Description and Requirements' required {...register("description")} />
                            </div>
                        </div>

                        {/* CANDIDATE FORM */}
                        <div className='lg:w-1/2 w-full'>
                            <div><h1 className='text-xl font-bold text-center'>Candidate Form</h1></div>



                            {/* DYNAMIC BLOCK */}
                            <div>
                                {questions.map((question, index) => (

                                    <div key={index}>
                                            <label className='block m-1 text-md'>Question {`${index+1}`}</label>
                                            <div className='mb-2 text-lg grid grid-cols-1 md:grid-cols-2 items-center'>
                                                <input type='text' required {...register(`applicationForm.question.${index}`)} placeholder={`Question ${index + 1}`} className=' create-job-input placeholder:text-xs md:placeholder:text-sm' ></input>

                                                <div className='flex justify-end md:justify-center my-2 md:my-0' >
                                                    <div onClick={() => handleDeleteQuestion(index)}>
                                                        <box-icon size='sm' name='trash'/>
                                                    </div>
                                                </div>

                                            </div>
                                    </div>
                                ))}
                            </div>
                                <button type='button' onClick={addQuestion} className={`${questionSize === 4? `hidden` : ``} block border border-black bg-transparent text-black text-xs md:text-md py-3 px-12 md:px-16 rounded-md mt-4 md:mt-8 mx-auto`}>Add More Questions</button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className='flex justify-center my-8'>
                        <button className='block bg-secondary text-white text-md py-4 px-16 rounded-md'>Create Job Post</button>
                    </div>
                </form>

            </div>
        </div>
    )
}
