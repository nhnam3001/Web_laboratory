import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./components/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useSecretDashboardShortcut } from "./hooks/useSecretDashboardShortcut.js";

import Home from "./pages/Home.jsx";
import News from "./pages/News.jsx";
import Research from "./pages/Research.jsx";
import Funding from "./pages/Funding.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import PublicationsPage from "./pages/PublicationsPage.jsx";
import GroupLeader from "./pages/member/GroupLeader.jsx";
import MemberListPage from "./pages/member/MemberListPage.jsx";

import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import MembersAdmin from "./pages/dashboard/MembersAdmin.jsx";
import MemberForm from "./pages/dashboard/MemberForm.jsx";
import CollectionAdmin from "./pages/dashboard/CollectionAdmin.jsx";
import SettingsAdmin from "./pages/dashboard/SettingsAdmin.jsx";

export default function App() {
  useSecretDashboardShortcut();

  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research/funding" element={<Funding />} />

        <Route path="/member/group-leader" element={<GroupLeader />} />
        <Route
          path="/member/alumni"
          element={
            <MemberListPage
              category="alumni"
              title="Alumni"
              subtitle="Former members of the lab"
            />
          }
        />
        <Route
          path="/member/visiting-members"
          element={
            <MemberListPage
              category="visiting"
              title="Visiting Members"
              subtitle="Researchers visiting the lab"
            />
          }
        />

        <Route
          path="/publications/international-conference"
          element={
            <PublicationsPage
              type="international-conference"
              title="International Conference"
            />
          }
        />
        <Route
          path="/publications/domestic-conference"
          element={
            <PublicationsPage type="domestic-conference" title="Domestic Conference" />
          }
        />
        <Route
          path="/publications/patents"
          element={<PublicationsPage type="patents" title="Patents" />}
        />

        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/members" replace />} />
        <Route path="members" element={<MembersAdmin />} />
        <Route path="members/new" element={<MemberForm />} />
        <Route path="members/:id/edit" element={<MemberForm />} />
        <Route path="news" element={<CollectionAdmin collection="news" />} />
        <Route path="research" element={<CollectionAdmin collection="research" />} />
        <Route path="funding" element={<CollectionAdmin collection="funding" />} />
        <Route path="publications" element={<CollectionAdmin collection="publications" />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
