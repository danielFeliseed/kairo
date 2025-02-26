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
    console.log(hasTodaysHomework);

    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    // Add this form for handling uploads
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
    });

    const handleTakePhoto = () => {
        setIsDialogOpen(true);
    };

    // Add these functions for camera handling
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
                "カメラへのアクセスができませんでした。ブラウザの設定を確認してください。"
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

            // Convert to file
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
        console.log(data.image);
        post(route("homework.store"), {
            image: data.image,
            onSuccess: () => {
                setIsDialogOpen(false);
                setCapturedImage(null);
                reset();
            },
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {user.name}のページ
                </h2>
            }
        >
            <Head title="生徒ダッシュボード" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Today's Homework Status */}
                    <Card className="mb-6 border-2 border-primary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                今日の宿題
                            </CardTitle>
                            <CardDescription>
                                {format(new Date(), "yyyy年MM月dd日 (EEEE)", {
                                    locale: ja,
                                })}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasTodaysHomework ? (
                                <div className="text-center py-3">
                                    <div className="text-green-600 font-bold text-lg mb-2">
                                        ✅ 今日の宿題は提出済みです！
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        先生からのコメントをお待ちください
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-3">
                                    <p className="text-lg mb-4">
                                        今日の英語日記をアップロードしてください
                                    </p>
                                    <Button
                                        className="gap-2 bg-blue-500 hover:bg-blue-600"
                                        onClick={handleTakePhoto}
                                    >
                                        <Camera size={20} /> 写真をとる
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Streak Card */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Award size={20} />
                                <span>れんぞく記録</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-2">
                                <span>現在の記録：</span>
                                <span className="font-bold text-orange-500">
                                    {currentStreak}日
                                </span>
                            </div>
                            <Progress
                                value={currentStreakPercentage}
                                className="h-2 mb-2"
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span>一番長い記録：</span>
                                <span className="font-semibold">
                                    {longestStreak}日
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Latest Feedback */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare size={20} />
                                <span>先生からのコメント</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {latestFeedback ? (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-500">
                                            {format(
                                                latestFeedback.created_at,
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
                                    <p className="text-gray-700">
                                        {latestFeedback?.feedback_text}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-center py-3 text-gray-500">
                                    まだコメントはありません
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center gap-1"
                            asChild
                        >
                            <a href="/homework-history">
                                <Book size={24} />
                                <span>宿題の履歴</span>
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center gap-1"
                            asChild
                        >
                            <a href="/calendar">
                                <CalendarDays size={24} />
                                <span>カレンダー</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Profile switcher button fixed at bottom */}
            <div className="fixed bottom-4 right-4">
                <Button
                    className="rounded-full h-14 w-14 flex items-center justify-center shadow-lg"
                    variant="secondary"
                    asChild
                >
                    <a href="/family/profiles">
                        <ArrowRight size={24} />
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
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>宿題の提出</DialogTitle>
                        <DialogDescription>
                            今日の英語日記の写真を撮ってください
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col space-y-4">
                        {isCameraActive && (
                            <div className="relative bg-black rounded-md overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                                <Button
                                    onClick={capturePhoto}
                                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-gray-200"
                                    size="lg"
                                    variant="outline"
                                >
                                    <Camera className="mr-2 h-4 w-4" /> 撮影する
                                </Button>
                            </div>
                        )}

                        {capturedImage && (
                            <div className="relative bg-black rounded-md overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <img
                                    src={capturedImage}
                                    alt="Captured"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {!isCameraActive && !capturedImage && (
                            <div className="flex flex-col space-y-4 p-6 items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                                <div className="text-center">
                                    <p>
                                        写真を撮るか、ギャラリーから選択してください
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

                        <div className="flex space-x-2">
                            {!isCameraActive && (
                                <Button
                                    onClick={startCamera}
                                    variant="default"
                                    className="flex-1"
                                >
                                    <Camera className="mr-2 h-4 w-4" />{" "}
                                    カメラを起動
                                </Button>
                            )}

                            {isCameraActive && (
                                <Button
                                    onClick={stopCamera}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    キャンセル
                                </Button>
                            )}

                            {!isCameraActive && (
                                <Button
                                    onClick={selectFromGallery}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    ギャラリーから選択
                                </Button>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        {capturedImage && (
                            <div className="flex space-x-2 w-full">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCapturedImage(null);
                                        setData("image", null);
                                    }}
                                    className="flex-1"
                                >
                                    やり直す
                                </Button>
                                <Button
                                    disabled={processing || !data.image}
                                    onClick={handleSubmit}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                    提出する
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
