import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Login from './Login';
import UploadRecipe from './UploadRecipe';
import Dashboard from './Dashboard';
import Main from './Main';
import RecipeDetails from './RecipeDetails';
import Header from './Header';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import Terms from './Terms';

function App() {
  const location = useLocation();
  const showHeaderFooter = location.pathname !== '/login';

  return (
    <div className="App">
      {showHeaderFooter && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadRecipe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/t"
          element={
            <ProtectedRoute>
              <Terms/>
            </ProtectedRoute>
          }
        />
      </Routes>
      {showHeaderFooter && <Footer />}
      <style jsx global>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #f9f9f9;
          font-family: 'Roboto', sans-serif;
        }
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #7B38E9;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        .loading-container p {
          color: #333;
          font-size: 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;