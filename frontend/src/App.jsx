import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthInitializer from "./components/auth/AuthInitializer";

import Home from "./components/pages/Home";
import Search from "./components/pages/Search";
import Library from "./components/pages/Library";

import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
    <AuthInitializer>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route path="/" element={<Home />} />

            <Route path="/search" element={<Search />} />

            <Route path="/library" element={<Library />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}

export default App;