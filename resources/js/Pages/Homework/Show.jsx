import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Link } from '@inertiajs/react';
import { 
    FileText, 
    Calendar, 
    User, 
    ArrowLeft,
    Star,
    Maximize,
    X
} from 'lucide-react';

// Helper function to format date manually
const formatDate = (dateString) => {
    if (!dateString) return '未提出';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export default function HomeworkShow({ homework, imageUrl }) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    console.log(imageUrl);
    return (
        <AuthenticatedLayout>
            <Head title={`${homework.student.name}の宿題`} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/homework" className="flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                宿題一覧に戻る
                            </Link>
                        </Button>
                    </div>

                    {/* Image Fullscreen View */}
                    {isFullscreen && imageUrl && (
                        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-4 right-4 text-white" 
                                onClick={() => setIsFullscreen(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                            <img 
                                src={imageUrl} 
                                alt="Homework" 
                                className="max-h-screen max-w-full object-contain" 
                            />
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Image Card */}
                        <Card className="overflow-hidden">
                            <CardHeader className="bg-muted pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    日記の写真
                                </CardTitle>
                            </CardHeader>
                            <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center">
                                {imageUrl ? (
                                    <>
                                        <img 
                                            src={imageUrl} 
                                            alt="Homework" 
                                            className="w-full h-full object-contain" 
                                        />
                                        <Button 
                                            variant="secondary" 
                                            size="icon"
                                            className="absolute bottom-3 right-3 bg-white/70 hover:bg-white/90 shadow-md"
                                            onClick={() => setIsFullscreen(true)}
                                        >
                                            <Maximize className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                        <p>写真がありません</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Details Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xl font-bold flex items-center">
                                    <User className="mr-3 h-5 w-5 text-muted-foreground" />
                                    {homework.student.name}の宿題
                                </CardTitle>
                                <Badge variant={homework.feedback ? "default" : "secondary"}>
                                    {homework.feedback ? "フィードバック済" : "未フィードバック"}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-center">
                                        <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            提出日: {formatDate(homework.homework_date)}
                                        </span>
                                    </div>
                                    
                                    {homework.description && (
                                        <div className="flex items-start">
                                            <FileText className="mr-3 h-5 w-5 text-muted-foreground shrink-0" />
                                            <div>
                                                <h3 className="text-sm font-medium mb-2">課題詳細</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {homework.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4 border-t">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                            <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                                            フィードバック
                                        </h3>
                                        
                                        {homework.feedback ? (
                                            <div className="space-y-3">
                                                {homework.feedback.rating && (
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                className={`w-5 h-5 ${i < homework.feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="bg-secondary/30 p-4 rounded-lg">
                                                    <p>{homework.feedback.feedback_text}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-secondary/30 p-4 rounded-lg">
                                                <p className="text-sm text-muted-foreground italic">
                                                    まだフィードバックはありません
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}