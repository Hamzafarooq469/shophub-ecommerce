// import './App.css'
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
// Import CSS for toast notifications

import axios from 'axios';

// Layout
import Layout from './Components/Shared/Layout';

// Pages - Auth Page
import SignUp from './Pages/AuthPage/SignUp'
import SignIn from './Pages/AuthPage/SignIn';
import NotAuthorized from './Pages/AuthPage/NotAuthorized';
import SignOut from "./Pages/AuthPage/SignOut";

// Pages - General Page
import Cart from './Pages/General Page/Cart';
import Home from './Pages/General Page/Home';
import Createshipping from './Pages/General Page/CreateShipping';
import UpdateShipping from "./Pages/General Page/UpdateShipping"
import GetShippingInfo from './Pages/General Page/GetShippingInfo';
import Order from './Pages/General Page/Order';
import GetOrder from './Pages/General Page/GetOrder';

// Components 
import GetProductDetails from './Components/GetProductDetails';

// Admin
import GetProductDetailsForAdmin from './Admin/Manage Product/GetProductDetailsForAdmin';
import CreateProduct from './Admin/Manage Product/CreateProduct';
import GetAllProducts from './Admin/Manage Product/GetAllProducts';
import AdminProtectedRoute from './Admin/AdminProtectedRoute';
import UpdateProduct from './Admin/Manage Product/UpdateProduct';

// Configure axios with environment-based base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const AdminRoute = ({ children }) => (
  <AdminProtectedRoute>
    {children}
  </AdminProtectedRoute>
);

function App() {
  return (
    <Router>
      <Layout>
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* General Page */}
          <Route path='/' element={<Home/>}/>
          <Route path='/cart' element={<Cart/>} />

          {/* Auth Pages */}
          <Route path='/signUp' element={<SignUp/>} />
          <Route path='/signIn' element={<SignIn/>} />
          <Route path="/signOut" element={<SignOut/>}/>
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* General Pages */}
          <Route path='/createShipping' element={<Createshipping/>} />
          <Route path='/getShippingInfo' element={<GetShippingInfo/>} />
          <Route path='/updateShipping' element={<UpdateShipping/>} />
          <Route path='/order' element={<Order/>} />
          <Route path='/getOrder' element={<GetOrder/>}/>

          {/* Product Details */}
          <Route path="/product/:id" element={<GetProductDetails />} />

          {/* Admin protected routes */}
          <Route path="/admin/createProduct" element={<AdminRoute><CreateProduct /></AdminRoute>} />
          <Route path="/admin/getAllProducts" element={<AdminRoute><GetAllProducts /></AdminRoute>} />
          <Route path="/admin/products/:id" element={<AdminRoute><GetProductDetailsForAdmin /></AdminRoute>} />
          <Route path="/admin/updateProduct/:id" element={<AdminRoute><UpdateProduct /></AdminRoute>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
