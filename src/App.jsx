import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import { DemoModeProvider } from "./contexts/DemoModeProvider";
import { useDemoMode } from "./hooks/useDemoMode";

const HomeRoute = () => {
  const { isDemo } = useDemoMode();
  const location = useLocation();
  const isOnboarded = sessionStorage.getItem("uid");

  if (isDemo || (isOnboarded && !location.state?.fromDemo)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
};

const App = () => {
  return (
    <BrowserRouter>
      <DemoModeProvider>
        <ScrollToTop />

        <Routes>
        <Route path="/" element={<HomeRoute />} />

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
      </DemoModeProvider>
    </BrowserRouter>
  );
};

export default App;