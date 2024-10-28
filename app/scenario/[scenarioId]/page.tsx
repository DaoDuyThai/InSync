'use client'
import React, { useEffect, useState } from "react";
import { Canvas } from "./_components/canvas";
import { Loading } from "@/components/loading";
import { toast } from "sonner";

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
    const [scenario, setScenario] = useState<Scenario | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScenario = async () => {
            try {
                localStorage.removeItem("jsonGeneratorWorkspace");
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/${params.scenarioId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setScenario(data);
                const jsonWeb = data.stepsWeb;
                if(isValidJSON(jsonWeb) && jsonWeb) {
                    localStorage.setItem("jsonGeneratorWorkspace", jsonWeb);
                }else if(!jsonWeb){
                    localStorage.removeItem("jsonGeneratorWorkspace");
                }
            } catch (error) {
                toast.error("Scenario not found. Redirecting...");
                setTimeout(() => {
                    window.history.back(); // Redirects to the previous page after 3 seconds
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchScenario();
    }, [params.scenarioId]);


    function isValidJSON(jsonString: string): boolean {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (error) {
            return false;
        }
    }

    const handleSaveScenario = async () => {
        try {
            const jsonWeb = localStorage.getItem("jsonGeneratorWorkspace");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scenarios/update-web-json/${params.scenarioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jsonWeb)
            });
            if (response.ok) {
                toast.success("Scenario saved successfully!");
            } else {
                toast.error("Failed to save scenario.");
            }
        } catch (error) {
            console.error("Error renaming project:", error);
            toast.error("Failed to rename project.");
        }
    };


    if (loading) return <Loading />;

    return (
        <div className="w-full h-full">
            {scenario ? (
                <>
                    <button onClick={handleSaveScenario}>Save</button>
                    <Canvas />
                </>
            ) : null}
        </div>
    );
};

export default ScenarioIdPage;
