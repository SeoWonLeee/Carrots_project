import React from "react";
import Header from "./components/header/Header";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ContentCategory from "./components/content/ContentCategory";
import MainContent from "./components/content/MainContent";
import LoginForm from "./components/user/LoginForm";
import { AuthProvider } from "./components/user/AuthContext";


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
          <Route path="/" element={<Header />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;