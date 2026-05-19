import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import RootLayout from './routes/_layout'
import HomePage from './routes/index'
import LoginPage from './routes/login'
import RegisterPage from './routes/register'
import AuthCallbackPage from './routes/auth-callback'
import ProfilePage from './routes/profile'
import ProfileEditPage from './routes/profile/edit'
import SearchPage from './routes/search'
import GroupsPage from './routes/groups/index'
import GroupDetailPage from './routes/groups/$id'
import CreateGroupPage from './routes/groups/create'
import EventsPage from './routes/events/index'
import EventDetailPage from './routes/events/$id'
import ChatListPage from './routes/chat/index'
import ChatConversationPage from './routes/chat/$id'
import GroupChatPage from './routes/chat/group.$groupId'
import CareersPage from './routes/academic/careers'
import SubjectsPage from './routes/academic/subjects'
import ExternalProfilePage from './routes/user/$id'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Page not found</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
          Go Home
        </a>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },

  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <ProfileEditPage /> },
      { path: 'profile/:id', element: <ProfilePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'groups/create', element: <CreateGroupPage /> },
      { path: 'groups/:id', element: <GroupDetailPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'chat', element: <ChatListPage /> },
      { path: 'chat/:id', element: <ChatConversationPage /> },
      { path: 'chat/group/:groupId', element: <GroupChatPage /> },
      { path: 'academic/careers', element: <CareersPage /> },
      { path: 'academic/subjects', element: <SubjectsPage /> },
      { path: 'user/:id', element: <ExternalProfilePage /> },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
