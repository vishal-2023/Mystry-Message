'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth';


const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user;

    return (
        <nav className='p-3 md:p-6 shadow-md '>
            <div className=' container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a className=' text-xl text-gray-800  font-bold mb-4 md:mb-0' href='/' >Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className=' mr-4  '> Welcome,  {user.username || user.email} </span>
                            <button className=' w-full md:w-auto text-gray-800 bg-yellow-400 text-gray-800 py-2 px-6 rounded-full px-4  transform hover:scale-105 transition duration-300 hover:bg-yellow-500 text-white'  onClick={() => signOut()}> Logout </button>
                        </>
                    ) : (
                        <Link className='text-gray-800 bg-yellow-400 text-gray-800 py-2 px-6 rounded-full px-4  transform hover:scale-105 transition duration-300 hover:bg-yellow-500 ' href='/sign-in'>
                            <button className=' w-full md:w-auto'>
                                Sign In
                            </button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar