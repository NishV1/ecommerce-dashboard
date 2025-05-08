import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import CheckSignedIn from './components/CheckSignedIn';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav />
      <Routes>
        <Route element={<CheckSignedIn />}>
          <Route path="/products" element={<h1>Product Listing Component</h1>} />
          <Route path="/add" element={<h1>Add Product Component</h1>} />
          <Route path="/update" element={<h1>Update Product Component</h1>} />
          <Route path="/signout" element={<h1>Signout Component</h1>} />
          <Route path="/profile" element={<h1>Profile Component</h1>} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}
export default App;