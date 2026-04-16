import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoURL from '../assets/img/logo.jpeg'

export const AllPostedJobs = () => {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/jobs/all-jobs`).then(res => res.json()).then(
            data => {
                const newData = data.slice(0, 6);
                setJobs(newData)
            }
        );
    }, []);

    return (
        <div className='py-6 md:py-8 lg:py-10'>
            <h1 className='mb-6 text-center text-xl font-bold text-primary md:mb-8 md:text-2xl lg:text-3xl'>Join Our Team</h1>
            <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                {jobs.map((job, key) => <Card key={key} job={job} />)}
            </div>
        </div>
    )
}

function Card({ job }) {
    const formatSalaryLpa = (salary) => {
        const numericSalary = Number(salary);

        if (Number.isNaN(numericSalary)) {
            return salary;
        }

        if (numericSalary >= 100000) {
            const lpa = (numericSalary / 100000).toFixed(1).replace(/\.0$/, '');
            return `${lpa} LPA`;
        }

        return `${numericSalary} LPA`;
    };

    const shortDescription = job.description?.length > 120
        ? `${job.description.slice(0, 120)}...`
        : job.description;

    return (
        <Link to={`/current-job/${job._id}`} className='card block border border-gray-200 shadow-lg transition hover:-translate-y-1 hover:shadow-xl lg:p-6'>
            {/* Card Header */}
            <div className='flex items-start gap-3'>
                <div>
                    {/* company image */}
                    <img src={logoURL} alt={job.companyName} className='w-12 rounded-full shrink-0' />
                </div>
                <div className='min-w-0'>
                    <div className='flex flex-wrap items-center text-sm text-gray-600'>
                        <box-icon size='18px' name='time'></box-icon>
                        <span className='pl-1'>{job.employmentType} </span>
                    </div>
                    <h1 className='text-base font-bold break-words lg:text-lg'>{job.jobTitle}</h1>
                </div>
            </div>
            <div>
                <p className='text-sm leading-6 text-gray-600'>{shortDescription}</p>
            </div>
            {/* Footer - apply now and location */}
            <div className='mt-auto flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex justify-center items-center'>
                    <box-icon size='19px' name='wallet'></box-icon>
                    <span className='pl-2'>{formatSalaryLpa(job.salary)} </span>
                </div>
                <span className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm text-white'>Apply Now</span>
                            
            </div>
        </Link>
    )
}