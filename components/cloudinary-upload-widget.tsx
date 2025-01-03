import { Loader, Plus } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

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
const CloudinaryScriptContext = React.createContext<CloudinaryScriptContextType | undefined>(undefined);

interface CloudinaryUploadWidgetProps {
    uwConfig: CloudinaryUploadWidgetConfig; // Expecting Cloudinary config
    setPublicId: (publicId: string) => void; // Function to set the public ID
    projectId: string; // Project ID
    children?: React.ReactNode; // Optional children
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({ uwConfig, setPublicId, children, projectId }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [loading, setLoading] = React.useState(false); // State to manage loading indicator

    const uploadAsset = async (assetName: string, filePath: string, projectId: string, type: string) => {
        setLoading(true); // Show loading indicator
        const body = {
            assetName,
            filePath,
            projectId,
            type,
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/assets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }
        } catch (error) {
            console.error("Error uploading asset:", error);
        }
        setLoading(false); // Hide loading
    };

    React.useEffect(() => {
        if (!loaded) {
            const uwScript = document.getElementById("uw");
            if (!uwScript) {
                // If not loaded, create and load the script
                const script = document.createElement("script");
                script.setAttribute("async", "");
                script.setAttribute("id", "uw");
                script.src = "https://upload-widget.cloudinary.com/global/all.js";
                script.addEventListener("load", () => {
                    setLoaded(true);
                    setLoading(false); // Hide loading once script is loaded
                });
                document.body.appendChild(script);
            } else {
                setLoaded(true);
            }
        }
    }, [loaded]);

    const initializeCloudinaryWidget = () => {
        if (window.cloudinary) {
            const myWidget = window.cloudinary.createUploadWidget(
                uwConfig,
                (error: any, result: any) => {
                    if (result?.event === "close") {
                        // If the widget is closed, hide loading
                        setLoading(false);
                    } else if (!error && result?.event === "success") {
                        setPublicId(result.info.public_id);
                        uploadAsset(result.info.original_filename, result.info.url, projectId, "image");
                        setLoading(false); // Hide loading on successful upload
                    }
                }
            );
            myWidget.open();
        } else {
            console.error("Cloudinary script not loaded.");
            toast.error("Something went wrong. Please try again.");
            setLoading(false); // Hide loading if there's an error
        }
    };

    return (
        <CloudinaryScriptContext.Provider value={{ loaded }}>
            <div className="relative w-full h-full">
                {loading ? (
                    <div className="h-full w-full group cursor-not-allowed relative aspect-square bg-neutral-100 touch-none flex items-center justify-center">
                        <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setLoading(true);
                            initializeCloudinaryWidget();
                        }}
                        id="upload_widget"
                        className="w-full h-full group cursor-pointer relative aspect-square bg-gray-500 rounded-lg hover:bg-gray-700 flex flex-col items-center justify-center"
                    >
                        <Plus className="h-12 w-12 text-white stroke-1" />
                        <p className="text-sm text-white font-light">New Asset</p>
                    </button>
                )}
                {children}
            </div>
        </CloudinaryScriptContext.Provider>
    );
};

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
