import * as React from 'react'
import type { Editor } from '@tiptap/react'
import type { Content, UseEditorOptions } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Underline } from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import {
  Link,
  Image,
  HorizontalRule,
  CodeBlockLowlight,
  Selection,
  Color,
  UnsetAllMarks,
  ResetMarksOnEnter,
  FileHandler
} from '../extensions'
import { cn } from '@/lib/utils'
import { fileToBase64, getOutput, randomId } from '../utils'
import { useThrottle } from '../hooks/use-throttle'
import { toast } from 'sonner'

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content
  output?: 'html' | 'json' | 'text'
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
}

// Cloudinary upload helper function
const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Image upload failed.");
    const data = await response.json();
    return data.secure_url; // Cloudinary URL to use in the editor
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    toast.error("Image upload to Cloudinary failed.");
    return null;
  }
};

const createExtensions = (placeholder: string) => [
  StarterKit.configure({
    horizontalRule: false,
    codeBlock: false,
    paragraph: { HTMLAttributes: { class: 'text-node' } },
    heading: { HTMLAttributes: { class: 'heading-node' } },
    blockquote: { HTMLAttributes: { class: 'block-node' } },
    bulletList: { HTMLAttributes: { class: 'list-node' } },
    orderedList: { HTMLAttributes: { class: 'list-node' } },
    code: { HTMLAttributes: { class: 'inline', spellcheck: 'false' } },
    dropcursor: { width: 2, class: 'ProseMirror-dropcursor border' }
  }),
  Link,
  Underline,
  Image.configure({
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: false,
    uploadFn: async (file: File) => {
      const src = await uploadImageToCloudinary(file);
      if (src) {
        return { id: Math.random().toString(36).substring(2, 9), src };
      } else {
        throw new Error("Image upload to Cloudinary failed.");
      }
    },
    onImageRemoved({ id, src }) {
      console.log('Image removed', { id, src })
    },
    onValidationError(errors) {
      errors.forEach(error => {
        toast.error('Image validation error', {
          position: 'bottom-right',
          description: error.reason
        })
      })
    },
    onActionSuccess({ action }) {
      const mapping = {
        copyImage: 'Copy Image',
        copyLink: 'Copy Link',
        download: 'Download'
      }
      toast.success(mapping[action], {
        position: 'bottom-right',
        description: 'Image action success'
      })
    },
    onActionError(error, { action }) {
      const mapping = {
        copyImage: 'Copy Image',
        copyLink: 'Copy Link',
        download: 'Download'
      }
      toast.error(`Failed to ${mapping[action]}`, {
        position: 'bottom-right',
        description: error.message
      })
    }
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ['image/*'],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: (editor, files, pos) => {
      files.forEach(async file => {
        const src = await fileToBase64(file)
        editor.commands.insertContentAt(pos, {
          type: 'image',
          attrs: { src }
        })
      })
    },
    onPaste: (editor, files) => {
      files.forEach(async file => {
        const src = await fileToBase64(file)
        editor.commands.insertContent({
          type: 'image',
          attrs: { src }
        })
      })
    },
    onValidationError: errors => {
      errors.forEach(error => {
        toast.error('Image validation error', {
          position: 'bottom-right',
          description: error.reason
        })
      })
    }
  }),
  Color,
  TextStyle,
  Selection,
  Typography,
  UnsetAllMarks,
  HorizontalRule,
  ResetMarksOnEnter,
  CodeBlockLowlight,
  Placeholder.configure({ placeholder: () => placeholder })
]

export const useMinimalTiptapEditor = ({
  value,
  output = 'html',
  placeholder = '',
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle((value: Content) => onUpdate?.(value), throttleDelay)

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value)
      }
    },
    [value]
  )

  const handleBlur = React.useCallback((editor: Editor) => onBlur?.(getOutput(editor, output)), [output, onBlur])

  const editor = useEditor({
    extensions: createExtensions(placeholder),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: cn('focus:outline-none', editorClassName)
      }
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props
  })

  return editor
}

export default useMinimalTiptapEditor