'use client'
import { Suspense, useEffect, useRef } from "react";
import { Loading } from "./_components/loading";
import * as Blockly from 'blockly';
import { blocks } from './_components/blocks/json';
import { save, load } from './_components/serialization';
import { toolbox } from './_components/toolbox';
import { BlocklyWorkspace } from 'react-blockly';
import { jsonGenerator } from "./_components/generators/json";
import { Themes } from 'blockly';
import { Canvas } from "./_components/canvas";

interface ScenarioIdPageProps {
    params: {
        scenarioId: string;
    }
}

const ScenarioIdPage = ({
    params
}: ScenarioIdPageProps) => {

    return (
        // <Suspense fallback={<Loading />}>
        //     {params.scenarioId}
        // </Suspense>


        <Canvas />

        // <Room roomId={params.boardId} fallback={<Loading />}>
        //     <Canvas boardId={params.boardId} />
        //     <Chat roomId={params.boardId}/>
        // </Room>
    )
}

export default ScenarioIdPage;