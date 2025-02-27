import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Progress } from "@/Components/ui/progress";
import {
    CalendarDays,
    Camera,
    Book,
    Award,
    ArrowRight,
    MessageSquare,
    Star,
    Sparkles,
    Sun,
    Image,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useRef, useState } from "react";
import { useForm } from "@inertiajs/react";

export default function StudentDashboard({
    user,
    currentStreak,
    longestStreak,
    lastSubmission,
    currentStreakPercentage,
    latestHomework,
    latestFeedback,
    hasSubmittedToday,
}) {
    const hasTodaysHomework = hasSubmittedToday;

    console.log(user);

    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
    });

    const handleTakePhoto = () => {
        setIsDialogOpen(true);
    };

    const startCamera = async () => {
        setIsCameraActive(true);
        setCapturedImage(null);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert(
                "カメラを使えないよ。おうちの人に聞いてみてね。"
            );
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    const file = new File([blob], "homework.jpg", {
                        type: "image/jpeg",
                    });
                    setCapturedImage(URL.createObjectURL(blob));
                    setData("image", file);
                    stopCamera();
                },
                "image/jpeg",
                0.9
            );
        }
    };

    const selectFromGallery = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCapturedImage(URL.createObjectURL(file));
            setData("image", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("homework.store"), {
            image: data.image,
            onSuccess: () => {
                setIsDialogOpen(false);
                setCapturedImage(null);
                reset();
            },
        });
    };

    const teacherName = user.teacher ? user.teacher.name : "先生";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-700 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    {user.name}のページ
                </h2>
            }
        >
            <Head title="おうちでべんきょう" />

            <div className="py-6 bg-gradient-to-b from-blue-50 to-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 border-2 border-blue-200 shadow-sm">
                        <div className="flex items-center">
                            <Sun className="h-10 w-10 text-yellow-500 mr-3" />
                            <div>
                                <h1 className="text-xl font-bold text-blue-700">
                                    こんにちは、{user.name}さん！
                                </h1>
                                <p className="text-blue-600">
                                    {teacherName}と一緒に今日も英語をがんばろう！
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Today's Homework Status */}
                    <Card className="mb-6 border-2 border-primary overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardTitle className="text-lg flex items-center">
                                <Book className="h-5 w-5 mr-2 text-blue-600" />
                                きょうの宿題
                            </CardTitle>
                            <CardDescription>
                                {format(new Date(), "yyyy年MM月dd日 (EEEE)", {
                                    locale: ja,
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {hasTodaysHomework ? (
                                <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center justify-center mb-2">
                                        <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
                                        <span className="text-green-600 font-bold text-lg">
                                            やったね！きょうの宿題はおわったよ！
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {teacherName}先生からのコメントをまっているよ
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-lg mb-4 font-medium text-blue-700">
                                        きょうの英語日記をとってね
                                    </p>
                                    <Button
                                        className="gap-2 bg-blue-500 hover:bg-blue-600 rounded-full px-6 py-6 text-lg shadow-md"
                                        onClick={handleTakePhoto}
                                    >
                                        <Camera size={24} /> 写真をとる
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mb-6 border-2 border-yellow-300 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-orange-50">
                            <CardTitle className="text-lg flex items-center">
                                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                きょうのことば
                            </CardTitle>
                            <CardDescription>
                                このことばをおぼえよう！
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-4 px-2">
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-yellow-200">
                                    <p className="text-2xl font-bold mb-2 text-blue-700">
                                        Friend
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        ともだち
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Streak Card */}
                    <Card className="mb-6 border-2 border-orange-300 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-orange-50 to-amber-50">
                            <CardTitle className="flex items-center gap-2">
                                <Award size={20} className="text-orange-500" />
                                <span>れんぞくきろく</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">いまのきろく：</span>
                                <div className="flex items-center">
                                    <span className="font-bold text-xl text-orange-500 mr-1">
                                        {currentStreak}
                                    </span>
                                    <span className="text-orange-500">にち</span>
                                </div>
                            </div>
                            <div className="relative mb-3">
                                <Progress
                                    value={currentStreakPercentage}
                                    className="h-4 rounded-full bg-orange-100"
                                />
                                {currentStreakPercentage >= 20 && (
                                    <div 
                                        className="absolute top-0 left-0 h-4 flex items-center pl-2 text-xs font-bold text-white"
                                        style={{ width: `${Math.min(100, currentStreakPercentage)}%` }}
                                    >
                                        {currentStreak}日れんぞく！
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span>いちばん長いきろく：</span>
                                <div className="flex items-center">
                                    <span className="font-semibold text-lg">
                                        {longestStreak}
                                    </span>
                                    <span>にち</span>
                                </div>
                            </div>
                            
                            {currentStreak > 0 && (
                                <div className="mt-3 text-center">
                                    <p className="text-sm text-blue-600">
                                        {currentStreak >= 5 
                                            ? "すごい！よくがんばってるね！" 
                                            : "あしたもがんばろう！"}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Latest Feedback */}
                    <Card className="mb-6 border-2 border-purple-200 overflow-hidden">
                        <CardHeader className="pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare size={20} className="text-purple-500" />
                                <span>{teacherName}からのメッセージ</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {latestFeedback ? (
                                <div className="bg-white p-3 rounded-lg border border-purple-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">
                                            {format(
                                                new Date(latestFeedback.created_at),
                                                "MM月dd日",
                                                { locale: ja }
                                            )}
                                        </span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-lg ${
                                                        i <
                                                        latestFeedback.rating
                                                            ? "text-yellow-400"
                                                            : "text-gray-300"
                                                    }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 p-2 bg-purple-50 rounded-lg">
                                        {latestFeedback?.feedback_text}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                    <p className="text-gray-500">
                                        まだメッセージはないよ
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col items-center justify-center gap-1 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl"
                            asChild
                        >
                            <a href="/homework-history">
                                <Book size={28} className="text-blue-600" />
                                <span className="font-medium">べんきょうのきろく</span>
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-24 flex flex-col items-center justify-center gap-1 border-2 border-green-200 bg-green-50 hover:bg-green-100 rounded-xl"
                            asChild
                        >
                            <a href="/calendar">
                                <CalendarDays size={28} className="text-green-600" />
                                <span className="font-medium">カレンダー</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Profile switcher button fixed at bottom */}
            <div className="fixed bottom-6 right-6">
                <Button
                    className="rounded-full h-16 w-16 flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    asChild
                >
                    <a href="/family/profiles">
                        <ArrowRight size={28} className="text-white" />
                    </a>
                </Button>
            </div>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        stopCamera();
                        setCapturedImage(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-center text-blue-700 flex items-center justify-center">
                            <Camera className="h-5 w-5 mr-2 text-blue-500" />
                            宿題をとろう！
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            きょうの英語日記の写真をとってね
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col space-y-4">
                        {isCameraActive && (
                            <div className="relative bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    onClick={capturePhoto}
                                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-gray-200 rounded-full px-6 py-6"
                                    size="lg"
                                    variant="outline"
                                >
                                    <Camera className="mr-2 h-5 w-5" /> パシャ！
                                </Button>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="relative bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {!isCameraActive && !capturedImage && (
                            <div className="flex flex-col space-y-4 p-8 items-center justify-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                                <Image className="h-16 w-16 text-blue-300" />
                                <div className="text-center">
                                    <p className="text-blue-700">
                                        写真をとるか、えらんでね
                                    </p>
                                </div>
                            </div>
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="flex space-x-3">
                            {!isCameraActive && (
                                <Button
                                    onClick={startCamera}
                                    variant="default"
                                    className="flex-1 py-6 rounded-xl bg-blue-500 hover:bg-blue-600"
                                >
                                    <Camera className="mr-2 h-5 w-5" />{" "}
                                    カメラをつかう
                                </Button>
                            )}

                            {isCameraActive && (
                                <Button
                                    onClick={stopCamera}
                                    variant="outline"
                                    className="flex-1 py-6 rounded-xl"
                                >
                                    やめる
                                </Button>
                            )}

                            {!isCameraActive && (
                                <Button
                                    onClick={selectFromGallery}
                                    variant="outline"
                                    className="flex-1 py-6 rounded-xl"
                                >
                                    アルバムからえらぶ
                                </Button>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        {capturedImage && (
                            <div className="flex space-x-3 w-full">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCapturedImage(null);
                                        setData("image", null);
                                    }}
                                    className="flex-1 py-6 rounded-xl"
                                >
                                    もういちど
                                </Button>
                                <Button
                                    disabled={processing || !data.image}
                                    onClick={handleSubmit}
                                    className="flex-1 py-6 rounded-xl bg-green-600 hover:bg-green-700 text-lg"
                                >
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    おくる
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
