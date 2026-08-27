import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import TraineeLayout from './layouts/TraineeLayout';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ExploreCourses from './pages/ExploreCourses';
import CourseDetails from './pages/CourseDetails';
import MyLearning from './pages/MyLearning';
import LearningPlayer from './pages/LearningPlayer';
import Library from './pages/Library';
import Assessments from './pages/Assessments';
import MCQExperience from './pages/MCQExperience';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import TrainerApplication from './pages/TrainerApplication';
import AdminRegister from './pages/admin/AdminRegister';

import TrainerLayout from './layouts/TrainerLayout';
// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerCourses from './pages/trainer/TrainerCourses';
import CreateCourse from './pages/trainer/CreateCourse';
import CourseManagement from './pages/trainer/CourseManagement';
import TrainerResources from './pages/trainer/TrainerResources';
import TrainerAssessments from './pages/trainer/TrainerAssessments';
import CreateAssessment from './pages/trainer/CreateAssessment';
import AssessmentResults from './pages/trainer/AssessmentResults';
import TrainerTrainees from './pages/trainer/TrainerTrainees';
import TraineeProfileView from './pages/trainer/TraineeProfileView';
import TrainerPerformance from './pages/trainer/TrainerPerformance';
import TrainerFeedback from './pages/trainer/TrainerFeedback';
import TrainerProfile from './pages/trainer/TrainerProfile';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import UserDetails from './pages/admin/UserDetails';
import TrainerApprovals from './pages/admin/TrainerApprovals';
import AdminCourses from './pages/admin/AdminCourses';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminAssessments from './pages/admin/AdminAssessments';
import AdminCertifications from './pages/admin/AdminCertifications';
import CompetencyMapping from './pages/admin/CompetencyMapping';
import LearningContent from './pages/admin/LearningContent';
import Announcements from './pages/admin/Announcements';
import AdminReports from './pages/admin/AdminReports';
import AdminProfile from './pages/admin/AdminProfile';
import SystemSettings from './pages/admin/SystemSettings';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/trainer/apply" element={<TrainerApplication />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          <Route path="/trainee" element={<TraineeLayout />}>
            <Route index element={<Navigate to="/trainee/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<ExploreCourses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="learning" element={<MyLearning />} />
            <Route path="learning/:id" element={<LearningPlayer />} />
            <Route path="library" element={<Library />} />
            <Route path="assessments" element={<Assessments />} />
            <Route path="assessments/:id" element={<MCQExperience />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/trainer" element={<TrainerLayout />}>
            <Route index element={<Navigate to="/trainer/dashboard" replace />} />
            <Route path="dashboard" element={<TrainerDashboard />} />
            <Route path="courses" element={<TrainerCourses />} />
            <Route path="courses/create" element={<CreateCourse />} />
            <Route path="courses/:id" element={<CourseManagement />} />
            <Route path="resources" element={<TrainerResources />} />
            <Route path="assessments" element={<TrainerAssessments />} />
            <Route path="assessments/create" element={<CreateAssessment />} />
            <Route path="assessments/:id" element={<AssessmentResults />} />
            <Route path="trainees" element={<TrainerTrainees />} />
            <Route path="trainees/:id" element={<TraineeProfileView />} />
            <Route path="performance" element={<TrainerPerformance />} />
            <Route path="feedback" element={<TrainerFeedback />} />
            <Route path="profile" element={<TrainerProfile />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="trainer-approvals" element={<TrainerApprovals />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="assessments" element={<AdminAssessments />} />
            <Route path="certifications" element={<AdminCertifications />} />
            <Route path="competencies" element={<CompetencyMapping />} />
            <Route path="content" element={<LearningContent />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
