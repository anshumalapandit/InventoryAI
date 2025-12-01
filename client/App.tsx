import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import Operations from "./pages/Operations";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import PlantManager from "./pages/PlantManager";
import Procurement from "./pages/Procurement";
import Predict from "./pages/Predict";
import Index from "./pages/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Public Landing Page */}
        <Route path="/" element={<Index />} />

          {/* Protected Routes */}
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        } />

        {/* Manager Routes */}
        <Route path="/plant-manager" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <PlantManager />
          </ProtectedRoute>
        } />
        <Route path="/operations" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Operations />
          </ProtectedRoute>
        } />
        <Route path="/procurement" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <Procurement />
          </ProtectedRoute>
        } />

        {/* Analyst Routes */}
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={["analyst"]}>
            <Analytics />
          </ProtectedRoute>
        } />

        {/* Predict Route - PUBLIC, no login required */}
        <Route path="/predict" element={<Predict />} />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
