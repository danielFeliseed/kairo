import React from 'react';

export function ColorPicker({ color, onChange }) {
    const colors = [
        '#4F46E5', // Indigo
        '#10B981', // Emerald
        '#EF4444', // Red
        '#F59E0B', // Amber
        '#6366F1', // Indigo
        '#8B5CF6', // Violet
        '#EC4899', // Pink
        '#14B8A6', // Teal
        '#F97316', // Orange
        '#06B6D4', // Cyan
    ];

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex space-x-2">
                {colors.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className={`w-8 h-8 rounded-full ${
                            color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: c }}
                        onClick={() => onChange(c)}
                    />
                ))}
            </div>
            <div className="flex items-center space-x-2">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-8 w-8 border-0 p-0"
                />
                <span className="text-sm text-gray-600">カスタムカラー</span>
            </div>
        </div>
    );
} 