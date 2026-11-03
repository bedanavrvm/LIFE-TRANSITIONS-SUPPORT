GOLD FLORAL DECOR KIT

1. Copy this folder into your site's static files (for example static/decor/).
2. Link decor.css in the <head>:  <link rel="stylesheet" href="decor/decor.css">
3. Wrap a page in <main class="decor-page"> and add corners, a title and a divider (see demo.html).

Corners:     corners/rose-spray, lotus-corner, olive-branch, laurel-sprig, line-bracket
Dividers:    dividers/flourish, moon-phases, olive-line, leaf-vine, three-blooms, diamond-line
Spots:       spots/tree-of-life, lotus-pond, pressed-flower
Edges:       strips/vine-strip (repeat-x), margin-vine (repeat-y)
Backgrounds: backgrounds/botanical-scatter, diamond-lattice, watermark-flower, deckle-edge
Surfaces (CSS in decor.css): .decor-wash (+ --sage, --rose, --indigo), .decor-foil, .decor-arch, .decor-pressed, .decor-deckle
Motion:      decor-fall.js   DecorFall(el, { kind: 'blossoms' | 'motes' | 'dandelion' | 'butterflies', wind: 'calm' | 'breeze' | 'gusty' })
             decor-draw.js   DecorDraw(el, 'decor/corners/rose-spray.svg') draws the lines in as if by pen
             .decor-candle   CSS-only flickering glow, add <i class="decor-candle"></i> inside the page

Recolour: change --decor-gold in decor.css and replace #B48A2F inside the SVG files (find and replace).
All art is line work drawn at about 1px, so it works on any pale background.
Motion pauses off-screen and stays still for visitors who prefer reduced motion.
