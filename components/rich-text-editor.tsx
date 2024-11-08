import React, { useCallback } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

interface RichTextEditorProps {
  onSave: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ onSave }) => {
  // Cloudinary upload handler
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // Set your upload preset here

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; // URL to be used in the editor
  };

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'editor-image',
          // You can add other attributes here, if necessary
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: '<p></p>',
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      onSave(htmlContent);
    },
  });

  // Custom image handler
  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const url = await uploadImage(file);
        editor?.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  }, [editor]);

  return (
    <div>
      <button
        onClick={addImage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upload Image
      </button>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
