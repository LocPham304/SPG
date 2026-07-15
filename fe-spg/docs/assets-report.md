# Asset Inventory

## Summary

- Directories scanned: `public/images/`, `public/videos/`
- Total public files: 434
- Images: 433
- Videos: 1
- Fonts under `public/`: 0
- Named banner images: 6
- Total public asset size: 127,548,269 bytes

Generated framework and test output directories were excluded. Original assets
were not renamed, moved, converted, compressed or deleted.

## Homepage Hero

| Path | Type | Dimensions | Size | Confidence | Notes |
| ---- | ---- | ---------: | ---: | ---------- | ----- |
| `/videos/spe-indexbanner1.mp4` | Video | 1280 x 720 | 10,531,740 B | HIGH | Exact live Hero video match; approximately 13.87 seconds, muted autoplay loop. |
| `/images/public/files/image/index_banner1.jpg` | Image | 1920 x 960 | 892,981 B | HIGH | Exact reference poster and no-playback fallback. |

No dedicated mobile Hero video or poster is present. The same media must use a
responsive cover crop.

## Other named banner assets

| Path | Dimensions | Size | Intended section |
| ---- | ---------: | ---: | ---------------- |
| `/images/public/files/image/article_solution_banner.jpg` | 1920 x 476 | 51,591 B | Products inner page |
| `/images/public/files/image/banner_about.jpg` | 1920 x 720 | 583,317 B | About inner page |
| `/images/public/files/image/banner_contact.jpg` | 1920 x 720 | 306,680 B | Contact inner page |
| `/images/public/files/image/banner_news.jpg` | 1920 x 720 | 466,795 B | News inner page |
| `/images/public/files/image/banner_technology.jpg` | 1920 x 720 | 666,337 B | Technology inner page |

These inner-page banners are not Hero alternatives and are outside the current
implementation scope.

## Potential issues

| Path | Issue | Severity | Recommendation |
| ---- | ----- | -------- | -------------- |
| `/videos/spe-indexbanner1.mp4` | File is slightly above the 10 MB review threshold. | WARNING | Keep preload conservative and load only this one Hero video. Optimize in a separate approved asset task if required. |

The existing typed manifest already contains valid entries for both Hero assets,
so no manifest path or asset metadata was changed for this task.
