import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AddExpense from "./pages/AddExpense";
import Charts from "./pages/Charts";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import Currency from "./pages/Currency";
import CategoryBudgets from "./pages/CategoryBudgets";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const isOnboarded = sessionStorage.getItem("uid");

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Public marketing homepage. Logged-in users skip straight to the
            dashboard; everyone else sees the real landing page instead of
            being bounced straight to onboarding. */}
        <Route
          path="/"
          element={
            isOnboarded ? <Navigate to="/dashboard" /> : <LandingPage />
          }
        />

        <Route path="/onboarding" element={<Onboarding />} />

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
          path="/currency"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Currency />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/category-budgets"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CategoryBudgets />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;