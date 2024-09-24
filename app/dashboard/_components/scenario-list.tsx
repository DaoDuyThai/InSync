"use client"

// import { useQueries, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
import { getUnixTime } from 'date-fns';

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
            "_id": "1a2b3c",
            "title": "Morning Routine Automation",
            "imageUrl": "/placeholders/1.svg",
            "authorId": "user123",
            "authorName": "John Doe",
            "_creationTime": "2024-08-17 08:00:00.000",
            "orgId": "project001",
            "isFavorite": true
        },
        {
            "_id": "2b3c4d",
            "title": "Smart Home Lights Control",
            "imageUrl": "/placeholders/2.svg",
            "authorId": "user456",
            "authorName": "Jane Smith",
            "_creationTime": "2024-08-17 08:00:00.000",
            "orgId": "project002",
            "isFavorite": false
        },
        {
            "_id": "3c4d5e",
            "title": "Office Meeting Scheduler",
            "imageUrl": "/placeholders/1.svg",
            "authorId": "user789",
            "authorName": "Emily Johnson",
            "_creationTime": "2024-08-17 08:00:00.000",
            "orgId": "project003",
            "isFavorite": true
        },
        {
            "_id": "4d5e6f",
            "title": "Fitness Tracker Automation",
            "imageUrl": "/placeholders/1.svg",
            "authorId": "user321",
            "authorName": "Michael Brown",
            "_creationTime": "2024-08-17 08:00:00.000",
            "orgId": "project004",
            "isFavorite": false
        }
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

                {/* {data?.map((scenario) => (
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
                ))} */}


                <ScenarioCard
                    key={data[0]._id}
                    id={data[0]._id}
                    title={data[0].title}
                    imageUrl={data[0].imageUrl}
                    authorId={data[0].authorId}
                    authorName={data[0].authorName}
                    createdAt={getUnixTime(data[0]._creationTime) * 1000} //milliseconds to seconds
                    projectId={data[0].orgId}
                    isFavorite={data[0].isFavorite} />
            </div>
        </div>
    )
}