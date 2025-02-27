import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { UserPlus, Users, Palette, School, CalendarDays } from "lucide-react";

export default function AddStudentModal({ onClose, onSubmit, families = [] }) {
    const { data, setData, post, errors, processing } = useForm({
        name: "",
        family_id: "",
        profile_color: "#4F46E5", // Default indigo color
    });
    
    
    // Predefined color options for student profiles
    const colorOptions = [
        { value: "#4F46E5", label: "インディゴ", class: "bg-indigo-600" },
        { value: "#2563EB", label: "ブルー", class: "bg-blue-600" },
        { value: "#0EA5E9", label: "スカイブルー", class: "bg-sky-500" },
        { value: "#06B6D4", label: "シアン", class: "bg-cyan-500" },
        { value: "#10B981", label: "エメラルド", class: "bg-emerald-500" },
        { value: "#84CC16", label: "ライム", class: "bg-lime-500" },
        { value: "#EAB308", label: "イエロー", class: "bg-yellow-500" },
        { value: "#F97316", label: "オレンジ", class: "bg-orange-500" },
        { value: "#EF4444", label: "レッド", class: "bg-red-500" },
        { value: "#EC4899", label: "ピンク", class: "bg-pink-500" },
        { value: "#8B5CF6", label: "バイオレット", class: "bg-violet-500" },
        { value: "#A855F7", label: "パープル", class: "bg-purple-500" },
    ];
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const handleSelectChange = (name, value) => {
        setData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/student', {
            name: data.name,
            family_id: data.family_id,
            profile_color: data.profile_color,
        });
        onClose();
    };
    
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl flex items-center text-blue-800">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
                            生徒を追加
                        </DialogTitle>
                        <DialogDescription className="text-blue-700">
                            新しい生徒の情報を入力してください。
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid gap-5 py-2">
                        {/* Student Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center text-gray-700">
                                <UserPlus className="h-4 w-4 mr-1 text-blue-500" />
                                名前
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={data.name}
                                onChange={handleChange}
                                placeholder="例: 田中太郎"
                                className={errors.name ? "border-red-300" : ""}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>
                        
                        {/* Family Selection */}
                        <div className="grid gap-2">
                            <Label htmlFor="family" className="flex items-center text-gray-700">
                                <Users className="h-4 w-4 mr-1 text-blue-500" />
                                家族
                                <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Select 
                                value={data.family_id} 
                                onValueChange={(value) => handleSelectChange("family_id", value)}
                            >
                                <SelectTrigger className={errors.family_id ? "border-red-300" : ""}>
                                    <SelectValue placeholder="家族を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {families.map(family => (
                                        <SelectItem key={family.id} value={family.id.toString()}>
                                            {family.name} ({family.access_code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.family_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.family_id}</p>
                            )}
                        </div>
                        
                        {/* Profile Color Selection */}
                        <div className="grid gap-2">
                            <Label className="flex items-center text-gray-700">
                                <Palette className="h-4 w-4 mr-1 text-blue-500" />
                                プロフィールカラー
                            </Label>
                            <RadioGroup 
                                value={data.profile_color}
                                onValueChange={(value) => handleSelectChange("profile_color", value)}
                                className="grid grid-cols-6 gap-2"
                            >
                                {colorOptions.map(color => (
                                    <div key={color.value} className="flex items-center space-x-2">
                                        <RadioGroupItem 
                                            value={color.value} 
                                            id={color.value}
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor={color.value}
                                            className={`
                                                h-8 w-8 rounded-full cursor-pointer ring-offset-2 
                                                ${color.class} 
                                                ${data.profile_color === color.value ? 'ring-2 ring-blue-600' : ''}
                                                hover:opacity-90 transition-opacity
                                            `}
                                            title={color.label}
                                        />
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>
                    
                    <DialogFooter className="mt-6 gap-2 flex-row sm:justify-end">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={onClose}
                        >
                            キャンセル
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            生徒を追加
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}