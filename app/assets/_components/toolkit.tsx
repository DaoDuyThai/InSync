import { RectangleHorizontal, PenBoxIcon } from "lucide-react"

export default function Toolkit() {
    return (
        <div className="p-5 rounded-sm shadow-xl shadow-gray-400 max-h-[400px]">
            <span className="text-lg">Toolkit</span>
            <RectangleHorizontal size={50} color="black"/>
            <PenBoxIcon size={50} color="black"/>
        </div>
    )
}