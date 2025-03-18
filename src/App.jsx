import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import QuizesPage from "./pages/QuizesPage";
import AddQuizForm from "./components/AddQuizForm";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/quizes" component={QuizesPage} />
          <Route path="/add-quiz" component={AddQuizForm} />
          <Route path="/about" component={About} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
      <ToastContainer />
    </Router>
  );
}

export default App;
