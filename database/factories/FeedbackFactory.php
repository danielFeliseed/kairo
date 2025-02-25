<?php

namespace Database\Factories;

use App\Models\Feedback;
use App\Models\Homework;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FeedbackFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Feedback::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a reviewed homework or create one
        $homework = Homework::where('status', 'reviewed')->doesntHave('feedback')->inRandomOrder()->first()
                  ?? Homework::factory()->reviewed()->create();
        
        // Get the student's teacher
        $student = User::find($homework->student_id);
        $teacher = User::find($student->teacher_id);
        
        // Japanese feedback phrases for English homework
        $feedbackPhrases = [
            'とても上手です！カタカナの練習を続けてください。',
            '素晴らしい努力です。単語のスペルに気をつけましょう。',
            '日記の内容がとても面白いです。英語の文法に注意してください。',
            'よく書けています。次回は長い文章に挑戦してみましょう。',
            'すごく上達しています！これからも頑張ってください。',
            '読みやすい文章です。発音の練習も続けましょう。',
            '創造性が素晴らしいです。英語の時制に気をつけましょう。',
            '毎日の練習の成果が出ています。素晴らしい！',
            '日本語と英語の対応がとても良いです。',
            'あなたの英語日記はいつも楽しみです。今日もよく書けていました。'
        ];
        
        return [
            'homework_id' => $homework->id,
            'teacher_id' => $teacher->id,
            'feedback_text' => $this->faker->randomElement($feedbackPhrases),
            'rating' => $this->faker->numberBetween(3, 5), // More positive ratings
        ];
    }
}