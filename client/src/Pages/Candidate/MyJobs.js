import React, { useEffect, useState } from 'react'

export const MyJobs = () => {

    const tableHeaderCss = "px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
    
    const [applications, setApplications] = useState([]);
    const [loginData, setLoginData] = useState();
    
    useEffect(() => {
        let token = localStorage.getItem("user");
        const user = JSON.parse(token);
        const normalizedUser = Array.isArray(user) ? user[0] : user;
        setLoginData(normalizedUser)
    }, [])

    useEffect(() => {
        const loadApplications = async () => {
            if (!loginData?._id) {
                return;
            }

            try {
                const [userRes, jobsRes, applicationsRes] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/users/user/${loginData._id}`),
                    fetch(`${process.env.REACT_APP_API_URL}/jobs/all-jobs`),
                    fetch(`${process.env.REACT_APP_API_URL}/application/all-application/`)
                ]);

                const [userData, jobsData, applicationsData] = await Promise.all([
                    userRes.json(),
                    jobsRes.json(),
                    applicationsRes.json()
                ]);

                let normalizedApplications = (userData.applications || []).map((application) => {
                    const matchedJob = jobsData.find((job) => String(job._id) === String(application.jobId));

                    return {
                        jobTitle: matchedJob?.jobTitle || 'Job not found',
                        employmentType: matchedJob?.employmentType || '-',
                        location: matchedJob?.location || '-',
                        status: application.status || 'active'
                    };
                });

                if (normalizedApplications.length === 0) {
                    normalizedApplications = (applicationsData || [])
                        .filter((item) => String(item.candidateID) === String(loginData._id))
                        .map((item) => {
                            const matchedJob = jobsData.find((job) => String(job._id) === String(item.jobID));

                            return {
                                jobTitle: matchedJob?.jobTitle || 'Job not found',
                                employmentType: matchedJob?.employmentType || '-',
                                location: matchedJob?.location || '-',
                                status: item.applicationStatus || 'active'
                            };
                        });
                }

                setApplications(normalizedApplications);
            } catch (error) {
                // console.log(error);
            }
        };

        loadApplications();
    }, [loginData]);

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
                                            <h3 className="font-bold text-base text-blueGray-700">My Applications</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="block w-full overflow-x-hidden">
                                    <table className="items-center bg-transparent w-full border-collapse ">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Job Role</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Type</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Location</th>
                                                <th className={tableHeaderCss}>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {   applications.length > 0 ?
                                                applications.map((application, key) => <RenderTableRows key={key} application={application} />)
                                                :
                                                <tr>
                                                    <td className='p-4 text-center' colSpan={4}>No applications found</td>
                                                </tr>
                                            }
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

function RenderTableRows({application}){
    
    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    return (

        <tr>
            <th className= {`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {application.jobTitle}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.employmentType}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.location}
            </td>
            <td className={`${tableDataCss} font-bold hidden md:table-cell`}>
                {application.status}
            </td>
            
        </tr>
    )
}

