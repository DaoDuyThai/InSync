// import { Canvas } from "./_components/canvas";
// import { Room } from "@/components/room";
import { Suspense } from "react";
import { Loading } from "./_components/loading";
import Canvas from "./_components/canvas";

interface ScenarioIdPageProps {
    params: {
        scenarioId: string;
    }
}


const ScenarioIdPage = ({
    params
}: ScenarioIdPageProps) => {
    return (
        <Canvas />
        // <Suspense fallback={<Loading />}>
        //     {params.scenarioId}
        //     {/* TODO: Canvas */}
            
        // </Suspense>

    )
}

export default ScenarioIdPage;