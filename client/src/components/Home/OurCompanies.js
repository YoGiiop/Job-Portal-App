import React from 'react'


export const OurCompanies = () => {
  const companyLogos = [
    {
      id: 1,
      logo: "https://companieslogo.com/img/orig/TCS.NS-7401f1bd.png",
    },
    {
      id: 2,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1280px-Infosys_logo.svg.png",
    },
    {
      id: 3,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/1200px-Wipro_Primary_Logo_Color_RGB.svg.png",
    },
    {
      id: 4,
      logo: "https://static.vecteezy.com/system/resources/thumbnails/013/760/485/small_2x/abstract-connection-logo-illustration-in-trendy-and-minimal-style-png.png",
    },
    {
      id: 5,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Switch_%28technology_company%29_logo.svg/1200px-Switch_%28technology_company%29_logo.svg.png",
    },
    {
      id: 6,
      logo: "https://companieslogo.com/img/orig/CTSH-82a8444b.png?t=1652276339",
    },
  ]

  return (
    <div className="mt-12 md:mt-16 lg:mt-20">
      <h1 className='my-6 text-center text-xl font-bold text-primary md:my-10 md:text-2xl lg:text-3xl'>Our Trusted Partners</h1>
            

      <ul className="grid grid-cols-2 items-center justify-items-center gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {companyLogos.map((obj) => (
          <li
            className="w-full"
            key={obj.id}
          >
            <div className="flex min-h-[88px] items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
              <img
                src={obj.logo}
                width={70}
                height={10}
                alt="Company logo"
                className="h-10 w-auto object-contain transition duration-300 ease-in-out hover:scale-105"
              />
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};
