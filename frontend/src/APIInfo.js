import { useState } from "react";
import "./APIInfo.css";

const APIInfo = ({ isOpen, onClose, providerInfo }) => {
    return isOpen ? (
        <div className={isOpen ? "open" : "close"}>
            <div
                style={{
                    margin: "24px 60px",
                }}
            >
                <div className="title">
                    <img
                        src={providerInfo["info"]["x-logo"]["url"]}
                        style={{
                            maxHeight: "80px",
                            maxWidth: "80px",
                            hegiht: "80px",
                            margin: "8px",
                        }}
                    ></img>
                    <div style={{ margin: "8px" }}>
                        {providerInfo["info"]["title"]}
                    </div>
                </div>
                {providerInfo["info"]["description"] && (
                    <div>
                        <div className="subtitle">Description</div>
                        {providerInfo["info"]["description"]}
                    </div>
                )}
                {providerInfo["swaggerUrl"] && (
                    <div>
                        <div className="subtitle">Swagger</div>
                        <div>{providerInfo["swaggerUrl"]}</div>
                    </div>
                )}
                {providerInfo["info"]["contact"] && (
                    <div>
                        <div className="subtitle">Contact</div>
                        {providerInfo["info"]["contact"]["email"] && (
                            <tr>
                                <td className="contact-type">Email</td>
                                <td>
                                    {providerInfo["info"]["contact"]["email"]}
                                </td>
                            </tr>
                        )}
                        {providerInfo["info"]["contact"]["name"] && (
                            <tr>
                                <td className="contact-type">Name</td>
                                <td>
                                    {providerInfo["info"]["contact"]["name"]}
                                </td>
                            </tr>
                        )}
                        {providerInfo["info"]["contact"]["url"] && (
                            <tr>
                                <td className="contact-type">Url</td>
                                <td>
                                    {providerInfo["info"]["contact"]["url"]}
                                </td>
                            </tr>
                        )}
                    </div>
                )}
                <div className="btn-holder">
                    <button
                        className="bluebutton bottom-button"
                        onClick={onClose}
                    >
                        Explore more APIs
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default APIInfo;
