'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center justify-center mr-8">
                    <Image
                        src="/logo1.png"
                        alt="Logo"
                        width={140}
                        height={60}
                        style={{ width: 'auto', height: 'auto', maxHeight: '60px' }}
                        priority
                    />
                </Link>


                {/* Center: Navigation Links */}
                <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
                    <Link href="/" className="text-xs lg:text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
                        Home
                    </Link>
                    <Link href="/styles" className="text-xs lg:text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
                        Styles
                    </Link>
                    <Link href="/gallery" className="text-xs lg:text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
                        Gallery
                    </Link>
                    <Link href="/process" className="text-xs lg:text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
                        Process
                    </Link>
                    {/* 'My Account' in reference is usually a link, but we also have Login. I'll stick to essential navs. */}
                    <Link href="/contact" className="text-xs lg:text-sm font-medium uppercase tracking-widest hover:text-gray-500 transition-colors">
                        Contact
                    </Link>
                </div>

                {/* Right: Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    {/* The "pink button" from reference - adapted to Order Now */}
                    <Link
                        href="/welcome-to-bondsnbeyond"
                        className="hidden lg:flex items-center px-4 py-2 bg-rose-500 text-white text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors rounded-sm"
                    >
                        <span className="mr-2">&larr;</span> Start Your Portrait
                    </Link>

                    {/* Login Link with Icon */}
                    <Link href="/login" className="flex items-center text-xs uppercase tracking-widest hover:text-gray-500 transition-colors font-medium">
                        <PersonOutlineIcon className="w-5 h-5 mr-1" />
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button (Hamburger) - Basic implementation */}
                <div className="md:hidden">
                    <button className="text-gray-900 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>

            </div>
        </nav>
    );
}
