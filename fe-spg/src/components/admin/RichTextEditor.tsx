"use client";

import ImageExtension from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  type LucideIcon,
} from "lucide-react";

import styles from "./RichTextEditor.module.scss";

type RichTextEditorProps = {
  error?: boolean;
  errorId?: string;
  labelId: string;
  onChange: (html: string) => void;
  value: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
};

function ToolbarButton({
  active = false,
  disabled = false,
  icon: Icon,
  label,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`flex size-9 items-center justify-center rounded-md border-0 p-0 ${
        active
          ? "bg-[#1d2088] text-white"
          : "bg-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900"
      } disabled:cursor-not-allowed disabled:opacity-40`}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon aria-hidden="true" size={17} />
    </button>
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeInitialContent(value: string) {
  if (!value.trim()) return "";
  if (/<[a-z][\s\S]*>/i.test(value)) return value;

  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function normalizeUrl(value: string) {
  const url = value.trim();
  if (!url) return "";
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) return url;
  return `https://${url}`;
}

export function RichTextEditor({
  error = false,
  errorId,
  labelId,
  onChange,
  value,
}: RichTextEditorProps) {
  const editor = useEditor({
    content: normalizeInitialContent(value),
    editorProps: {
      attributes: {
        "aria-describedby": errorId ?? "",
        "aria-labelledby": labelId,
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
        underline: false,
      }),
      Placeholder.configure({
        placeholder: "Nhập nội dung bài viết...",
      }),
      Link.configure({
        defaultProtocol: "https",
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      ImageExtension.configure({
        allowBase64: false,
        HTMLAttributes: {
          loading: "lazy",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    onCreate: ({ editor: currentEditor }) => {
      const initialHtml = currentEditor.isEmpty ? "" : currentEditor.getHTML();
      if (initialHtml !== value) onChange(initialHtml);
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    },
  });

  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      alignCenter: currentEditor?.isActive({ textAlign: "center" }) ?? false,
      alignLeft: currentEditor?.isActive({ textAlign: "left" }) ?? false,
      alignRight: currentEditor?.isActive({ textAlign: "right" }) ?? false,
      blockquote: currentEditor?.isActive("blockquote") ?? false,
      bold: currentEditor?.isActive("bold") ?? false,
      bulletList: currentEditor?.isActive("bulletList") ?? false,
      canRedo:
        currentEditor?.can().chain().focus().redo().run() ?? false,
      canUndo:
        currentEditor?.can().chain().focus().undo().run() ?? false,
      heading2:
        currentEditor?.isActive("heading", { level: 2 }) ?? false,
      heading3:
        currentEditor?.isActive("heading", { level: 3 }) ?? false,
      italic: currentEditor?.isActive("italic") ?? false,
      link: currentEditor?.isActive("link") ?? false,
      orderedList: currentEditor?.isActive("orderedList") ?? false,
      strike: currentEditor?.isActive("strike") ?? false,
      underline: currentEditor?.isActive("underline") ?? false,
    }),
  });

  function setLink() {
    if (!editor) return;

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    const input = window.prompt(
      "Nhập đường dẫn liên kết:",
      currentUrl ?? "https://",
    );

    if (input === null) return;

    const url = normalizeUrl(input);
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  function insertImage() {
    if (!editor) return;

    const input = window.prompt(
      "Nhập URL ảnh (chưa hỗ trợ tải ảnh lên):",
      "https://",
    );
    if (input === null) return;

    const url = normalizeUrl(input);
    if (!url) return;

    editor.chain().focus().setImage({ src: url }).run();
  }

  return (
    <div
      className={`${styles.editor} ${error ? styles.editorError : ""}`}
    >
      <div aria-label="Thanh công cụ soạn thảo" className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <ToolbarButton
            active={toolbarState?.bold}
            icon={Bold}
            label="In đậm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            active={toolbarState?.italic}
            icon={Italic}
            label="In nghiêng"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            active={toolbarState?.underline}
            icon={UnderlineIcon}
            label="Gạch chân"
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          />
          <ToolbarButton
            active={toolbarState?.strike}
            icon={Strikethrough}
            label="Gạch ngang"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          />
        </div>

        <div className={styles.toolbarGroup}>
          <ToolbarButton
            active={toolbarState?.heading2}
            icon={Heading2}
            label="Tiêu đề cấp 2"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          />
          <ToolbarButton
            active={toolbarState?.heading3}
            icon={Heading3}
            label="Tiêu đề cấp 3"
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          />
          <ToolbarButton
            active={toolbarState?.blockquote}
            icon={Quote}
            label="Trích dẫn"
            onClick={() =>
              editor?.chain().focus().toggleBlockquote().run()
            }
          />
        </div>

        <div className={styles.toolbarGroup}>
          <ToolbarButton
            active={toolbarState?.bulletList}
            icon={List}
            label="Danh sách dấu đầu dòng"
            onClick={() =>
              editor?.chain().focus().toggleBulletList().run()
            }
          />
          <ToolbarButton
            active={toolbarState?.orderedList}
            icon={ListOrdered}
            label="Danh sách đánh số"
            onClick={() =>
              editor?.chain().focus().toggleOrderedList().run()
            }
          />
        </div>

        <div className={styles.toolbarGroup}>
          <ToolbarButton
            active={toolbarState?.alignLeft}
            icon={AlignLeft}
            label="Căn trái"
            onClick={() =>
              editor?.chain().focus().setTextAlign("left").run()
            }
          />
          <ToolbarButton
            active={toolbarState?.alignCenter}
            icon={AlignCenter}
            label="Căn giữa"
            onClick={() =>
              editor?.chain().focus().setTextAlign("center").run()
            }
          />
          <ToolbarButton
            active={toolbarState?.alignRight}
            icon={AlignRight}
            label="Căn phải"
            onClick={() =>
              editor?.chain().focus().setTextAlign("right").run()
            }
          />
        </div>

        <div className={styles.toolbarGroup}>
          <ToolbarButton
            active={toolbarState?.link}
            icon={Link2}
            label="Thêm hoặc sửa liên kết"
            onClick={setLink}
          />
          <ToolbarButton
            disabled={!toolbarState?.link}
            icon={Unlink}
            label="Xóa liên kết"
            onClick={() =>
              editor?.chain().focus().extendMarkRange("link").unsetLink().run()
            }
          />
          <ToolbarButton
            icon={ImageIcon}
            label="Chèn ảnh bằng URL"
            onClick={insertImage}
          />
        </div>

        <div className={styles.toolbarGroup}>
          <ToolbarButton
            disabled={!toolbarState?.canUndo}
            icon={Undo2}
            label="Hoàn tác"
            onClick={() => editor?.chain().focus().undo().run()}
          />
          <ToolbarButton
            disabled={!toolbarState?.canRedo}
            icon={Redo2}
            label="Làm lại"
            onClick={() => editor?.chain().focus().redo().run()}
          />
        </div>
      </div>

      <EditorContent className={styles.content} editor={editor} />
    </div>
  );
}
