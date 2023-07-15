import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    // Functions as the sidebar component. Displays a list of providers from the API guru API.

    // Data is the list of all providers from the API guru API
    const [data, setData] = useState([]);
    // displayedData is the list of providers that are currently displayed in the sidebar
    const [displayedData, setDisplayedData] = useState([]);
    // selectedIndex is the index of the selected provider in the data array. Set as 1 to default
    const [selectedIndex, setSelectedIndex] = useState(-1);
    // Only a single provider's information is stored at a time, as storing all providers' information could be too much data to store in memory.
    const [providerInfo, setProviderInfo] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.apis.guru/v2/providers.json"
                );
                const json = await response.json();
                setData(json["data"]);
                setDisplayedData(json["data"].slice(0, 20));
            } catch (error) {
                console.log(error);
            }
        };
        if (data.length === 0) {
            fetchData();
        }
    });

    const getProviderInfo = async (provider) => {
        // Calls the API guru API to get the provider's information
        try {
            const response = await fetch(
                "https://api.apis.guru/v2/" + provider + ".json"
            );
            const json = await response.json();
            let apis = Object.keys(json["apis"]);
            let apiInfo = [];
            apis.forEach((api) => {
                apiInfo.push(json["apis"][api]);
            });
            setProviderInfo(apiInfo);
        } catch (error) {
            console.log(error);
        }
    };

    const handleItemClick = async (index) => {
        // When clicking a provider, calls the API guru API to get the provider's information
        // If the provider is already selected, deselect it
        if (selectedIndex !== index) {
            await getProviderInfo(data[index]);
            setSelectedIndex(index);
        } else {
            setSelectedIndex(-1);
        }
    };

    const handleAPIClick = (info) => {
        onClose(info);
    };

    const getSelectedHeight = () => {
        // Calculate height of selected provider. This is used to allow for smooth transitions when opening and closing providers,
        // as 'height: auto' cannot be used with CSS transitions.
        let base = 1;
        for (let i = 0; i < providerInfo.length; i++) {
            base += 1;
        }
        return base * 48 + 16;
    };

    const handleScroll = (e) => {
        // Load more data when user scrolls to bottom of sidebar
        // 20 providers are loaded at a time
        const bottom =
            e.target.scrollHeight - e.target.scrollTop <=
            e.target.clientHeight + 10;
        let remaining = data.length - displayedData.length;
        if (bottom && displayedData.length < data.length) {
            setDisplayedData(
                data.slice(
                    0,
                    displayedData.length + (remaining > 20 ? 20 : remaining)
                )
            );
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: isOpen ? 0 : "-100%",
                width: "40vw",
                height: "100vh",
                background: "#42607b",
                transition: "right 0.3s ease",
                zIndex: 10,
                color: "white",
                overflowY: "scroll",
            }}
            onScroll={(event) => handleScroll(event)}
        >
            <div style={{ margin: "16px" }}>
                <div className="header">Select Provider</div>
            </div>
            <div style={{ margin: "16px" }}>
                {displayedData.length > 0 &&
                    displayedData.map((item, index) => {
                        // for each provider, display the provider's name and logo
                        return (
                            <div id={index}>
                                <div
                                    key={index}
                                    className={
                                        selectedIndex === index
                                            ? "provider selected-provider"
                                            : "provider"
                                    }
                                    style={{
                                        height:
                                            selectedIndex !== index
                                                ? "40px"
                                                : getSelectedHeight() + "px",
                                        transition: "height 0.25s ease",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        className="row"
                                        onClick={() => handleItemClick(index)}
                                    >
                                        <span>{item}</span>
                                        <FontAwesomeIcon
                                            // rotation is used to allow for smooth transitions when opening and closing providers
                                            style={{
                                                transform:
                                                    selectedIndex === index
                                                        ? "rotate(180deg)"
                                                        : "rotate(0deg)",
                                                transition:
                                                    "transform 0.2s ease",
                                            }}
                                            icon={faChevronDown}
                                        />
                                    </div>
                                    <div>
                                        {selectedIndex === index &&
                                            providerInfo.map((info, i) => {
                                                // for each API from the selected provider, display the API's name and logo
                                                return (
                                                    <div
                                                        className="row provider-info"
                                                        onClick={() =>
                                                            handleAPIClick(info)
                                                        }
                                                    >
                                                        <img
                                                            className="logo"
                                                            src={
                                                                info["info"][
                                                                    "x-logo"
                                                                ]["url"]
                                                            }
                                                            alt=""
                                                        ></img>
                                                        <div
                                                            style={{
                                                                textOverflow:
                                                                    "ellipsis",
                                                                overflow:
                                                                    "hidden",
                                                                whiteSpace:
                                                                    "nowrap",
                                                                maxWidth: "80%",
                                                            }}
                                                        >
                                                            {
                                                                info["info"][
                                                                    "title"
                                                                ]
                                                            }
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Sidebar;
