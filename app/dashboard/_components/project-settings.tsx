import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pencil, Settings, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/confirm-modal';

export const ProjectSettings = () => {
    {/* TODO: Add functionality menu for project settings */ }
    return (

        <DropdownMenu >
            <DropdownMenuTrigger><Settings size={24} className='inline-block' /></DropdownMenuTrigger>
            <DropdownMenuContent >
                <DropdownMenuLabel className="p-3"><span className='text-lg'>Project Settings</span></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                    <Button variant="ghost" size={'sm'} className="flex cursor-pointer text-sm w-full justify-center font-normal">
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                    </Button>
                </DropdownMenuLabel>
                <DropdownMenuLabel>
                    <ConfirmModal
                        header="Delete project?"
                        description="This will delete the project and all of its contents."
                        disabled={true}
                        onConfirm={() => { }}
                    >
                        <Button variant="redBg" size={'sm'} className="flex cursor-pointer text-sm w-full justify-center font-normal">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </ConfirmModal>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}