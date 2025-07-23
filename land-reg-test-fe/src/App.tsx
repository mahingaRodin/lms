import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import RegisterLandPage from "./pages/RegisterLandPage";
import ViewLandsPage from "./pages/ViewLandsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/register-land" element={<RegisterLandPage />} />
            <Route path="/view-lands" element={<ViewLandsPage />} />
            <Route
              path="/"
              element={<Navigate to="/register-land" replace />}
            />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/register-land" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
