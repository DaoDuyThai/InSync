import { useEffect, useRef } from "react";
import * as Blockly from 'blockly';
import { blocks } from './blocks/json';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import { jsonGenerator } from "./generators/json";
import './blockly.css';
import { toast } from "sonner";
import React from "react";
import { Loading } from "@/components/loading";


export const Canvas = () => {
    const mount = useRef(false);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (mount.current == false) {

            // Register the blocks and generator with Blockly
            Blockly.common.defineBlocks(blocks);

            // Set up UI elements and inject Blockly
            // const codeDiv = document.getElementById('generatedCode')?.firstChild;
            const blocklyDiv = document.getElementById('blocklyDiv');
            if (blocklyDiv) {
                const workspace = Blockly.inject(blocklyDiv, {
                    toolbox,
                    scrollbars: false,
                    toolboxPosition: "start",
                    grid: {
                        spacing: 20,
                        length: 3,
                        colour: '#ccc',
                        snap: true,
                    },
                    maxBlocks: Infinity,
                    move: {
                        scrollbars: {
                            horizontal: true,
                            vertical: true
                        },
                        drag: true,
                        wheel: true
                    },
                    trashcan: true,
                    zoom: {
                        controls: true,
                        // wheel: true,
                        startScale: 1.0,
                        maxScale: 3,
                        minScale: 0.3,
                        scaleSpeed: 1.2,
                        pinch: true
                    },
                });

                // Function to generate and display the JSON code
                const runCode = () => {
                    const code = jsonGenerator.workspaceToCode(workspace);
                    if ((!code.startsWith('[') || !code.endsWith(']')) && code.trim() !== '') {
                        toast.error('Action blocks must be inside a scenario block')
                    }
                    // console.log(code);
                    // (codeDiv as HTMLElement).innerText = code;
                };

                // Load the initial state from storage and run the code

                load(workspace);
                runCode();

                // Add listeners for workspace changes
                workspace.addChangeListener((e) => {
                    if (e.isUiEvent) return;
                    save(workspace); // Save changes
                });

                workspace.addChangeListener((e) => {
                    if (
                        e.isUiEvent ||
                        e.type == Blockly.Events.FINISHED_LOADING ||
                        workspace.isDragging()
                    ) {
                        return;
                    }
                    runCode(); // Regenerate and display the code
                });
                setLoading(false);
            }
        }

        return () => {
            mount.current = true;
        };
    }, []);

    if (loading) {
        return (
            <div id="pageContainer" className="w-full h-full">
                <div id="blocklyDiv" className="w-full h-full basis-full"><Loading /></div>
            </div>
        )
    } else if(!loading){
        return (
            <div id="pageContainer" className="w-full h-full flex">
                <div id="blocklyDiv " className="w-full h-full basis-full"></div>
            </div>
        );
    }


};
