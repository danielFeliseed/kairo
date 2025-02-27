import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { ChevronLeft, ChevronRight, Star, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
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
                <h2 className="text-xl font-semibold leading-tight text-blue-700 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    べんきょうカレンダー
                </h2>
            }
        >
            <Head title="べんきょうカレンダー" />

            <div className="py-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Calendar Card */}
                        <Card className="md:col-span-2 border-2 border-blue-100 shadow-md overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span className="flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                                        {format(activeStartDate, 'yyyy年 M月', { locale: ja })}
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="rounded-full h-8 w-8 p-0"
                                            onClick={() => {
                                                const newDate = new Date(activeStartDate);
                                                newDate.setMonth(newDate.getMonth() - 1);
                                                setActiveStartDate(newDate);
                                            }}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="rounded-full h-8 w-8 p-0"
                                            onClick={() => {
                                                const newDate = new Date(activeStartDate);
                                                newDate.setMonth(newDate.getMonth() + 1);
                                                setActiveStartDate(newDate);
                                            }}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="calendar-container">
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
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats and Selected Day Info */}
                        <div className="space-y-6">
                            {/* Streak Info Card */}
                            <Card className="border-2 border-yellow-100 shadow-md">
                                <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 pb-2">
                                    <CardTitle className="text-lg flex items-center">
                                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                        れんぞくきろく
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">いまのれんぞく：</span>
                                            <span className="text-xl font-bold text-blue-600">{streakInfo.currentStreak}にち</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">さいこうきろく：</span>
                                            <span className="text-xl font-bold text-purple-600">{streakInfo.longestStreak}にち</span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="text-center">
                                                <p className="text-sm text-blue-600 font-medium">
                                                    {streakInfo.currentStreak > 0 
                                                        ? "すごい！がんばってるね！" 
                                                        : "あしたからがんばろう！"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selected Day Info */}
                            <Card className="border-2 border-green-100 shadow-md">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 pb-2">
                                    <CardTitle className="text-lg flex items-center">
                                        <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
                                        えらんだひ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {selectedDate ? (
                                        <div>
                                            <p className="text-lg font-medium text-gray-700 mb-2">
                                                {format(selectedDate, 'yyyy年MM月dd日 (EEEE)', { locale: ja })}
                                            </p>
                                            
                                            {parsedSubmissionDates.some(date => isSameDay(date, selectedDate)) ? (
                                                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                                    <div className="flex items-center">
                                                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                                                        <span className="text-green-700 font-medium">
                                                            このひはべんきょうしたよ！
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <p className="text-gray-500 text-center">
                                                        このひはべんきょうしてないよ
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            カレンダーからひをえらんでね
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-calendar {
                    width: 100%;
                    border: none;
                    font-family: sans-serif;
                }
                
                .custom-calendar .react-calendar__tile {
                    padding: 1em 0.5em;
                    position: relative;
                    height: 60px;
                }
                
                .custom-calendar .react-calendar__month-view__weekdays__weekday {
                    padding: 0.5em;
                    background-color: #f0f9ff;
                    color: #3b82f6;
                    font-weight: bold;
                    text-decoration: none;
                    text-transform: none;
                    font-size: 0.9em;
                }
                
                .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
                    text-decoration: none;
                }
                
                .custom-calendar .react-calendar__tile--active {
                    background: #dbeafe;
                    color: #1e40af;
                }
                
                .custom-calendar .react-calendar__tile--now {
                    background: #eff6ff;
                }
                
                .custom-calendar .react-calendar__tile:enabled:hover,
                .custom-calendar .react-calendar__tile:enabled:focus {
                    background-color: #bfdbfe;
                }
                
                .custom-calendar .submission-day {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                
                .submission-indicator {
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
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
            `}</style>
        </AuthenticatedLayout>
    );
}
