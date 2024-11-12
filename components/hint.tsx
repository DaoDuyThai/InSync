import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as React from "react"

export interface HintProps {
    label: string
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
    sideOffset?: number
    alignOffset?: number
}

export const Hint = ({
    label,
    children,
    side,
    align,
    sideOffset,
    alignOffset

}: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black border-black z-50" side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
                    <p className="font-semibold">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}