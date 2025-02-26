import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function HomeworkHistory({ homework }) {
    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        宿題履歴
                    </h2>
                }
            >
                <div className="max-w-3xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-4">宿題履歴</h1>
                    <div className="space-y-4">
                        {homework.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {format(
                                            new Date(item.homework_date),
                                            "PPP p"
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Badge
                                        className={`${
                                            item.status === "Completed"
                                                ? "bg-green-500"
                                                : item.status === "Pending"
                                                ? "bg-yellow-500"
                                                : "bg-gray-500"
                                        } text-white px-3 py-1 rounded-full`}
                                    >
                                        {item.status}
                                    </Badge>
                                    {item.feedback && (
                                        <p className="mt-2 text-gray-600">
                                            {item.feedback.feedback_text}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
