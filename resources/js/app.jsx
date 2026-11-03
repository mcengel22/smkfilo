import ReactDOM from "react-dom/client";
import React, { Suspense } from "react";
import ListenLoad from "./Listen/Load.jsx";
import { Store, persistor } from "./Repo/Redux/Load.jsx";
import { Provider } from "react-redux";
import Loader from "./Components/Loader";
import { PersistGate } from "redux-persist/integration/react";
import { HelmetProvider } from "react-helmet-async";
import "./Libs/i18n/localization_config.jsx";

const loaderStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    zIndex: 9999,
};

const rootElement = document.getElementById("tourency");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Suspense
                fallback={
                    <div style={loaderStyle}>
                        <Loader />
                    </div>
                }
            >
                <Provider store={Store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <HelmetProvider>
                            {/* ✅ DynamicSeo artık burada değil */}
                            <ListenLoad />
                        </HelmetProvider>
                    </PersistGate>
                </Provider>
            </Suspense>
        </React.StrictMode>
    );
}
