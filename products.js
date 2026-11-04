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
   category = denim | t-shirts | hoodies | jackets | sets-half
   ===================================================================== */
(function () {
  var CATEGORIES = [
    { slug: "denim", name: "Denim", page: "denim" },
    { slug: "t-shirts", name: "T-Shirts", page: "t-shirts" },
    { slug: "hoodies", name: "Hoodies", page: "hoodies" },
    { slug: "jackets", name: "Jackets", page: "jackets" },
    { slug: "sets-half", name: "Category 5", page: "category-5" }
  ];

  var PRODUCTS = [
  // ---- Denim ----
  { slug: "asymmetric-flap-cargo-jeans", name: "Asymmetric Flap Cargo Jeans", category: "denim", price: 5299, sale: true, folder: "pdp-asymmetric-flap-cargo-jeans", hov: true,
    details: ["Charcoal black washed denim", "Wide-leg relaxed fit", "Layered flap panel across the waist", "Cargo pockets with straps and D-rings"],
    description: "Wide-leg jeans in a charcoal black wash with a layered flap panel across the front and tiered cargo pockets on the sides. Metal D-rings and utility straps add detail to a relaxed, roomy leg." },
  { slug: "swirl-panel-wide-jeans", name: "Swirl Panel Wide Jeans", category: "denim", price: 5499, sale: true, folder: "pdp-swirl-panel-wide-jeans", hov: true,
    details: ["Washed black denim", "Extra-wide relaxed fit", "Curved contrast-wash panels", "Classic five-pocket styling"],
    description: "Extra-wide jeans in washed black denim, with curved panels in a lighter wash sweeping down both legs. A bold shape that keeps the rest of the outfit simple." },
  { slug: "distressed-khaki-wide-jeans", name: "Distressed Khaki Wide Jeans", category: "denim", price: 4899, sale: false, folder: "pdp-distressed-khaki-wide-jeans", hov: true,
    details: ["Washed khaki denim", "Wide-leg relaxed fit", "Hand-distressed rips and fraying", "Classic five-pocket styling"],
    description: "Wide-leg jeans in a sun-faded khaki wash, with rips and frayed patches worked across the front, back and sides. A lived-in look straight off the hanger." },
  { slug: "tribal-print-black-jeans", name: "Tribal Print Black Jeans", category: "denim", price: 4299, sale: false, folder: "pdp-tribal-print-black-jeans", hov: true,
    details: ["Washed black denim", "Wide-leg relaxed fit", "White tribal graphic on each leg", "Contrast stitching"],
    description: "Wide-leg black jeans with a large white tribal graphic running down each leg, front and back, and crisp contrast stitching along the seams." },
  { slug: "black-patch-cargo-jeans", name: "Black Patch Cargo Jeans", category: "denim", price: 5199, sale: false, folder: "pdp-black-patch-cargo-jeans", hov: true,
    details: ["Washed charcoal black denim", "Wide-leg relaxed fit", "Large flap cargo pockets", "Classic five-pocket styling"],
    description: "Wide-leg cargo jeans in a washed charcoal black with oversized flap pockets on the thighs. Easy, practical and made to be worn with everything." },
  { slug: "lightning-cargo-jeans", name: "Lightning Cargo Jeans", category: "denim", price: 5699, sale: false, folder: "pdp-lightning-cargo-jeans", hov: true,
    details: ["Black denim with electric blue lightning print", "Wide-leg relaxed fit", "Layered cargo pockets", "Overlapping waist panel"],
    description: "Wide-leg black cargo jeans with a glowing electric blue lightning print that runs across the front, back and sides. Layered cargo pockets and an overlapping waist panel finish the look." },
  { slug: "flame-wide-jeans", name: "Flame Wide Jeans", category: "denim", price: 4799, sale: true, folder: "pdp-flame-wide-jeans", hov: true,
    details: ["Black denim with red fade", "Wide-leg relaxed fit", "Embroidered red and gold flames", "Red contrast stitching"],
    description: "Wide-leg jeans in black denim that fades to red at the hem, with embroidered red and gold flames licking up both legs and red contrast stitching throughout." },
  { slug: "cherry-blossom-wide-jeans", name: "Cherry Blossom Wide Jeans", category: "denim", price: 4499, sale: false, folder: "pdp-cherry-blossom-wide-jeans", hov: true,
    details: ["Washed black denim", "Extra-wide relaxed fit", "Embroidered pink cherry blossoms", "Classic five-pocket styling"],
    description: "Extra-wide jeans in a soft washed black, with a branch of embroidered pink cherry blossoms climbing the leg. A gentle detail on a strong silhouette." },
  { slug: "sunflower-cargo-jeans", name: "Sunflower Cargo Jeans", category: "denim", price: 5699, sale: false, folder: "pdp-sunflower-cargo-jeans", hov: true,
    details: ["Dark indigo denim", "Wide-leg relaxed fit", "Embroidered sunflowers", "Flap cargo pockets"],
    description: "Wide-leg cargo jeans in dark indigo denim, with embroidered sunflowers and leaves on the pockets and hem. Bright and cheerful against the deep wash." },
  { slug: "spiral-panel-cargo-jeans", name: "Spiral Panel Cargo Jeans", category: "denim", price: 5099, sale: false, folder: "pdp-spiral-panel-cargo-jeans", hov: true,
    details: ["Washed charcoal denim", "Extra-wide relaxed fit", "Curved panelling on both legs", "Side cargo pocket"],
    description: "Extra-wide jeans in a washed charcoal with curved, spiralling panels down both legs and a flap cargo pocket on the side seam." },
  { slug: "frayed-star-cargo-jeans", name: "Frayed Star Cargo Jeans", category: "denim", price: 4999, sale: true, folder: "pdp-frayed-star-cargo-jeans", hov: true,
    details: ["Washed charcoal denim", "Extra-wide relaxed fit", "Frayed-edge star appliqués on both legs", "Side cargo pocket"],
    description: "Extra-wide jeans in a washed charcoal with large frayed-edge star appliqués on the legs, a patched waist yoke with brass studs, and a flap cargo pocket on the side seam." },
  { slug: "gilded-scroll-wide-jeans", name: "Gilded Scroll Wide Jeans", category: "denim", price: 5399, sale: false, folder: "pdp-gilded-scroll-wide-jeans", hov: true,
    details: ["Dark raw-look black denim", "Extra-wide relaxed fit", "Gold scrollwork embroidery down one leg", "Contrast gold topstitching"],
    description: "Extra-wide jeans in deep black denim with a flowing gold scrollwork embroidery running down one leg and contrast gold stitching on the pockets and seams." },

  // ---- T-Shirts ----
  { slug: "starboy-graphic-tee", name: "Starboy Graphic Tee", category: "t-shirts", price: 4299, sale: true, folder: "pdp-starboy-graphic-tee", hov: true, noSide: true,
    details: ["Soft cotton jersey in off-white", "Oversized relaxed fit", "Embroidered \"starboy\" script on the chest", "Large embroidered graphic on the back"],
    description: "An off-white oversized tee with a small embroidered \"starboy\" script and stars on the chest, and a bold hand-drawn boy graphic stitched across the back." },
  { slug: "crochet-mandala-tee", name: "Crochet Mandala Tee", category: "t-shirts", price: 4499, sale: false, folder: "pdp-crochet-mandala-tee", hov: true, noSide: true,
    details: ["Heavy black cotton jersey", "Oversized boxy fit", "Cream crochet patch on the chest", "Large crochet patch with text on the back"],
    description: "A black oversized tee with a cream crochet mandala patch on the chest and a larger one across the back, finished with a few lines of small printed text." },
  { slug: "butterfly-transformation-tee", name: "Butterfly Transformation Tee", category: "t-shirts", price: 4099, sale: false, folder: "pdp-butterfly-transformation-tee", hov: true, noSide: true,
    details: ["Heavy black cotton jersey", "Oversized boxy fit", "Small butterfly print and quote on the chest", "Large colourful butterfly graphic on the back"],
    description: "A black oversized tee with a small butterfly and a short quote on the chest, and a large, colourful \"Butterfly Transformation\" graphic across the back." },
  { slug: "parisian-script-tee", name: "Parisian Script Tee", category: "t-shirts", price: 4199, sale: false, folder: "pdp-parisian-script-tee", hov: true, noSide: true,
    details: ["Soft cotton jersey in white", "Oversized relaxed fit", "Two black starburst prints on the chest", "Cursive Paris address script on the back"],
    description: "A white oversized tee with two black starbursts on the chest and an elegant cursive Paris address printed across the back." },
  { slug: "ladybug-washed-tee", name: "Ladybug Washed Tee", category: "t-shirts", price: 999, sale: false, folder: "pdp-ladybug-washed-tee", hov: true, noSide: true,
    details: ["Washed charcoal cotton jersey", "Oversized boxy fit", "Embroidered red ladybugs on the front", "Plain back"],
    description: "A washed charcoal oversized tee with a scatter of embroidered red ladybugs across the front. The back is left plain." },
  { slug: "tribal-back-washed-tee", name: "Tribal Back Washed Tee", category: "t-shirts", price: 4399, sale: true, folder: "pdp-tribal-back-washed-tee", hov: true, noSide: true,
    details: ["Washed charcoal cotton jersey", "Oversized boxy fit", "Small Dolce Orso mark on the chest", "Large tribal graphic on the back"],
    description: "A washed charcoal oversized tee with a small Dolce Orso mark on the chest and a large tribal graphic spread across the back." },
  { slug: "crimson-wing-tee", name: "Crimson Wing Tee", category: "t-shirts", price: 4599, sale: false, folder: "pdp-red-crest-tee", hov: true, noSide: true,
    details: ["Soft white cotton jersey", "Oversized boxy fit", "Red embroidered Dolce Orso crest on the chest", "Large red tribal crest on the back"],
    description: "A white oversized tee with a small red Dolce Orso crest on the chest and a bold, sculpted red tribal crest spread across the back." },
  { slug: "sunflower-collage-tee", name: "Sunflower Collage Tee", category: "t-shirts", price: 4799, sale: false, folder: "pdp-sunflower-collage-tee", hov: true, noSide: true,
    details: ["Acid-washed black cotton jersey", "Oversized boxy fit", "Anime-style sunflower collage print on the chest", "Plain back"],
    description: "A black acid-washed oversized tee with an anime-style collage on the chest: green eyes, a sunflower, and a cicada, finished with a short line of Japanese script. The back is left plain." },
  { slug: "swan-embroidery-tee", name: "Swan Embroidery Tee", category: "t-shirts", price: 4099, sale: false, folder: "pdp-swan-embroidery-tee", hov: true, noSide: true,
    details: ["Soft cream cotton jersey", "Oversized boxy fit", "Small Dolce Orso wordmark on the chest", "Large embroidered swans and roses on the back"],
    description: "A cream oversized tee with a small Dolce Orso wordmark on the chest and a richly embroidered back: two swans among roses and scrollwork in chocolate, tan and gold." },
  { slug: "golden-crane-tee", name: "Golden Crane Tee", category: "t-shirts", price: 4299, sale: true, folder: "pdp-golden-crane-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Small gold Dolce Orso wordmark on the chest", "Embroidered cranes along a scrollwork panel on the back"],
    description: "A black oversized tee with a small gold Dolce Orso wordmark on the chest and a vertical panel of ornate scrollwork on the back, with two embroidered cranes in flight." },
  { slug: "gods-plan-tee", name: "God's Plan Tee", category: "t-shirts", price: 4199, sale: false, folder: "pdp-gods-plan-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Bold cyan \"GOD'S PLAN.\" print on the chest", "Large glowing neon portrait on the back"],
    description: "A black oversized tee with a bold cyan \"GOD'S PLAN.\" print and a small Dolce Orso mark on the chest, and a large glowing blue-and-green portrait spread across the back." },
  { slug: "red-graffiti-star-tee", name: "Red Graffiti Star Tee", category: "t-shirts", price: 4499, sale: false, folder: "pdp-red-graffiti-star-tee", hov: true, noSide: true,
    details: ["Soft black cotton jersey", "Oversized boxy fit", "Large red graffiti lettering, illustrated figure and star on the front", "Small red graffiti tag on the back"],
    description: "A black oversized tee with bold red graffiti lettering, a hand-drawn figure in a cap and a red star across the front, and a small matching graffiti tag on the back." },

  // ---- Hoodies ----
  { slug: "embossed-crest-zip-hoodie", name: "Embossed Crest Zip Hoodie", category: "hoodies", price: 4199, sale: true, folder: "pdp-embossed-crest-zip-hoodie", hov: true, noSide: true,
    details: ["Black leather-look finish", "Hooded zip-up with ribbed hem and cuffs", "Embossed Dolce Orso crest on the chest and back", "Silver cross studs and zip sleeve pockets"],
    description: "A black hooded zip-up in a leather-look finish, with an embossed Dolce Orso crest on the chest, a large crest across the back, embossed floral sleeves and silver cross studs." },
  { slug: "armoured-panel-denim-jacket", name: "Armoured Panel Denim Jacket", category: "hoodies", price: 4399, sale: false, folder: "pdp-armoured-panel-denim-jacket", hov: true, noSide: true,
    details: ["Washed charcoal denim", "Structured panels on the shoulders, sleeves and back", "Zip front with two zip chest pockets", "Ribbed hem and cuffs"],
    description: "A washed charcoal denim jacket with a high collar and sculpted, armour-style panels across the shoulders, sleeves and back, finished with a front zip, two zip chest pockets and a ribbed hem." },
  { slug: "tribal-layered-zip-hoodie", name: "Tribal Layered Zip Hoodie", category: "hoodies", price: 999, sale: false, folder: "pdp-tribal-layered-zip-hoodie", hov: true, noSide: true,
    details: ["Heavy black and grey fleece", "Oversized boxy fit", "Gothic tribal embroidery on the chest and sleeves", "Zip front, kangaroo pockets and ribbed hem"],
    description: "An oversized black and grey zip hoodie with a torn-edge layered panel over the body, gothic tribal embroidery across the chest and sleeves, silver star studs and a front zip." },
  { slug: "icy-grey-puffer-jacket", name: "Icy Grey Puffer Jacket", category: "hoodies", price: 899, sale: false, folder: "pdp-icy-grey-puffer-jacket", hov: true, noSide: true,
    details: ["Quilted icy grey puffer fabric", "Cropped, roomy fit with a lined hood", "Snap front with two flap pockets", "Ribbed grey hem and cuffs"],
    description: "A cropped icy grey puffer jacket with a soft quilted finish, a snap front, two flap pockets, a ribbed hem and a small Dolce Orso logo on the chest." },
  { slug: "silver-swirl-bomber-jacket", name: "Silver Swirl Bomber Jacket", category: "hoodies", price: 4299, sale: false, folder: "pdp-silver-swirl-bomber-jacket", hov: true, noSide: true,
    details: ["Black leather-look finish", "Sculpted silver swirl panels on the body and sleeves", "High collar with an asymmetric zip", "Elastic waistband with chain and buckle detail"],
    description: "A black leather-look bomber jacket with glossy silver swirl panels across the body and sleeves, a high collar, an asymmetric zip and a banded waist with a chain." },
  { slug: "hoodies-product-6", name: "Product 6", category: "hoodies", price: 4099, sale: true, folder: "pdp-boucle-terry-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-7", name: "Product 7", category: "hoodies", price: 4499, sale: false, folder: "pdp-selvedge-denim-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-8", name: "Product 8", category: "hoodies", price: 4199, sale: false, folder: "pdp-colour-block-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-9", name: "Product 9", category: "hoodies", price: 4599, sale: false, folder: "pdp-printed-swim-trunks",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-10", name: "Product 10", category: "hoodies", price: 4099, sale: true, folder: "pdp-pleated-tailored-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-11", name: "Product 11", category: "hoodies", price: 899, sale: false, folder: "pdp-easy-fit-jersey-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "hoodies-product-12", name: "Product 12", category: "hoodies", price: 4299, sale: false, folder: "pdp-racing-stripe-shorts",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Jackets ----
  { slug: "jackets-product-1", name: "Product 1", category: "jackets", price: 5999, sale: true, folder: "pdp-atelier-co-ord-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-2", name: "Product 2", category: "jackets", price: 6499, sale: false, folder: "pdp-cashmere-touch-track-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-3", name: "Product 3", category: "jackets", price: 6999, sale: false, folder: "pdp-ceremony-two-piece",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-4", name: "Product 4", category: "jackets", price: 5799, sale: false, folder: "pdp-printed-ensemble",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-5", name: "Product 5", category: "jackets", price: 6199, sale: false, folder: "pdp-linen-riviera-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-6", name: "Product 6", category: "jackets", price: 5599, sale: true, folder: "pdp-jersey-leisure-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-7", name: "Product 7", category: "jackets", price: 6299, sale: false, folder: "pdp-maison-track-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-8", name: "Product 8", category: "jackets", price: 5899, sale: false, folder: "pdp-colour-block-ensemble",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-9", name: "Product 9", category: "jackets", price: 6599, sale: false, folder: "pdp-ribbed-merino-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-10", name: "Product 10", category: "jackets", price: 6199, sale: true, folder: "pdp-utility-ensemble",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-11", name: "Product 11", category: "jackets", price: 5999, sale: false, folder: "pdp-polo-trouser-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jackets-product-12", name: "Product 12", category: "jackets", price: 5699, sale: false, folder: "pdp-essential-cotton-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Category 5 ----
  { slug: "category-5-product-1", name: "Product 1", category: "sets-half", price: 4999, sale: true, folder: "pdp-riviera-tee-short",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-2", name: "Product 2", category: "sets-half", price: 5299, sale: false, folder: "pdp-polo-bermuda-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-3", name: "Product 3", category: "sets-half", price: 4799, sale: false, folder: "pdp-debardeur-short-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-4", name: "Product 4", category: "sets-half", price: 5099, sale: false, folder: "pdp-artisan-print-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-5", name: "Product 5", category: "sets-half", price: 4899, sale: false, folder: "pdp-sport-luxe-mesh-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-6", name: "Product 6", category: "sets-half", price: 5199, sale: true, folder: "pdp-boucle-summer-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-7", name: "Product 7", category: "sets-half", price: 4999, sale: false, folder: "pdp-mariniere-casual-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-8", name: "Product 8", category: "sets-half", price: 5499, sale: false, folder: "pdp-printed-resort-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-9", name: "Product 9", category: "sets-half", price: 4899, sale: false, folder: "pdp-colour-block-duo",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-10", name: "Product 10", category: "sets-half", price: 5099, sale: true, folder: "pdp-plage-day-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-11", name: "Product 11", category: "sets-half", price: 4799, sale: false, folder: "pdp-petit-sportif-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "category-5-product-12", name: "Product 12", category: "sets-half", price: 5299, sale: false, folder: "pdp-weekend-leisure-set",
    details: ["Soft cotton fabric", "Relaxed everyday fit", "Made for daily wear", "Details coming soon"],
    description: "A piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
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
})();
