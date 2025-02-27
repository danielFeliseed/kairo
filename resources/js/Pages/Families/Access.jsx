// resources/js/Pages/Families/Access.jsx
import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import ApplicationLogo from '@/Components/ApplicationLogo';
import { BookOpen, Star, Sparkles, Key } from 'lucide-react';
// import { Toaster } from "@/Components/ui/sonner";

export default function Access({ errors }) {
    const { data, setData, post, processing } = useForm({
        access_code: '',
    });
    // const { toast } = Toaster();

    const [codeChars, setCodeChars] = useState(['', '', '', '', '', '']);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Create refs for each input
    const inputRefs = Array(6).fill(0).map(() => React.createRef());
    
    useEffect(() => {
        // Focus the first input on mount
        if (inputRefs[0].current) {
            inputRefs[0].current.focus();
        }
    }, []);
    
    const handleCodeChange = (index, value) => {
        // Update the character at this index
        const newCodeChars = [...codeChars];
        newCodeChars[index] = value.toUpperCase();
        setCodeChars(newCodeChars);
        
        // Update the form data with the full code
        setData('access_code', newCodeChars.join(''));
        
        // Move to next input if this one is filled
        if (value && index < 5) {
            setActiveIndex(index + 1);
            inputRefs[index + 1].current.focus();
        }
    };
    
    const handleKeyDown = (index, e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !codeChars[index] && index > 0) {
            setActiveIndex(index - 1);
            inputRefs[index - 1].current.focus();
        }
    };
    
    const submit = (e) => {
        e.preventDefault();
        setIsAnimating(true);
        
        // Add a small delay to show the animation
        setTimeout(() => {
            post(route('family.access.submit'));
            setIsAnimating(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
            <Head title="NoBi - かぞくログイン" />
            
            <div className="w-full max-w-md">
                {/* Logo and App Name */}
                <div className="text-center mb-8">
                    <div className="flex justify-center">
                        <ApplicationLogo className="h-20 w-20" />
                    </div>
                    <h1 className="mt-4 text-3xl font-bold text-blue-700">NoBi</h1>
                    <p className="text-blue-600 mt-1">おうちでべんきょう</p>
                </div>
                
                <Card className="border-2 border-blue-100 shadow-lg overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 bg-yellow-100 rounded-full opacity-70"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 -mb-6 -ml-6 bg-blue-100 rounded-full opacity-70"></div>
                    
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6 relative">
                        <div className="absolute top-2 right-2">
                            <Star className="h-5 w-5 text-yellow-400" />
                        </div>
                        <CardTitle className="text-2xl text-center text-blue-700 flex items-center justify-center">
                            <Key className="h-5 w-5 mr-2 text-blue-500" />
                            かぞくログイン
                        </CardTitle>
                        <CardDescription className="text-center text-blue-600">
                            せんせいからもらったコードをいれてね
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Code input boxes */}
                                <div className="flex justify-center space-x-2">
                                    {codeChars.map((char, index) => (
                                        <div key={index} className="relative">
                                            <input
                                                ref={inputRefs[index]}
                                                type="text"
                                                maxLength="1"
                                                value={char}
                                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className={`
                                                    w-10 h-12 text-center text-xl font-bold uppercase 
                                                    border-2 rounded-lg focus:outline-none focus:ring-2
                                                    ${index === activeIndex ? 'border-blue-500 ring-blue-300' : 'border-gray-200'}
                                                    ${char ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700'}
                                                    transition-all duration-200
                                                `}
                                            />
                                            {index < 5 && (
                                                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-gray-300">
                                                    -
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                
                                {errors.access_code && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm border border-red-200">
                                        {errors.access_code}
                                    </div>
                                )}
                                
                                <Button 
                                    type="submit" 
                                    className={`w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
                                    disabled={processing || data.access_code.length < 6}
                                >
                                    {isAnimating ? (
                                        <span className="flex items-center">
                                            <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                                            ログインちゅう...
                                        </span>
                                    ) : (
                                        "ログイン"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    
                    <CardFooter className="flex justify-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-t border-blue-100">
                        <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">
                                せんせいのログインは
                            </p>
                            <a href="/login" className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline">
                                <BookOpen className="h-4 w-4 mr-1" />
                                こちら
                            </a>
                        </div>
                    </CardFooter>
                </Card>
                
                {/* Decorative elements */}
                <div className="mt-8 text-center text-sm text-blue-600 opacity-80">
                    <p>おうちでたのしくえいごをべんきょうしよう！</p>
                </div>
            </div>
            
            {/* Background decorations */}
            <div className="fixed top-10 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-20"></div>
            <div className="fixed bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
            <div className="fixed top-1/4 right-1/4 w-8 h-8 bg-purple-200 rounded-full opacity-20"></div>
        </div>
    );
}