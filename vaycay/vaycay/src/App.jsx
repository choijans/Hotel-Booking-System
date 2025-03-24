import { BrowserRouter, Routes, Route, Link, HashRouter } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
        <div>
          <nav>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </nav>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;
