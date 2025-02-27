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
import {
    Users,
    BookOpen,
    Calendar,
    Image,
    Award,
    Plus,
    Trash2,
    Search,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

export default function TeacherDashboard({
    students,
    recentHomework,
    families,
    streaks,
}) {
    const { delete: destroy } = useForm();
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const totalStudents = students?.length;

    console.log(students);

    const handleDelete = (id) => {
        if (confirm("本当に削除しますか？")) {
            destroy(route("student.destroy", { user: id }), {
                onSuccess: () => {
                    toast.success("生徒が削除されました。");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    先生ダッシュボード
                </h2>
            }
        >
            <Head title="先生ダッシュボード" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <Users className="h-8 w-8 text-primary mb-2" />
                                <p className="text-2xl font-bold">
                                    {totalStudents}
                                </p>
                                <p className="text-sm text-gray-500">生徒数</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 flex flex-col items-center justify-center">
                                <BookOpen className="h-8 w-8 text-primary mb-2" />
                                <p className="text-2xl font-bold">
                                    {
                                        recentHomework?.filter(
                                            (hw) => hw.status === "submitted"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-gray-500">
                                    未確認宿題
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Homework Submissions */}
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">
                                最近の宿題提出
                            </CardTitle>
                            <CardDescription>確認が必要な宿題</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentHomework?.length > 0 ? (
                                <div className="space-y-4">
                                    {recentHomework?.map((homework) => (
                                        <div
                                            key={homework.id}
                                            className="flex items-center justify-between border-b pb-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback
                                                        style={{
                                                            backgroundColor:
                                                                homework.avatarColor,
                                                        }}
                                                    >
                                                        {homework.studentName?.charAt(
                                                            0
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">
                                                        {homework.studentName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {format(
                                                            homework.homeworkDate,
                                                            "MM月dd日",
                                                            { locale: ja }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                {homework.status === "new" ? (
                                                    <Badge className="bg-blue-500">
                                                        新規
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className={`${
                                                            homework.status ===
                                                            "reviewed"
                                                                ? "text-green-600 border-green-600"
                                                                : "text-red-600 border-red-600"
                                                        }`}
                                                    >
                                                        {homework.status ===
                                                        "reviewed"
                                                            ? "確認済"
                                                            : "未確認"}
                                                    </Badge>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <a
                                                    href={`/homework/${homework.id}`}
                                                >
                                                    確認する
                                                </a>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-gray-500">
                                    確認が必要な宿題はありません
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <a href="/homework">すべての宿題を見る</a>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Students and Families Tabs */}
                    <Tabs defaultValue="students" className="mb-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="students">生徒</TabsTrigger>
                            <TabsTrigger value="families">家族</TabsTrigger>
                        </TabsList>

                        <TabsContent value="students" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            生徒 ({students?.length})
                                        </CardTitle>
                                        <Button
                                            onClick={() =>
                                                setShowAddStudentModal(true)
                                            }
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <Plus size={16} /> 追加
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-72">
                                        <div className="space-y-4">
                                            {students?.map((student) => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-center justify-between border-b pb-3"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarFallback
                                                                style={{
                                                                    backgroundColor:
                                                                        student.avatarColor,
                                                                }}
                                                            >
                                                                {student.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">
                                                                {student.name} (
                                                                {
                                                                    student
                                                                        .family
                                                                        ?.name
                                                                }
                                                                )
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500 gap-1">
                                                                <Award className="h-3 w-3" />{" "}
                                                                {student?.streak
                                                                    ?.current_streak ||
                                                                    0}
                                                                日連続
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`/students/${student.id}`}
                                                            >
                                                                詳細
                                                            </a>
                                                        </Button>
                                                        <Button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    student.id
                                                                )
                                                            }
                                                            variant="danger"
                                                            size="sm"
                                                        >
                                                            <Trash2
                                                                size={16}
                                                                className="text-red-500"
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="families" className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            家族 ({families?.length})
                                        </CardTitle>
                                        <Button
                                            size="sm"
                                            className="gap-1"
                                            asChild
                                        >
                                            <a href="/families/create">
                                                <Plus size={16} /> 追加
                                            </a>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-72">
                                        <div className="space-y-4">
                                            {families?.map((family) => (
                                                <div
                                                    key={family.id}
                                                    className="flex items-center justify-between border-b pb-3"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {family.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            アクセスコード:{" "}
                                                            <span className="font-mono">
                                                                {
                                                                    family.accessCode
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="outline">
                                                            {
                                                                family.studentCount
                                                            }{" "}
                                                            人
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <a
                                                                href={`/families/${family.id}`}
                                                            >
                                                                管理
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

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center gap-1"
                            asChild
                        >
                            <a href="/calendar">
                                <Calendar size={24} />
                                <span>カレンダー</span>
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center gap-1"
                            asChild
                        >
                            <a href="/homework">
                                <Search size={24} />
                                <span>宿題</span>
                            </a>
                        </Button>
                    </div>
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
