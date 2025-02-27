import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/Components/ui/table";
import { Link } from '@inertiajs/react';

// Helper function to format date manually
const formatDate = (dateString) => {
    if (!dateString) return '未提出';
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
};

export default function HomeworkIndex({ homework }) {
    return (
        <AuthenticatedLayout>
            <Head title="宿題一覧" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">宿題一覧</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {homework.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>生徒名</TableHead>
                                            <TableHead>提出日</TableHead>
                                            <TableHead>フィードバック</TableHead>
                                            <TableHead className="text-right">アクション</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {homework.map(hw => (
                                            <TableRow key={hw.id}>
                                                <TableCell className="font-medium">
                                                    {hw.student?.name}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(hw.homework_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {hw.feedback?.feedback_text ?? '未提出'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        asChild
                                                    >
                                                        <Link href={`/homework/${hw.id}`}>
                                                            詳細
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-lg">宿題はありません</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}