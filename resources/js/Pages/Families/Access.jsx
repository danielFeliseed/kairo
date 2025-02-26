// resources/js/Pages/Families/Access.jsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
// import { Toaster } from "@/Components/ui/sonner";

export default function Access({ errors }) {
    const { data, setData, post, processing } = useForm({
        access_code: '',
    });
    // const { toast } = Toaster();

    const submit = (e) => {
        e.preventDefault();
        post(route('family.access.submit'));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Head title="家族アクセス" />
            
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">かいろ</CardTitle>
                    <CardDescription className="text-center">
                        アクセスコードを入力してください
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div className="space-y-4">
                            <div>
                                <Input
                                    id="access_code"
                                    name="access_code"
                                    value={data.access_code}
                                    className="uppercase text-center text-2xl tracking-widest"
                                    onChange={(e) => setData('access_code', e.target.value.toUpperCase())}
                                    maxLength={6}
                                    placeholder="ABCDEF"
                                />
                                {errors.access_code && (
                                    <p className="text-red-500 text-sm mt-1">{errors.access_code}</p>
                                )}
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={processing || !data.access_code || data.access_code.length < 6}
                            >
                                ログイン
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-500">
                        先生のアクセスは <a href="/login" className="text-blue-500 hover:underline">こちら</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}