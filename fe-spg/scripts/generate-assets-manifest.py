from __future__ import annotations

import json
import math
import re
from pathlib import Path
from xml.etree import ElementTree

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUTPUT = ROOT / "src" / "data" / "assets-manifest.ts"


def svg_dimensions(path: Path) -> tuple[int | None, int | None]:
    root = ElementTree.parse(path).getroot()

    def number(value: str | None) -> int | None:
        if not value:
            return None
        match = re.match(r"([\d.]+)", value)
        return round(float(match.group(1))) if match else None

    width = number(root.attrib.get("width"))
    height = number(root.attrib.get("height"))
    if width and height:
        return width, height

    view_box = root.attrib.get("viewBox", "").split()
    if len(view_box) == 4:
        return round(float(view_box[2])), round(float(view_box[3]))
    return None, None


def dimensions(path: Path) -> tuple[int | None, int | None]:
    suffix = path.suffix.lower()
    if suffix == ".svg":
        return svg_dimensions(path)
    if suffix == ".mp4":
        # Confirmed against the loaded reference hero video on 2026-07-15.
        return 1280, 720
    try:
        with Image.open(path) as image:
            return image.size
    except Exception:
        return None, None


def section_for(relative_path: str) -> tuple[str, str, str]:
    name = Path(relative_path).name.lower()
    normalized = relative_path.lower()

    if name in {"next.svg", "vercel.svg", "globe.svg", "window.svg", "file.svg"}:
        return "scaffold-only", "high", "Default create-next-app asset; exclude from the rebuilt public site."
    if name == "spe-indexbanner1.mp4" or name == "index_banner1.jpg":
        return "home.hero", "high", "Hero video and fallback/poster candidate."
    if name.startswith("logo") or name == "bg_logo.png":
        return "global.header-or-brand", "high", "Brand mark; white and color variants are used by the reference header."
    if name in {"favicon.ico"}:
        return "global.metadata", "high", "Browser icon."
    if name.startswith("banner_about") or name.startswith("about_introduction"):
        return "about.company-profile", "high", "Named about-page banner/content asset."
    if name.startswith("banner_contact") or name.startswith("contact_img"):
        return "contact", "high", "Named contact-page asset."
    if name.startswith("banner_news") or name.startswith("indexnew"):
        return "news", "high", "Named news banner or home-news media."
    if name.startswith("banner_technology"):
        return "technology.shared-banner", "high", "Named technology-page banner."
    if name.startswith("technology_layout"):
        return "technology.r-and-d-layout", "high", "Named R&D layout content asset."
    if name.startswith("technology_achievements"):
        return "technology.achievements", "high", "Named achievements content asset."
    if name.startswith("technology_major_project"):
        return "technology.major-project", "high", "Named major-project content/background asset."
    if name.startswith("article_solution_banner"):
        return "products.shared-banner", "high", "Products & Solutions inner-page banner."
    if name.startswith("index_") or name.startswith("index-img"):
        return "home", "high", "Named home-section media/background asset."
    if "20240129" in normalized:
        return "about.company-profile", "high", "Confirmed in the live Company Profile page asset list."
    if "20240124" in normalized or "20240125" in normalized or "20240221" in normalized or "20240222" in normalized:
        return "about.company-qualifications", "medium", "Contact sheet shows certificates, permits, and qualification documents."
    if "20240531" in normalized:
        if name in {"deb3408ee543ed1217dfb22f8a768b68.jpg", "84dc6533d0aab16149c7e5089d1a95fa.jpg"}:
            return "global.footer-or-contact-qr", "high", "Used by the reference footer for WeChat links."
        return "products-and-solutions.gallery", "medium", "Predominantly original + _lp product/project image pairs; exact product subtype requires page-level mapping."
    if "20240327" in normalized:
        return "technology-or-news", "low", "Mixed technology, awards, meetings, and project media; requires page-level mapping."
    if any(date in normalized for date in ("20240603", "20240606", "20240731")):
        return "news-or-product-detail", "low", "Uploaded editorial media; exact article association requires backend/content mapping."
    if "20241018" in normalized:
        return "about.organization-chart", "medium", "Wide diagram-like asset and date grouping suggest organization content."
    if "uploads/allimg" in normalized:
        return "uploaded-content.review-needed", "low", "Hash-only filename; keep unmoved until page/backend ownership is confirmed."
    return "unassigned.review-needed", "low", "No reliable section signal from path or filename."


def build_entry(path: Path) -> dict[str, object]:
    relative = path.relative_to(PUBLIC).as_posix()
    width, height = dimensions(path)
    if width and height:
        divisor = math.gcd(width, height)
        ratio = f"{width // divisor}:{height // divisor}"
        ratio_value = round(width / height, 4)
    else:
        ratio = None
        ratio_value = None
    section, confidence, notes = section_for(relative)
    return {
        "path": f"/{relative}",
        "fileName": path.name,
        "format": path.suffix.lower().lstrip("."),
        "width": width,
        "height": height,
        "aspectRatio": ratio,
        "aspectRatioValue": ratio_value,
        "sizeBytes": path.stat().st_size,
        "suggestedSection": section,
        "confidence": confidence,
        "notes": notes,
    }


assets = [build_entry(path) for path in sorted(PUBLIC.rglob("*")) if path.is_file()]
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
payload = json.dumps(assets, ensure_ascii=False, indent=2)
OUTPUT.write_text(
    "// Generated from public/ by scripts/generate-assets-manifest.py.\n"
    "// Re-run after assets are added, removed, or replaced.\n\n"
    "export type AssetManifestEntry = {\n"
    "  path: string;\n"
    "  fileName: string;\n"
    "  format: string;\n"
    "  width: number | null;\n"
    "  height: number | null;\n"
    "  aspectRatio: string | null;\n"
    "  aspectRatioValue: number | null;\n"
    "  sizeBytes: number;\n"
    "  suggestedSection: string;\n"
    "  confidence: \"high\" | \"medium\" | \"low\";\n"
    "  notes: string;\n"
    "};\n\n"
    f"export const assetsManifest = {payload} as const satisfies readonly AssetManifestEntry[];\n",
    encoding="utf-8",
)

print(f"Wrote {len(assets)} entries to {OUTPUT}")
