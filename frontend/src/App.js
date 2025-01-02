import React from "react";
import Header from "./components/header/Header";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ContentCategory from "./components/content/ContentCategory";
import MainContent from "./components/content/MainContent";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
        <Route path="/" element={
              <div>
                <MainContent/>
                <ContentCategory />
              </div>
            } />
          <Route path="/" element={<Header />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;