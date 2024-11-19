import { getUnixTime, set } from 'date-fns';
import * as React from "react";
import { EmptyFavorites } from "./empty-favorites";
import { EmptyScenario } from "./empty-scenario";
import { EmptySearch } from "./empty-search";
import { ScenarioCard } from "./scenario-card";
import { ProjectSettings } from './project-settings';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { NoProjectSelected } from './no-project-selected';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProModal } from '@/store/use-pro-modal';


interface ScenarioListProps {
    projectId: string;
    query: {
        search?: string;
        favorites?: boolean | string;
    };
}

type Scenario = {
    id: string;
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

type SubscriptionPlan = {
    id: string,
    subscriptionsName: string,
    status: boolean,
    price: number,
    userId: string,
    userIdGuid: string,
    displayName: string,
    content: string,
    dateCreated: string,
    dateUpdated: string | null,
    maxProjects: number,
    maxAssets: number,
    maxScenarios: number,
    maxUsersAccess: number,
    storageLimit: number,
    supportLevel: "standard" | "advanced",
    customFeaturesDescription: string,
    dataRetentionPeriod: number,
    prioritySupport: boolean,
    monthlyReporting: boolean
}

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg",
]

export const ScenarioList = ({
    projectId,
    query
}: ScenarioListProps) => {
    const [scenarioList, setScenarioList] = React.useState<Scenario[]>([]);
    const [filteredScenarios, setFilteredScenarios] = React.useState<Scenario[]>([]);
    const [open, setOpen] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>("Untitled");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isSubscribed, setIsSubscribed] = React.useState(null);
    const [subscriptionPlans, setSubscriptionPlans] = React.useState<SubscriptionPlan[]>([]);
    const [totalScenarios, setTotalScenarios] = React.useState<number>(0);
    const { user, isLoaded } = useUser();
    const { onOpen } = useProModal();

    // Fetch scenarios based on the project ID and user
    const fetchScenarios = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/scenarios-project-useridclerk/${projectId}?userIdClerk=${user?.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            const data = await response.json();
            setScenarioList(data.data);
        } catch (error) {
            console.error("Error fetching scenarios:", error);
        }
    };

    // Fetch total scenarios created by the user
    const fetchTotalScenarios = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/scenarios-user-clerk/${user?.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            const data = await response.json();
            setTotalScenarios(data.data.length);
        } catch (error) {
            console.error("Error fetching scenarios:", error);
        }
    }

    // Fetch subscription plans
    const fetchSubscriptionPlans = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptionplans/pagination`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (!response.ok) throw new Error("Failed to fetch subscription plans");
            const data = await response.json();
            setSubscriptionPlans(data.data);
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
        }
    };

    // Check if user is subscribed
    const fetchIsSubscribed = async () => {
        try {
            if (!user) {
                return;
            }
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/usersubscriptions/check-non-expired/${user.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    }
                }
            );
            if (!response.ok) {
                console.error('Failed to fetch subscription status');
                return
            }
            const data = await response.json();
            setIsSubscribed(data.isSubscribed);
        } catch (error) {
            console.error('Error checking subscription:', error);
        }
    }

    // Check if user is subscribed
    React.useEffect(() => {
        fetchSubscriptionPlans();
        fetchIsSubscribed();
    }, [user, isLoaded]);


    // Fetch scenarios when the project ID changes
    React.useEffect(() => {
        if (projectId !== "" && user && isLoaded) {
            fetchScenarios();
            fetchTotalScenarios();
        }
    }, [projectId, user, isLoaded]);

    // Filter scenarios based on the query and sorting logic for createdAt and updatedAt
    React.useEffect(() => {
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
            // Sort based on createdAt and updatedAt
            filtered = filtered.sort((a, b) => {
                // Convert dates to Unix time
                const dateA = a.updatedAt ? getUnixTime(new Date(a.updatedAt)) : getUnixTime(new Date(a.createdAt));
                const dateB = b.updatedAt ? getUnixTime(new Date(b.updatedAt)) : getUnixTime(new Date(b.createdAt));
                return dateB - dateA; // Descending order, newest first
            });
            setFilteredScenarios(filtered);
        }
    }, [projectId, scenarioList, query]);

    // Create a new scenario
    const createScenario = async (title: string) => {
        if (!user || !isLoaded) return;
        try {
            if (!subscriptionPlans)
                throw new Error("Subscription plans not loaded");
            if (!isSubscribed && totalScenarios >= subscriptionPlans[0].maxScenarios) {
                onOpen();
                return;
            } else if (isSubscribed && totalScenarios >= subscriptionPlans[1].maxScenarios) {
                toast.error("You have reached the maximum number of scenarios allowed for your subscription plan. Contact Admin to upgrade your plan.");
                return;
            } else {
                const randomImage = images[Math.floor(Math.random() * images.length)]
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/byuserclerk`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                    },
                    body: JSON.stringify(
                        {
                            projectId: projectId,
                            scenarioName: title,
                            userIdClerk: user.id,
                            description: "Description",
                            isFavorites: false,
                            imageUrl: randomImage,
                        }
                    ),
                });
                const data = await response.json();
                if (response.status === 200) {
                    toast.success(data.message);
                } else {
                    toast.error(data.title);
                }
                fetchScenarios();
            }
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    // Create a new scenario
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await createScenario(title);
        } catch (error) {
            console.error("Failed to create scenario." + error);
        } finally {
            setIsLoading(false);
            setOpen(false);
        }
    };

    // Rename a scenario
    const renameScenario = async (id: string, newTitle: string) => {
        if (!user || !isLoaded) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/rename-scenario/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
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
            fetchScenarios();
        } catch (error) {
            toast.error("Failed to rename scenario.");
            console.error("Error renaming scenario:", error);
        }
    }

    // Delete a scenario
    const deleteScenario = async (id: string) => {
        if (!user || !isLoaded) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }
            fetchScenarios();
        } catch (error) {
            console.error("Error deleting scenario:", error);
        }
    }

    // Toggle favorite status of a scenario
    const toggleFavorite = async (id: string) => {
        if (!user || !isLoaded) return;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL!}/api/scenarios/toggle-favorite/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": `${process.env.NEXT_PUBLIC_API_KEY!}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.title);
            }
            fetchScenarios();
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    }

    if (projectId === "") {
        return (
            <NoProjectSelected />
        );
    }

    if (!filteredScenarios.length && query.search) {
        return <EmptySearch />;
    }

    if (!filteredScenarios.length && query.favorites) {
        return <EmptyFavorites />;
    }

    if (!scenarioList.length) {
        return <EmptyScenario createScenario={createScenario} />;
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
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button
                            className={cn(
                                "col-span-1 aspect-[100/127] bg-gray-500 rounded-lg hover:bg-gray-700 flex flex-col items-center justify-center py-6"
                                , (false) && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}
                        >
                            <div />
                            <Plus className="h-12 w-12 text-white stroke-1" />
                            <p className="text-sm text-white font-light">
                                New Scenario
                            </p>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" >
                        <DialogHeader>
                            <DialogTitle>Create Scenario</DialogTitle>
                            <DialogDescription>
                                Enter title for this scenario.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <Input
                                required
                                maxLength={30}
                                minLength={5}
                                placeholder="Enter scenario title"
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                }}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Submit"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                {filteredScenarios.map((scenario) => (
                    <ScenarioCard
                        key={scenario.id}
                        id={scenario.id}
                        title={scenario.title}
                        imageUrl={scenario.imageUrl}
                        authorId={scenario.authorId}
                        authorName={scenario.authorName}
                        createdAt={getUnixTime(new Date(scenario.updatedAt)) * 1000} //milliseconds to seconds
                        isFavorite={scenario.isFavorites}
                        toggleFavorite={() => toggleFavorite(scenario.id)}
                        deleteScenario={() => deleteScenario(scenario.id)}
                        renameScenario={renameScenario}
                    />
                ))}
            </div>
        </div>
    );
};
