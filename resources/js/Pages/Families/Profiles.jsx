// resources/js/Pages/Families/Profiles.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { ArrowLeft, Users, Star, Sparkles } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Profiles({ family, students }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
            <Head title="NoBi - プロフィール選択" />
            
            {/* Background decorations */}
            <div className="fixed top-10 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-20"></div>
            <div className="fixed bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="fixed top-1/3 right-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-20"></div>
            <div className="fixed bottom-1/3 left-1/4 w-20 h-20 bg-green-200 rounded-full opacity-20"></div>
            
            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Logo and App Name */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center">
                            <ApplicationLogo className="h-16 w-16" />
                        </div>
                        <h1 className="mt-2 text-2xl font-bold text-blue-700">NoBi</h1>
                    </div>
                    
                    {/* Header */}
                    <Card className="mb-8 border-2 border-blue-100 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 text-center relative">
                            <div className="absolute top-2 right-2">
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="absolute bottom-2 left-2">
                                <Sparkles className="h-5 w-5 text-blue-400" />
                            </div>
                            
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-6 w-6 text-blue-600 mr-2" />
                                <h2 className="text-2xl font-bold text-blue-700">だれがべんきょうする？</h2>
                            </div>
                            
                            <p className="text-blue-600">
                                {family.name}ファミリー - コード: <span className="font-mono font-bold">{family.access_code}</span>
                            </p>
                        </div>
                    </Card>
                    
                    {/* Profiles */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                        {students.map((student) => (
                            <a 
                                key={student.id} 
                                href={route('family.login.student', student.id)}
                                className="block transform transition-all duration-200 hover:scale-105"
                            >
                                <Card className="overflow-hidden border-2 border-blue-100 shadow-md hover:shadow-xl transition-all">
                                    <div className="p-4 text-center">
                                        <div 
                                            className="w-28 h-28 mx-auto rounded-xl mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-md"
                                            style={{ backgroundColor: student.profile_color }}
                                        >
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 mt-2">
                                            <span className="text-lg font-medium text-blue-700">{student.name}</span>
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                    
                    {/* Empty state if no students */}
                    {students.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border-2 border-blue-100 shadow-sm">
                            <Users className="h-16 w-16 mx-auto mb-4 text-blue-200" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">まだがくせいがいません</h3>
                            <p className="text-gray-500 mb-6">せんせいにれんらくしてください</p>
                        </div>
                    )}
                    
                    {/* Back Button */}
                    <div className="mt-12 text-center">
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm"
                            onClick={() => window.location.href = route('family.access')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> もどる
                        </Button>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-12 text-center text-sm text-blue-600 opacity-80">
                        <p>おうちでたのしくえいごをべんきょうしよう！</p>
                        <p className="mt-1">© {new Date().getFullYear()} NoBi</p>
                    </div>
                </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="fixed top-1/2 left-4 w-4 h-4 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="fixed top-1/3 right-4 w-4 h-4 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="fixed bottom-1/4 left-1/4 w-4 h-4 bg-green-300 rounded-full opacity-30 animate-pulse"></div>
            <div className="fixed bottom-1/3 right-1/3 w-4 h-4 bg-purple-300 rounded-full opacity-30 animate-pulse"></div>
        </div>
    );
}