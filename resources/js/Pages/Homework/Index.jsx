import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function HomeworkIndex({ homework }) {
    return (
        <AuthenticatedLayout>
            <Head title="宿題一覧" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">宿題一覧</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {homework.length > 0 ? (
                                <ul className="space-y-4">
                                    {homework.map(hw => (
                                        <li key={hw.id} className="flex justify-between items-center border-b pb-2">
                                            <span>{hw.title}</span>
                                            <Button variant="ghost" size="sm" asChild>
                                                <a href={`/homework/${hw.id}`}>詳細</a>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-4 text-gray-500">宿題はありません</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 