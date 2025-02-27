<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeworkController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\FamilyController;
use App\Http\Controllers\CalendarController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('family.access');
});

Route::get('/family/access', function () {
    return Inertia::render('Families/Access');
})->name('family.access');

Route::post('/family/access', [FamilyController::class, 'access'])
    ->name('family.access.submit');

Route::get('/family/profiles', [FamilyController::class, 'showProfiles'])
    ->name('family.profiles');

Route::get('/family/login/{student}', [FamilyController::class, 'loginAsStudent'])
    ->name('family.login.student');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/teacher-dashboard', [TeacherDashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('teacher-dashboard');
    Route::get('/homework', [HomeworkController::class, 'index'])->name('homework.index');
    Route::get('/homework/{id}', [HomeworkController::class, 'show'])->name('homework.show');
    Route::post('/homework', [HomeworkController::class, 'store'])->name('homework.store');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
    Route::get('/homework-history', [HomeworkController::class, 'history'])->name('homework.history');
    Route::delete('/homework/{id}', [HomeworkController::class, 'destroy'])->name('homework.destroy');
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/debug-media/{id}', function ($id) {
    $homework = App\Models\Homework::findOrFail($id);
    $media = $homework->getFirstMedia('diary_images');

    if (!$media) {
        return ['error' => 'No media found'];
    }

    return [
        'id' => $media->id,
        'file_name' => $media->file_name,
        'path' => $media->getPath(),
        'url' => $media->getUrl(),
        'disk' => $media->disk,
        'file_exists' => file_exists($media->getPath()),
        'collection' => $media->collection_name,
    ];
});

Route::get('/homework-images/{id}', function ($id) {
    $homework = App\Models\Homework::findOrFail($id);

    if (!$homework->hasMedia('diary_images')) {
        abort(404);
    }

    $media = $homework->getFirstMedia('diary_images');
    $path = $media->getPath();

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path);
})->name('homework.image');

require __DIR__ . '/auth.php';
