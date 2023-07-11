import "./App.css";
import { useState } from "react";
import Sidebar from "./Sidebar";

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = async () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                <button className="bluebutton" onClick={handleToggleSidebar}>
                    Explore web APIs
                </button>
            </header>
            {isSidebarOpen && (
                <div
                    className="blocking-overlay"
                    onClick={handleCloseSidebar}
                ></div>
            )}
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
        </div>
    );
}

export default App;
