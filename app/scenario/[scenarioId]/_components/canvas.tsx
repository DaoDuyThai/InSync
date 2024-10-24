'use client'
import { Suspense, useEffect, useRef } from "react";
import { Loading } from "./loading";
import * as Blockly from 'blockly';
import { blocks } from './blocks/json';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import { BlocklyWorkspace } from 'react-blockly';
import '@/CSS/blockly.css';
import { jsonGenerator } from "./generators/json";
import { Themes } from 'blockly';

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
                const ws = Blockly.inject(blocklyDiv, {
                    toolbox,
                    theme: Blockly.Themes.Zelos,
                    scrollbars: false,
                    // horizontalLayout: true,
                    collapse: false,
                    toolboxPosition: "start",
                });

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
        <div id="pageContainer" >
            <div id="blocklyDiv" ></div>
            <div id="toolbox"></div>

            <pre id="generatedCode"><code></code></pre>

            <div id="output"></div>
        </div>
    )
}