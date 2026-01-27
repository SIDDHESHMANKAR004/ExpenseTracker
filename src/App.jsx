import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import Charts from "./pages/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Settings from "./pages/Settings";
import UserDetails from "./pages/UserDetails";
import Currency from "./pages/Currency";

const App = () => {
  const isOnboarded = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isOnboarded ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* All pages WITH bottom navigation */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Charts />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Reports />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-expense"
          element={
            <ProtectedRoute>
              <AppLayout>
                <AddExpense />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-details"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UserDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/currency"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Currency />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
