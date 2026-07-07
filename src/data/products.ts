export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Women' | 'Men';
  subcategory: 'Casual' | 'Partywear' | 'Streetwear' | 'Loungewear';
  rating: number;
  reviewsCount: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  washCare: string;
  fit: string;
  material: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "w-01",
    name: "CYBER-LIME CUTOUT MIDI DRESS",
    description: "Make a bold entry in this ultra-modern, asymmetric cutout dress. Crafted from premium stretch-rib knit that clings in all the right places, this dress screams Y2K party energy with a cyber-lime colorway.",
    price: 3499,
    category: "Women",
    subcategory: "Partywear",
    rating: 4.8,
    reviewsCount: 124,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Cyber Lime", hex: "#00ff66" },
      { name: "Hot Pink", hex: "#ff0055" },
      { name: "Void Black", hex: "#09090b" }
    ],
    details: [
      "Asymmetrical cutout detailing at the waist",
      "Premium heavyweight stretch-rib knit fabric",
      "Mid-calf midi length with side slit",
      "High mock neck with zip closure at back"
    ],
    washCare: "Hand wash cold, dry flat. Do not wring.",
    fit: "Bodycon / Slim Fit",
    material: "85% Polyester, 15% Elastane",
    inStock: true
  },
  {
    id: "w-02",
    name: "DUBPLATE OVERSIZED HOODIE DRESS",
    description: "An oversized hoodie dress featuring raw contrast stitching and bold industrial typography printed on the back. The ultimate streetwear piece to stay comfy yet stand out.",
    price: 2899,
    category: "Women",
    subcategory: "Streetwear",
    rating: 4.6,
    reviewsCount: 89,
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Void Black", hex: "#09090b" },
      { name: "Graphite Gray", hex: "#4b5563" }
    ],
    details: [
      "Heavyweight 450GSM organic cotton fleece",
      "Dropped shoulders and extra long cuffs",
      "Industrial streetwear print on back and sleeves",
      "Double-lined hood with custom silver metal toggles"
    ],
    washCare: "Machine wash cold inside out. Line dry.",
    fit: "Ultra Oversized Fit",
    material: "100% Organic Cotton",
    inStock: true
  },
  {
    id: "w-03",
    name: "Y2K POP-GLAM SATIN SLIP DRESS",
    description: "A dreamy satin slip dress with a cowl neck and vibrant retro pop gradient prints. Designed to transition seamlessly from dynamic day styling to electric night events.",
    price: 3199,
    category: "Women",
    subcategory: "Casual",
    rating: 4.7,
    reviewsCount: 56,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Acid Sunset Gradient", hex: "#ff0055" },
      { name: "Liquid Silver", hex: "#cbd5e1" }
    ],
    details: [
      "Adjustable criss-cross spaghetti straps",
      "Graceful cowl neckline",
      "Flattering bias-cut drape style",
      "Side leg slit with lace trim detail"
    ],
    washCare: "Dry clean only. Iron on low heat.",
    fit: "Regular Bias Fit",
    material: "95% Silk Satin, 5% Spandex",
    inStock: true
  },
  {
    id: "w-04",
    name: "NEON MESH RETRO WAVES MAXI",
    description: "Double layered mesh dress with graphic Y2K digital wave printing. Stretchy, breathable, and features a subtle metallic shimmer that catches direct sunlight beautifully.",
    price: 3999,
    category: "Women",
    subcategory: "Loungewear",
    rating: 4.9,
    reviewsCount: 78,
    images: [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Psychedelic Wave", hex: "#bd00ff" },
      { name: "Cyber Wave Blue", hex: "#00f0ff" }
    ],
    details: [
      "Double layered sheer power-mesh fabric",
      "Fully lined bodice, sheer sleeves and hem",
      "Dynamic all-over psychedelic wave printing",
      "Comfortable elastic fit that hugs your body"
    ],
    washCare: "Machine wash cold in laundry bag. Air dry.",
    fit: "Second Skin Bodycon",
    material: "90% Nylon, 10% Elastane",
    inStock: true
  },
  {
    id: "m-01",
    name: "CYBER-INDUSTRIAL utility JUMPSUIT",
    description: "Designed for the ultimate streetwear utilitarian, this functional jumpsuit features heavy metal D-rings, modular cargo pockets, and a structured Y2K collar.",
    price: 4999,
    category: "Men",
    subcategory: "Streetwear",
    rating: 4.7,
    reviewsCount: 65,
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Void Black", hex: "#09090b" },
      { name: "Military Olive", hex: "#3f4238" }
    ],
    details: [
      "Brushed cotton twill with high tear strength",
      "Detachable cargo pockets with zip adjustments",
      "Brutalist black strap adjustments with steel D-rings",
      "Heavy duty front metal two-way zip"
    ],
    washCare: "Wash inside out with similar colors. Warm iron.",
    fit: "Relaxed Utility Fit",
    material: "100% Heavy Twill Cotton",
    inStock: true
  },
  {
    id: "m-02",
    name: "NEON HEAVY-METAL SHIRT DRESS",
    description: "A button-down longline shirt dress featuring custom metal hardware and cyber-neon contrast paneling. Can be styled open as a jacket or closed as a modular dress statement.",
    price: 3299,
    category: "Men",
    subcategory: "Casual",
    rating: 4.5,
    reviewsCount: 42,
    images: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cyber Lime", hex: "#00ff66" },
      { name: "Void Black", hex: "#09090b" }
    ],
    details: [
      "High-contrast fluorescent piping detail",
      "Cuban collar with snap-button adjustments",
      "Longline split hem design with metal rivets",
      "Dual chest pockets with utility rings"
    ],
    washCare: "Dry clean recommended. Cool wash if necessary.",
    fit: "Boxy / Longline Fit",
    material: "70% Cotton, 30% Rayon",
    inStock: true
  },
  {
    id: "m-03",
    name: "DOUBLE-BREASTED BRUTALIST SUIT COAT",
    description: "A structured, heavy double-breasted coat representing formal party wear with an industrial edge. Features raw edge stitching and chrome industrial button closures.",
    price: 5999,
    category: "Men",
    subcategory: "Partywear",
    rating: 4.9,
    reviewsCount: 94,
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: "Slate Charcoal", hex: "#1f2937" },
      { name: "Void Black", hex: "#09090b" }
    ],
    details: [
      "Structured padded shoulders",
      "Double-breasted front with chrome buttons",
      "Raw-edge design finish on cuffs and lapel",
      "Tonal interior lining with secure phone pocket"
    ],
    washCare: "Dry clean only. Cover buttons before cleaning.",
    fit: "Sharp / Tailored Fit",
    material: "80% Wool, 20% Polyester Blend",
    inStock: true
  },
  {
    id: "m-04",
    name: "TECH-FLEECE COZY LOUNGE SET",
    description: "Ultra-heavyweight French Terry sweatshirt dress style and matching bottom details. Merges the comfort of high-end loungewear with Y2K paneled tech aesthetics.",
    price: 3799,
    category: "Men",
    subcategory: "Loungewear",
    rating: 4.8,
    reviewsCount: 112,
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Off-White Cream", hex: "#f5f5f4" },
      { name: "Cyber Lime / Dark Panel", hex: "#00ff66" }
    ],
    details: [
      "500GSM ultra-heavyweight cotton loopback",
      "Panels with retro reflective piping",
      "Ribbed collar, waistband and thumbhole cuffs",
      "Invisible zipper pockets for clean layout"
    ],
    washCare: "Cold machine wash with similar colors. Tumble dry low.",
    fit: "Relaxed Boxy Fit",
    material: "100% French Terry Cotton",
    inStock: true
  }
];
