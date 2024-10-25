import { useEffect, useRef } from "react";
import * as Blockly from 'blockly';
import { blocks } from './blocks/json';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import { jsonGenerator } from "./generators/json";
import './blockly.css';


export const Canvas = () => {
    const mount = useRef(false);

    useEffect(() => {
        if (mount.current == false) {
            // Register the blocks and generator with Blockly
            Blockly.common.defineBlocks(blocks);

            // Set up UI elements and inject Blockly
            const codeDiv = document.getElementById('generatedCode')?.firstChild;
            const blocklyDiv = document.getElementById('blocklyDiv');
            if (blocklyDiv && codeDiv) {
                const workspace = Blockly.inject(blocklyDiv, {
                    toolbox,
                    theme: Blockly.Themes.Zelos,
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
                    (codeDiv as HTMLElement).innerText = code;
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
            }
        }

        return () => {
            mount.current = true;
        };
    }, []);

    return (
        <div id="pageContainer" className="relative">
            <div id="blocklyDiv"></div>
            <div id="toolbox"></div>
            <pre id="generatedCode" className="w-1/4  h-full"><code className=""></code></pre>
        </div>
    );
};
