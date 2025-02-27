import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight, Star, Calendar as CalendarIcon, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-calendar/dist/Calendar.css';

export default function HomeworkCalendar({ auth, submissionDates, currentStreak, longestStreak }) {
    const [value, setValue] = useState(new Date());
    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [streakInfo, setStreakInfo] = useState({
        currentStreak: currentStreak,
        longestStreak: longestStreak
    });

    // Parse the submission dates from strings to Date objects
    const parsedSubmissionDates = submissionDates.map(date => new Date(date));

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    const pulseAnimation = {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity }
    };

    useEffect(() => {
        // You could fetch streak info here if not passed as props
    }, []);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            // Check if the date has a homework submission
            const hasSubmission = parsedSubmissionDates.some(submissionDate => 
                isSameDay(submissionDate, date)
            );
            
            return hasSubmission ? 'submission-day' : null;
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasSubmission = parsedSubmissionDates.some(submissionDate => 
                isSameDay(submissionDate, date)
            );
            
            return hasSubmission ? (
                <div className="submission-indicator">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
            ) : null;
        }
    };

    const handleDateChange = (newDate) => {
        setValue(newDate);
        setSelectedDate(newDate);
    };

    const handleActiveStartDateChange = ({ activeStartDate }) => {
        setActiveStartDate(activeStartDate);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <motion.div animate={pulseAnimation}>
                        <CalendarIcon className="h-6 w-6 mr-2 text-blue-500" />
                    </motion.div>
                    <h2 className="text-xl font-semibold leading-tight text-blue-700">
                        べんきょうカレンダー
                    </h2>
                </motion.div>
            }
        >
            <Head title="べんきょうカレンダー" />

            <div className="py-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Calendar Card */}
                        <motion.div variants={item} className="md:col-span-2">
                            <Card className="border-2 border-blue-100 shadow-md overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        <span className="flex items-center">
                                            <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                                            {format(activeStartDate, 'yyyy年 M月', { locale: ja })}
                                        </span>
                                        <div className="flex space-x-2">
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="rounded-full h-8 w-8 p-0 border-blue-200"
                                                    onClick={() => {
                                                        const newDate = new Date(activeStartDate);
                                                        newDate.setMonth(newDate.getMonth() - 1);
                                                        setActiveStartDate(newDate);
                                                    }}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="rounded-full h-8 w-8 p-0 border-blue-200"
                                                    onClick={() => {
                                                        const newDate = new Date(activeStartDate);
                                                        newDate.setMonth(newDate.getMonth() + 1);
                                                        setActiveStartDate(newDate);
                                                    }}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="calendar-container"
                                    >
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={value}
                                            activeStartDate={activeStartDate}
                                            onActiveStartDateChange={handleActiveStartDateChange}
                                            tileClassName={tileClassName}
                                            tileContent={tileContent}
                                            locale="ja-JP"
                                            formatDay={(locale, date) => format(date, 'd')}
                                            formatShortWeekday={(locale, date) => ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}
                                            formatMonthYear={(locale, date) => format(date, 'yyyy年 M月', { locale: ja })}
                                            next2Label={null}
                                            prev2Label={null}
                                            nextLabel={<ChevronRight className="h-4 w-4" />}
                                            prevLabel={<ChevronLeft className="h-4 w-4" />}
                                            showNeighboringMonth={false}
                                            className="custom-calendar"
                                        />
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Stats and Selected Day Info */}
                        <motion.div variants={item} className="space-y-6">
                            {/* Streak Info Card */}
                            <motion.div 
                                whileHover={{ y: -3 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Card className="border-2 border-yellow-100 shadow-md">
                                    <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <motion.div animate={pulseAnimation}>
                                                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                            </motion.div>
                                            れんぞくきろく
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-4">
                                            <motion.div 
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-gray-600">いまのれんぞく：</span>
                                                <motion.span 
                                                    className="text-xl font-bold text-blue-600"
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.3, type: "spring" }}
                                                >
                                                    {streakInfo.currentStreak}にち
                                                </motion.span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="flex justify-between items-center"
                                            >
                                                <span className="text-gray-600">さいこうきろく：</span>
                                                <motion.span 
                                                    className="text-xl font-bold text-purple-600"
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.5, type: "spring" }}
                                                >
                                                    {streakInfo.longestStreak}にち
                                                </motion.span>
                                            </motion.div>
                                            <motion.div 
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                                className="mt-4 pt-4 border-t border-gray-100"
                                            >
                                                <div className="text-center">
                                                    {streakInfo.currentStreak > 5 && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ 
                                                                type: "spring", 
                                                                stiffness: 260, 
                                                                damping: 20, 
                                                                delay: 0.7 
                                                            }}
                                                            className="flex justify-center mb-2"
                                                        >
                                                            <Sparkles className="text-yellow-500 h-6 w-6" />
                                                        </motion.div>
                                                    )}
                                                    <motion.p 
                                                        className={`text-sm ${streakInfo.currentStreak > 0 ? "text-blue-600" : "text-gray-500"} font-medium`}
                                                        animate={streakInfo.currentStreak > 5 ? pulseAnimation : {}}
                                                    >
                                                        {streakInfo.currentStreak > 5 
                                                            ? "すごい！よくがんばってるね！" 
                                                            : streakInfo.currentStreak > 0 
                                                            ? "がんばってるね！" 
                                                            : "あしたからがんばろう！"}
                                                    </motion.p>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Selected Day Info */}
                            <motion.div 
                                whileHover={{ y: -3 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Card className="border-2 border-green-100 shadow-md">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 pb-2">
                                        <CardTitle className="text-lg flex items-center">
                                            <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                                            えらんだひ
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <AnimatePresence mode="wait">
                                            {selectedDate ? (
                                                <motion.div
                                                    key="selected"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ type: "spring" }}
                                                >
                                                    <motion.p 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="text-lg font-medium text-gray-700 mb-2"
                                                    >
                                                        {format(selectedDate, 'yyyy年MM月dd日 (EEEE)', { locale: ja })}
                                                    </motion.p>
                                                    
                                                    {parsedSubmissionDates.some(date => isSameDay(date, selectedDate)) ? (
                                                        <motion.div 
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 0.2, type: "spring" }}
                                                            className="bg-green-50 p-4 rounded-lg border border-green-200"
                                                        >
                                                            <div className="flex items-center">
                                                                <motion.div
                                                                    initial={{ rotate: -180, opacity: 0 }}
                                                                    animate={{ rotate: 0, opacity: 1 }}
                                                                    transition={{ delay: 0.3, type: "spring" }}
                                                                >
                                                                    <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                                                                </motion.div>
                                                                <motion.span 
                                                                    initial={{ x: 20, opacity: 0 }}
                                                                    animate={{ x: 0, opacity: 1 }}
                                                                    transition={{ delay: 0.4 }}
                                                                    className="text-green-700 font-medium text-lg"
                                                                >
                                                                    このひはべんきょうしたよ！
                                                                </motion.span>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ scale: 0.9, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            transition={{ delay: 0.2 }}
                                                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                                        >
                                                            <p className="text-gray-500 text-center">
                                                                このひはべんきょうしてないよ
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="min-h-[120px] flex items-center justify-center"
                                                >
                                                    <motion.p 
                                                        animate={pulseAnimation}
                                                        className="text-gray-500 text-center py-4"
                                                    >
                                                        カレンダーからひをえらんでね
                                                    </motion.p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <style jsx global>{`
                .custom-calendar {
                    width: 100%;
                    border: none;
                    font-family: sans-serif;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                }
                
                .custom-calendar .react-calendar__tile {
                    padding: 1em 0.5em;
                    position: relative;
                    height: 65px;
                    transition: all 0.2s ease;
                }
                
                .custom-calendar .react-calendar__month-view__weekdays__weekday {
                    padding: 0.8em 0.5em;
                    background-color: #f0f9ff;
                    color: #3b82f6;
                    font-weight: bold;
                    text-decoration: none;
                    text-transform: none;
                    font-size: 0.9em;
                    text-align: center;
                }
                
                .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none;
                }
                
                .custom-calendar .react-calendar__tile--active {
                    background: #dbeafe;
                    color: #1e40af;
                    box-shadow: inset 0 0 0 2px #93c5fd;
                    font-weight: bold;
                    transition: all 0.2s ease;
                }
                
                .custom-calendar .react-calendar__tile--now {
                    background: #eff6ff;
                    font-weight: bold;
                }
                
                .custom-calendar .react-calendar__tile:enabled:hover,
                .custom-calendar .react-calendar__tile:enabled:focus {
                    background-color: #bfdbfe;
                    transition: all 0.2s ease;
                    transform: scale(1.02);
                    z-index: 2;
                }
                
                .custom-calendar .submission-day {
                    background-color: #d1fae5;
                    color: #065f46;
                    transition: all 0.2s ease;
                }
                
                .submission-indicator {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    transition: all 0.2s ease;
                }
                
                .custom-calendar .react-calendar__navigation {
                    display: none;
                }
                
                .custom-calendar .react-calendar__tile--hasActive {
                    background: #dbeafe;
                }
                
                .custom-calendar .react-calendar__month-view__days__day--weekend {
                    color: #ef4444;
                }
                
                .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
                    color: #9ca3af;
                }
                
                .custom-calendar .react-calendar__tile:disabled {
                    background-color: #f9fafb;
                    color: #d1d5db;
                }
                
                .custom-calendar .submission-day:hover {
                    background-color: #a7f3d0;
                }
                
                .custom-calendar .react-calendar__tile--now.submission-day {
                    background: linear-gradient(135deg, #d1fae5 50%, #eff6ff 50%);
                }
                
                .custom-calendar .react-calendar__tile--active.submission-day {
                    background: linear-gradient(135deg, #d1fae5 50%, #dbeafe 50%);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
