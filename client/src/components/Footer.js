import React from 'react'
import { Link } from 'react-router-dom'
import logoURL from '../assets/img/logo.jpeg'

export const Footer = () => {

    const footerNav = [
        { label: "Jobs", path: "/all-posted-jobs" },
        { label: "Login", path: "/login" },
        { label: "Signup", path: "/signup" },
        { label: "Post Job", path: "/post-job" }
    ]

    return (
        <footer className="bg-white rounded-lg shadow m-4">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src={logoURL} className="rounded-full h-16" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap ">HireFlow™</span>
                    </Link>
                    <ul className="flex flex-wrap justify-center items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
                        
                        {
                            footerNav.map( (menu, key)=> {
                                return (
                                    <li key={key}>
                                        <Link to={menu.path} className="hover:underline me-4 md:me-6">{menu.label}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center ">© 2024 <Link to="/" className="hover:underline">HireFlow™</Link>. All Rights Reserved.</span>
            </div>
        </footer>

    )
}
