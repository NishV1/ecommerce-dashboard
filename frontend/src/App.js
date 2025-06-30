import './App.css';
import Nav from './components/Nav';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import CheckSignedIn from './components/CheckSignedIn';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import UpdateProduct from './components/UpdateProduct';
import Profile from './components/Profile';
import Signout from './components/Signout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <main className="main-content">
          <Routes>
            <Route element={<CheckSignedIn />}>
              <Route path="/add" element={<AddProduct />} />
              <Route path="/update/:id" element={<UpdateProduct />} />
              <Route path="/signout" element={<Signout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;