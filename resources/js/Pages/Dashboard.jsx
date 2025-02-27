import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TeacherDashboard from '@/Pages/TeacherDashboard';
import StudentDashboard from '@/Pages/StudentDashboard';

export default function Dashboard({ auth }) {
    const { user } = auth;

    if (user.role === 'teacher') {
        return <TeacherDashboard />;
    } else {
        return <StudentDashboard />;
    }
}

