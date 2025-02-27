import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { BookOpen, ChevronLeft } from 'lucide-react';

export default function GuestLayout({ children, showBackLink = true }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Background decorations - more subtle than student pages */}
            <div className="fixed top-0 right-0 w-64 h-64 bg-blue-100 rounded-bl-full opacity-20"></div>
            <div className="fixed bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-tr-full opacity-20"></div>
            
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and App Name */}
                <div className="text-center mb-6">
                    <Link href="/">
                        <ApplicationLogo className="mx-auto h-16 w-16" />
                    </Link>
                    <h1 className="mt-3 text-3xl font-bold text-blue-700">NoBi</h1>
                    <p className="mt-1 text-blue-600">先生用ポータル</p>
                </div>
                
                {/* Main Content Card */}
                <div className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-blue-100 relative overflow-hidden">
                    {/* Subtle decorative accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                    
                    {/* Back to family login link */}
                    {showBackLink && (
                        <div className="">
                            <Link 
                                href={route('family.access')} 
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                家族ログイン
                            </Link>
                        </div>
                    )}
                    
                    {children}
                </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 text-center">
                <div className="flex items-center justify-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    <span>先生専用ページ</span>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    © {new Date().getFullYear()} NoBi - All rights reserved
                </p>
            </div>
        </div>
    );
}
