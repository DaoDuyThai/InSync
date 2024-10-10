"use client"

import { getUnixTime } from 'date-fns';
import * as React from "react";

import { EmptyFavorites } from "./empty-favorites";
import { EmptyScenario } from "./empty-scenario";
import { EmptySearch } from "./empty-search";
import { NewScenarioButton } from "./new-scenario-button";
import { ScenarioCard } from "./scenario-card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pencil, Settings, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/confirm-modal';
import { ProjectSettings } from './project-settings';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { selectProject } from '@/store/projectSlice';

interface ScenarioListProps {
    projectId: string;
    query: {
        search?: string;
        favorites?: string;
    }
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
    isFavorite: boolean;
    imageUrl: string;
    authorId: string;
    authorName: string;
}

export const ScenarioList = ({
    projectId,
    query
}: ScenarioListProps) => {


    const [scenarioList, setScenarioList] = React.useState<Scenario[]>([]);


    

    const data = [
        {
            "_id": "4d5e6f",
            "title": "Fitness Tracker Automation",
            "imageUrl": "/placeholders/1.svg",
            "authorId": "user321",
            "authorName": "Michael Brown",
            "_creationTime": "2024-08-17 08:00:00.000",
            "orgId": "project004",
            "isFavorite": false
        },
        {
            "_id": "4d5e6ss",
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
                <div className='flex justify-between align-middle'>
                    <h2 className="text-3xl">
                        {query.favorites ? "Favorites Scenarios" : "Scenarios List"}
                    </h2>
                    {/* TODO: Add functionality menu for project settings */}
                    <ProjectSettings />
                </div>
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
            <div className='flex justify-between align-middle'>
                <h2 className="text-3xl">
                    {query.favorites ? "Favorites Scenarios" : "Scenarios List"}
                </h2>
                {/* TODO: Add functionality menu for project settings */}
                <ProjectSettings />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-12">
                <NewScenarioButton projectId={projectId} disabled />

                {data.map((scenario) => (
                    <ScenarioCard
                        key={scenario._id}
                        id={scenario._id}
                        title={scenario.title}
                        imageUrl={scenario.imageUrl}
                        authorId={scenario.authorId}
                        authorName={scenario.authorName}
                        createdAt={getUnixTime(scenario._creationTime) * 1000} //milliseconds to seconds
                        projectId={scenario.orgId}
                        isFavorite={scenario.isFavorite} />
                ))}

            </div>
        </div>
    )
}