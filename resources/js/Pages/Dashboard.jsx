import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TeacherDashboard from '@/Pages/TeacherDashboard';
import StudentDashboard from '@/Pages/StudentDashboard';

export default function Dashboard({ auth, students, recentHomework, families }) {
    const { user } = auth;
    console.log(user);

    if (user.role === 'teacher') {
        return <TeacherDashboard students={students} recentHomework={recentHomework} families={families} />;
    } else {
        return <StudentDashboard user={user} />;
    }
}

