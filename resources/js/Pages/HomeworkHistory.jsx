import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Trash2, X, Maximize, FileText, MessageSquare, Calendar, Star, CheckCircle } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Head } from "@inertiajs/react";

export default function HomeworkHistory({ auth, homework }) {
    const { delete: destroy } = useForm();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleDelete = (id) => {
        if (confirm("この宿題を削除しますか？")) {
            destroy(route("homework.destroy", id));
        }
    };

    const openFullscreen = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsFullscreen(true);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-700 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    べんきょうのきろく
                </h2>
            }
        >
            <Head title="べんきょうのきろく" />

            <div className="py-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Banner */}
                    <div className="mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-4 border-2 border-indigo-200 shadow-sm">
                        <div className="flex items-center">
                            <Star className="h-8 w-8 text-yellow-500 mr-3" />
                            <div>
                                <h1 className="text-xl font-bold text-indigo-700">
                                    べんきょうのきろく
                                </h1>
                                <p className="text-indigo-600">
                                    これまでにがんばったべんきょうがぜんぶみれるよ！
                                </p>
                            </div>
                        </div>
                    </div>

                    {homework.length > 0 ? (
                        <div className="space-y-6">
                            {homework.map((item) => (
                                <Card 
                                    key={item.id} 
                                    className="overflow-hidden border-2 border-blue-100 shadow-md transition-all hover:shadow-lg"
                                >
                                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                                                <CardTitle className="text-lg text-blue-700">
                                                    {format(
                                                        new Date(item.homework_date),
                                                        "yyyy年MM月dd日 (EEEE)",
                                                        { locale: ja }
                                                    )}
                                                </CardTitle>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="mt-2">
                                            <Badge
                                                className={`${
                                                    item.status === "Completed"
                                                        ? "bg-green-100 text-green-700 border border-green-300"
                                                        : item.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                                        : "bg-gray-100 text-gray-700 border border-gray-300"
                                                } px-3 py-1 rounded-full text-sm font-medium`}
                                            >
                                                {item.status === "Completed" ? (
                                                    <span className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        おわった！
                                                    </span>
                                                ) : item.status === "Pending" ? (
                                                    "まだだよ"
                                                ) : (
                                                    item.status
                                                )}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="p-4">
                                        <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                                            {item.imageUrl ? (
                                                <div className="relative">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt="べんきょうのきろく" 
                                                        className="w-full object-contain max-h-[300px]" 
                                                    />
                                                    <Button 
                                                        variant="secondary" 
                                                        size="sm"
                                                        className="absolute bottom-3 right-3 bg-white/70 hover:bg-white/90 shadow-md rounded-full"
                                                        onClick={() => openFullscreen(item.imageUrl)}
                                                    >
                                                        <Maximize className="h-4 w-4 mr-1" />
                                                        大きく見る
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-400">
                                                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                    <p>写真がありません</p>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {item.feedback && (
                                            <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                <div className="flex items-start">
                                                    <MessageSquare className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-yellow-700 mb-1">先生からのメッセージ</h4>
                                                        <p className="text-gray-700">
                                                            {item.feedback.feedback_text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-blue-100 shadow-sm">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-blue-200" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">まだべんきょうのきろくがないよ</h3>
                            <p className="text-gray-500 mb-6">はじめての宿題をだしてみよう！</p>
                            <Button 
                                onClick={() => window.location.href = route('dashboard')}
                                className="bg-blue-500 hover:bg-blue-600"
                            >
                                ホームにもどる
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Fullscreen View */}
            {isFullscreen && selectedImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4 text-white hover:bg-white/20" 
                        onClick={() => setIsFullscreen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                    <img 
                        src={selectedImage} 
                        alt="べんきょうのきろく" 
                        className="max-h-[90vh] max-w-[90vw] object-contain" 
                    />
                </div>
            )}
        </AuthenticatedLayout>
    );
}
