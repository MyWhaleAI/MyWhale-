import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => (
  <WalletProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </WalletProvider>
);

export default App;