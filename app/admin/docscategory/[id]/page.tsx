"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@radix-ui/react-dialog";
import { ConfirmModal } from "@/components/confirm-modal";
import { Trash2 } from "lucide-react";
import '@/components/rich-text.css';

type Category = {
    id: string
    title: string
    order: number
    description: string | null
    dateCreated: string | null
    dateUpdated: string | null
    documents: Docs[] | null
  }
  
  type Docs = {
    id: string
    slug: string
    title: string
    content: string
    note: string
    dateCreated: string | null
    dateUpdated: string | null
    categoryId: string | null
    order: number
    categoryName: string | null
  }

const AdminDocsCategoryPage = () => {
    const { id } = useParams();
    return (
        <div className="w-full h-full overflow-y-auto">
            category id: {id}
        </div>
    );
}

export default AdminDocsCategoryPage;