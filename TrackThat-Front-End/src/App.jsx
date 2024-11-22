import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./LandingPage/LandingPage";
import RegisterPage from "./RegisterPage/RegisterPage";
import LoginPage from "./LoginPage/LoginPage";
import Dashboard from "./Dashboard/Dashboard";
import Overview from "./Dashboard/Overview";
import Viewapp from "./Dashboard/Viewapp";
import Jobpost from "./Dashboard/Jobpost";
import Settings from "./Dashboard/Settings";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Need to be logged in to access Dashboard.");
  }
  // Need to add a FA dialogue to indicate user is signed out.

  // don't forget to remove this when finish
  const isDevelopment = true; // Set this to `true` during development to bypass authentication
  if (isDevelopment) {
    return children;
  }

  return token ? children : <Navigate to="/register" />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />{" "}
          {/* Add the login route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route index element={<Overview />} /> // Set Overview as the
            default
            <Route path="overview" element={<Overview />} />
            <Route path="viewapp" element={<Viewapp />} />
            <Route path="jobpost" element={<Jobpost />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
