import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Dashboard from "../screens/Dashboard";
import Tasks from "../screens/Tasks";
import Header from "../components/Header";
const Navigation = () => {
    return (
        <Router>
            <Header/>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
            </Routes>
        </Router>
    )
}

export default Navigation