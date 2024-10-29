import React, { useEffect, useRef, useState } from "react";
import * as Blockly from 'blockly';
import { blocks } from './blocks/json';
import { save, load } from './serialization';
import { toolbox } from './toolbox';
import { jsonGenerator } from "./generators/json";
import './blockly.css';
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Undo, Redo, Trash, MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const Canvas = () => {
    const blocklyDivRef = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState<string>("");
    const [activeTab, setActiveTab] = useState("code");

    function formatJSON(jsonString: string): string | null {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 4);
        } catch (error) {
            return jsonString;
        }
    }

    const handleUndo = () => {
        if (workspaceRef.current) {
            workspaceRef.current.undo(false)
        }
    }

    const handleRedo = () => {
        if (workspaceRef.current) {
            workspaceRef.current.undo(true)
        }
    }

    const handleDelete = () => {
        const selectedBlock = Blockly.common.getSelected();
    
        if (selectedBlock && selectedBlock instanceof Blockly.BlockSvg) {
            selectedBlock.dispose(true, true); // Dispose of only the selected block
        }
    };

    useEffect(() => {
        if (!workspaceRef.current && blocklyDivRef.current) {
            Blockly.common.defineBlocks(blocks);

            const workspace = Blockly.inject(blocklyDivRef.current, {
                toolbox,
                scrollbars: false,
                toolboxPosition: "start",
                grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
                maxBlocks: Infinity,
                move: { scrollbars: { horizontal: true, vertical: true }, drag: true, wheel: true },
                trashcan: true,
                zoom: {
                    controls: true,
                    wheel: true,
                    startScale: 1.0,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                    pinch: true
                },
            });

            workspaceRef.current = workspace;

            const runCode = () => {
                const code = jsonGenerator.workspaceToCode(workspace).trim();
                if ((!code.startsWith('[') || !code.endsWith(']')) && code) {
                    toast.error('Action block(s) must be inside a scenario block');
                }
                const formattedCode = formatJSON(code);
                setCode(formattedCode ?? '');
            };

            load(workspace);
            runCode();

            workspace.addChangeListener((e) => {
                if (e.isUiEvent) return;
                save(workspace);
                runCode();
            });

            setLoading(false);
        }
    }, []);

    return (
        <div className="flex h-[calc(100vh-70px)] overflow-hidden">
            {/* Left sidebar */}
            <div className="w-2/3 flex flex-col border-r">
                <div className=" flex items-center justify-between px-4 py-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>New Block</DropdownMenuItem>
                            <DropdownMenuItem>Import</DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="flex">
                        <Button variant="ghost" size="sm" onClick={handleUndo} aria-label="Undo">
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleRedo} aria-label="Redo">
                            <Redo className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDelete} aria-label="Delete">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>

                </div>
                <div ref={blocklyDivRef} id="blocklyDiv" className="w-full h-full"></div>
            </div>

            {/* Right content area */}
            <div className="flex-1 w-1/3 flex flex-col">

                <Tabs
                    defaultValue="code"
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value)}
                    className="flex-1 flex flex-col"
                >

                    <div className="p-1 flex justify-between">
                        <div className="p-2 text-lg font-semibold">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} {/* Capitalize first letter */}
                        </div>
                        <TabsList>
                            <TabsTrigger value="assets">Assets</TabsTrigger>
                            <TabsTrigger value="logs">Logs</TabsTrigger>
                            <TabsTrigger value="code">Code</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="assets" className="flex-1 p-1">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            This is an Assets tab
                        </div>
                    </TabsContent>
                    <TabsContent value="logs" className="flex-1 p-1">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            This is a Logs tab
                        </div>
                    </TabsContent>
                    <TabsContent value="code" className="flex-1">
                        <Textarea
                            id="codeTextarea"
                            className="w-full h-full overflow-auto resize-none focus:ring-0 focus:ring-offset-0"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                boxShadow: 'none',
                            }}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                    <Loading />
                </div>
            )}
        </div>
    );
};
