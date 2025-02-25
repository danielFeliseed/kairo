<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['teacher', 'student'])->default('student')->after('password');
            $table->foreignId('teacher_id')->nullable()->after('role')->constrained('users');
            $table->foreignId('family_id')->nullable()->after('teacher_id')->constrained('families');
            $table->string('profile_color', 7)->nullable()->after('family_id');
            $table->string('email')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['family_id']);
            $table->dropColumn(['role', 'teacher_id', 'family_id', 'profile_color']);
            $table->string('email')->nullable(false)->change();
        });
    }
};