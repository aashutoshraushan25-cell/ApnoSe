import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeaderBanner } from './components/layout/HeaderBanner';
import { FamilySectionBar } from './components/family/FamilySectionBar';
import { CreatePostCard } from './components/feed/CreatePostCard';
import { CreatePostModal } from './components/feed/CreatePostModal';
import { FeedFilters, FeedFilterType } from './components/feed/FeedFilters';
import { PostCard } from './components/feed/PostCard';
import { FamilyPage } from './components/family/FamilyPage';
import { AddFamilyMemberModal } from './components/family/AddFamilyMemberModal';
import { FriendsPage } from './components/friends/FriendsPage';
import { MessagesPage } from './components/messages/MessagesPage';
import { VideoCallModal } from './components/calls/VideoCallModal';
import { AudioCallModal } from './components/calls/AudioCallModal';
import { CommunitiesPage } from './components/communities/CommunitiesPage';
import { BirthdayReminders } from './components/birthdays/BirthdayReminders';
import { VoiceToPostModal } from './components/voice/VoiceToPostModal';
import { AIAssistantBot } from './components/assistant/AIAssistantBot';
import { SafetyCenterPage } from './components/safety/SafetyCenterPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { SettingsPage } from './components/settings/SettingsPage';
import { LandingPage } from './components/auth/LandingPage';
import { Toast } from './components/common/Toast';
import { Sparkles, Heart } from 'lucide-react';

export const MainAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeTab, posts, searchQuery } = useApp();
  const [feedFilter, setFeedFilter] = useState<FeedFilterType>('all');

  // If user is not authenticated, display the Landing Page!
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Filter posts based on tab & search query
  const filteredPosts = posts.filter((post) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = post.text.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q);
      const matchLoc = post.location?.toLowerCase().includes(q);
      if (!matchText && !matchAuthor && !matchLoc) return false;
    }

    // Feed tab filter match
    if (feedFilter === 'family') {
      return post.audience === 'family' || post.authorRelation === 'पत्नी' || post.authorRelation === 'भाई' || post.authorRelation === 'माताजी' || post.authorRelation === 'आप';
    }
    if (feedFilter === 'friends') {
      return post.audience === 'friends' || post.authorRelation === 'मित्र' || post.authorRelation === 'आप';
    }
    if (feedFilter === 'communities') {
      return !!post.communityId;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-warm-900 pb-20 lg:pb-8">
      
      {/* Top Main Navigation Bar */}
      <Navbar />

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex-1 flex justify-center pt-4 sm:pt-6">
        
        {/* Dynamic Center Main Content Area */}
        <main className={`w-full min-w-0 transition-all duration-300 ${activeTab === 'messages' ? 'max-w-6xl' : 'max-w-4xl'}`}>
          
          {/* TAB 1: HOME FEED */}
          {activeTab === 'home' && (
            <div className="space-y-2 animate-in fade-in">
              <HeaderBanner />
              <FamilySectionBar />
              <CreatePostCard />
              <FeedFilters
                activeFilter={feedFilter}
                onChangeFilter={setFeedFilter}
              />

              {/* Feed Post List */}
              <div className="space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-warm-200 shadow-soft">
                    <Sparkles className="w-12 h-12 text-brand-300 mx-auto mb-2" />
                    <p className="text-lg font-bold text-warm-700 font-devanagari">
                      कोई पोस्ट नहीं मिली। आप एक नई पोस्ट लिखकर शुरुआत करें! 🌸
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAMILY */}
          {activeTab === 'family' && <FamilyPage />}

          {/* TAB 3: FRIENDS */}
          {activeTab === 'friends' && <FriendsPage />}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && <MessagesPage />}

          {/* TAB 5: COMMUNITIES */}
          {activeTab === 'communities' && <CommunitiesPage />}

          {/* TAB 6: BIRTHDAYS */}
          {activeTab === 'birthdays' && <BirthdayReminders />}

          {/* TAB 7: NOTIFICATIONS */}
          {activeTab === 'notifications' && <NotificationsPage />}

          {/* TAB 8: SAFETY */}
          {activeTab === 'safety' && <SafetyCenterPage />}

          {/* TAB 9: PROFILE */}
          {activeTab === 'profile' && <ProfilePage />}

          {/* TAB 10: SETTINGS */}
          {activeTab === 'settings' && <SettingsPage />}

        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <CreatePostModal />
      <VoiceToPostModal />
      <AddFamilyMemberModal />
      <VideoCallModal />
      <AudioCallModal />
      
      {/* Floating AI Sarathi Help Assistant */}
      <AIAssistantBot />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Accessible Toast Notification System */}
      <Toast />

    </div>
  );
};
