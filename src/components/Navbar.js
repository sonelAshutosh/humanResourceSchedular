import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import LogoutIcon from '@/svg/LogoutIcon'

function Navbar(props) {
  const { pathname } = useRouter() // Get the pathname from useRouter hook

  // Define your left navbar list items
  var navbarListItems = [
    { id: 1, link: 'My Schedules', path: '/admin/mySchedules' }, // Add path property for each item
    { id: 2, link: 'Tasks', path: '/admin/tasks' },
    { id: 3, link: 'Venues', path: '/admin/venues' },
    { id: 4, link: 'Human R.', path: '/admin/humanResource' },
    { id: 5, link: 'Analytics', path: '/admin/analytics' },
    { id: 6, link: 'Export', path: '/admin/export' },
  ]
  const [activeIndex, setActiveIndex] = useState(null)

  const handleLinkState = (index) => {
    setActiveIndex(index)
  }

  return (
    <>
      <div className="w-full flex items-center shadow-md text-primaryDark bg-secondary rounded-3xl">
        <div className="font-extrabold mx-12 tracking-widest hover:scale-110 transition-all cursor-pointer">
          HRS
        </div>
        <ul className="flex">
          {navbarListItems.map((item) => {
            return (
              <Link href={item.path} key={item.id}>
                <li
                  className={`font-medium p-4 hover:text-primary ${
                    pathname === item.path
                      ? 'border-b-4 border-primaryDark hover:border-primary'
                      : ''
                  }`}
                  onClick={() => handleLinkState(item.id)}
                >
                  {item.link}
                </li>
              </Link>
            )
          })}
        </ul>
        <div className="m-auto mr-12 cursor-pointer hover:text-primary hover:scale-110 transition-all">
          <LogoutIcon />
        </div>
      </div>
    </>
  )
}
export default Navbar
