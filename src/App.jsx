import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UserPage from "./pages/UserPage";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import QuizDisplay from "./pages/QuizDisplay";
import QuizPlay from "./pages/QuizPlay";
import CreateQuiz from "./pages/CreateQuiz";
import CategoryRoute from "./routes/CategoryRoute";
import OtherUserPage from "./pages/OtherUserPage";
import QuizEdit from "./pages/QuizEdit";
import LandingPage from "./pages/LandingPage";
import DesignSystemPage from "./pages/DesignSystemPage";
import ProfileSetup from "./pages/ProfileSetup";
import StatisticsPage from "./pages/Statistics";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route
            element={
              <ProtectedRoute info="Zaloguj się aby ukończyć konfigurację profilu" />
            }
          >
            <Route path="/profile-setup" element={<ProfileSetup />} />
          </Route>
          {/* Pages with duolingo layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="app" element={<Home />} />
            {/* Temporary Design System Showcase */}
            <Route path="design-system" element={<DesignSystemPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path=":category"
              element={
                <CategoryRoute>
                  <Home />
                </CategoryRoute>
              }
            />
            <Route path="profile/:username" element={<OtherUserPage />} />
            <Route path="quiz/:quizId" element={<QuizDisplay />} />
            <Route
              element={<ProtectedRoute info="Zaloguj się aby uzyskać dostęp" />}
            >
              {/* Tworzenie nowego quizu */}
              <Route path="newquiz" element={<CreateQuiz />} />
              {/* Edycja profilu */}
              <Route path="user/edit-profile" element={<EditProfile />} />\{" "}
              {/* Edycja quizu */}
              <Route path="quiz/edit/:quizId" element={<QuizEdit />} />
            </Route>
            {/* 404 */}
            <Route path="not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          <Route
            element={<ProtectedRoute info="Zaloguj się aby uzyskać dostęp" />}
            >
            <Route path="user/details" element={<UserPage />} />
          </Route>
            </Route>
          {/* QuizPlay with different layout */}
          <Route
            element={<ProtectedRoute info="Zaloguj się aby uzyskać dostęp" />}
          >
            {/* Gra w quizy */}
            <Route path="quiz/play/:quizId" element={<QuizPlay />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
