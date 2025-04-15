import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UserPage from "./pages/UserPage";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import QuizDisplay from "./pages/QuizDisplay";
import QuizPlay from "./pages/QuizPlay";
import CreateQuiz from "./pages/CreateQuiz";
import CategoryRoute from "./routes/CategoryRoute";
import OtherUserPage from "./pages/OtherUserPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              element={
                <ProtectedRoute message="Musisz się zalogować aby stworzyć quiz" />
              }
            >
              <Route path="newquiz" element={<CreateQuiz />} />
            </Route>
            <Route path="user/login" element={<Login />} />
            <Route path="user/signup" element={<Signup />} />
            <Route path="user/reset-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="user/details" element={<UserPage />} />
            </Route>
            <Route path="quiz/:quizId" element={<QuizDisplay />} />
            <Route path="quiz/play/:quizId" element={<QuizPlay />} />
            <Route
              path=":category"
              element={
                <CategoryRoute>
                  <Home />
                </CategoryRoute>
              }
            />
            <Route path="profile/:uuid" element={<OtherUserPage />} />
            <Route path="not-found" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
