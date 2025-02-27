import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import AddStudentModal from "@/Components/AddStudentModal";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Toaster } from "@/Components/ui/sonner";
import {
    Users,
    BookOpen,
    Calendar,
    Image,
    Award,
    Plus,
    Trash2,
    Search,
    Star,
    School,
    ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function TeacherDashboard({
    students,
    recentHomework,
    families,
}) {
    const { delete: destroy } = useForm();
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const totalStudents = students?.length;

    const handleDelete = (id) => {
        if (confirm("本当に削除しますか？")) {
            destroy(route("student.destroy", { user: id }), {
                onSuccess: () => {
                    toast.success("生徒が削除されました。");
                },
            });
        }
    };

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <School className="w-8 h-8 text-sky-500 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        先生ダッシュボード
                    </h2>
                </div>
            }
        >
            <Head title="先生ダッシュボード" />
            <Toaster position="top-right" />

            <div className="py-8 bg-gradient-to-b from-sky-50 to-white min-h-screen">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Banner */}
                    <div className="mb-8 bg-sky-500 rounded-xl overflow-hidden shadow-lg">
                        <div className="relative px-6 py-8 md:px-10 text-white">
                            <div className="absolute right-0 top-0 h-full opacity-10">
                                <School className="h-full w-auto" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">おはようございます！</h1>
                            <p className="text-sky-100 max-w-2xl">
                                今日も元気に授業をはじめましょう。{totalStudents}人の生徒たちがあなたを待っています。
                            </p>
                            <div className="mt-4 flex space-x-3">
                                <Button 
                                    className="bg-white text-sky-600 hover:bg-sky-50 hover:text-sky-700"
                                    size="sm"
                                    asChild
                                >
                                    <a href="/homework">
                                        宿題を確認する
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="bg-sky-600/20 border-sky-200 text-white hover:bg-sky-600/30"
                                    size="sm"
                                    asChild
                                >
                                    <a href="/calendar">
                                        カレンダーを見る
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Stats Overview */}
                        <motion.div variants={item} className="md:col-span-9">
                            <Card className="bg-white shadow-md border-sky-100">
                                <CardHeader className="pb-2 border-b border-sky-100">
                                    <CardTitle className="text-sky-800 flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        ダッシュボード概要
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-sky-50 rounded-lg p-4 text-center border border-sky-100 transition-all hover:shadow-md hover:bg-sky-100">
                                            <div className="inline-flex p-3 bg-sky-500/10 rounded-full mb-2">
                                                <Users className="h-6 w-6 text-sky-600" />
                                            </div>
                                            <p className="text-3xl font-bold text-sky-700">
                                                {totalStudents}
                                            </p>
                                            <p className="text-sm text-sky-600 font-medium">生徒数</p>
                                        </div>

                                        <div className="bg-sky-50 rounded-lg p-4 text-center border border-sky-100 transition-all hover:shadow-md hover:bg-sky-100">
                                            <div className="inline-flex p-3 bg-sky-500/10 rounded-full mb-2">
                                                <BookOpen className="h-6 w-6 text-sky-600" />
                                            </div>
                                            <p className="text-3xl font-bold text-sky-700">
                                                {recentHomework?.filter(hw => hw.status === "submitted").length}
                                            </p>
                                            <p className="text-sm text-sky-600 font-medium">未確認宿題</p>
                                        </div>

                                        <div className="bg-sky-50 rounded-lg p-4 text-center border border-sky-100 transition-all hover:shadow-md hover:bg-sky-100">
                                            <div className="inline-flex p-3 bg-sky-500/10 rounded-full mb-2">
                                                <Award className="h-6 w-6 text-sky-600" />
                                            </div>
                                            <p className="text-3xl font-bold text-sky-700">
                                                {students?.reduce((acc, student) => acc + (student.streak_count || 0), 0)}
                                            </p>
                                            <p className="text-sm text-sky-600 font-medium">合計継続日数</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div variants={item} className="md:col-span-3">
                            <Card className="h-full bg-gradient-to-br from-sky-600 to-sky-700 text-white shadow-md">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-white">クイックアクション</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-4">
                                    <Button 
                                        className="w-full justify-start bg-sky-500/20 hover:bg-sky-500/40 text-white border-0"
                                        onClick={() => setShowAddStudentModal(true)}
                                    >
                                        <Plus className="mr-2 h-5 w-5" />
                                        新しい生徒を追加
                                    </Button>
                                    <Button 
                                        className="w-full justify-start bg-sky-500/20 hover:bg-sky-500/40 text-white border-0"
                                        asChild
                                    >
                                        <a href="/homework">
                                            <Search className="mr-2 h-5 w-5" />
                                            宿題を確認する
                                        </a>
                                    </Button>
                                    <Button 
                                        className="w-full justify-start bg-sky-500/20 hover:bg-sky-500/40 text-white border-0"
                                        asChild
                                    >
                                        <a href="/calendar">
                                            <Calendar className="mr-2 h-5 w-5" />
                                            カレンダーを見る
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Recent Homework Submissions */}
                    <motion.div 
                        variants={item} 
                        className="mb-8"
                    >
                        <Card className="shadow-md border-sky-100 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-sky-50 to-white border-b border-sky-100 pb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle className="text-xl text-sky-800">
                                            最近の宿題提出
                                        </CardTitle>
                                        <CardDescription className="text-sky-600 mt-1">
                                            確認が必要な最新の宿題
                                        </CardDescription>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="border-sky-200 text-sky-600 hover:bg-sky-50 hover:text-sky-700"
                                        size="sm"
                                        asChild
                                    >
                                        <a href="/homework">すべての宿題を見る</a>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {recentHomework?.length > 0 ? (
                                    <div className="divide-y divide-sky-100">
                                        {recentHomework?.map((homework) => (
                                            <div
                                                key={homework.id}
                                                className="flex items-center justify-between p-4 hover:bg-sky-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 border-2 border-sky-100 shadow-sm">
                                                        <AvatarFallback
                                                            style={{
                                                                backgroundColor: homework.avatarColor || 'rgb(14 165 233)',
                                                            }}
                                                            className="text-white font-bold"
                                                        >
                                                            {homework.studentName?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">
                                                            {homework.studentName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {format(
                                                                new Date(homework.homeworkDate),
                                                                "MM月dd日",
                                                                { locale: ja }
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {homework.status === "new" ? (
                                                        <Badge className="bg-sky-500 text-white hover:bg-sky-600">
                                                            新規
                                                        </Badge>
                                                    ) : homework.status === "reviewed" ? (
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200">
                                                            確認済み
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200">
                                                            未確認
                                                        </Badge>
                                                    )}
                                                    <Button
                                                        className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <a href={`/homework/${homework.id}`}>
                                                            確認する
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center py-8 text-gray-500">
                                        確認が必要な宿題はありません
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Students and Families Tabs */}
                    <motion.div variants={item}>
                        <Tabs defaultValue="students" className="mb-8">
                            <TabsList className="w-full bg-sky-100 p-1">
                                <TabsTrigger 
                                    value="students" 
                                    className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm rounded-md"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    生徒
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="families" 
                                    className="data-[state=active]:bg-white data-[state=active]:text-sky-600 data-[state=active]:shadow-sm rounded-md"
                                >
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-2" />
                                        家族
                                    </div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="students" className="mt-6">
                                <Card className="border-sky-100 shadow-md">
                                    <CardHeader className="border-b border-sky-100 pb-4 bg-gradient-to-r from-sky-50 to-white">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-xl text-sky-800 flex items-center">
                                                <School className="h-5 w-5 mr-2 text-sky-600" />
                                                生徒 ({students?.length})
                                            </CardTitle>
                                            <Button
                                                onClick={() => setShowAddStudentModal(true)}
                                                size="sm"
                                                className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                                            >
                                                <Plus size={16} className="mr-1" /> 生徒を追加
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-80">
                                            <div className="divide-y divide-sky-100">
                                                {students?.map((student, index) => (
                                                    <div
                                                        key={student.id}
                                                        className={`flex items-center justify-between p-4 ${
                                                            index % 2 ? "bg-sky-50" : "bg-white"
                                                        } hover:bg-sky-100 transition-colors`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-12 w-12 border-2 border-sky-100 shadow-sm">
                                                                <AvatarFallback
                                                                    style={{
                                                                        backgroundColor: student.profile_color || 'rgb(14 165 233)',
                                                                    }}
                                                                    className="text-white font-bold"
                                                                >
                                                                    {student.name.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="font-medium text-gray-800 text-lg">
                                                                    {student.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500 mt-1">
                                                                    <span className="font-medium text-sky-700">
                                                                        {student.family_name || "家族未所属"}
                                                                    </span>
                                                                    <span className="mx-2">•</span>
                                                                    <span className="flex items-center inline-flex text-amber-600">
                                                                        <Award className="h-3.5 w-3.5 mr-1" />
                                                                        <span>
                                                                            {student.streak_count || 0}日連続
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-sky-200 text-sky-600 hover:bg-sky-50"
                                                                asChild
                                                            >
                                                                <a href={`/students/${student.id}`}>
                                                                    詳細
                                                                </a>
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleDelete(student.id)}
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-200 text-red-500 hover:bg-red-50"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="families" className="mt-6">
                                <Card className="border-sky-100 shadow-md">
                                    <CardHeader className="border-b border-sky-100 pb-4 bg-gradient-to-r from-sky-50 to-white">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-xl text-sky-800 flex items-center">
                                                <Users className="h-5 w-5 mr-2 text-sky-600" />
                                                家族 ({families?.length})
                                            </CardTitle>
                                            <Button
                                                size="sm"
                                                className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                                                asChild
                                            >
                                                <a href="/families/create">
                                                    <Plus size={16} className="mr-1" /> 家族を追加
                                                </a>
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-80">
                                            <div className="divide-y divide-sky-100">
                                                {families?.map((family, index) => (
                                                    <div
                                                        key={family.id}
                                                        className={`flex items-center justify-between p-4 ${
                                                            index % 2 ? "bg-sky-50" : "bg-white"
                                                        } hover:bg-sky-100 transition-colors`}
                                                    >
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-800 text-lg">
                                                                {family.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                                <span className="font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-xs">
                                                                    {family.access_code || "コード未設定"}
                                                                </span>
                                                                <span className="mx-2">•</span>
                                                                <span className="flex items-center">
                                                                    <Users className="h-3.5 w-3.5 mr-1 text-sky-600" />
                                                                    {family.student_count || 0}人の生徒
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-sky-200 text-sky-600 hover:bg-sky-50"
                                                                asChild
                                                            >
                                                                <a href={`/families/${family.id}`}>
                                                                    管理する
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>

            {showAddStudentModal && (
                <AddStudentModal
                    onClose={() => setShowAddStudentModal(false)}
                    families={families}
                />
            )}
        </AuthenticatedLayout>
    );
}
