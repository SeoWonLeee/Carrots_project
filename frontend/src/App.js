import React from "react";
import Header from "./components/Header";
import { Route, Routes, BrowserRouter as Router} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
      </Routes>
    </Router>
  );
}

export default App;