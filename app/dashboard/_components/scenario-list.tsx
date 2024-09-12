"use client"

// import { useQueries, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

import { EmptyFavorites } from "./empty-favorites";
import { EmptyScenario } from "./empty-scenario";
import { EmptySearch } from "./empty-search";
import { NewScenarioButton } from "./new-scenario-button";
import { ScenarioCard } from "./scenario-card";
// import { EmptyBoards } from "./empty-boards";
// import { BoardCard } from "./board-card";
// import { NewBoardButton } from "./new-board-button";

interface ScenarioListProps {
    projectId: string;
    query: {
        search?: string;
        favorites?: string;
    }
}

export const ScenarioList = ({
    projectId,
    query
}: ScenarioListProps) => {


    // const data = useQuery(api.boards.get, {
    //     orgId,
    //     ...query,
    // });

    const data = [
        {
            
        },
        {}
    ]

    if (data === undefined) {
        return (
            <div>
                <h2 className="text-3xl">
                    {query.favorites ? "Favorites boards" : "Team Boards"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                    {/* <NewBoardButton orgId={orgId} disabled /> */}
                    <NewScenarioButton projectId={projectId} disabled />
                    <ScenarioCard.Skeleton />
                </div>
            </div >
        )
    }

    if (!data?.length && query.search) {
        return (
            <EmptySearch />
        )
    }

    if (!data?.length && query.favorites) {
        return (
            <EmptyFavorites />
        )
    }

    if (!data?.length) {
        return (
            <EmptyScenario />
        )
    }

    return (
        <div>
            <h2 className="text-3xl">
                {query.favorites ? "Favorites boards" : "Team Boards"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
                <NewScenarioButton projectId={projectId} disabled />
                {data?.map((scenario) => (
                    <ScenarioCard
                        key={scenario._id}
                        id={scenario._id}
                        title={scenario.title}
                        imageUrl={scenario.imageUrl}
                        authorId={scenario.authorId}
                        authorName={scenario.authorName}
                        createdAt={scenario._creationTime}
                        projectId={scenario.orgId}
                        isFavorite={scenario.isFavorite} />
                ))}
            </div>
        </div>
    )
}