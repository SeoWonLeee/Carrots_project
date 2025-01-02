import React from "react";
import Header from "./components/header/Header";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ContentCategory from "./components/content/ContentCategory";
import MainContent from "./components/content/MainContent";
import LoginForm from "./components/user/LoginForm";
import { AuthProvider } from "./components/user/AuthContext";
import SignupForm from "./components/user/SignupForm";


function App() {
  return (
    <Router>
          <AuthProvider>
      <Layout>
        <Routes>
        <Route path="/" element={
              <div>
                <MainContent/>
                <ContentCategory />
              </div>
            } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
      </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;