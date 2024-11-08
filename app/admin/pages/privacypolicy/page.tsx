"use client";

import * as React from "react";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";



const AdminPrivacyPolicyPage = () => {
  const [value, setValue] = React.useState<any>('')

  
  return (
    <div className="w-full h-full overflow-y-auto">
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        className="w-full mt-5"
        editorContentClassName="p-5"
        output="html"
        placeholder="Type your description here..."
        autofocus={true}
        editable={true}
        editorClassName="focus:outline-none"
      />
    </div>
  );
}

export default AdminPrivacyPolicyPage;