"use client";

import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import * as React from "react";




const AdminAboutPage = () => {
  const [value, setValue] = React.useState<any>('')
  React.useEffect(() => {
    console.log(value)
  }, [value]);

  return (
    <div className="w-full flex flex-col p-6 h-full overflow-y-auto pb-10">
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        className="w-full"
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

export default AdminAboutPage;