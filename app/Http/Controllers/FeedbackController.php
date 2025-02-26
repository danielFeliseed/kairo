<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Homework;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'feedback_text' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $feedback = Feedback::create([
            'feedback_text' => $request->feedback_text,
            'rating' => $request->rating,
            'homework_id' => $request->homework_id,
            'teacher_id' => Auth::user()->id,
        ]);

        $homework = Homework::find($request->homework_id);
        $homework->update([
            'status' => 'reviewed',
        ]);

        return redirect()->back()->with('success', 'フィードバックを送信しました');
    }
}
