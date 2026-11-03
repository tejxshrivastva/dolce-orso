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
        The card shows card.web.jpg (the front-model photo with extra white margin
        so the whole child fits the card; copy 1-model-front if unsure) and switches to hero on hover.
        No side views (e.g. t-shirts)? add  noSide: true  to the product and skip files 3 and 4.
     4. Set  folder  to that folder name.  That's it - every page updates.
   price = normal price in rupees.  sale: true = shows 20% off.
   category = denim | t-shirts | shorts | sets-full | sets-half
   ===================================================================== */
(function () {
  var CATEGORIES = [
    { slug: "denim", name: "Le Denim", page: "Denim Collection.dc.html" },
    { slug: "t-shirts", name: "Les Tees", page: "The Tee Shop.dc.html" },
    { slug: "shorts", name: "Les Shorts", page: "Shorts Studio.dc.html" },
    { slug: "sets-full", name: "Ensembles", page: "Full Set Range.dc.html" },
    { slug: "sets-half", name: "Demi-Sets", page: "Half Set Range.dc.html" }
  ];

  var PRODUCTS = [
  // ---- Le Denim ----
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
  { slug: "relaxed-atelier-denim", name: "Relaxed Atelier Denim", category: "denim", price: 4999, sale: true, folder: "pdp-relaxed-atelier-denim",
    details: ["Washed denim", "Relaxed everyday fit", "Utility pockets", "Comfortable waist"],
    description: "A denim piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "artisan-patchwork-denim", name: "Artisan Patchwork Denim", category: "denim", price: 5399, sale: false, folder: "pdp-artisan-patchwork-denim",
    details: ["Washed denim", "Relaxed everyday fit", "Utility pockets", "Comfortable waist"],
    description: "A denim piece from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Les Tees ----
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
  { slug: "pocket-crest-tee", name: "Pocket Crest Tee", category: "t-shirts", price: 4099, sale: false, folder: "pdp-pocket-crest-tee",
    details: ["Soft cotton jersey", "Relaxed everyday fit", "Ribbed crew neck", "Made for daily wear"],
    description: "A tee from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "stone-wash-tee", name: "Stone Wash Tee", category: "t-shirts", price: 4299, sale: true, folder: "pdp-stone-wash-tee",
    details: ["Soft cotton jersey", "Relaxed everyday fit", "Ribbed crew neck", "Made for daily wear"],
    description: "A tee from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "bold-mariniere-tee", name: "Bold Marinière Tee", category: "t-shirts", price: 4199, sale: false, folder: "pdp-bold-mariniere-tee",
    details: ["Soft cotton jersey", "Relaxed everyday fit", "Ribbed crew neck", "Made for daily wear"],
    description: "A tee from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "contrast-stitch-tee", name: "Contrast Stitch Tee", category: "t-shirts", price: 4499, sale: false, folder: "pdp-contrast-stitch-tee",
    details: ["Soft cotton jersey", "Relaxed everyday fit", "Ribbed crew neck", "Made for daily wear"],
    description: "A tee from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Les Shorts ----
  { slug: "utility-bermuda-shorts", name: "Utility Bermuda Shorts", category: "shorts", price: 4199, sale: true, folder: "pdp-utility-bermuda-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "riviera-board-shorts", name: "Riviera Board Shorts", category: "shorts", price: 4399, sale: false, folder: "pdp-riviera-board-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "tailored-chino-shorts", name: "Tailored Chino Shorts", category: "shorts", price: 999, sale: false, folder: "pdp-tailored-chino-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "sport-luxe-mesh-shorts", name: "Sport Luxe Mesh Shorts", category: "shorts", price: 899, sale: false, folder: "pdp-sport-luxe-mesh-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "linen-blend-bermuda", name: "Linen Blend Bermuda", category: "shorts", price: 4299, sale: false, folder: "pdp-linen-blend-bermuda",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "boucle-terry-shorts", name: "Bouclé Terry Shorts", category: "shorts", price: 4099, sale: true, folder: "pdp-boucle-terry-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "selvedge-denim-shorts", name: "Selvedge Denim Shorts", category: "shorts", price: 4499, sale: false, folder: "pdp-selvedge-denim-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "colour-block-shorts", name: "Colour Block Shorts", category: "shorts", price: 4199, sale: false, folder: "pdp-colour-block-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "printed-swim-trunks", name: "Printed Swim Trunks", category: "shorts", price: 4599, sale: false, folder: "pdp-printed-swim-trunks",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "pleated-tailored-shorts", name: "Pleated Tailored Shorts", category: "shorts", price: 4099, sale: true, folder: "pdp-pleated-tailored-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "easy-fit-jersey-shorts", name: "Easy-Fit Jersey Shorts", category: "shorts", price: 899, sale: false, folder: "pdp-easy-fit-jersey-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "racing-stripe-shorts", name: "Racing Stripe Shorts", category: "shorts", price: 4299, sale: false, folder: "pdp-racing-stripe-shorts",
    details: ["Lightweight fabric", "Easy relaxed fit", "Elastic drawstring waist", "Side pockets"],
    description: "A pair of shorts from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Ensembles ----
  { slug: "atelier-co-ord-set", name: "Atelier Co-ord Set", category: "sets-full", price: 5999, sale: true, folder: "pdp-atelier-co-ord-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "cashmere-touch-track-set", name: "Cashmere Touch Track Set", category: "sets-full", price: 6499, sale: false, folder: "pdp-cashmere-touch-track-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "ceremony-two-piece", name: "Ceremony Two-Piece", category: "sets-full", price: 6999, sale: false, folder: "pdp-ceremony-two-piece",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "printed-ensemble", name: "Printed Ensemble", category: "sets-full", price: 5799, sale: false, folder: "pdp-printed-ensemble",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "linen-riviera-set", name: "Linen Riviera Set", category: "sets-full", price: 6199, sale: false, folder: "pdp-linen-riviera-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "jersey-leisure-set", name: "Jersey Leisure Set", category: "sets-full", price: 5599, sale: true, folder: "pdp-jersey-leisure-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "maison-track-set", name: "Maison Track Set", category: "sets-full", price: 6299, sale: false, folder: "pdp-maison-track-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "colour-block-ensemble", name: "Colour Block Ensemble", category: "sets-full", price: 5899, sale: false, folder: "pdp-colour-block-ensemble",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "ribbed-merino-set", name: "Ribbed Merino Set", category: "sets-full", price: 6599, sale: false, folder: "pdp-ribbed-merino-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "utility-ensemble", name: "Utility Ensemble", category: "sets-full", price: 6199, sale: true, folder: "pdp-utility-ensemble",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "polo-trouser-set", name: "Polo & Trouser Set", category: "sets-full", price: 5999, sale: false, folder: "pdp-polo-trouser-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "essential-cotton-set", name: "Essential Cotton Set", category: "sets-full", price: 5699, sale: false, folder: "pdp-essential-cotton-set",
    details: ["Matching two-piece set", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A full set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },

  // ---- Demi-Sets ----
  { slug: "riviera-tee-short", name: "Riviera Tee & Short", category: "sets-half", price: 4999, sale: true, folder: "pdp-riviera-tee-short",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "polo-bermuda-set", name: "Polo Bermuda Set", category: "sets-half", price: 5299, sale: false, folder: "pdp-polo-bermuda-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "debardeur-short-set", name: "Débardeur & Short Set", category: "sets-half", price: 4799, sale: false, folder: "pdp-debardeur-short-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "artisan-print-set", name: "Artisan Print Set", category: "sets-half", price: 5099, sale: false, folder: "pdp-artisan-print-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "sport-luxe-mesh-set", name: "Sport Luxe Mesh Set", category: "sets-half", price: 4899, sale: false, folder: "pdp-sport-luxe-mesh-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "boucle-summer-set", name: "Bouclé Summer Set", category: "sets-half", price: 5199, sale: true, folder: "pdp-boucle-summer-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "mariniere-casual-set", name: "Marinière Casual Set", category: "sets-half", price: 4999, sale: false, folder: "pdp-mariniere-casual-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "printed-resort-set", name: "Printed Resort Set", category: "sets-half", price: 5499, sale: false, folder: "pdp-printed-resort-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "colour-block-duo", name: "Colour Block Duo", category: "sets-half", price: 4899, sale: false, folder: "pdp-colour-block-duo",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "plage-day-set", name: "Plage Day Set", category: "sets-half", price: 5099, sale: true, folder: "pdp-plage-day-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "petit-sportif-set", name: "Petit Sportif Set", category: "sets-half", price: 4799, sale: false, folder: "pdp-petit-sportif-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  { slug: "weekend-leisure-set", name: "Weekend Leisure Set", category: "sets-half", price: 5299, sale: false, folder: "pdp-weekend-leisure-set",
    details: ["Matching top and shorts", "Soft, comfortable fabric", "Relaxed fit", "Wear together or apart"],
    description: "A short set from the Dolce Orso Autumn/Winter collection. Full product details coming soon." },
  ];

  var IMG = ['hero', '1-model-front', '2-product-front', '3-model-side', '4-product-side', '5-model-back', '6-product-back', 'card', 'hover'];
  function img(p, n) { return 'assets/' + p.folder + '/' + IMG[n] + '.web.jpg?v=' + ((window.DOLCE_SETTINGS || {}).imageVersion || 1); }
  function inr(n) { return '\u20b9' + Number(n).toLocaleString('en-IN'); }
  function salePrice(p) { return Math.round(p.price * 0.8); }
  function href(p) { return 'Product Detail.dc.html?p=' + p.slug; }
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
    imgs: function (c, n) { return inCat(c).slice(0, n).map(function (p) { return [img(p, 7), img(p, 0)]; }); },
    cover: function (c) { var l = inCat(c); return l.length ? img(l[0], 0) : ''; },
    hrefForImg: function (path) {
      path = path || '';
      for (var i = 0; i < PRODUCTS.length; i++) if (path.indexOf('/' + PRODUCTS[i].folder + '/') > -1) return href(PRODUCTS[i]);
      return 'Shop All.dc.html';
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
