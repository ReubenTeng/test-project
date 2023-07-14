import "./App.css";
import { useState } from "react";
import Sidebar from "./Sidebar";
import APIInfo from "./APIInfo";

function App() {
    const [providerInfo, setProviderInfo] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAPIInfoOpen, setIsAPIInfoOpen] = useState(false);

    const handleToggleSidebar = async () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = (data) => {
        console.log(data);
        setIsSidebarOpen(false);
        if (data.info) {
            setProviderInfo(data);
            console.log(providerInfo);
            setIsAPIInfoOpen(true);
        }
    };

    const handleCloseProviderInfo = () => {
        console.log("close");
        setIsAPIInfoOpen(false);
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
            <APIInfo
                isOpen={isAPIInfoOpen}
                onClose={handleCloseProviderInfo}
                providerInfo={providerInfo}
            />
        </div>
    );
}

export default App;
