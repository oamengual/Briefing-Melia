"use client"

import * as React from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Extension } from '@tiptap/core'
import { cn } from "@/lib/utils"
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, RemoveFormatting } from 'lucide-react'
import { Button } from "./button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

// Custom Extension for Font Size
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType,
            unsetFontSize: () => ReturnType,
        }
    }
}

const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
                        renderHTML: attributes => {
                            if (!attributes.fontSize) {
                                return {}
                            }
                            return {
                                style: `font-size: ${attributes.fontSize}`,
                            }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: fontSize => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize })
                    .run()
            },
            unsetFontSize: () => ({ chain }) => {
                return chain()
                    .setMark('textStyle', { fontSize: null })
                    .removeEmptyTextStyle()
                    .run()
            },
        }
    },
})

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const fontSizes = [
    { label: 'Small', value: '12px' },
    { label: 'Normal', value: '14px' },
    { label: 'Large', value: '16px' },
    { label: 'Huge', value: '20px' },
]

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontSize,
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Only update if the content has actually changed to avoid cursor jumping
            if (editor.getHTML() !== value) {
                // If it's just an empty paragraph, consider it empty
                if (editor.getText().trim() === '' && editor.getHTML() === '<p></p>') {
                    onChange('');
                } else {
                    onChange(editor.getHTML());
                }
            }
        },
        editorProps: {
            attributes: {
                className: 'min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm dark:prose-invert max-w-none prose-p:m-0 prose-p:leading-relaxed',
            },
        },
    })

    // Update editor content when external value changes (e.g., loading a new brief)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [editor, value]);

    if (!editor) {
        return null
    }

    return (
        <div className={cn("flex flex-col gap-2 rounded-md border border-input bg-card shadow-sm overflow-hidden", className)}>
            <div className="flex flex-wrap items-center gap-1 p-1 border-b border-input bg-muted/30">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive('bold') && "bg-muted")}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        type="button"
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive('italic') && "bg-muted")}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        type="button"
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive('underline') && "bg-muted")}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        type="button"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Button>
                </div>

                <div className="w-[1px] h-6 bg-border mx-1" />

                {/* Alignment */}
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive({ textAlign: 'left' }) && "bg-muted")}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        type="button"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive({ textAlign: 'center' }) && "bg-muted")}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        type="button"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive({ textAlign: 'right' }) && "bg-muted")}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        type="button"
                    >
                        <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8", editor.isActive({ textAlign: 'justify' }) && "bg-muted")}
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        type="button"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </Button>
                </div>

                <div className="w-[1px] h-6 bg-border mx-1" />

                {/* Font Size */}
                <Select
                    onValueChange={(val) => {
                        if (val === 'default') {
                            editor.chain().focus().unsetFontSize().run();
                        } else {
                            editor.chain().focus().setFontSize(val).run();
                        }
                    }}
                >
                    <SelectTrigger className="h-8 w-[100px] text-xs border-none bg-transparent shadow-none focus:ring-0">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default" className="text-xs">Default</SelectItem>
                        {fontSizes.map((size) => (
                            <SelectItem key={size.value} value={size.value} className="text-xs">
                                {size.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="w-[1px] h-6 bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    type="button"
                    title="Clear Formatting"
                >
                    <RemoveFormatting className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-1">
                <EditorContent editor={editor} className={className} />
            </div>
        </div>
    )
}
