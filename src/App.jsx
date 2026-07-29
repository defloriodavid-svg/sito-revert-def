import { Route, Routes } from "react-router-dom";
import IntroVideo from "./components/IntroVideo";
import ScrollToTop from "./components/ScrollToTop";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Product from "./pages/Product";

export default function App() {
  return (
    <>
      <IntroVideo />
      <ScrollToTop />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:slug" element={<Product />} />
      </Routes>
    </>
  );
}
