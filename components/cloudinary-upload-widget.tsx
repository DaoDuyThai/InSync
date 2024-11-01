import { Plus } from "lucide-react";
import { createContext, useEffect, useState, ReactNode } from "react";

// Extend the Window interface to include the cloudinary property
declare global {
    interface Window {
        cloudinary: any;
    }
}

// Define the configuration type for Cloudinary upload widget
interface CloudinaryUploadWidgetConfig {
    cloudName: string;
    uploadPreset: string;
    [key: string]: any; // Allow additional configuration properties
}

// Define the context type
interface CloudinaryScriptContextType {
    loaded: boolean;
}

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext<CloudinaryScriptContextType | undefined>(undefined);

interface CloudinaryUploadWidgetProps {
    uwConfig: CloudinaryUploadWidgetConfig; // Expecting Cloudinary config
    setPublicId: (publicId: string) => void; // Function to set the public ID
    children?: ReactNode; // Optional children
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({ uwConfig, setPublicId, children }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Check if the script is already loaded
        if (!loaded) {
            const uwScript = document.getElementById("uw");
            if (!uwScript) {
                // If not loaded, create and load the script
                const script = document.createElement("script");
                script.setAttribute("async", "");
                script.setAttribute("id", "uw");
                script.src = "https://upload-widget.cloudinary.com/global/all.js";
                script.addEventListener("load", () => setLoaded(true));
                document.body.appendChild(script);
            } else {
                // If already loaded, update the state
                setLoaded(true);
            }
        }
    }, [loaded]);

    const initializeCloudinaryWidget = () => {
    if (window.cloudinary) {
        const myWidget = window.cloudinary.createUploadWidget(
            uwConfig,
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info.url);
                    setPublicId(result.info.public_id);
                }
            }
        );

        myWidget.open();
    } else {
        console.error("Cloudinary script not loaded.");
    }
};

    return (
        <CloudinaryScriptContext.Provider value={{ loaded }}>
            <button onClick={initializeCloudinaryWidget} id="upload_widget" className="group cursor-pointer relative aspect-square bg-gray-500 rounded-lg hover:bg-gray-700 flex flex-col items-center justify-center">
                <Plus className="h-12 w-12 text-white stroke-1" />
                <p className="text-sm text-white font-light">
                    New Asset
                </p>
            </button>
            {children} {/* Render any child components if needed */}
        </CloudinaryScriptContext.Provider>
    );
};

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
