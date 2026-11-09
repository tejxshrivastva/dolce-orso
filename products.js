/* =====================================================================
   DOLCE ORSO — PRODUCT LIST  (edit this file to add / change products)
   ---------------------------------------------------------------------
   To add a product:
     1. Copy one line below, paste it in the right category section.
     2. Change slug (unique, lowercase-with-dashes), name, price, details.
     3. Put 7 images in  assets/<folder>/  named exactly:
          hero.web.jpg (the photo with a background),
          1-model-front.web.jpg, 2-product-front.web.jpg,
          3-model-side.web.jpg, 4-product-side.web.jpg,
          5-model-back.web.jpg, 6-product-back.web.jpg
        The card shows card.web.jpg and switches to hover.web.jpg on hover. Do NOT make these by hand:
        after adding hero.web.jpg and 1-model-front.web.jpg run  python3 make-card-images.py <folder-name>
        (it keeps the whole child inside the card with room above the head and below the shoes), then add  hov: true.
        No side views (e.g. t-shirts)? add  noSide: true  to the product and skip files 3 and 4.
     4. Set  folder  to that folder name.  That's it - every page updates.
   price = normal price in rupees.  sale: true = shows 20% off.
   category = denim | t-shirts | jackets | hoodies
   ===================================================================== */
(function () {
  var CATEGORIES = [
    { slug: "denim", name: "Denim", page: "denim" },
    { slug: "t-shirts", name: "T-Shirts", page: "t-shirts" },
    { slug: "jackets", name: "Jackets", page: "jackets" },
    { slug: "hoodies", name: "Hoodies", page: "hoodies" }
  ];

  var PRODUCTS = [
  // ---- Denim ----
  { slug: "asymmetric-flap-cargo-jeans", name: "Asymmetric Flap Cargo Jeans", category: "denim", price: 3199, sale: true, folder: "pdp-asymmetric-flap-cargo-jeans", hov: true,
    details: ["Charcoal black washed denim", "Wide-leg relaxed fit", "Layered flap panel across the waist", "Cargo pockets with straps and D-rings"],
    description: "Wide-leg jeans in a charcoal black wash with a layered flap panel across the front and tiered cargo pockets on the sides. Metal D-rings and utility straps add detail to a relaxed, roomy leg." },
  { slug: "swirl-panel-wide-jeans", name: "Swirl Panel Wide Jeans", category: "denim", price: 2999, sale: true, folder: "pdp-swirl-panel-wide-jeans", hov: true,
    details: ["Washed black denim", "Extra-wide relaxed fit", "Curved contrast-wash panels", "Classic five-pocket styling"],
    description: "Extra-wide jeans in washed black denim, with curved panels in a lighter wash sweeping down both legs. A bold shape that keeps the rest of the outfit simple." },
  { slug: "distressed-khaki-wide-jeans", name: "Distressed Khaki Wide Jeans", category: "denim", price: 3399, sale: false, folder: "pdp-distressed-khaki-wide-jeans", hov: true,
    details: ["Washed khaki denim", "Wide-leg relaxed fit", "Hand-distressed rips and fraying", "Classic five-pocket styling"],
    description: "Wide-leg jeans in a sun-faded khaki wash, with rips and frayed patches worked across the front, back and sides. A lived-in look straight off the hanger." },
  { slug: "tribal-print-black-jeans", name: "Tribal Print Black Jeans", category: "denim", price: 2899, sale: false, folder: "pdp-tribal-print-black-jeans", hov: true,
    details: ["Washed black denim", "Wide-leg relaxed fit", "White tribal graphic on each leg", "Contrast stitching"],
    description: "Wide-leg black jeans with a large white tribal graphic running down each leg, front and back, and crisp contrast stitching along the seams." },
  { slug: "black-patch-cargo-jeans", name: "Black Patch Cargo Jeans", category: "denim", price: 3299, sale: false, folder: "pdp-black-patch-cargo-jeans", hov: true,
    details: ["Washed charcoal black denim", "Wide-leg relaxed fit", "Large flap cargo pockets", "Classic five-pocket styling"],
    description: "Wide-leg cargo jeans in a washed charcoal black with oversized flap pockets on the thighs. Easy, practical and made to be worn with everything." },
  { slug: "lightning-cargo-jeans", name: "Lightning Cargo Jeans", category: "denim", price: 3099, sale: false, folder: "pdp-lightning-cargo-jeans", hov: true,
    details: ["Black denim with electric blue lightning print", "Wide-leg relaxed fit", "Layered cargo pockets", "Overlapping waist panel"],
    description: "Wide-leg black cargo jeans with a glowing electric blue lightning print that runs across the front, back and sides. Layered cargo pockets and an overlapping waist panel finish the look." },
  { slug: "flame-wide-jeans", name: "Flame Wide Jeans", category: "denim", price: 3499, sale: true, folder: "pdp-flame-wide-jeans", hov: true,
    details: ["Black denim with red fade", "Wide-leg relaxed fit", "Embroidered red and gold flames", "Red contrast stitching"],
    description: "Wide-leg jeans in black denim that fades to red at the hem, with embroidered red and gold flames licking up both legs and red contrast stitching throughout." },
  { slug: "cherry-blossom-wide-jeans", name: "Cherry Blossom Wide Jeans", category: "denim", price: 2999, sale: false, folder: "pdp-cherry-blossom-wide-jeans", hov: true,
    details: ["Washed black denim", "Extra-wide relaxed fit", "Embroidered pink cherry blossoms", "Classic five-pocket styling"],
    description: "Extra-wide jeans in a soft washed black, with a branch of embroidered pink cherry blossoms climbing the leg. A gentle detail on a strong silhouette." },
  { slug: "sunflower-cargo-jeans", name: "Sunflower Cargo Jeans", category: "denim", price: 3199, sale: false, folder: "pdp-sunflower-cargo-jeans", hov: true,
    details: ["Dark indigo denim", "Wide-leg relaxed fit", "Embroidered sunflowers", "Flap cargo pockets"],
    description: "Wide-leg cargo jeans in dark indigo denim, with embroidered sunflowers and leaves on the pockets and hem. Bright and cheerful against the deep wash." },
  { slug: "spiral-panel-cargo-jeans", name: "Spiral Panel Cargo Jeans", category: "denim", price: 2799, sale: false, folder: "pdp-spiral-panel-cargo-jeans", hov: true,
    details: ["Washed charcoal denim", "Extra-wide relaxed fit", "Curved panelling on both legs", "Side cargo pocket"],
    description: "Extra-wide jeans in a washed charcoal with curved, spiralling panels down both legs and a flap cargo pocket on the side seam." },
  { slug: "frayed-star-cargo-jeans", name: "Frayed Star Cargo Jeans", category: "denim", price: 3399, sale: true, folder: "pdp-frayed-star-cargo-jeans", hov: true,
    details: ["Washed charcoal denim", "Extra-wide relaxed fit", "Frayed-edge star appliqués on both legs", "Side cargo pocket"],
    description: "Extra-wide jeans in a washed charcoal with large frayed-edge star appliqués on the legs, a patched waist yoke with brass studs, and a flap cargo pocket on the side seam." },
  { slug: "gilded-scroll-wide-jeans", name: "Gilded Scroll Wide Jeans", category: "denim", price: 3099, sale: false, folder: "pdp-gilded-scroll-wide-jeans", hov: true,
    details: ["Dark raw-look black denim", "Extra-wide relaxed fit", "Gold scrollwork embroidery down one leg", "Contrast gold topstitching"],
    description: "Extra-wide jeans in deep black denim with a flowing gold scrollwork embroidery running down one leg and contrast gold stitching on the pockets and seams." },

  // ---- T-Shirts ----
  { slug: "starboy-graphic-tee", name: "Starboy Graphic Tee", category: "t-shirts", price: 2999, sale: true, folder: "pdp-starboy-graphic-tee", hov: true, noSide: true,
    details: ["Soft cotton jersey in off-white", "Oversized relaxed fit", "Embroidered \"starboy\" script on the chest", "Large embroidered graphic on the back"],
    description: "An off-white oversized tee with a small embroidered \"starboy\" script and stars on the chest, and a bold hand-drawn boy graphic stitched across the back." },
  { slug: "crochet-mandala-tee", name: "Crochet Mandala Tee", category: "t-shirts", price: 2799, sale: false, folder: "pdp-crochet-mandala-tee", hov: true, noSide: true,
    details: ["Heavy black cotton jersey", "Oversized boxy fit", "Cream crochet patch on the chest", "Large crochet patch with text on the back"],
    description: "A black oversized tee with a cream crochet mandala patch on the chest and a larger one across the back, finished with a few lines of small printed text." },
  { slug: "butterfly-transformation-tee", name: "Butterfly Transformation Tee", category: "t-shirts", price: 3199, sale: false, folder: "pdp-butterfly-transformation-tee", hov: true, noSide: true,
    details: ["Heavy black cotton jersey", "Oversized boxy fit", "Small butterfly print and quote on the chest", "Large colourful butterfly graphic on the back"],
    description: "A black oversized tee with a small butterfly and a short quote on the chest, and a large, colourful \"Butterfly Transformation\" graphic across the back." },
  { slug: "parisian-script-tee", name: "Parisian Script Tee", category: "t-shirts", price: 2899, sale: false, folder: "pdp-parisian-script-tee", hov: true, noSide: true,
    details: ["Soft cotton jersey in white", "Oversized relaxed fit", "Two black starburst prints on the chest", "Cursive Paris address script on the back"],
    description: "A white oversized tee with two black starbursts on the chest and an elegant cursive Paris address printed across the back." },
  { slug: "ladybug-washed-tee", name: "Ladybug Washed Tee", category: "t-shirts", price: 3099, sale: false, folder: "pdp-ladybug-washed-tee", hov: true, noSide: true,
    details: ["Washed charcoal cotton jersey", "Oversized boxy fit", "Embroidered red ladybugs on the front", "Plain back"],
    description: "A washed charcoal oversized tee with a scatter of embroidered red ladybugs across the front. The back is left plain." },
  { slug: "tribal-back-washed-tee", name: "Tribal Back Washed Tee", category: "t-shirts", price: 3299, sale: true, folder: "pdp-tribal-back-washed-tee", hov: true, noSide: true,
    details: ["Washed charcoal cotton jersey", "Oversized boxy fit", "Small Dolce Orso mark on the chest", "Large tribal graphic on the back"],
    description: "A washed charcoal oversized tee with a small Dolce Orso mark on the chest and a large tribal graphic spread across the back." },
  { slug: "crimson-wing-tee", name: "Crimson Wing Tee", category: "t-shirts", price: 2999, sale: false, folder: "pdp-red-crest-tee", hov: true, noSide: true,
    details: ["Soft white cotton jersey", "Oversized boxy fit", "Red embroidered Dolce Orso crest on the chest", "Large red tribal crest on the back"],
    description: "A white oversized tee with a small red Dolce Orso crest on the chest and a bold, sculpted red tribal crest spread across the back." },
  { slug: "sunflower-collage-tee", name: "Sunflower Collage Tee", category: "t-shirts", price: 2799, sale: false, folder: "pdp-sunflower-collage-tee", hov: true, noSide: true,
    details: ["Acid-washed black cotton jersey", "Oversized boxy fit", "Anime-style sunflower collage print on the chest", "Plain back"],
    description: "A black acid-washed oversized tee with an anime-style collage on the chest: green eyes, a sunflower, and a cicada, finished with a short line of Japanese script. The back is left plain." },
  { slug: "swan-embroidery-tee", name: "Swan Embroidery Tee", category: "t-shirts", price: 3199, sale: false, folder: "pdp-swan-embroidery-tee", hov: true, noSide: true,
    details: ["Soft cream cotton jersey", "Oversized boxy fit", "Small Dolce Orso wordmark on the chest", "Large embroidered swans and roses on the back"],
    description: "A cream oversized tee with a small Dolce Orso wordmark on the chest and a richly embroidered back: two swans among roses and scrollwork in chocolate, tan and gold." },
  { slug: "golden-crane-tee", name: "Golden Crane Tee", category: "t-shirts", price: 2899, sale: true, folder: "pdp-golden-crane-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Small gold Dolce Orso wordmark on the chest", "Embroidered cranes along a scrollwork panel on the back"],
    description: "A black oversized tee with a small gold Dolce Orso wordmark on the chest and a vertical panel of ornate scrollwork on the back, with two embroidered cranes in flight." },
  { slug: "gods-plan-tee", name: "God's Plan Tee", category: "t-shirts", price: 3099, sale: false, folder: "pdp-gods-plan-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Bold cyan \"GOD'S PLAN.\" print on the chest", "Large glowing neon portrait on the back"],
    description: "A black oversized tee with a bold cyan \"GOD'S PLAN.\" print and a small Dolce Orso mark on the chest, and a large glowing blue-and-green portrait spread across the back." },
  { slug: "red-graffiti-star-tee", name: "Red Graffiti Star Tee", category: "t-shirts", price: 3299, sale: false, folder: "pdp-red-graffiti-star-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Large red graffiti lettering, illustrated figure and star on the front", "Small red graffiti tag on the back"],
    description: "A black oversized tee with bold red graffiti lettering, a hand-drawn figure in a cap and a red star across the front, and a small matching graffiti tag on the back." },

  // ---- Jackets ----
  { slug: "embossed-crest-zip-hoodie", name: "Embossed Crest Zip Hoodie", category: "jackets", price: 6999, sale: true, folder: "pdp-embossed-crest-zip-hoodie", hov: true, noSide: true,
    details: ["Black leather-look finish", "Hooded zip-up with ribbed hem and cuffs", "Embossed Dolce Orso crest on the chest and back", "Silver cross studs and zip sleeve pockets"],
    description: "A black hooded zip-up in a leather-look finish, with an embossed Dolce Orso crest on the chest, a large crest across the back, embossed floral sleeves and silver cross studs." },
  { slug: "armoured-panel-denim-jacket", name: "Armoured Panel Denim Jacket", category: "jackets", price: 7499, sale: false, folder: "pdp-armoured-panel-denim-jacket", hov: true, noSide: true,
    details: ["Washed charcoal denim", "Structured panels on the shoulders, sleeves and back", "Zip front with two zip chest pockets", "Ribbed hem and cuffs"],
    description: "A washed charcoal denim jacket with a high collar and sculpted, armour-style panels across the shoulders, sleeves and back, finished with a front zip, two zip chest pockets and a ribbed hem." },
  { slug: "tribal-layered-zip-hoodie", name: "Tribal Layered Zip Hoodie", category: "jackets", price: 6499, sale: false, folder: "pdp-tribal-layered-zip-hoodie", hov: true, noSide: true,
    details: ["Heavy black and grey fleece", "Oversized boxy fit", "Gothic tribal embroidery on the chest and sleeves", "Zip front, kangaroo pockets and ribbed hem"],
    description: "An oversized black and grey zip hoodie with a torn-edge layered panel over the body, gothic tribal embroidery across the chest and sleeves, silver star studs and a front zip." },
  { slug: "icy-grey-puffer-jacket", name: "Icy Grey Puffer Jacket", category: "jackets", price: 7799, sale: false, folder: "pdp-icy-grey-puffer-jacket", hov: true, noSide: true,
    details: ["Quilted icy grey puffer fabric", "Cropped, roomy fit with a lined hood", "Snap front with two flap pockets", "Ribbed grey hem and cuffs"],
    description: "A cropped icy grey puffer jacket with a soft quilted finish, a snap front, two flap pockets, a ribbed hem and a small Dolce Orso logo on the chest." },
  { slug: "silver-swirl-bomber-jacket", name: "Silver Swirl Bomber Jacket", category: "jackets", price: 6799, sale: false, folder: "pdp-silver-swirl-bomber-jacket", hov: true, noSide: true,
    details: ["Black leather-look finish", "Sculpted silver swirl panels on the body and sleeves", "High collar with an asymmetric zip", "Elastic waistband with chain and buckle detail"],
    description: "A black leather-look bomber jacket with glossy silver swirl panels across the body and sleeves, a high collar, an asymmetric zip and a banded waist with a chain." },
  { slug: "fur-hood-leather-bomber", name: "Fur Hood Leather Bomber", category: "jackets", price: 7299, sale: true, folder: "pdp-fur-hood-leather-bomber", hov: true, noSide: true,
    details: ["Textured black leather-look finish", "Faux fur hood with leopard print lining", "Full zip front with zip sleeve pocket", "Ribbed hem and cuffs"],
    description: "A black bomber jacket in a textured leather-look finish, with a faux fur trimmed hood lined in leopard print, a full front zip, a zip pocket on the sleeve and a ribbed hem." },
  { slug: "crimson-croc-bomber-jacket", name: "Crimson Croc Bomber Jacket", category: "jackets", price: 6999, sale: false, folder: "pdp-crimson-croc-bomber-jacket", hov: true, noSide: true,
    details: ["Black crocodile-embossed leather-look finish", "Crimson star-shaped panels on the body and sleeves", "High collar with a full silver zip", "Zip cuffs and a banded hem"],
    description: "A black crocodile-embossed bomber jacket with sharp crimson star panels across the body and sleeves, a high collar, a full silver zip, zip cuffs and a banded hem." },
  { slug: "cross-back-faux-fur-jacket", name: "Cross Back Faux Fur Jacket", category: "jackets", price: 7499, sale: false, folder: "pdp-cross-back-faux-fur-jacket", hov: true, noSide: true,
    details: ["Long-pile brown faux fur", "Cropped, roomy fit with a fur hood", "Full zip front", "Black leather-look cross patch on the back"],
    description: "A cropped brown faux fur jacket with a deep, plush pile, a full-fur hood, a front zip and a bold black leather-look cross patch across the back." },
  { slug: "magenta-faux-fur-hooded-jacket", name: "Magenta Faux Fur Hooded Jacket", category: "jackets", price: 6599, sale: false, folder: "pdp-magenta-faux-fur-hooded-jacket", hov: true, noSide: true,
    details: ["Long-pile magenta and indigo faux fur", "Roomy cropped fit with a fur hood", "Full zip front", "Elasticated hem and cuffs"],
    description: "A roomy cropped jacket in vivid magenta faux fur streaked with indigo, with a plush hood, a full front zip and an elasticated hem and cuffs." },
  { slug: "studded-silver-fur-bomber-jacket", name: "Studded Silver Fur Bomber Jacket", category: "jackets", price: 7699, sale: true, folder: "pdp-studded-silver-fur-bomber-jacket", hov: true, noSide: true,
    details: ["Black leather-look finish", "Hood trimmed with silver-grey faux fur", "Silver studs on the shoulders and pockets", "Full zip front with elasticated hem and cuffs"],
    description: "A black leather-look bomber jacket with a silver-grey faux fur trimmed hood, silver studs across the shoulders and pockets, a full front zip and an elasticated hem and cuffs." },
  { slug: "capsule-red-leather-jacket", name: "Capsule Red Leather Jacket", category: "jackets", price: 6899, sale: false, folder: "pdp-capsule-red-leather-jacket", hov: true, noSide: true,
    details: ["Glossy red leather-look finish", "High collar with metal toggle fastenings", "Quilted shoulder panels and flap pockets", "Capsule emblem embroidered on the back"],
    description: "A glossy red leather-look jacket with a high collar, metal toggle fastenings, quilted shoulder panels, flap pockets, an elasticated hem and a large capsule emblem embroidered across the back." },
  { slug: "dragon-tiger-leather-jacket", name: "Dragon and Tiger Leather Jacket", category: "jackets", price: 7199, sale: false, folder: "pdp-dragon-tiger-leather-jacket", hov: true, noSide: true,
    details: ["Smooth black leather-look finish", "Embroidered dragon and tiger across the back", "Collar with a full silver zip front and zip pockets", "Buckle tabs at the waist"],
    description: "A smooth black leather-look jacket with a classic collar, a full silver zip, a small Dolce Orso mark on the chest, buckle tabs at the waist and a large embroidered dragon and tiger across the back." },

  // ---- Hoodies ----
  { slug: "crimson-smoke-patchwork-hoodie", name: "Crimson Smoke Patchwork Hoodie", category: "hoodies", price: 5299, sale: false, folder: "pdp-crimson-smoke-patchwork-hoodie", hov: true, noSide: true,
    details: ["Black fleece with crimson patchwork panels", "White smoke appliqué on the shoulder and sleeve", "Red emblem and grey flame detail on the front", "Drawcord hood and kangaroo pocket"],
    description: "A black fleece hoodie with crimson patchwork panels, a white smoke appliqué curling down the sleeve, a red emblem and grey flame detail on the front, a drawcord hood and a kangaroo pocket." },
  { slug: "purple-skeleton-patchwork-hoodie", name: "Purple Skeleton Patchwork Hoodie", category: "hoodies", price: 4899, sale: false, folder: "pdp-purple-skeleton-patchwork-hoodie", hov: true, noSide: true,
    details: ["Plum, violet and magenta patchwork panels", "Padded ribcage, bone and eye appliqué on the front", "Contrast white hood lining with drawcords", "Kangaroo pocket and a relaxed fit"],
    description: "A plum hoodie built from violet and magenta patchwork panels, with a padded ribcage, bone and eye appliqué on the front, a contrast white hood lining, drawcords and a kangaroo pocket." },
  { slug: "bubblegum-pink-slogan-hoodie", name: "Bubblegum Pink Slogan Hoodie", category: "hoodies", price: 5399, sale: true, folder: "pdp-bubblegum-pink-slogan-hoodie", hov: true, noSide: true,
    details: ["Soft bubblegum pink heavyweight fleece", "Bold white slogan lettering across the back", "Roomy hood and kangaroo pocket", "Ribbed cuffs and hem, relaxed oversized fit"],
    description: "A soft bubblegum pink heavyweight fleece hoodie with bold white slogan lettering across the back, a roomy hood, a kangaroo pocket, ribbed cuffs and hem and a relaxed oversized fit." },
  { slug: "ivory-blessed-hoodie", name: "Ivory Blessed Hoodie", category: "hoodies", price: 4899, sale: false, folder: "pdp-ivory-blessed-hoodie", hov: true, noSide: true,
    details: ["Soft ivory heavyweight fleece", "Spaced black BLESSED lettering across the back", "Roomy hood and kangaroo pocket", "Ribbed cuffs and hem, relaxed oversized fit"],
    description: "A soft ivory heavyweight fleece hoodie with spaced black BLESSED lettering across the back, a roomy hood, a kangaroo pocket, ribbed cuffs and hem and a relaxed oversized fit." },
  { slug: "thermal-handprint-hoodie", name: "Thermal Handprint Hoodie", category: "hoodies", price: 5199, sale: false, folder: "pdp-thermal-handprint-hoodie", hov: true, noSide: true,
    details: ["Soft black fleece with heat-map handprint graphics", "Red, yellow and blue prints across the front, back and sleeves", "Roomy hood and kangaroo pocket", "Ribbed cuffs and hem, relaxed oversized fit"],
    description: "A soft black fleece hoodie printed with bright heat-map handprints in red, yellow and blue across the front, back and sleeves, with a roomy hood, kangaroo pocket, ribbed cuffs and hem and a relaxed oversized fit." },
  { slug: "blue-flame-skull-hoodie", name: "Blue Flame Skull Hoodie", category: "hoodies", price: 5599, sale: false, folder: "pdp-blue-flame-skull-hoodie", hov: true, noSide: true,
    details: ["Charcoal washed fleece with electric blue flame details", "Dripping cream skull appliqués on the front, back and sleeves", "Blue hood lining with a Dolce Orso patch", "Relaxed fit with a kangaroo pocket"],
    description: "A charcoal washed fleece hoodie covered in dripping cream skull appliqués topped with electric blue flames, with a blue hood lining, a Dolce Orso patch inside the hood and a kangaroo pocket." },
  { slug: "persian-rug-black-hoodie", name: "Persian Rug Black Hoodie", category: "hoodies", price: 5499, sale: false, folder: "pdp-persian-rug-black-hoodie", hov: true, noSide: true,
    details: ["Soft black fleece with an elasticated hem and cuffs", "Woven Persian rug panel across the back", "Tiny Dolce Orso mark on the chest", "Oversized fit with a kangaroo pocket"],
    description: "A clean black fleece hoodie with a small Dolce Orso mark on the chest and a woven Persian rug panel across the back, finished with an elasticated hem and cuffs for an oversized, easy fit." },
  { slug: "sand-botanical-embroidered-hoodie", name: "Sand Botanical Embroidered Hoodie", category: "hoodies", price: 5199, sale: false, folder: "pdp-sand-botanical-embroidered-hoodie", hov: true, noSide: true,
    details: ["Soft sand heavyweight fleece", "Tonal botanical bouquet embroidered across the back", "Small Dolce Orso mark on the chest", "Roomy hood, kangaroo pocket and a relaxed oversized fit"],
    description: "A soft sand heavyweight fleece hoodie with a tonal botanical bouquet embroidered across the back, a small Dolce Orso mark on the chest, a roomy hood, a kangaroo pocket and a relaxed oversized fit." },
  { slug: "neon-pink-flame-hoodie", name: "Neon Pink Flame Hoodie", category: "hoodies", price: 5199, sale: true, folder: "pdp-neon-pink-flame-hoodie", hov: true, noSide: true,
    details: ["Heavyweight black fleece with a hot pink base", "Raised flame appliqué across the chest and back", "Kangaroo pocket and a roomy double-layer hood", "Relaxed, slightly oversized fit"],
    description: "A heavyweight black fleece hoodie that burns into hot pink at the hem, with raised flame appliqué across the chest and back, a kangaroo pocket, a roomy hood and a relaxed oversized fit." },
  { slug: "cosmic-planet-chenille-hoodie", name: "Cosmic Planet Chenille Hoodie", category: "hoodies", price: 4999, sale: true, folder: "pdp-cosmic-planet-chenille-hoodie", hov: true, noSide: true,
    details: ["Soft black fleece with a drawcord hood", "Chenille planets, moons and stars across the front", "Earth appliqué on the kangaroo pocket", "Dolce Orso lettering down the back"],
    description: "A soft black fleece hoodie scattered with chenille planets, moons and stars, with an Earth appliqué on the kangaroo pocket, a drawcord hood and Dolce Orso lettering running down the back." },
  { slug: "pink-ribcage-skeleton-hoodie", name: "Pink Ribcage Skeleton Hoodie", category: "hoodies", price: 5399, sale: false, folder: "pdp-pink-ribcage-skeleton-hoodie", hov: true, noSide: true,
    details: ["Black fleece with hot pink lightning patchwork", "Cream ribcage, bone and dripping skull appliqué on the front", "Hot pink hood lining with drawcords", "Stitched edges, kangaroo pocket and a relaxed fit"],
    description: "A black fleece hoodie with hot pink lightning patchwork, a cream ribcage, bone sleeves and two dripping skull appliqués on the front, a hot pink hood lining, drawcords and a kangaroo pocket." },
  { slug: "black-floral-jacquard-hoodie", name: "Black Floral Jacquard Hoodie", category: "hoodies", price: 5099, sale: false, folder: "pdp-black-floral-jacquard-hoodie", hov: true, noSide: true,
    details: ["Soft black knit with a tonal floral jacquard pattern", "Flowers wrap across the front, sleeves and back", "Roomy hood and kangaroo pocket", "Ribbed cuffs and hem, relaxed oversized fit"],
    description: "A soft black knit hoodie with a tonal grey floral jacquard pattern that wraps across the front, sleeves, hood and back, with a kangaroo pocket, ribbed cuffs and hem and a relaxed oversized fit." },
  ];

  var IMG = ['hero', '1-model-front', '2-product-front', '3-model-side', '4-product-side', '5-model-back', '6-product-back', 'card', 'hover'];
  function img(p, n) { return 'assets/' + p.folder + '/' + IMG[n] + '.web.jpg?v=' + ((window.DOLCE_SETTINGS || {}).imageVersion || 1); }
  function inr(n) { return '\u20b9' + Number(n).toLocaleString('en-IN'); }
  function salePrice(p) { return Math.round(p.price * 0.8); }
  function href(p) { return 'product?p=' + p.slug; }
  function bySlug(s) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === s) return PRODUCTS[i]; return null; }
  function inCat(c) { return c ? PRODUCTS.filter(function (p) { return p.category === c; }) : PRODUCTS.slice(); }
  function card(p) {
    return { slug: p.slug, name: p.name, img: img(p, 7), hoverImg: img(p, p.hov ? 8 : 0), href: href(p), priceText: inr(p.price),
      onSale: !!p.sale, notOnSale: !p.sale, salePriceText: p.sale ? inr(salePrice(p)) : '', salePercent: '-20%',
      sizes: 'S \u00b7 M \u00b7 L \u00b7 XL' };
  }

  window.DOLCE = {
    categories: CATEGORIES, products: PRODUCTS, bySlug: bySlug, inr: inr, href: href, salePrice: salePrice,
    cards: function (c) { return inCat(c).map(card); },
    names: function (c, n) { return inCat(c).slice(0, n).map(function (p) { return p.name; }); },
    prices: function (c, n) { return inCat(c).slice(0, n).map(function (p) { return p.price; }); },
    imgs: function (c, n) { return inCat(c).slice(0, n).map(function (p) { return [img(p, 7), img(p, p.hov ? 8 : 0)]; }); },
    menuCover: function (c) { return 'assets/thumbs/menu-' + c + '.webp'; },   // menu tiles use the landing-banner photos
    cover: function (c) { var l = inCat(c); return l.length ? img(l[0], 0) : ''; },
    hrefForImg: function (path) {
      path = path || '';
      for (var i = 0; i < PRODUCTS.length; i++) if (path.indexOf('/' + PRODUCTS[i].folder + '/') > -1) return href(PRODUCTS[i]);
      return 'shop';
    },
    card: card,
    slugForImg: function (path) {
      path = path || '';
      for (var i = 0; i < PRODUCTS.length; i++) if (path.indexOf('/' + PRODUCTS[i].folder + '/') > -1) return PRODUCTS[i].slug;
      return '';
    },
    gallery: function (p) { return (p.noSide ? [1, 2, 5, 6] : [1, 2, 3, 4, 5, 6]).map(function (n) { return img(p, n); }); },
    hero: function (p) { return img(p, 0); },
    related: function (p, n) {
      var l = inCat(p.category), i = l.indexOf(p), out = [];
      for (var k = 1; k < l.length && out.length < n; k++) out.push(l[(i + k) % l.length]);
      return out.map(function (q) { return { slug: q.slug, name: q.name, price: inr(q.sale ? salePrice(q) : q.price), href: href(q), img: img(q, 7), hoverImg: img(q, q.hov ? 8 : 0) }; });
    },
    current: function () {
      var s = ''; try { s = new URLSearchParams(location.search).get('p') || ''; } catch (e) {}
      return bySlug(s) || PRODUCTS[0];
    }
  };

  // product page with a missing or unknown ?p= goes to the not-found page instead of showing a random piece
  (function () {
    if (!/\/product(\.html)?$/.test(location.pathname)) return;
    var s = ''; try { s = new URLSearchParams(location.search).get('p') || ''; } catch (e) {}
    if (!bySlug(s)) location.replace('404.html');
  })();
})();
