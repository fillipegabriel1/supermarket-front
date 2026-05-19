import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import './app.css';

import Login from './login/login';
import Home from './home/home';
import Dashboard from './dashboard/dashboard';
import Sale from './sale/sale';
import Product from './product/product';
import SignUp from './sign-up/signup';

import PrivateRoute from './routes/private-route';

console.log('✅ App.tsx carregado');

const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* Redirect inicial */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rotas privadas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/sale"
          element={
            <PrivateRoute>
              <Sale />
            </PrivateRoute>
          }
        />

        <Route
          path="/product"
          element={
            <PrivateRoute>
              <Product />
            </PrivateRoute>
          }
        />

        {/* Página não encontrada */}
        <Route
          path="*"
          element={<h1>404 - Página não encontrada</h1>}
        />

      </Routes>
    </Router>
  );
};

export default App;