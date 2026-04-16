import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import LogoURL from '../../assets/img/logo.jpeg'
import { useForm } from 'react-hook-form'
import { SimilarJobs } from '../SimilarJobs'

export const JobDetails = () => {

    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            candidateID: "",
            jobID: "",
            applicationStatus: "active",
            resume: null,
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

    const randomNum = Math.floor(Math.random() * (200 - 20 + 1) + 20)
    const { id } = useParams();
    const [job, setJob] = useState();
    const [file, setFile] = useState();

    const [loginData, setLoginData] = useState();
    
    useEffect(() => {
        let token = localStorage.getItem("user");
        const user = JSON.parse(token);
        const normalizedUser = Array.isArray(user) ? user[0] : user;
        setLoginData(normalizedUser)
        // console.log(user);
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`).then(res => res.json()).then(
            data => { setJob(data); /* console.log(data); */ }
        )
    }
        , [id]);

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile || !loginData?._id) {
            return;
        }

        setFile(selectedFile.name);
        const formData = new FormData();
        formData.append("resume", selectedFile);
        fetch(`${process.env.REACT_APP_API_URL}/upload/resume/${loginData._id}`, {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
            });
    }

    const onSubmit = (data) => {
        console.log(data);
    }

    const isAlreadyApplied = job && loginData?._id
        ? job.applicants?.some((item) => String(item.applicant) === String(loginData._id))
        : false;

    return (
        <div className='container mx-auto mt-2 w-full max-w-screen-xl px-4 sm:px-6 xl:px-24'>

            <div className='mx-auto rounded-2xl bg-[#efefef] px-4 py-8 sm:px-6 md:px-10 md:py-12 lg:px-14'>

                <div className='flex flex-col lg:flex-row  gap-8'>

                    {/* JOB DETAILS */}
                    {
                        job &&
                        <div className='w-full'>

                            {/* BASIC DETAILS */}
                            <div className='flex flex-wrap items-center justify-center gap-4 md:justify-start'>
                                <img src={LogoURL} alt="Logo" className="rounded-full w-20 md:w-24 h-auto" />
                                <div className='my-3 text-center md:my-0 md:text-left'>
                                    <h1 className='text-xl md:text-2xl font-bold'>{job.jobTitle}</h1>
                                    <p className='text-secondary'>Hireflow.com</p>
                                    <p className='text-sm text-gray-700'>Posted - 19/06/2024</p>
                                </div>
                            </div>

                            {/* ADDITIONALS */}
                            <div className='my-4 grid grid-cols-2 gap-3 xl:grid-cols-4'>
                                <div className='bg-blue-300 rounded-lg py-4 md:py-5 text-center'>
                                    <h2 className='text-xs md:text-md font-semibold text-gray-700'>Job Type</h2><p className='text-sm md:text-lg font-bold'>{job.employmentType}</p>
                                </div>
                                <div className='bg-green-300 rounded-lg py-4 md:py-5 text-center'>
                                    <h2 className='text-xs md:text-md font-semibold text-gray-700'>Salary</h2><p className='text-sm md:text-lg font-bold'>{job.salary}</p>
                                </div>
                                <div className='bg-blue-300 rounded-lg py-4 md:py-5 text-center'>
                                    <h2 className='text-xs md:text-md font-semibold text-gray-700'>Location</h2><p className='text-sm md:text-lg font-bold'>{job.location}</p>
                                </div>
                                <div className='bg-green-300 rounded-lg py-4 md:py-5 text-center'>
                                    <h2 className='text-xs md:text-md font-semibold text-gray-700'>Applicants</h2><p className='text-sm md:text-lg font-bold'>{randomNum}</p>
                                </div>
                            </div>

                            {/* JOB DESCRIPTION */}
                            <div className='px-1'>
                                <h2 className='my-2 font-bold'>Job Description</h2>
                                <p className='text-sm md:text-base text-justify '>
                                    {job.description}
                                </p>
                            </div>
                        </div>
                    }
                </div>

                {/* Submit button */}
                <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>
                    <h2 className=' font-bold my-4'>Upload Resume to Apply<span className=' text-red-600'>*</span></h2>
                    <div className='grid grid-cols-1 items-center gap-4 px-2 lg:grid-cols-[minmax(0,1fr)_auto]'>

                        <div className='w-full'>
                            <label className="sr-only">Choose file</label>
                            <input type="file" onChange={handleFileUpload} {...register("resume")} id="file-input" className="block w-full cursor-pointer rounded-lg border border-primary text-sm shadow-sm file:me-4 file:border-0 file:bg-primary file:px-3 file:py-2 file:text-white focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50" />
                        </div>

                        {
                            job && isAlreadyApplied ?
                                <div className='flex w-full justify-center lg:w-auto'>
                                    <button type='button' disabled className='block w-full rounded-md bg-gray-500 px-8 py-3 text-md text-white sm:w-auto md:px-16'>Already Applied</button>
                                </div>
                                :
                                <Link to={`/application-form/${job?._id}`} className='w-full lg:w-auto'>
                                    <div className='flex w-full justify-center'>
                                        <button type='button' className='block w-full rounded-md bg-primary px-8 py-3 text-md text-white sm:w-auto md:px-16'>Apply Now</button>
                                    </div>
                                </Link>
                        }
                    </div>
                </form>
                {job && job.applicants && job.applicants.length > 0 && (
                    <div className="mt-4">
                        <h2 className="font-bold">Uploaded Resume:</h2>
                        <p>{file}</p>
                    </div>
                )}
                <div className='text-center'>
                    <p className='hover:underline text-xs md:text-sm mt-8'>By applying to above job, you agree to our terms and conditions.</p>
                </div>
            </div>
            
            <SimilarJobs />
        </div>
    )
}
