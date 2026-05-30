"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImageIcon,
  Loader2,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Minus,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Palette,
  Video,
  Table as TableIcon,
  Columns,
  Rows,
  Trash2,
  CodeSquare,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor;
  onImageUpload: (file: File) => void;
  isUploading?: boolean;
}

const textColors = ["#111827", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
const highlightColors = ["#fef08a", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fecdd3", "#fed7aa", "#d1d5db", "#ffffff"];

export function EditorToolbar({ editor, onImageUpload, isUploading }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleToggleLinkInput = () => {
    if (!showLinkInput && editor.isActive("link")) {
      setLinkUrl(editor.getAttributes("link").href || "");
    } else {
      setLinkUrl("");
    }
    setShowLinkInput(!showLinkInput);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
    setShowYoutubeInput(false);
  };

  const handleSetLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const handleAddYoutube = () => {
    if (youtubeUrl.trim()) {
      editor.commands.setYoutubeVideo({ src: youtubeUrl });
    }
    setShowYoutubeInput(false);
    setYoutubeUrl("");
  };

  const handleToggleYoutube = () => {
    setShowYoutubeInput(!showYoutubeInput);
    setShowLinkInput(false);
    setShowColorPicker(false);
    setShowHighlightPicker(false);
  };

  const handleToggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
    setShowLinkInput(false);
    setShowHighlightPicker(false);
    setShowYoutubeInput(false);
  };

  const handleToggleHighlightPicker = () => {
    setShowHighlightPicker(!showHighlightPicker);
    setShowLinkInput(false);
    setShowColorPicker(false);
    setShowYoutubeInput(false);
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-all duration-150 flex items-center justify-center relative",
        isActive
          ? "bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-900/40 dark:text-indigo-400"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => <div className="w-px h-6 bg-gray-200 mx-0.5 dark:bg-gray-700" />;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 w-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive("subscript")}
        title="Subscript"
      >
        <SubscriptIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive("superscript")}
        title="Superscript"
      >
        <SuperscriptIcon className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        title="Align left"
      >
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        title="Align center"
      >
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        title="Align right"
      >
        <AlignRight className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet list"
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered list"
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <Quote className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code block"
      >
        <CodeSquare className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal rule"
      >
        <Minus className="size-4" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton onClick={handleImageClick} disabled={isUploading} title="Insert image">
        {isUploading ? <Loader2 className="size-4 animate-spin text-indigo-600" /> : <ImageIcon className="size-4" />}
      </ToolbarButton>

      <div className="relative">
        <ToolbarButton
          onClick={handleToggleLinkInput}
          isActive={editor.isActive("link")}
          title="Insert link"
        >
          <LinkIcon className="size-4" />
        </ToolbarButton>
        {showLinkInput && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 flex items-center gap-2">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
              className="w-56 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSetLink}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}
              className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {editor.isActive("link") && (
        <ToolbarButton onClick={handleRemoveLink} title="Remove link">
          <Unlink className="size-4" />
        </ToolbarButton>
      )}

      <div className="relative">
        <ToolbarButton
          onClick={handleToggleYoutube}
          title="Embed YouTube video"
        >
          <Video className="size-4" />
        </ToolbarButton>
        {showYoutubeInput && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3 flex items-center gap-2">
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddYoutube()}
              className="w-64 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleAddYoutube}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Embed
            </button>
            <button
              type="button"
              onClick={() => { setShowYoutubeInput(false); setYoutubeUrl(""); }}
              className="px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <ToolbarButton
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        title="Insert table"
      >
        <TableIcon className="size-4" />
      </ToolbarButton>

      {editor.isActive("table") && (
        <>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="Add column"
          >
            <Columns className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="Add row"
          >
            <Rows className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Delete table"
          >
            <Trash2 className="size-4" />
          </ToolbarButton>
        </>
      )}

      <ToolbarDivider />

      <div className="relative">
        <ToolbarButton
          onClick={handleToggleColorPicker}
          title="Text color"
        >
          <Palette className="size-4" />
        </ToolbarButton>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3">
            <div className="grid grid-cols-4 gap-1.5">
              {textColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => { editor.chain().focus().setColor(color).run(); setShowColorPicker(false); }}
                  className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
              className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-1"
            >
              Reset Color
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <ToolbarButton
          onClick={handleToggleHighlightPicker}
          isActive={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="size-4" />
        </ToolbarButton>
        {showHighlightPicker && (
          <div className="absolute top-full right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-3">
            <div className="grid grid-cols-4 gap-1.5">
              {highlightColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setShowHighlightPicker(false); }}
                  className="w-7 h-7 rounded-full border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightPicker(false); }}
              className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 py-1"
            >
              Remove Highlight
            </button>
          </div>
        )}
      </div>

      <ToolbarDivider />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Undo"
      >
        <Undo className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Redo"
      >
        <Redo className="size-4" />
      </ToolbarButton>
    </div>
  );
}
