/* eslint-disable @next/next/no-img-element */
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
import { Undo, Redo, Trash, MoreHorizontal, ZoomOut, ZoomIn, Minimize, Maximize, Move, Save, Link, SquarePen, Pencil, Trash2, Plus } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Hint } from "@/components/hint";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/confirm-modal";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import Image from "next/image";

interface Asset {
    id: string;
    projectId: string;
    projectName: string | null;
    assetName: string;
    type: string | null;
    filePath: string;
    dateCreated: string | null;
    dateUpdated: string | null;
}

interface CanvasProps {
    id: string;
    title: string;
    deleteScenario: () => void;
    renameScenario: (id: string, newTitle: string) => Promise<void>;
    saveScenario: () => void;
    projectId: string;
}

export const Canvas = ({
    id,
    title,
    deleteScenario,
    renameScenario,
    saveScenario,
    projectId
}: CanvasProps) => {
    const blocklyDivRef = useRef<HTMLDivElement | null>(null);
    const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
    const [code, setCode] = useState<string>("");
    const [activeTab, setActiveTab] = useState("assets");
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [saved, setSaved] = useState(true);
    const [newTitle, setNewTitle] = React.useState<string>(title);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingScenarioRenameInput, setLoadingScenarioRenameInput] = React.useState<boolean>(false);
    const [openRenameScenarioDialog, setOpenRenameScenarioDialog] = React.useState<boolean>(false);
    const [assets, setAssets] = React.useState<Asset[]>([]);

    // Fetch assets based on the project ID 
    React.useEffect(() => {
        if (projectId !== "") {
            const fetchAssets = async () => {
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL!}/api/assets/asset-project/${projectId}`
                    );
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setAssets(data.data);
                } catch (error) {
                    console.error("Error fetching assets:", error);
                }
            };
            fetchAssets();
            // setPending(false);
        }
    }, [projectId]);

    function formatJSON(jsonString: string): string | null {
        try {
            const parsed = JSON.parse(jsonString);
            return JSON.stringify(parsed, null, 4);
        } catch (error) {
            return jsonString;
        }
    }

    const handleSave = () => {
        saveScenario();
        setSaved(true);
    }

    const handleCopyUrl = () => {
        navigator.clipboard
            .writeText(`${window.location.origin}/scenario/${id}`)
            .then(() => {
                toast.success("Link copied");
            })
            .catch(() => {
                toast.error("Failed to copy link");
            });
    };

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingScenarioRenameInput(true);
        try {
            await renameScenario(id, newTitle);
        } catch (error) {
            console.error("Failed to rename scenario.");
        } finally {
            setLoadingScenarioRenameInput(false);
            setOpenRenameScenarioDialog(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    };

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

    const handleZoomIn = () => {
        if (workspaceRef.current) {
            workspaceRef.current.zoomCenter(1); // 1 is zoom-in scale
        }
    };

    const handleZoomOut = () => {
        if (workspaceRef.current) {
            workspaceRef.current.zoomCenter(-1); // -1 is zoom-out scale
        }
    };

    const handleCenterWorkspace = () => {
        if (workspaceRef.current) {
            workspaceRef.current.scrollCenter();
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
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
                setSaved(false);
                localStorage.setItem('jsonMobile', formattedCode ?? '');
                setCode(formattedCode ?? '');
            };

            load(workspace);
            runCode();

            workspace.addChangeListener((e) => {
                if (e.isUiEvent) return;
                save(workspace);
                runCode();
            });

            setLoadingPage(false);
        }
    }, []);

    return (
        <div className="flex h-[calc(100vh-70px)] ">
            {/* Left sidebar */}
            <div className="hidden  w-2/3 md:flex flex-col ">
                <div className=" flex items-center justify-between px-4 py-1 h-12">
                    <div className="flex items-center">
                        <Hint label="Save" side="top">
                            <Button onClick={handleSave} variant="ghost" size="sm" aria-label="Save" disabled={saved}>
                                <Save className="h-4 w-4" />
                            </Button>
                        </Hint>
                        <Hint label="Copy URL" side="top">
                            <Button onClick={handleCopyUrl} variant="ghost" size="sm" aria-label="Copy URL">
                                <Link className="h-4 w-4" />
                            </Button>
                        </Hint>
                        <Dialog open={openRenameScenarioDialog} onOpenChange={setOpenRenameScenarioDialog}>
                            <Hint label="Rename" side="top">
                                <DialogTrigger asChild>

                                    <Button variant="ghost" size="sm" aria-label="Rename">
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </Hint>
                            <DialogContent className="sm:max-w-md" >
                                <DialogHeader>
                                    <DialogTitle>Edit scenario title</DialogTitle>
                                    <DialogDescription>
                                        Enter a new title for this scenario.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRename} className="space-y-4">
                                    <Input
                                        required
                                        maxLength={60}
                                        minLength={5}
                                        placeholder={title}
                                        // value={title} // Pre-filled with the current title
                                        onChange={(e) => {
                                            setNewTitle(e.target.value)
                                        }}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={loadingScenarioRenameInput}>
                                            {loadingScenarioRenameInput ? "Renaming..." : "Submit"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>


                        <ConfirmModal
                            header="Delete Scenario?"
                            description="This will delete the scenario and all of its contents."
                            onConfirm={() => {
                                deleteScenario();
                                setTimeout(() => {
                                    window.location.reload();
                                }, 5000);
                            }}
                        >
                            <span>
                                <Hint label="Delete Scenario" side="top">
                                    <Button variant="ghost" size="sm" aria-label="Delete">
                                        <Trash2 color="#ff0000" className="h-4 w-4" />
                                    </Button>
                                </Hint>
                            </span>
                        </ConfirmModal>


                        <Separator orientation="vertical" className="mx-2 h-4" />
                        <Hint label="Undo" side="top">
                            <Button variant="ghost" size="sm" onClick={handleUndo} aria-label="Undo">
                                <Undo className="h-4 w-4" />
                            </Button>
                        </Hint>
                        <Hint label="Redo" side="top">
                            <Button variant="ghost" size="sm" onClick={handleRedo} aria-label="Redo">
                                <Redo className="h-4 w-4" />
                            </Button>
                        </Hint>


                    </div>
                    <div className="flex">
                        <Hint label="Zoom In" side="top">
                            <Button onClick={handleZoomIn} variant="ghost" size="sm" aria-label="Zoom In">
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </Hint>
                        <Hint label="Zoom Out" side="top">
                            <Button onClick={handleZoomOut} variant="ghost" size="sm" aria-label="Zoom Out">
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                        </Hint>

                        <Hint label="Center Workspace" side="top">
                            <Button onClick={handleCenterWorkspace} variant="ghost" size="sm" aria-label="Center Workspace">
                                <Move className="h-4 w-4" />
                            </Button>
                        </Hint>

                        <Hint label={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"} side="top">
                            <Button onClick={toggleFullScreen} variant="ghost" size="sm" aria-label="Full Screen">
                                {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                            </Button>
                        </Hint>
                        <Hint label="Delete Block(s)" side="top">
                            <Button variant="ghost" size="sm" onClick={handleDelete} aria-label="Delete Block(s)">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </Hint>
                    </div>
                </div>
                <div ref={blocklyDivRef} id="blocklyDiv" className="w-full h-full"></div>
            </div>

            {/* Right content area */}
            <div className="flex-1 md:w-1/3 flex flex-col">
                <Tabs
                    defaultValue="code"
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value)}
                    className="flex-1 flex flex-col"
                >
                    <div className="px-2 h-12 flex justify-between items-center">
                        <div className="px-1 text-lg font-semibold">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </div>
                        <TabsList>
                            <TabsTrigger value="assets">Assets</TabsTrigger>
                            <TabsTrigger value="logs">Logs</TabsTrigger>
                            <TabsTrigger value="code">Code</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="assets" className="flex-1 overflow-hidden m-0">
                        <div className="w-full h-full max-h-[calc(100vh-119px)] overflow-y-auto text-muted-foreground grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
                            <div className="group cursor-pointer relative aspect-square bg-gray-500 rounded-lg hover:bg-gray-700 flex flex-col items-center justify-center">
                                <Plus className="h-12 w-12 text-white stroke-1" />
                                <p className="text-sm text-white font-light">
                                    New Asset
                                </p>
                            </div>
                            {assets.map((asset) => (
                                <div key={asset.id} className="group cursor-pointer relative aspect-square">
                                    <img
                                        src={asset.filePath}
                                        alt={asset.assetName}
                                        className="w-full h-full object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="logs" className="flex-1 p-1">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            This is a Logs tab
                        </div>
                    </TabsContent>
                    <TabsContent value="code" className="flex-1 overflow-auto m-0">
                        <div className="w-full h-[calc(100vh-119px)]">
                            <CodeMirror
                                value={code}
                                extensions={[json()]}
                                theme="light"
                                onChange={(value) => setCode(value)}
                                basicSetup={{
                                    lineNumbers: true,
                                    foldGutter: true,
                                    highlightActiveLineGutter: true,
                                }}
                                className="w-full"
                                style={{
                                    maxHeight: '100%',
                                    overflowY: 'auto', // Ensures scrolling within the editor
                                }}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {loadingPage && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                    <Loading />
                </div>
            )}
        </div>
    );
};

