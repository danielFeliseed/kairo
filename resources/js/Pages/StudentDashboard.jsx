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
    Smile,
    Check,
    BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useRef, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

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
    const teacherName = user.teacher ? user.teacher.name : "先生";
    
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null,
    });

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };
    
    const pulseAnimation = {
        scale: [1, 1.05, 1],
        transition: { duration: 2, repeat: Infinity }
    };
    
    const springButton = {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
        pressed: { scale: 0.95 }
    };

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
            alert("カメラを使えないよ。おうちの人に聞いてみてね。");
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
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <Star className="h-6 w-6 mr-2 text-yellow-500" />
                    <h2 className="text-xl font-bold text-blue-700 flex items-center">
                        {user.name}のページ
                    </h2>
                </motion.div>
            }
        >
            <Head title="おうちでべんきょう" />

            <div className="py-6 bg-gradient-to-b from-blue-50 via-purple-50 to-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden"
                    >
                        <div className="absolute right-0 top-0 h-full opacity-10">
                            <Sun className="h-full w-auto" />
                        </div>
                        <div className="flex items-center">
                            <motion.div animate={pulseAnimation}>
                                <Sun className="h-12 w-12 text-yellow-300 mr-4" />
                            </motion.div>
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    こんにちは、{user.name}さん！
                                </h1>
                                <p className="text-blue-100">
                                    {teacherName}先生と一緒に今日も英語をがんばろう！
                                </p>
                                {currentStreak > 0 && (
                                    <div className="mt-2 flex items-center">
                                        <Award className="h-5 w-5 text-yellow-300 mr-1" />
                                        <span className="text-sm bg-white/20 px-2 py-1 rounded-full text-white font-medium">
                                            {currentStreak}日れんぞく チャレンジ中！
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {/* Today's Homework Status */}
                        <motion.div variants={item}>
                            <Card className="border-2 border-blue-300 overflow-hidden shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-r from-blue-100 to-blue-50">
                                    <CardTitle className="text-lg flex items-center text-blue-700">
                                        <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                                        きょうの宿題
                                    </CardTitle>
                                    <CardDescription>
                                        {format(new Date(), "yyyy年MM月dd日 (EEEE)", {
                                            locale: ja,
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <AnimatePresence mode="wait">
                                        {hasTodaysHomework ? (
                                            <motion.div 
                                                key="completed"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="text-center py-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ 
                                                        type: "spring", 
                                                        stiffness: 260, 
                                                        damping: 20,
                                                        delay: 0.2 
                                                    }}
                                                    className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                                                >
                                                    <Check className="h-8 w-8 text-green-600" />
                                                </motion.div>
                                                <span className="text-green-600 font-bold text-xl block mb-2">
                                                    やったね！きょうの宿題はおわったよ！
                                                </span>
                                                <p className="text-sm text-gray-500 flex items-center justify-center">
                                                    <MessageSquare className="h-4 w-4 mr-1" />
                                                    {teacherName}先生からのコメントをまっているよ
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="pending"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="text-center py-8"
                                            >
                                                <p className="text-xl mb-5 font-medium text-blue-700">
                                                    きょうの英語日記をとってね ✏️
                                                </p>
                                                <motion.div
                                                    variants={springButton}
                                                    initial="rest"
                                                    whileHover="hover"
                                                    whileTap="pressed"
                                                >
                                                    <Button
                                                        className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full px-8 py-7 text-lg shadow-md"
                                                        onClick={handleTakePhoto}
                                                    >
                                                        <Camera size={24} /> 写真をとる
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Streak Card */}
                        <motion.div variants={item}>
                            <Card className="border-2 border-yellow-300 overflow-hidden shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-r from-yellow-100 to-amber-50">
                                    <CardTitle className="text-lg flex items-center text-amber-700">
                                        <Award className="h-5 w-5 mr-2 text-amber-600" />
                                        がんばりカレンダー
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex-1">
                                            <p className="text-lg font-bold text-blue-700 mb-1">
                                                {currentStreak}日れんぞく
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                さいこうきろく: {longestStreak}日
                                            </p>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium text-blue-700">
                                                    つづけるぞ！
                                                </span>
                                                <span className="text-sm font-medium text-purple-700">
                                                    {currentStreakPercentage}%
                                                </span>
                                            </div>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${currentStreakPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            >
                                                <Progress
                                                    value={currentStreakPercentage}
                                                    className="h-3 bg-blue-100"
                                                    indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                                                />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {lastSubmission && (
                                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mt-2">
                                            <p className="text-sm text-amber-700 flex items-center">
                                                <CalendarDays className="h-4 w-4 mr-2 text-amber-600" />
                                                さいごのにっき: {format(new Date(lastSubmission), "MM月dd日", { locale: ja })}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Teacher's Message */}
                        <motion.div variants={item}>
                            <Card className="border-2 border-purple-300 overflow-hidden shadow-md">
                                <CardHeader className="pb-2 bg-gradient-to-r from-purple-100 to-pink-50">
                                    <CardTitle className="text-lg flex items-center text-purple-700">
                                        <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                                        {teacherName}先生からのメッセージ
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <AnimatePresence mode="wait">
                                        {latestFeedback ? (
                                            <motion.div 
                                                key="has-feedback"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm"
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-sm text-gray-500 bg-purple-50 px-2 py-1 rounded-full">
                                                        {format(
                                                            new Date(latestFeedback.created_at),
                                                            "MM月dd日",
                                                            { locale: ja }
                                                        )}
                                                    </span>
                                                    <motion.div 
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ 
                                                            type: "spring",
                                                            stiffness: 400,
                                                            damping: 17,
                                                            delay: 0.3
                                                        }}
                                                        className="flex"
                                                    >
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-5 w-5 ${
                                                                    i < latestFeedback.rating
                                                                        ? "text-yellow-400 fill-yellow-400"
                                                                        : "text-gray-200"
                                                                }`}
                                                            />
                                                        ))}
                                                    </motion.div>
                                                </div>
                                                <motion.div
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                                                >
                                                    <p className="text-gray-700 text-lg font-medium">
                                                        {latestFeedback?.feedback_text}
                                                    </p>
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="no-feedback"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center py-8 bg-gray-50 rounded-lg"
                                            >
                                                <motion.div 
                                                    animate={pulseAnimation}
                                                    className="mx-auto mb-3 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"
                                                >
                                                    <MessageSquare className="h-8 w-8 text-purple-400" />
                                                </motion.div>
                                                <p className="text-gray-500">
                                                    まだメッセージはないよ
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div 
                            variants={item}
                            className="grid grid-cols-2 gap-4 mt-6"
                        >
                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    className="h-24 w-full flex flex-col items-center justify-center gap-2 border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white hover:from-blue-100 hover:to-blue-50 rounded-xl shadow-sm"
                                    asChild
                                >
                                    <a href="/homework-history">
                                        <Book size={28} className="text-blue-600" />
                                        <span className="font-medium">べんきょうのきろく</span>
                                    </a>
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="outline"
                                    className="h-24 w-full flex flex-col items-center justify-center gap-2 border-2 border-green-200 bg-gradient-to-b from-green-50 to-white hover:from-green-100 hover:to-green-50 rounded-xl shadow-sm"
                                    asChild
                                >
                                    <a href="/calendar">
                                        <CalendarDays size={28} className="text-green-600" />
                                        <span className="font-medium">カレンダー</span>
                                    </a>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Profile switcher button fixed at bottom */}
            <motion.div 
                className="fixed bottom-6 right-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    className="rounded-full h-16 w-16 flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    asChild
                >
                    <a href="/family/profiles">
                        <ArrowRight size={28} className="text-white" />
                    </a>
                </Button>
            </motion.div>

            {/* Photo Dialog */}
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
                <DialogContent className="sm:max-w-md rounded-xl border-2 border-blue-200">
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
                        <AnimatePresence mode="wait">
                            {isCameraActive && (
                                <motion.div
                                    key="camera"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center"
                                >
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button
                                            onClick={capturePhoto}
                                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black hover:bg-gray-200 rounded-full px-6 py-6 shadow-lg"
                                            size="lg"
                                            variant="outline"
                                        >
                                            <Camera className="mr-2 h-5 w-5" /> パシャ！
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}

                            {capturedImage && (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative bg-black rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center"
                                >
                                    <img
                                        src={capturedImage}
                                        alt="Captured"
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                            )}

                            {!isCameraActive && !capturedImage && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col space-y-4 p-10 items-center justify-center border-2 border-dashed border-blue-300 rounded-xl bg-blue-50"
                                >
                                    <motion.div animate={pulseAnimation}>
                                        <Image className="h-20 w-20 text-blue-300" />
                                    </motion.div>
                                    <div className="text-center">
                                        <p className="text-blue-700 text-lg">
                                            写真をとるか、えらんでね
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        <div className="flex space-x-3">
                            {!isCameraActive && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Button
                                        onClick={startCamera}
                                        variant="default"
                                        className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md"
                                    >
                                        <Camera className="mr-2 h-5 w-5" /> カメラをつかう
                                    </Button>
                                </motion.div>
                            )}

                            {isCameraActive && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Button
                                        onClick={stopCamera}
                                        variant="outline"
                                        className="w-full py-6 rounded-xl border-2 border-red-200 text-red-500"
                                    >
                                        やめる
                                    </Button>
                                </motion.div>
                            )}

                            {!isCameraActive && (
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Button
                                        onClick={selectFromGallery}
                                        variant="outline"
                                        className="w-full py-6 rounded-xl border-2 border-blue-200"
                                    >
                                        アルバムからえらぶ
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-start">
                        {capturedImage && (
                            <div className="flex space-x-3 w-full">
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setCapturedImage(null);
                                            setData("image", null);
                                        }}
                                        className="w-full py-6 rounded-xl border-2 border-blue-200"
                                    >
                                        もういちど
                                    </Button>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ y: -2, scale: 1.02 }} 
                                    whileTap={{ scale: 0.95 }} 
                                    className="flex-1"
                                >
                                    <Button
                                        disabled={processing || !data.image}
                                        onClick={handleSubmit}
                                        className="w-full py-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-lg shadow-md"
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        おくる
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confetti celebration when homework submitted */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    {/* This would be where you'd implement a confetti effect */}
                    {/* For a real implementation, you could use a library like react-confetti */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-full p-10 shadow-xl"
                    >
                        <motion.div 
                            animate={{ 
                                rotate: 360,
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ 
                                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                            }}
                        >
                            <Sparkles className="h-20 w-20 text-yellow-500" />
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mt-4 text-xl font-bold text-blue-700"
                        >
                            やったね！<br/>宿題ができたよ！
                        </motion.p>
                    </motion.div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
