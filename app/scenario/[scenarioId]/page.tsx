"use client";
import * as React from "react";
import { Canvas } from "./_components/canvas";
import { Loading } from "@/components/loading";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Header } from "./_components/header";

interface Scenario {
    id: string;
    projectId: string;
    projectName: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    stepsWeb: string;
    stepsAndroid: string;
    isFavorites: boolean;
    imageUrl: string;
    authorId: string;
    authorIdGuid: string;
    authorName: string;
}

interface ScenarioIdPageProps {
    params: {
        scenarioId: string;
    };
}

const ScenarioIdPage = ({ params }: ScenarioIdPageProps) => {
    const [scenario, setScenario] = React.useState<Scenario | null>(null);
    const [loading, setLoading] = React.useState(true);
    const { user, isLoaded } = useUser();

    const fetchScenario = async () => {
        try {
            localStorage.removeItem("jsonWeb");
            localStorage.removeItem("jsonMobile");
            const selectedProjectId = localStorage.getItem("selectedProjectId");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/${params.scenarioId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (selectedProjectId !== data.projectId) {
                throw new Error("Scenario not found. Redirecting...");
            } else {
                setScenario(data);

                const jsonWeb = data.stepsWeb;
                if (isValidJSON(jsonWeb) && jsonWeb) {
                    localStorage.setItem("jsonWeb", jsonWeb);
                } else if (!jsonWeb) {
                    localStorage.removeItem("jsonWeb");
                }
            }

        } catch (error) {
            toast.error("Scenario not found. Redirecting...");
            setTimeout(() => {
                window.location.href = '/dashboard'; // Redirects to the previous page after 3 seconds
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchScenario();
    }, [params.scenarioId]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();
                handleSaveScenario();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    function isValidJSON(jsonString: string): boolean {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (error) {
            return false;
        }
    }

    const renameScenario = async (id: string, newTitle: string) => {
        if (!user || !isLoaded) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/rename-scenario/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    scenarioName: newTitle,
                    id: id,
                }),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }
            fetchScenario();
        } catch (error) {
            toast.error("Failed to rename scenario.");
            console.error("Error renaming scenario:", error);
        }
    };

    const deleteScenario = async (id: string) => {
        if (!user || !isLoaded) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }
            fetchScenario();
        } catch (error) {
            console.error("Error deleting scenario:", error);
        }
    };

    const handleSaveScenario = async () => {
        try {
            // Get Web JSON from localStorage
            const jsonWeb = localStorage.getItem("jsonWeb");

            // Get Android JSON from Textarea by ID
            const jsonMobile = localStorage.getItem("jsonMobile");

            // Save Web JSON
            const responseWeb = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/update-web-json/${params.scenarioId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonWeb)
            });

            // Save Android JSON
            const responseAndroid = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/update-android-json/${params.scenarioId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonMobile) // Use jsonMobile directly from the Textarea
            });

            if (responseWeb.ok && responseAndroid.ok) {
                toast.success("Scenario saved successfully!");
            } else {
                toast.error("Failed to save scenario!");
            }
            fetchScenario();
        } catch (error) {
            console.error("Error saving scenario:", error);
            toast.error("Failed to save scenario.");
        }
    };

    if (loading) return <Loading />;
    if (!scenario) return <Loading />;
    return (
        <div className="w-screen h-screen">
            <Header
                id={scenario.id}
                title={scenario?.title} />
            {scenario ? (
                <>
                    <Canvas
                        id={scenario.id}
                        title={scenario.title}
                        deleteScenario={() => deleteScenario(scenario.id)}
                        renameScenario={renameScenario}
                        saveScenario={handleSaveScenario}
                        projectId={scenario.projectId}
                    />
                </>
            ) : null}
        </div>
    );
};

export default ScenarioIdPage;
