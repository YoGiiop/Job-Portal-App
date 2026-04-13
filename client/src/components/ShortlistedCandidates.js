import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const ShortlistedCandidates = () => {

    const tableHeaderCss = "px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
    
    const [shortlistedRows, setShortlistedRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [applicationsRes, usersRes, jobsRes] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/application/all-application/`),
                    fetch(`${process.env.REACT_APP_API_URL}/users/all-users/`),
                    fetch(`${process.env.REACT_APP_API_URL}/jobs/all-jobs/`)
                ]);

                const [applications, users, jobs] = await Promise.all([
                    applicationsRes.json(),
                    usersRes.json(),
                    jobsRes.json()
                ]);

                const shortlistedApplications = applications.filter((item) => item.applicationStatus === 'shortlist');
                const rows = shortlistedApplications
                    .map((application) => {
                        const candidate = users.find((user) => user._id === application.candidateID);
                        const job = jobs.find((item) => item._id === application.jobID);

                        if (!candidate || !job) {
                            return null;
                        }

                        return {
                            candidate,
                            job,
                            application
                        };
                    })
                    .filter(Boolean);

                setShortlistedRows(rows);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

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
                                            <h3 className="font-bold text-base text-blueGray-700">Shortlisted Candidates</h3>
                                        </div>

                                    </div>
                                </div>

                                <div className="block w-full overflow-x-hidden">
                                    <table className="items-center bg-transparent w-full border-collapse ">
                                        <thead>
                                            <tr>
                                                <th className={tableHeaderCss}>Candidate</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Email</th>
                                                <th className={`${tableHeaderCss} hidden md:table-cell`}>Verdict</th>
                                                <th className={tableHeaderCss}></th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {shortlistedRows.length > 0 ?
                                             shortlistedRows.map((row, key) => <RenderTableRows key={key} row={row} />)
                                                :
                                                <tr><td colSpan={4} className='p-4 text-center'>No shortlisted candidates found</td></tr>
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

function RenderTableRows({ row }){
    const { candidate, job } = row;
    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
    return (
        
        candidate && 
        <tr>
            <th className= {`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {candidate.userName}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {candidate.userEmail}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                Shortlisted
            </td>
            <td className={`flex justify-between ${tableDataCss}`}>
                <Link to={`/shortlist/details/${candidate._id}/${job._id}`}>
                    <button className='block bg-primary text-white mx-auto text-md py-2  px-2 md:px-6 rounded-md'>Details</button>
                </Link>
            </td>
        </tr>
    )
}