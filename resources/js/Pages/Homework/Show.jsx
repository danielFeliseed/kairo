import React from 'react';
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
    ArrowLeft 
} from 'lucide-react';

// Helper function to format date manually
const formatDate = (dateString) => {
    if (!dateString) return '未提出';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export default function HomeworkShow({ homework }) {
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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <User className="mr-3 h-6 w-6 text-muted-foreground" />
                                {homework.student.name}の宿題
                            </CardTitle>
                            <Badge variant={homework.feedback ? "default" : "secondary"}>
                                {homework.feedback ? "フィードバック済" : "未フィードバック"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center mb-4">
                                        <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            提出日: {formatDate(homework.homework_date)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-start mb-4">
                                        <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <h3 className="text-sm font-medium mb-2">課題詳細</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {homework.description || '詳細情報はありません'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                                        <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                                        フィードバック
                                    </h3>
                                    <div className="bg-secondary/30 p-4 rounded-lg">
                                        {homework.feedback?.feedback_text ? (
                                            <p className="text-sm">{homework.feedback.feedback_text}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                まだフィードバックはありません
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}