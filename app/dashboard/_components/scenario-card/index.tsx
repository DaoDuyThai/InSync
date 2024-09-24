"use client"

import Image from "next/image";
import Link from "next/link";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/nextjs";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton"
// TODO: Action to be implemented
// import { Actions } from "@/components/actions";
import { MoreHorizontal } from "lucide-react";
// import { useApiMutation } from "@/hooks/use-api-mutation";
// import { api } from "@/convex/_generated/api";
import { on } from "events";
import { toast } from "sonner";

interface ScenarioCardProps {
    id: string;
    title: string;
    authorName: string;
    authorId: string;
    createdAt: number;
    imageUrl: string;
    projectId: string;
    isFavorite: boolean;
}

export const ScenarioCard = ({
    id,
    title,
    authorName,
    authorId,
    createdAt,
    imageUrl,
    projectId,
    isFavorite
}: ScenarioCardProps) => {
    const { userId } = useAuth();
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

    // const {
    //     mutate: onFavorite,
    //     pending: pendingFavorite
    // } = useApiMutation(api.board.favorite)

    // const {
    //     mutate: onUnfavorite,
    //     pending: pendingUnfavorite
    // } = useApiMutation(api.board.unfavorite)

    const toggleFavorite = () => {
        // if (isFavorite) {
        //     onUnfavorite({ id })
        //         .catch(() => toast.error("Failed to unfavorite board"))
        // } else {
        //     onFavorite({ id, orgId })
        //         .catch(() => toast.error("Failed to favorite board"))
        // }
    }

    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-gray-200">
                    <Image src={imageUrl} fill className="object-fit" alt={title} />
                    <Overlay />
                    {/* <Actions
                        id={id}
                        title={title}
                        side="right">
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                            <MoreHorizontal className="text-white opacity-75 hover:opacity-100 transition-opacity" />
                        </button>
                    </Actions> */}
                </div>
                {/* <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={pendingFavorite || pendingUnfavorite}
                /> */}

                <Footer
                    isFavorite={isFavorite}
                    title={title}
                    authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={toggleFavorite}
                    disabled={false}
                />

            </div>

        </Link>
    )
}

ScenarioCard.Skeleton = function ScenarioCardSkeleton() {
    return (
        <div className="aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}