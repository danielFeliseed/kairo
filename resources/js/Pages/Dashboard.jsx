import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TeacherDashboard from '@/Pages/TeacherDashboard';
import StudentDashboard from '@/Pages/StudentDashboard';

export default function Dashboard({ auth, students, recentHomework, families, currentStreak, longestStreak, lastSubmission, currentStreakPercentage, latestHomework, latestFeedback }) {
    const { user } = auth;
    console.log(user);

    if (user.role === 'teacher') {
        return <TeacherDashboard students={students} recentHomework={recentHomework} families={families} />;
    } else {
        return <StudentDashboard user={user} currentStreak={currentStreak} longestStreak={longestStreak} lastSubmission={lastSubmission} currentStreakPercentage={currentStreakPercentage} latestHomework={latestHomework} latestFeedback={latestFeedback} />;
    }
}

