'use client'
import { Suspense, useEffect, useRef } from "react";
import { Loading } from "./_components/loading";
import * as Blockly from 'blockly';
import { blocks } from './_components/blocks/json';
import { save, load } from './_components/serialization';
import { toolbox } from './_components/toolbox';
import { jsonGenerator } from './_components/generators/json';
import '@/CSS/blockly.css';
import Canvas from "./_components/canvas";

interface ScenarioIdPageProps {
    params: {
        scenarioId: string;
    }
}


const ScenarioIdPage = ({
    params
}: ScenarioIdPageProps) => {
    const mount = useRef(false);

    useEffect(() => {
        if (mount.current == false) {

            // Register the blocks and generator with Blockly
            Blockly.common.defineBlocks(blocks);

            // Set up UI elements and inject Blockly
            const codeDiv = document.getElementById('generatedCode')?.firstChild;
            const blocklyDiv = document.getElementById('blocklyDiv');
            if (blocklyDiv && codeDiv) {
                const ws = Blockly.inject(blocklyDiv, { toolbox });

                /// This function resets the code div and shows the
                // generated code from the workspace.
                const runCode = () => {
                    const code = jsonGenerator.workspaceToCode(ws);
                    (codeDiv as HTMLElement).innerText = code;
                };

                // Load the initial state from storage and run the code.
                load(ws);
                runCode();

                // Every time the workspace changes state, save the changes to storage.
                ws.addChangeListener((e) => {
                    // UI events are things like scrolling, zooming, etc.
                    // No need to save after one of these.
                    if (e.isUiEvent) return;
                    save(ws);
                });

                // Whenever the workspace changes meaningfully, run the code again.
                ws.addChangeListener((e) => {
                    // Don't run the code when the workspace finishes loading; we're
                    // already running it once when the application starts.
                    // Don't run the code during drags; we might have invalid state.
                    if (
                        e.isUiEvent ||
                        e.type == Blockly.Events.FINISHED_LOADING ||
                        ws.isDragging()
                    ) {
                        return;
                    }
                    runCode();
                });
            }
        }

        return () => {
            mount.current = true;
        }


    }, []);

    return (
        <Canvas />
        // <Suspense fallback={<Loading />}>
        //     {params.scenarioId}
        //     {/* TODO: Canvas */}
            
        // </Suspense>

    )
}

export default ScenarioIdPage;