import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function HomeworkShow({ homework }) {
    return (
        <AuthenticatedLayout>
            <Head title={homework.title} />
            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{homework.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{homework.description}</p>
                            <p>締切: {homework.dueDate}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 