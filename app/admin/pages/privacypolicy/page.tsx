"use client";

import * as React from "react";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { toast } from "sonner";
import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";

const AdminPrivacyPolicyPage = () => {
  const [value, setValue] = React.useState<any>('')
  const [privacyPolicy, setPrivacyPolicy] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pending, setPending] = React.useState<boolean>(false);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/privacypolicys`);
      if (!response.ok) throw new Error("Failed to fetch privacy policy.");
      const data = await response.json();
      setPrivacyPolicy(data[0]);
      setValue(data[0].description);
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
      toast.error("Failed to fetch privacy policy");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPrivacyPolicy();
  }, [loading]);

  if (loading) {
    return <Loading />
  }

  const handleSave = async () => {
    setPending(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/privacypolicys/${privacyPolicy.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: privacyPolicy.id,
          title: privacyPolicy.title,
          description: value,
        }),
      });
      if (!response.ok) throw new Error("Failed to save privacy policy.");
      toast.success("Privacy policy saved successfully");
    } catch (error) {
      console.error("Error saving privacy policy:", error);
      toast.error("Failed to save privacy policy");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] overflow-hidden flex flex-col">
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        className="w-full flex-1 overflow-y-auto my-4"
        editorContentClassName="p-5 h-full"
        output="html"
        placeholder="Type your description here..."
        autofocus={true}
        editable={true}
        editorClassName="focus:outline-none"
      />
      <div className="flex justify-center my-2">
        <Button disabled={pending} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default AdminPrivacyPolicyPage;