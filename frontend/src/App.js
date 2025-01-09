import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import ContentCategory from "./components/content/ContentCategory";
import MainContent from "./components/content/MainContent";
import LoginForm from "./components/user/LoginForm";
import { AuthProvider } from "./components/user/AuthContext";
import SignupForm from "./components/user/SignupForm";
import Talk from "./components/talk/Talk";
import Mypage from "./components/user/Mypage";
import CreateProduct from "./components/product/createProduct";
import Product from "./components/product/Product";
import Products from "./components/product/Products";
import Map from "./components/KakaoMap";
import UserPage from "./components/user/UserPage";
import UserEditPage from "./components/user/UserEditPage";
import ScrollToTop from "./components/etc/ScrollToTop";


function App() {
  return (
    <Router>
      <AuthProvider>
      <ScrollToTop />
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
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/sell-product" element={<CreateProduct/>}/>
            <Route path="/product/:productId" element={<Product/>}/>
            <Route path="/buy-sell" element={<Products/>}/>
            <Route path="/maps" element={<Map/>}/>
            <Route path="/users/:userId" element={<UserPage/>}/>
            <Route path="/users/edit" element={<UserEditPage/>}/>
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;