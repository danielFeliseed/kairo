import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Home, 
    Book, 
    Calendar, 
    User, 
    LogOut, 
    Menu, 
    X, 
    Award, 
    MessageSquare,
    Sun,
    Moon
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [notification, setNotification] = useState(flash?.message || null);
    
    useEffect(() => {
        if (flash?.message) {
            setNotification(flash.message);
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const isStudent = user.role === 'student';
    const isTeacher = user.role === 'teacher';
    
    // Generate avatar background color from user's profile_color
    const avatarStyle = {
        backgroundColor: user.profile_color || '#3B82F6',
    };
    
    // Get first letter of name for avatar
    const avatarText = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 max-w-sm bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">おしらせ</p>
                            <p className="text-sm">{notification}</p>
                        </div>
                    </div>
                </div>
            )}

            <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 shadow-sm`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('dashboard')} className="flex items-center">
                                    <ApplicationLogo className={`block h-9 w-auto ${darkMode ? 'fill-white' : 'fill-blue-600'}`} />
                                    <span className={`ml-2 text-lg font-bold ${darkMode ? 'text-white' : 'text-blue-600'} hidden sm:block`}>
                                        NoBi
                                    </span>
                                </Link>
                            </div>

                            <div className="hidden space-x-2 sm:ml-6 sm:flex">
                                {isStudent && (
                                    <>
                                        <NavLink 
                                            href={route('dashboard')} 
                                            active={route().current('dashboard')}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
                                        >
                                            <Home className="w-4 h-4 mr-2" />
                                            ホーム
                                        </NavLink>
                                        <NavLink 
                                            href={route('homework.history')} 
                                            active={route().current('homework.history')}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
                                        >
                                            <Book className="w-4 h-4 mr-2" />
                                            べんきょうのきろく
                                        </NavLink>
                                    </>
                                )}

                                {isTeacher && (
                                    <>
                                        <NavLink 
                                            href={route('dashboard')} 
                                            active={route().current('dashboard')}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
                                        >
                                            <Home className="w-4 h-4 mr-2" />
                                            ダッシュボード
                                        </NavLink>
                                        <NavLink 
                                            href={route('homework.index')} 
                                            active={route().current('homework.index')}
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
                                        >
                                            <Book className="w-4 h-4 mr-2" />
                                            宿題一覧
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} transition-colors`}
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {/* User dropdown */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button 
                                            className="flex items-center text-sm focus:outline-none transition duration-150 ease-in-out"
                                        >
                                            <div 
                                                className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium" 
                                                style={avatarStyle}
                                            >
                                                {avatarText}
                                            </div>
                                            <div className={`ml-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                                <span className="text-sm font-medium">{user.name}</span>
                                                <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {user.role === 'student' ? 'がくせい' : 'せんせい'}
                                                </span>
                                            </div>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content 
                                        contentClasses={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-md shadow-lg py-1`}
                                        width="48"
                                    >
                                        <Dropdown.Link 
                                            href={route('profile.edit')}
                                            className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            プロフィール
                                        </Dropdown.Link>
                                        
                                        {isStudent && (
                                            <Dropdown.Link 
                                                href="/family/profiles"
                                                className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                            >
                                                <Award className="mr-2 h-4 w-4" />
                                                きょうだいにかえる
                                            </Dropdown.Link>
                                        )}
                                        
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className={`w-full text-left flex items-center px-4 py-2 text-sm ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            ログアウト
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                {showingNavigationDropdown ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} sm:hidden`}>
                    <div className={`space-y-1 pb-3 pt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {isStudent && (
                            <>
                                <ResponsiveNavLink 
                                    href={route('dashboard')} 
                                    active={route().current('dashboard')}
                                    className="flex items-center"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    ホーム
                                </ResponsiveNavLink>
                                <ResponsiveNavLink 
                                    href={route('homework.history')} 
                                    active={route().current('homework.history')}
                                    className="flex items-center"
                                >
                                    <Book className="w-4 h-4 mr-2" />
                                    べんきょうのきろく
                                </ResponsiveNavLink>
                            </>
                        )}

                        {isTeacher && (
                            <>
                                <ResponsiveNavLink 
                                    href={route('dashboard')} 
                                    active={route().current('dashboard')}
                                    className="flex items-center"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    ダッシュボード
                                </ResponsiveNavLink>
                                <ResponsiveNavLink 
                                    href={route('homework.index')} 
                                    active={route().current('homework.index')}
                                    className="flex items-center"
                                >
                                    <Book className="w-4 h-4 mr-2" />
                                    宿題一覧
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pb-3 pt-4`}>
                        <div className="flex items-center px-4">
                            <div 
                                className="h-10 w-10 rounded-full flex items-center justify-center text-white font-medium" 
                                style={avatarStyle}
                            >
                                {avatarText}
                            </div>
                            <div className="ml-3">
                                <div className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {user.name}
                                </div>
                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {user.email}
                                </div>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`ml-auto p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink 
                                href={route('profile.edit')}
                                className="flex items-center"
                            >
                                <User className="mr-2 h-4 w-4" />
                                プロフィール
                            </ResponsiveNavLink>
                            
                            {isStudent && (
                                <ResponsiveNavLink 
                                    href="/family/profiles"
                                    className="flex items-center"
                                >
                                    <Award className="mr-2 h-4 w-4" />
                                    きょうだいにかえる
                                </ResponsiveNavLink>
                            )}
                            
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="flex items-center w-full text-left"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                ログアウト
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* {header && (
                <header className={`${darkMode ? 'bg-gray-800 shadow-gray-900/10' : 'bg-white shadow'}`}>
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className={darkMode ? 'text-white' : ''}>
                            {header}
                        </div>
                    </div>
                </header>
            )} */}

            <main className={`${darkMode ? 'text-white' : ''}`}>
                {children}
            </main>
            
            {/* Footer */}
            <footer className={`mt-auto py-6 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <ApplicationLogo className={`h-8 w-8 ${darkMode ? 'fill-white' : 'fill-blue-600'}`} />
                            <span className="ml-2 text-sm font-semibold">NoBi © {new Date().getFullYear()}</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-sm hover:underline">ヘルプ</a>
                            <a href="#" className="text-sm hover:underline">プライバシー</a>
                            <a href="#" className="text-sm hover:underline">利用規約</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
