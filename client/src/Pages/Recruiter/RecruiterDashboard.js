import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const RecruiterDashboard = () => {

    const tableHeaderCss = "px-4 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold "

    const [loginData, setLoginData] = useState();
    const [job, setJob] = useState();
    const [recruiter, setRecruiter] = useState();
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoginData(user || null);
    }, []);

    useEffect(() => {
        const fetchRecruiterData = async () => {
            if (!loginData?._id) {
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/recruiter/all-recruiter`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recruiter data');
                }
                const data = await response.json();

                const recruiterData = data.find((item) => item.recruiterID === loginData._id);
                if (recruiterData) {
                    setRecruiter(recruiterData);
                } else {
                    setRecruiter(null);
                }
            } catch (error) {
                console.error('Error fetching recruiter data:', error);
            }
        };

        fetchRecruiterData();
    }, [loginData]);

    useEffect(() => {
        if (recruiter && recruiter.jobID) {
            const fetchJobsData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${recruiter.jobID}`);
                    const data = await response.json();
                    setJob(data);
                } catch (error) {
                    console.error('Error fetching jobs data:', error);
                }
            };

            fetchJobsData();
        } else {
            setJob(null);
            setApplicants([]);
        }
    }, [recruiter]);

    useEffect(() => {
        if (job && job.applicants) {
            const fetchApplicantsData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/all-users`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch applicants data');
                    }
                    const data = await response.json();

                                        const filteredApplicants = data.filter(app => {
                                                return job.applicants.some(jobApplicant => jobApplicant.applicant === app._id);
                                        });

                                        const applicantsWithStatus = filteredApplicants.map((applicant) => {
                                                const currentApplicant = job.applicants.find((item) => item.applicant === applicant._id);
                                                return {
                                                        ...applicant,
                                                        applicationStatus: currentApplicant?.status || 'active'
                                                };
                                        });

                                        setApplicants(applicantsWithStatus);
                } catch (error) {
                    console.error('Error fetching applicants data:', error);
                }
            };

            fetchApplicantsData();
        }
        }, [job]);

    return (
        <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>

            <div className='py-1'>
                <div className='w-full '>

                    {/* MAIN TABLE */}
                    <section className="py-1 bg-blueGray-50">
                        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                                <div className="rounded-t mb-0 px-4 py-3 border-0 bg-secondary text-white ">
                                    <div className="flex flex-wrap items-center">
                                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-center">
                                            <h3 className="font-bold text-base text-blueGray-700">Review Candidate</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="block w-full overflow-x-hidden">
                                    <table className="items-center bg-transparent w-full border-collapse ">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Candidate</th>
                                                <th className={tableHeaderCss}>Status</th>
                                                <th className={tableHeaderCss}>Application</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applicants.map((applicant, key) => (
                                                <RenderTableRows key={key} applicant={applicant} />
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    )
}

function RenderTableRows({ applicant }) {
    const tableDataCss = "border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
    return (

        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {applicant.userName}
            </th>
            <td className={`${tableDataCss}`}>
                {applicant.applicationStatus}
            </td>
            <td className={`${tableDataCss}`}>
                <Link to={`/candidate/${applicant._id}`} >
                    <button className='block bg-primary text-white mx-auto text-md py-2  px-5 md:px-6 rounded-md'> Review</button>
                </Link>
            </td>
        </tr>
    )
}