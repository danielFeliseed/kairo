import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function Homework({ homework }) {
    return (
        <AuthenticatedLayout>
            <Head title="宿題" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">宿題一覧</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {homework.length > 0 ? (
                                <ul>
                                    {homework.map(hw => (
                                        <li key={hw.id}>
                                            {hw.title} - {hw.dueDate}
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