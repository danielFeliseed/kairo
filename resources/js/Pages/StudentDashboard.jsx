import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { CalendarDays, Camera, Book, Award, ArrowRight, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function StudentDashboard({ user, currentStreak, longestStreak, lastSubmission, currentStreakPercentage, latestHomework, latestFeedback }) {
    const hasTodaysHomework = false;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {user.name}のページ
                </h2>
            }
        >
            <Head title="生徒ダッシュボード" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Today's Homework Status */}
                    <Card className="mb-6 border-2 border-primary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">今日の宿題</CardTitle>
                            <CardDescription>
                                {format(new Date(), 'yyyy年MM月dd日 (EEEE)', { locale: ja })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasTodaysHomework ? (
                                <div className="text-center py-3">
                                    <div className="text-green-600 font-bold text-lg mb-2">✅ 今日の宿題は提出済みです！</div>
                                    <p className="text-sm text-gray-500">先生からのコメントをお待ちください</p>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <p className="text-lg mb-4">今日の英語日記をアップロードしてください</p>
                                    <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
                                        <Camera size={20} /> 写真をとる
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Streak Card */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Award size={20} /> 
                                <span>れんぞく記録</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-2">
                                <span>現在の記録：</span>
                                <span className="font-bold text-orange-500">{currentStreak}日</span>
                            </div>
                            <Progress value={currentStreakPercentage} className="h-2 mb-2" />
                            <div className="flex items-center justify-between text-sm">
                                <span>一番長い記録：</span>
                                <span className="font-semibold">{longestStreak}日</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Latest Feedback */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare size={20} />
                                <span>先生からのコメント</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestFeedback ? (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">
                                            {format(latestFeedback.created_at, 'MM月dd日', { locale: ja })}
                                        </span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-lg ${i < latestFeedback.rating ? "text-yellow-400" : "text-gray-300"}`}>
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{latestFeedback?.feedback_text}</p>
                                </div>
                            ) : (
                                <p className="text-center py-3 text-gray-500">まだコメントはありません</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" asChild>
                            <a href="/homework-history">
                                <Book size={24} />
                                <span>宿題の履歴</span>
                            </a>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-1" asChild>
                            <a href="/calendar">
                                <CalendarDays size={24} />
                                <span>カレンダー</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Profile switcher button fixed at bottom */}
            <div className="fixed bottom-4 right-4">
                <Button className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg" variant="secondary" asChild>
                    <a href="/family/profiles">
                        <ArrowRight size={24} />
                    </a>
                </Button>
            </div>
        </AuthenticatedLayout>
    );
}