// resources/js/Pages/Families/Profiles.jsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { ArrowLeft } from 'lucide-react';

export default function Profiles({ family, students }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <Head title="プロフィール選択" />
            
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">だれですか？</h1>
                        <p className="text-gray-400 text-lg">
                            {family.name} - コード: {family.access_code}
                        </p>
                    </div>
                    
                    {/* Profiles */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                        {students.map((student) => (
                            <a 
                                key={student.id} 
                                href={route('family.login.student', student.id)}
                                className="block"
                            >
                                <div className="flex flex-col items-center group">
                                    <div 
                                        className="w-32 h-32 rounded-md mb-4 flex items-center justify-center text-white text-5xl font-bold transition-transform group-hover:scale-110 group-hover:ring-4 ring-white"
                                        style={{ backgroundColor: student.profile_color }}
                                    >
                                        {student.name}
                                    </div>
                                    <span className="text-xl mb-1">{student.name}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                    
                    {/* Back Button */}
                    <div className="mt-16 text-center">
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="bg-transparent border-white/20 text-white hover:bg-white/10"
                            onClick={() => window.location.href = route('family.access')}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> もどる
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}