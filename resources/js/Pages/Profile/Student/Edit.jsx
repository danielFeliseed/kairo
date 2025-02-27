import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar'; 
import { ColorPicker } from '@/Components/ColorPicker';
import { Toaster } from '@/Components/ui/sonner';

export default function StudentProfile({ auth }) {
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: auth.user.name,
        profile_color: auth.user.profile_color || '#4F46E5',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.student.update'), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "保存完了！",
                    description: "プロフィールを更新しました",
                    variant: "success",
                });
            },
            onError: (errors) => {
                console.error('Update failed with errors:', errors);
                toast({
                    title: "エラー",
                    description: "保存に失敗しました",
                    variant: "destructive",
                });
            }
        });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-bold text-2xl text-primary leading-tight">マイプロフィール</h2>}
        >
            <Head title="プロフィール" />

            <div className="py-12 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4">
                    <Card className="border-2 border-primary/20 shadow-lg">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <div className="flex items-center space-x-6">
                                <Avatar className="h-24 w-24 border-2" style={{ backgroundColor: data.profile_color, borderColor: data.profile_color }}>
                                    <AvatarFallback className="text-2xl font-bold text-white">
                                        {getInitials(data.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-primary">
                                        {data.name}のプロフィール
                                    </CardTitle>
                                    <CardDescription className="text-base mt-1">
                                        自分の名前とカラーをえらんでね！
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-8">
                            <form onSubmit={submit} className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-lg font-medium">
                                        名前
                                    </Label>
                                    <Input
                                        id="name"
                                        className="text-lg h-12 rounded-lg"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm font-medium text-destructive mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profile_color" className="text-lg font-medium">
                                        プロフィールカラー
                                    </Label>
                                    <div className="mt-3 p-4 bg-white rounded-lg border">
                                        <ColorPicker
                                            color={data.profile_color}
                                            onChange={(color) => setData('profile_color', color)}
                                        />
                                    </div>
                                    {errors.profile_color && (
                                        <p className="text-sm font-medium text-destructive mt-1">
                                            {errors.profile_color}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center pt-4">
                                    <Button 
                                        type="submit" 
                                        disabled={processing} 
                                        className="text-lg py-6 px-8 rounded-full shadow-md transition-all bg-sky-500 text-white"
                                    >
                                        {processing ? 'ほぞん中...' : 'ほぞんする'}
                                    </Button>

                                    {recentlySuccessful && (
                                        <div className="ml-4 text-sm bg-green-50 text-green-600 py-2 px-4 rounded-full">
                                            ほぞんしました！
                                        </div>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
