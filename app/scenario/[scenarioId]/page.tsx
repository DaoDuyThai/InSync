// import { Canvas } from "./_components/canvas";
// import { Room } from "@/components/room";
import { Suspense } from "react";
import { Loading } from "./_components/loading";

interface ScenarioIdPageProps {
    params: {
        scenarioId: string;
    }
}


const ScenarioIdPage = ({
    params
}: ScenarioIdPageProps) => {
    return (
        <Suspense fallback={<Loading />}>
            {params.scenarioId}
        </Suspense>
        // <Room roomId={params.boardId} fallback={<Loading />}>
        //     <Canvas boardId={params.boardId} />
        //     <Chat roomId={params.boardId}/>
        // </Room>
    )
}

export default ScenarioIdPage;