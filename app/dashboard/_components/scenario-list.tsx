import { getUnixTime } from 'date-fns';
import * as React from "react";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyScenario } from "./empty-scenario";
import { EmptySearch } from "./empty-search";
import { NewScenarioButton } from "./new-scenario-button";
import { ScenarioCard } from "./scenario-card";
import { ProjectSettings } from './project-settings';
import { useUser } from '@clerk/nextjs';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { selectProject } from '@/store/projectSlice';
import { toast } from 'sonner';
import { NoProjectSelected } from './no-project-selected';

interface ScenarioListProps {
    projectId: string;
    query: {
        search?: string;
        favorites?: boolean | string;
    };
}

interface Scenario {
    _id: string;
    projectId: string;
    projectName: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    stepWeb: string;
    stepAndroid: string;
    isFavorites: boolean;
    imageUrl: string;
    authorId: string;
    authorName: string;
}

export const ScenarioList = ({
    projectId,
    query
}: ScenarioListProps) => {

    const { user, isLoaded } = useUser();
    const [scenarioList, setScenarioList] = React.useState<Scenario[]>([]);
    const [filteredScenarios, setFilteredScenarios] = React.useState<Scenario[]>([]);

    React.useEffect(() => {
        if (projectId != "" && user && isLoaded) {
            const fetchScenarios = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/scenarios-project-useridclerk/${projectId}?userIdClerk=${user.id}`
                    );
                    const data = await response.json();
                    setScenarioList(data.data);
                } catch (error) {
                    console.error("Error fetching scenarios:", error);
                }
            };
            fetchScenarios();
        }
    }, [projectId, user, isLoaded]);

    React.useEffect(() => {
        // Filter scenarios based on the query
        if (scenarioList.length > 0) {
            let filtered = scenarioList;

            // Apply search filter if present
            if (query.search) {
                filtered = filtered.filter((scenario) =>
                    scenario.title.toLowerCase().includes(query.search!.toLowerCase()) ||
                    scenario.description.toLowerCase().includes(query.search!.toLowerCase())
                );
            }

            // Apply favorites filter if present
            if (query.favorites) {
                filtered = filtered.filter((scenario) => scenario.isFavorites);
            }

            setFilteredScenarios(filtered);
        }
    }, [projectId, scenarioList, query]);

    if (!filteredScenarios.length && query.search) {
        return <EmptySearch />;
    }

    if (!filteredScenarios.length && query.favorites) {
        return <EmptyFavorites />;
    }

    if (!scenarioList.length) {
        return <EmptyScenario />;
    }

    if (projectId == "") {
        return (
            <NoProjectSelected />
        )
    }

    return (
        <div>
            <div className='flex justify-between align-middle'>
                <h2 className="text-3xl">
                    {query.favorites ? "Favorites Scenarios" : "Scenarios List"}
                </h2>
                <ProjectSettings />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-12">
                <NewScenarioButton projectId={projectId} disabled />

                {filteredScenarios.map((scenario) => (
                    <ScenarioCard
                        key={scenario._id}
                        id={scenario._id}
                        title={scenario.title}
                        imageUrl={scenario.imageUrl}
                        authorId={scenario.authorId}
                        authorName={scenario.authorName}
                        createdAt={getUnixTime(new Date(scenario.createdAt)) * 1000} //milliseconds to seconds
                        projectId={scenario.projectId}
                        isFavorite={scenario.isFavorites}
                    />
                ))}
            </div>
        </div>
    );
};
