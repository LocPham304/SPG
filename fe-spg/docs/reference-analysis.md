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

