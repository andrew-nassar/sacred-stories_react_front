import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useStories } from './sacred-stories/hooks/useStories';
import DashboardPage from './dashboard/pages/DashboardPage';
import ArchivePage from './sacred-stories/pages/ArchivePage';
import PendingReviewsPage from './pending-reviews/pages/PendingReviewsPage';
import UserDirectoryPage from './users/pages/UserDirectoryPage';
import CreateStoryPage from './create-story/pages/CreateStoryPage';
import SettingsPage from './settings/pages/SettingsPage';
import Sidebar from './shared/components/Sidebar';
import { PortalUser } from './shared/types';
import { AuthApi } from '../auth/api/auth.api';
import { useNavigate } from "react-router-dom";
const ALLOWED_ADMIN_ROLES = ['Admin', 'Archivist', 'Chief Editor'];
export default function AdminIndexPage() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
    const navigate = useNavigate();

  // Helper function to read current user from AuthApi
  const getAuthUser = (): PortalUser | null => {
    const user = AuthApi.getStoredUser(); // Directly query AuthApi
    if (!user) return null;
    return {
      id: user.id || 'usr-admin',
      name: user.userName || user.email || 'Admin User',
      email: user.email || '',
      role: user.role || '',
      status: (user.status as 'Active' | 'Inactive' | 'Pending') || 'Active',
      avatarUrl:
        user.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      verified: user.verified ?? true,
      joinDate: user.joinDate || new Date().toISOString(),
    };
  };

  // State initialization directly using AuthApi methods
  const [currentUser, setCurrentUser] = useState<PortalUser | null>(() => getAuthUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(AuthApi.getStoredToken()));

  // Dynamic role validation check
  const isAuthorizedRole = currentUser ? ALLOWED_ADMIN_ROLES.includes(currentUser.role) : false;

  // Sync component state with AuthApi state
  const syncAuthState = useCallback(() => {
    const token = AuthApi.getStoredToken();
    const user = getAuthUser();

    setIsAuthenticated(Boolean(token));
    setCurrentUser(user);
  }, []);

  // Listen for global auth session events dispatched by AuthApi
  useEffect(() => {
    const handleLogout = () => {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentView('dashboard');
    };

    const handleLogin = () => {
      syncAuthState();
    };

    // Attach event listeners
    window.addEventListener('admin-login', handleLogin);
    window.addEventListener('admin-logout', handleLogout);
    window.addEventListener('admin-session-expired', handleLogout);
    window.addEventListener('storage', syncAuthState); // Sync across browser tabs

    return () => {
      window.removeEventListener('admin-login', handleLogin);
      window.removeEventListener('admin-logout', handleLogout);
      window.removeEventListener('admin-session-expired', handleLogout);
      window.removeEventListener('storage', syncAuthState);
    };
  }, [syncAuthState]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleReviewStory = (storyId: string) => {
    setCurrentView('pending');
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('open-story-review', { detail: { storyId } })
      );
    }, 50);
  };

  // Top-level counts
  const { stories } = useStories();
  const pendingCount = stories.filter((s) => s.status === 'Pending').length;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onReviewStory={handleReviewStory}
          />
        );
      case 'archive':
        return <ArchivePage />;
      case 'pending':
        return <PendingReviewsPage />;
      case 'users':
        return <UserDirectoryPage />;
      case 'creator':
        return <CreateStoryPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="p-8 text-stone-500">
            Select an item from the sidebar.
          </div>
        );
    }
  };

  // 1. Not Authenticated State
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-8 select-none">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-6">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto border border-amber-100">
            <span className="font-serif text-xl font-bold">✙</span>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Session Required
            </h3>
            <p className="text-stone-500 text-xs leading-normal">
              Please sign in through the primary authentication portal to access
              the Curator Panel.
            </p>
          </div>
          <button
           onClick={() => {
              AuthApi.logout();
              navigate("/login");
            }}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // 2. Unauthorized Role State (User logged in, but not Admin/Archivist/Chief Editor)
  if (!isAuthorizedRole) {
    return (
      <div className="h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-8 select-none">
        <div
          id="unauthorized-card"
          className="max-w-md w-full bg-white border border-stone-200 rounded-xl p-8 shadow-sm text-center space-y-6"
        >
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto border border-red-100">
            <ShieldAlert size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              ✙ Unauthorized Access
            </h3>
            <p className="text-stone-500 text-xs leading-normal">
              Only members with Admin or Archivist privileges are permitted to
              enter the Sanctuary.
            </p>
          </div>
          <button
            id="btn-unauthorized-logout"
            onClick={() => {
  AuthApi.logout();
  navigate("/login");
}}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            Sign in with another account
          </button>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin Portal Layout
  return (
    <div
      id="portal-root-layout"
      className="flex h-screen bg-[#FAF9F5] text-stone-800 font-sans overflow-hidden"
    >
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        pendingCount={pendingCount}
      />
      <main
        id="portal-main-workspace"
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
      >
        {renderView()}
      </main>
    </div>
  );
}