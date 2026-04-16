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
        <footer className="mt-12 border-t border-gray-200 bg-white/90 shadow-sm">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 md:py-10 lg:px-10 xl:px-16 2xl:px-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logoURL} className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14" alt="HireFlow logo" />
                        <span className="self-center text-xl font-semibold sm:text-2xl">HireFlow™</span>
                    </Link>
                    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-500 sm:justify-end sm:text-base">
                        
                        {
                            footerNav.map( (menu, key)=> {
                                return (
                                    <li key={key}>
                                        <Link to={menu.path} className="transition hover:text-primary hover:underline">{menu.label}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <span className="block text-sm text-gray-500 sm:text-center">© 2024 <Link to="/" className="hover:text-primary hover:underline">HireFlow™</Link>. All Rights Reserved.</span>
            </div>
        </footer>

    )
}
