import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Trash2, X, Maximize, FileText, MessageSquare, Calendar, Star, CheckCircle, Sparkles } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeworkHistory({ auth, homework }) {
    const { delete: destroy } = useForm();
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

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
        show: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

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
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                >
                    <motion.div 
                        animate={{ 
                            rotate: [0, 10, 0, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                    >
                        <Calendar className="h-6 w-6 mr-2 text-blue-500" />
                    </motion.div>
                    <h2 className="text-xl font-semibold leading-tight text-blue-700">
                        べんきょうのきろく
                    </h2>
                </motion.div>
            }
        >
            <Head title="べんきょうのきろく" />

            <div className="py-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    
                    {/* Welcome Banner */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 border-2 border-indigo-200 shadow-md"
                    >
                        <div className="flex items-center">
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ 
                                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                                }}
                            >
                                <Star className="h-10 w-10 text-yellow-500 mr-4" />
                            </motion.div>
                            <div>
                                <motion.h1 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold text-indigo-700 mb-1"
                                >
                                    べんきょうのきろく
                                </motion.h1>
                                <motion.p 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-indigo-600"
                                >
                                    これまでにがんばったべんきょうがぜんぶみれるよ！
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>

                    {homework.length > 0 ? (
                        <motion.div 
                            className="space-y-6"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            {homework.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    variants={item}
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                >
                                    <Card className="overflow-hidden border-2 border-blue-100 shadow-md hover:shadow-lg">
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
                                                <motion.div
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                            <div className="mt-2">
                                                <Badge
                                                    className={`${
                                                        item.status === "reviewed"
                                                            ? "bg-green-100 text-green-700 border border-green-300"
                                                            : item.status === "submitted"
                                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                                            : "bg-gray-100 text-gray-700 border border-gray-300"
                                                    } px-3 py-1 rounded-full text-sm font-medium`}
                                                >
                                                    {item.status === "reviewed" ? (
                                                        <motion.span 
                                                            className="flex items-center"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            先生が見たよ！
                                                        </motion.span>
                                                    ) : item.status === "submitted" ? (
                                                        "先生からのコメントまち"
                                                    ) : (
                                                        item.status
                                                    )}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="p-4">
                                            <motion.div 
                                                className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-100"
                                                whileHover={{ boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -5px rgba(59, 130, 246, 0.05)" }}
                                            >
                                                {item.imageUrl ? (
                                                    <div className="relative">
                                                        <motion.img 
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                                                            src={item.imageUrl} 
                                                            alt="べんきょうのきろく" 
                                                            className="w-full object-contain max-h-[300px]" 
                                                        />
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <Button 
                                                                variant="secondary" 
                                                                size="sm"
                                                                className="absolute bottom-3 right-3 bg-white/80 hover:bg-white shadow-md rounded-full"
                                                                onClick={() => openFullscreen(item.imageUrl)}
                                                            >
                                                                <Maximize className="h-4 w-4 mr-1" />
                                                                大きく見る
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12 text-gray-400">
                                                        <motion.div
                                                            animate={{ 
                                                                opacity: [0.3, 0.5, 0.3],
                                                                scale: [0.95, 1, 0.95]
                                                            }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                            className="flex justify-center"
                                                        >
                                                            <FileText className="h-16 w-16 mx-auto mb-2" />
                                                        </motion.div>
                                                        <p>写真がありません</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                            
                                            {item.feedback && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 + (0.1 * index), type: "spring" }}
                                                    className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200"
                                                >
                                                    <div className="flex items-start">
                                                        <motion.div
                                                            animate={{ 
                                                                rotate: [0, 15, 0, -15, 0],
                                                            }}
                                                            transition={{ 
                                                                duration: 2, 
                                                                repeat: Infinity, 
                                                                repeatDelay: 3
                                                            }}
                                                        >
                                                            <MessageSquare className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                                                        </motion.div>
                                                        <div>
                                                            <motion.h4 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.4 + (0.1 * index) }}
                                                                className="font-medium text-yellow-700 mb-1"
                                                            >
                                                                先生からのメッセージ
                                                            </motion.h4>
                                                            <motion.p 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.5 + (0.1 * index) }}
                                                                className="text-gray-700"
                                                            >
                                                                {item.feedback.feedback_text}
                                                            </motion.p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="text-center py-12 bg-white rounded-xl border-2 border-blue-100 shadow-sm"
                        >
                            <motion.div 
                                animate={{ 
                                    y: [0, -10, 0],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="flex justify-center mb-4"
                            >
                                <FileText className="h-20 w-20 text-blue-200" />
                            </motion.div>
                            <motion.h3 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-xl font-medium text-gray-700 mb-2"
                            >
                                まだべんきょうのきろくがないよ
                            </motion.h3>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-500 mb-6"
                            >
                                はじめての宿題をだしてみよう！
                            </motion.p>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <Button 
                                    onClick={() => window.location.href = route('dashboard')}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                                >
                                    <motion.span 
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                                        className="flex items-center"
                                    >
                                        ホームにもどる
                                        <Sparkles className="ml-2 h-4 w-4" />
                                    </motion.span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Image Fullscreen View */}
            <AnimatePresence>
                {isFullscreen && selectedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-4 right-4"
                        >
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-white hover:bg-white/20 rounded-full" 
                                onClick={() => setIsFullscreen(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </motion.div>
                        <motion.img 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            src={selectedImage} 
                            alt="べんきょうのきろく" 
                            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
