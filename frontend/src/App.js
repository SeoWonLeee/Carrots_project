import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ContentCategory from "./components/content/ContentCategory";
import MainContent from "./components/content/MainContent";
import LoginForm from "./components/user/LoginForm";
import { AuthProvider } from "./components/user/AuthContext";
import SignupForm from "./components/user/SignupForm";
import Talk from "./components/talk/Talk";
import Mypagee from "./components/user/MyPagee";
import CreateProduct from "./components/product/createProduct";
import Product from "./components/product/Product";
import Products from "./components/product/Products";
import Map from "./components/KakaoMap";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={
              <div>
                <MainContent />
                <ContentCategory />
              </div>
            } />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/talk" element={<Talk />} />
            <Route path="/talk/:roomId" element={<Talk />} />
            <Route path="/mypage" element={<Mypagee />} />
            <Route path="/sell-product" element={<CreateProduct/>}/>
            <Route path="/product/:productId" element={<Product/>}/>
            <Route path="/buy-sell" element={<Products/>}/>
            <Route path="/maps" element={<Map/>}/>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;