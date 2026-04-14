import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

export const CoordinatorDashboard = () => {

    const tableHeaderCss = "px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"

    const [jobs, setJobs] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [assignedRecruitersByJob, setAssignedRecruitersByJob] = useState({});

    useEffect(() => {
        try {
            fetch(`${process.env.REACT_APP_API_URL}/jobs/all-jobs`).then((res) => res.json()).then((data) => setJobs(data))

            fetch(`${process.env.REACT_APP_API_URL}/users/all-users`).then((res) => res.json()).then((data) => {
                let recruiterData = data.filter((user) => user.role === 'recruiter');
                setRecruiters(recruiterData);

                fetch(`${process.env.REACT_APP_API_URL}/recruiter/all-recruiter`).then((res) => res.json()).then((assignedData) => {
                    const map = {};

                    assignedData.forEach((assignment) => {
                        const assignedUser = recruiterData.find((user) => user._id === assignment.recruiterID);
                        if (assignedUser) {
                            map[assignment.jobID] = assignedUser.userName;
                        }
                    });

                    setAssignedRecruitersByJob(map);
                });
            })

        } catch (error) {
            // console.log(error);
        }
    }, []);

    // useEffect(() => {
    //     setIsLoading(true);
    //     fetch("jobs.json").then(res => res.json()).then(
    //         data => setJobs(data)
    //     )
    //     setIsLoading(false);
    //     console.log(jobs);
    // }
    //     , []);

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
                                            <h3 className="font-bold text-base text-blueGray-700">Jobs Approval - Assign Recruiter</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="block w-full overflow-x-auto">
                                    <table className="items-center bg-transparent w-full border-collapse min-w-[900px]">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Job Title</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Type</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Location</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Applicants</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Assigned Recruiter</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Recruiters</th>
                                                <th className={tableHeaderCss}>Assign</th>
                                                <th className={tableHeaderCss}></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {jobs.map((job, key) => <RenderTableRows key={key} job={job} recruiters={recruiters} assignedRecruitersByJob={assignedRecruitersByJob}/>)}
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

function RenderTableRows({ job, recruiters, assignedRecruitersByJob }) {
    // console.log("called");
    // console.log(recruiters);

    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    return (

        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6 max-w-[180px] truncate`} title={job.jobTitle}>
                {job.jobTitle}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {job.employmentType}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {job.location}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {job?.applicants?.length || 0}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell max-w-[180px] truncate`} title={assignedRecruitersByJob[job._id] || 'Not assigned'}>
                {assignedRecruitersByJob[job._id] || 'Not assigned'}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                <div>
                {/* {...register("userType", { required: true })}  */}
                    <select className='max-w-[180px] w-full border rounded px-2 py-1'>
                        {recruiters.length === 0 && (
                            <option value=''>No recruiters found</option>
                        )}
                        {recruiters.map((recruiter, index) => (
                            <option key={index} value={recruiter._id}>
                                {recruiter.userName} {recruiter.isAssigned ? '(Assigned)' : '(Available)'}
                            </option>
                        ))}
                    </select>
                </div>
            </td>
            <td className={`flex justify-between ${tableDataCss}`}>
                <Link to={`/assign-recruiter/${job._id}`}>
                    <button className='block bg-primary text-white mx-auto text-md py-2  px-5 md:px-6 rounded-md'>Approve</button>
                </Link>
            </td>
        </tr>
    )
}