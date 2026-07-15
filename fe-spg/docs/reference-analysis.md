# SPE reference analysis

## Header scope

Reference: `http://en.spe.cn/`

Observed on 2026-07-15 with the existing project screenshots and a live browser session.

### Verified

- The header is fixed and overlays the hero. There is no separate top bar.
- At the top of the page the header is transparent, the logo is white, and navigation, language and search controls are white.
- Desktop header height is `6.25vw`, measured as `90px` at 1440px and `85.375px` at 1366px. Horizontal padding is about `2.6vw`.
- At 1366px the logo is about `299 x 29.5px`; at 1440px it is about `315 x 31px`.
- Desktop navigation order is Company Profile, News, Products & Solutions, Technical Innovation, Contact us. The logo is the home link.
- Desktop navigation uses a DIN-like medium face with Microsoft YaHei/PingFang fallbacks. Measured menu text is about `15.65px` at 1366px, regular weight.
- Each desktop item owns an absolute submenu. Submenu content and link order were verified from the rendered DOM.
- A language control and search control appear at the right. The English reference exposes a single `中文` link.
- The search panel is a fixed, white, full-width header-height panel positioned above the viewport while closed. It contains the colored logo, search field, submit control and close control.
- After scrolling, the header uses a white surface, colored logo, dark navigation/actions, a subtle shadow and a `0.4s` transition. The observed scrolled height was about `74px`.
- At 1024px desktop navigation is hidden. The header measured about `74.7px`, the logo about `320 x 31.6px`, and language, search and hamburger controls remain visible.
- At 390px the header is `56px` high. The white logo measured about `213 x 21px`, with language, search and a 28px hamburger aligned to the right.
- The mobile navigation is a fixed drawer that starts off-canvas to the right. It is full viewport width on phone and approximately 60% wide at 1024px. Its background is approximately `#f9f9f9` and its transition is `0.4s`.
- The mobile navigation is structured as five parent rows with nested submenu rows.
- Current Affairs is currently present in the reference News submenu and should therefore be represented in navigation data.

### Partially verified or not verified

- Exact desktop hover-panel visual state and easing: the hidden submenu structure was verified, but browser pointer input repeatedly timed out. Use conservative opacity/translate transitions and keep the pointer bridge intact.
- Exact mobile open-state overlay, focus behavior and whether multiple accordions may remain open: browser input timed out before a stable open state could be captured. The rebuilt menu will use a closing overlay at tablet widths, one-open accordion behavior and an accessible focus trap as safe project requirements.
- Hide-on-scroll-direction behavior was inconsistent during remote input. The stable verified behavior is a visible white sticky header after the threshold; the rebuild should not hide it on downward scroll.
- Exact active-route decoration was not visible in the captured top states. The rebuild should use a subtle brand underline without inventing a stronger visual treatment.

### Navigation mapping

- Company Profile: Company Profile, Organization Chart, Corporate Culture, Company Qualifications.
- News: Current Affairs, Group News, Product Delivery Dynamics, Notices.
- Products & Solutions: Container Handling Systems, Dry Bulk Handling Systems, Breakbulk Handling Systems, Liquefied Oil Handling Systems, Grain Silo Loading and Unloading System, Smart Logistics Park, Repair of Shipbuilding Systems, Other Products and Services.
- Technical Innovation: R&D Layout, Technological Achievements, Major Project.
- Contact: Contact, Marketing Network.

## Homepage Hero scope

Reference: `http://en.spe.cn/`

Observed on 2026-07-15 from the live English homepage and the existing
`home-top-*` screenshots.

### Verified

- The Hero is one full-viewport video, not an image slider. The live DOM contains
  one video and no Swiper pagination, arrows, progress bar or scroll indicator.
- The reference video is muted, autoplaying, looping and inline, without native
  controls. Its measured duration is approximately `13.87s`.
- The supplied `/videos/spe-indexbanner1.mp4` is the matching `1280 x 720`
  company video. `/images/public/files/image/index_banner1.jpg` is the matching
  `1920 x 960` poster/fallback.
- Media fills the Hero with `object-fit: cover` and centered object positioning.
- At the measured `1280 x 720` live viewport, the Hero is exactly `720px` high.
  Existing desktop and tablet top screenshots also show a viewport-height Hero.
- The content contains two lines only: `To build a domestic first-class` and
  `A world-renowned manufacturer of high-end equipment`. There is no eyebrow,
  description or action button.
- Content is left aligned. At `1280px` it begins at approximately `85.6px`
  (`6.77vw`). The two text rows use a DIN-like medium family, approximately
  `36.9px / 48px`, weight `700`, in white.
- The content block is vertically centered while accounting for the overlaid
  Header height. At `1280 x 720`, the first row begins near `351.6px` and the
  second near `399.5px`.
- Two Hero overlays are present: a vertical brand-blue-to-transparent gradient
  over the top half and a left-to-right brand-blue-to-transparent gradient over
  roughly 60% of the Hero width. Both start around `rgba(42, 63, 126, 0.3)`.
- Mobile keeps the same video and text, uses a centered cover crop, wraps the
  heading naturally, and remains viewport height. No separate mobile Hero asset
  exists in the supplied project.

### Partially verified or not verified

- A stable initial-load sample showed the text in its final visible state with
  no persistent CSS animation. The exact original entrance timing/easing could
  not be isolated from remote page load, so the rebuild should use only a short,
  conservative GSAP line reveal and disclose the timing as partially verified.
- There is no slide autoplay delay or slide transition because the reference has
  a single video. There is no verified media zoom or crossfade to reproduce.
- The reference video can pause when the remote browser tab is backgrounded.
  The rebuilt video should pause while the document is hidden and resume when
  visible, while retaining the poster if playback is unavailable.
