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
  LoaderCircle,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { ApiError } from "@/lib/api";
import { uploadMedia } from "@/services/media.service";
import {
  MEDIA_FILE_ACCEPT,
  isSupportedMediaFile,
} from "@/types/media";

import styles from "./RichTextEditor.module.scss";

type RichTextEditorProps = {
  error?: boolean;
  errorId?: string;
  labelId: string;
  onChange: (html: string) => void;
  onImageUploadNotice?: (notice: {
    message: string;
    tone: "error" | "success";
  }) => void;
  value: string;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  loading?: boolean;
  onClick: () => void;
};

const MAX_CONTENT_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

function ToolbarButton({
  active = false,
  disabled = false,
  icon: Icon,
  label,
  loading = false,
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
      <Icon
        aria-hidden="true"
        className={loading ? "animate-spin" : undefined}
        size={17}
      />
    </button>
  );
}

type LinkDialogProps = {
  error: string;
  hasExistingLink: boolean;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
};

function LinkDialog({
  error,
  hasExistingLink,
  onCancel,
  onChange,
  onSubmit,
  value,
}: LinkDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();
  const errorId = useId();
  const titleId = useId();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:p-7"
        role="dialog"
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[#1d2088]"
          >
            <Link2 size={21} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 pt-0.5">
            <h2
              className="text-lg font-bold leading-7 text-slate-900"
              id={titleId}
            >
              {hasExistingLink ? "Chỉnh sửa liên kết" : "Thêm liên kết"}
            </h2>
            <p
              className="mt-1.5 text-sm leading-6 text-slate-600"
              id={descriptionId}
            >
              Nhập đường dẫn muốn gắn vào phần nội dung đang chọn.
            </p>
          </div>
        </div>

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label
            className="mb-2 block text-sm font-semibold text-slate-700"
            htmlFor={`${titleId}-url`}
          >
            Đường dẫn liên kết
          </label>
          <input
            aria-describedby={error ? errorId : descriptionId}
            aria-invalid={Boolean(error)}
            className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:ring-4 ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                : "border-slate-300 focus:border-[#1d2088] focus:ring-[#1d2088]/10"
            }`}
            id={`${titleId}-url`}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com"
            ref={inputRef}
            spellCheck={false}
            type="text"
            value={value}
          />
          {error ? (
            <p className="mt-2 text-sm text-red-600" id={errorId} role="alert">
              {error}
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Có thể nhập đầy đủ https:// hoặc chỉ nhập tên miền.
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300/30"
              onClick={onCancel}
              type="button"
            >
              Hủy
            </button>
            <button
              className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white transition hover:bg-[#171a70] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1d2088]/25"
              type="submit"
            >
              {hasExistingLink ? "Lưu thay đổi" : "Thêm liên kết"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body,
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

function isValidLinkUrl(value: string) {
  if (/^(\/[^/]|#\S)/.test(value)) return true;

  try {
    const url = new URL(value);
    if (url.protocol === "mailto:" || url.protocol === "tel:") {
      return Boolean(url.pathname);
    }
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

export function RichTextEditor({
  error = false,
  errorId,
  labelId,
  onChange,
  onImageUploadNotice,
  value,
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [linkDialog, setLinkDialog] = useState<{
    hasExistingLink: boolean;
    value: string;
  } | null>(null);
  const [linkError, setLinkError] = useState("");
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

  const closeLinkDialog = useCallback(() => {
    setLinkDialog(null);
    setLinkError("");
  }, []);

  function openLinkDialog() {
    if (!editor) return;

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    setLinkError("");
    setLinkDialog({
      hasExistingLink: Boolean(currentUrl),
      value: currentUrl ?? "https://",
    });
  }

  function applyLink() {
    if (!editor || !linkDialog) return;

    const url = normalizeUrl(linkDialog.value);
    if (!url) {
      setLinkError("Vui lòng nhập đường dẫn liên kết.");
      return;
    }
    if (!isValidLinkUrl(url)) {
      setLinkError("Đường dẫn liên kết không hợp lệ.");
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
    closeLinkDialog();
  }

  function chooseImage() {
    if (!editor || isUploadingImage) return;
    imageInputRef.current?.click();
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;

    if (!isSupportedMediaFile(file)) {
      onImageUploadNotice?.({
        message: "Chỉ hỗ trợ ảnh JPG, JPEG, PNG, WebP hoặc HEIC.",
        tone: "error",
      });
      return;
    }

    if (file.size > MAX_CONTENT_IMAGE_SIZE_BYTES) {
      onImageUploadNotice?.({
        message: "Ảnh chèn vào nội dung không được vượt quá 10MB.",
        tone: "error",
      });
      return;
    }

    if (file.size === 0) {
      onImageUploadNotice?.({
        message: "Tệp ảnh không có nội dung.",
        tone: "error",
      });
      return;
    }

    setIsUploadingImage(true);
    try {
      const fallbackAltText = file.name.replace(/\.[^.]+$/, "");
      const media = await uploadMedia(file, fallbackAltText);
      editor
        .chain()
        .focus()
        .setImage({
          alt: media.altText ?? fallbackAltText,
          src: media.publicUrl,
          title: media.originalName,
        })
        .run();
      onImageUploadNotice?.({
        message: "Tải và chèn ảnh vào nội dung thành công",
        tone: "success",
      });
    } catch (error: unknown) {
      let message = "Không thể tải ảnh lên. Vui lòng thử lại.";
      if (error instanceof ApiError) {
        if (error.status === 403) {
          message = "Bạn không có quyền tải ảnh lên.";
        } else if (error.message) {
          message = error.message;
        }
      }
      onImageUploadNotice?.({ message, tone: "error" });
    } finally {
      setIsUploadingImage(false);
    }
  }

  return (
    <>
      {linkDialog ? (
        <LinkDialog
          error={linkError}
          hasExistingLink={linkDialog.hasExistingLink}
          onCancel={closeLinkDialog}
          onChange={(value) => {
            setLinkDialog((current) =>
              current ? { ...current, value } : current,
            );
            if (linkError) setLinkError("");
          }}
          onSubmit={applyLink}
          value={linkDialog.value}
        />
      ) : null}
      <div
        className={`${styles.editor} ${error ? styles.editorError : ""}`}
      >
      <input
        accept={MEDIA_FILE_ACCEPT}
        className="sr-only"
        onChange={(event) => void handleImageChange(event)}
        ref={imageInputRef}
        tabIndex={-1}
        type="file"
      />
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
            onClick={openLinkDialog}
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
            disabled={!editor || isUploadingImage}
            icon={isUploadingImage ? LoaderCircle : ImageIcon}
            label={
              isUploadingImage
                ? "Đang tải ảnh lên"
                : "Chèn ảnh từ thiết bị"
            }
            loading={isUploadingImage}
            onClick={chooseImage}
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
    </>
  );
}
