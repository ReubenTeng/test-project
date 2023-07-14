import "./Sidebar.css";
import { useState, useEffect, createRef } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    const [data, setData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [providerInfo, setProviderInfo] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    "https://api.apis.guru/v2/providers.json"
                );
                const json = await response.json();
                setData(json["data"]);
            } catch (error) {
                console.log(error);
            }
        };
        if (data.length === 0) {
            fetchData();
        }
    });

    const getProviderInfo = async (provider) => {
        try {
            const response = await fetch(
                "https://api.apis.guru/v2/" + provider + ".json"
            );
            const json = await response.json();
            let apis = Object.keys(json["apis"]);
            let apiInfo = [];
            apis.forEach((api) => {
                console.log(api);
                apiInfo.push(json["apis"][api]);
            });
            setProviderInfo(apiInfo);
        } catch (error) {
            console.log(error);
        }
    };

    const handleItemClick = async (index) => {
        if (selectedIndex !== index) {
            await getProviderInfo(data[index]);
            setSelectedIndex(index);
        } else {
            setSelectedIndex(-1);
        }
    };

    const handleAPIClick = (info) => {
        console.log(info);
        // setSelectedAPIIndex(index);
        onClose(info);
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
        >
            <div style={{ padding: "16px" }}>
                <div className="title">Select Provider</div>
            </div>
            <div style={{ padding: "16px" }}>
                {data.length > 0
                    ? data.map((item, index) => {
                          return (
                              <div id={index}>
                                  <div
                                      key={index}
                                      className={
                                          selectedIndex === index
                                              ? "provider selected-provider"
                                              : "provider"
                                      }
                                  >
                                      <div
                                          className="row"
                                          onClick={() => handleItemClick(index)}
                                      >
                                          <span>{item}</span>
                                          <i
                                              className={
                                                  selectedIndex === index
                                                      ? "fa fa-chevron-down"
                                                      : "fa fa-chevron-up"
                                              }
                                          ></i>
                                      </div>
                                      {selectedIndex === index
                                          ? providerInfo.map((info, i) => {
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
                                            })
                                          : null}
                                  </div>
                              </div>
                          );
                      })
                    : null}
            </div>
        </div>
    );
};

export default Sidebar;
