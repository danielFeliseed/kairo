import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { Trash2, X, Maximize, FileText, CheckCircle, Clock, Star } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export default function HomeworkHistory({ homework }) {
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

    const getStatusIcon = (status) => {
        switch(status) {
            case "Completed": return <CheckCircle className="h-4 w-4 mr-1" />;
            case "Pending": return <Clock className="h-4 w-4 mr-1" />;
            default: return <Star className="h-4 w-4 mr-1" />;
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case "Completed": return "おわった！";
            case "Pending": return "まだだよ";
            default: return status;
        }
    };

    return (
        <>
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        おうちでやる勉強のきろく
                    </h2>
                }
            >
                <div className="max-w-3xl mx-auto p-4 sm:p-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 border-2 border-blue-200">
                        <h1 className="text-2xl font-bold text-blue-700 mb-2 flex items-center">
                            <Star className="h-6 w-6 mr-2 text-yellow-500" />
                            おうちでやった勉強のきろく
                        </h1>
                        <p className="text-blue-600">ここでは、おうちでやった勉強がぜんぶ見られるよ！</p>
                    </div>

                    {homework.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg text-gray-500">まだ勉強のきろくがないよ</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {homework.map((item) => (
                                <Card key={item.id} className="overflow-hidden border-2 hover:shadow-lg transition-shadow duration-200">
                                    <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 pb-2">
                                        <CardTitle className="text-lg font-bold text-blue-700">
                                            {format(
                                                new Date(item.homework_date),
                                                "M月d日（EEEE）HH:mm",
                                                { locale: ja }
                                            )}
                                        </CardTitle>
                                        <Button 
                                            variant="outline" 
                                            size="icon" 
                                            onClick={() => handleDelete(item.id)}
                                            className="h-8 w-8 rounded-full bg-white hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <Badge
                                            className={`${
                                                item.status === "Completed"
                                                    ? "bg-green-500"
                                                    : item.status === "Pending"
                                                    ? "bg-amber-500"
                                                    : "bg-gray-500"
                                            } text-white px-3 py-1 rounded-full mb-4 flex items-center w-fit text-sm`}
                                        >
                                            {getStatusIcon(item.status)}
                                            {getStatusText(item.status)}
                                        </Badge>
                                        
                                        <div className="relative mt-2 rounded-lg overflow-hidden border bg-gray-50">
                                            {item.imageUrl ? (
                                                <div className="relative">
                                                    <img 
                                                        src={item.imageUrl} 
                                                        alt="勉強のきろく" 
                                                        className="w-full h-48 object-contain bg-white p-2" 
                                                    />
                                                    <Button 
                                                        variant="secondary" 
                                                        size="sm"
                                                        className="absolute bottom-2 right-2 bg-white/80 hover:bg-white shadow-md rounded-full"
                                                        onClick={() => openFullscreen(item.imageUrl)}
                                                    >
                                                        <Maximize className="h-4 w-4 mr-1" />
                                                        大きく見る
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-400">
                                                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                                    <p>写真がないよ</p>
                                                </div>
                                            )}
                                        </div>

                                        {item.feedback && (
                                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <h3 className="font-bold text-yellow-700 mb-1 flex items-center">
                                                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                                    先生からのメッセージ
                                                </h3>
                                                <p className="text-gray-700">
                                                    {item.feedback.feedback_text}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
                            alt="勉強のきろく" 
                            className="max-h-[90vh] max-w-[90vw] object-contain" 
                        />
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
