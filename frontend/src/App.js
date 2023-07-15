import "./App.css";
import { useState } from "react";
import Sidebar from "./Sidebar";
import APIInfo from "./APIInfo";

function App() {
    // Functions as the main controller for both the side bar and API info component.
    // Passes information from the sidebar to the API info component to avoid calling the API guru API multiple times.
    const [providerInfo, setProviderInfo] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAPIInfoOpen, setIsAPIInfoOpen] = useState(false);

    const handleToggleSidebar = async () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = (data) => {
        // When closing the sidebar, if the sidebar was closed by clicking a provider, open the API info component
        setIsSidebarOpen(false);
        if (data.info) {
            // Sends the provider's information to the API info component if the sidebar was closed by clicking a provider
            setProviderInfo(data);
            setIsAPIInfoOpen(true);
        }
    };

    const handleCloseProviderInfo = () => {
        // Reopens the sidebar when closing the API info component, with the same provider selected
        setIsAPIInfoOpen(false);
        setIsSidebarOpen(true);
    };

    return (
        <div className="App">
            <header className="App-header">
                <button className="bluebutton" onClick={handleToggleSidebar}>
                    Explore web APIs
                </button>
            </header>
            {isSidebarOpen && (
                <div className="blocking-overlay" onClick={handleCloseSidebar}>
                    {/* This div blocks everything apart from the sidebar when the sidebar is active */}
                </div>
            )}
            <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
            <APIInfo
                isOpen={isAPIInfoOpen}
                onClose={handleCloseProviderInfo}
                providerInfo={providerInfo}
            />
        </div>
    );
}

export default App;
