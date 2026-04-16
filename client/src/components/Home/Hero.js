import React from 'react'
import { Link } from 'react-router-dom'
import { OurCompanies } from './OurCompanies'

export const Hero = () => {
  const heroImage = require('../../assets/img/banner_1.png')

  return (
    <div className='mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8 xl:px-16 2xl:px-24'>
      <section className='relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 via-white to-teal-100 px-6 py-10 shadow-sm sm:px-8 md:px-12 md:py-16 lg:px-14 lg:py-20'>
        <div className='absolute -left-12 bottom-0 h-36 w-36 rounded-full bg-primary/5 blur-3xl'></div>
        <div className='absolute -right-16 top-8 h-48 w-48 rounded-full bg-secondary/10 blur-3xl'></div>

        <div className='relative grid items-center gap-10 md:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14'>
          <div className='max-w-2xl'>
            <span className='inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary shadow-sm'>
              Smart hiring, faster matches
            </span>
            <h1 className='mt-5 text-4xl font-bold leading-tight text-primary sm:text-5xl lg:text-[4.2rem]'>
              Find the right job without fighting the platform.
            </h1>
            <p className='mt-4 max-w-xl text-base leading-7 text-gray-700 sm:text-lg'>
              Browse open roles, review requirements clearly, and move from search to application on a layout that works properly on mobile.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link to='/all-posted-jobs' className='inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#065f47]'>
                Explore Jobs
              </Link>
              <Link to='/post-job' className='inline-flex items-center justify-center rounded-lg border border-primary/15 bg-white px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white'>
                Post a Job
              </Link>
            </div>
          </div>

          <div className='relative hidden md:flex justify-center lg:justify-end'>
            <div className='w-full max-w-md rounded-[2rem] bg-white/80 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur lg:max-w-xl'>
              <img src={heroImage} alt='Job portal hero' className='w-full rounded-[1.5rem] object-cover' />
            </div>
          </div>
        </div>
      </section>

      <OurCompanies />
    </div>
  )
}
