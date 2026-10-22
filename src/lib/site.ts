/**
 * Language-neutral site data mirrored from formedics.lt: offices, partner
 * manufacturers, product areas and photos. All wording lives in src/lib/content.
 * Images are served from the original WordPress uploads, as on the live site.
 */

export const W = "https://formedics.lt/wp-content/uploads";

export type OfficeCode = "LT" | "LV" | "EE";

export type Office = {
  code: OfficeCode;
  company?: string;
  address: string;
  phone: string;
  phoneHref: string;
  fax?: string;
  email: string;
  companyCode?: string;
  vat?: string;
  /** Google Maps query for the address */
  maps: string;
};

export const OFFICES: Office[] = [
  {
    code: "LT",
    company: "UAB „Formedics“",
    address: "Senosios Pilaitės kelias 1, LT-06229 Vilnius",
    phone: "+370 5 262 30 70",
    phoneHref: "tel:+37052623070",
    fax: "+370 5 213 75 63",
    email: "info@formedics.lt",
    companyCode: "124980311",
    vat: "LT100001278310",
    maps: "Senosios Pilaitės kelias 1, Vilnius, Lithuania",
  },
  {
    code: "LV",
    address: "Zemgaļu street 8, Rīga, LV-1006",
    phone: "+371 23 205 334",
    phoneHref: "tel:+37123205334",
    email: "eduards@formedics.lv",
    maps: "Zemgaļu iela 8, Rīga, Latvia",
  },
  {
    code: "EE",
    address: "Veskiposti 2, 10138 Tallinn, Estonia",
    phone: "+372 591 952 90",
    phoneHref: "tel:+37259195290",
    email: "rep@formedics.ee",
    maps: "Veskiposti 2, Tallinn, Estonia",
  },
];

/** Product categories used to filter partner manufacturers (English keys; labels come from the dictionaries). */
export const CATEGORIES = [
  "Endoscopic medicine",
  "Hand surgery",
  "Heart rhythm management",
  "Interventional cardiology",
  "Interventional radiology",
  "Neurosurgery",
  "Optics",
  "Orthopedics",
  "Otorhinolaryngology",
  "Surgery and intensive therapy",
  "Urology",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** The seven product areas shown on the homepage: category key + original icon. Names come from the dictionaries, in this order. */
export const PRODUCT_AREAS: { category: Category; icon: string }[] = [
  { category: "Interventional cardiology", icon: "2014/11/Intervencine-kardiologija_logo.png" },
  { category: "Interventional radiology", icon: "2014/11/Intervencine-radiologija_logo.png" },
  { category: "Endoscopic medicine", icon: "2014/11/Endoskopine-medicina_logo.png" },
  { category: "Orthopedics", icon: "2014/11/Ortopedija_logo.png" },
  { category: "Otorhinolaryngology", icon: "2014/11/Otolarinolaringologija_logo.png" },
  { category: "Urology", icon: "2014/11/Urologija_logo.png" },
  { category: "Surgery and intensive therapy", icon: "2014/11/Chirurgija-logo.png" },
];

export type Partner = { name: string; url: string; logo: string; categories: Category[] };

export const PARTNERS: Partner[] = [
  { name: "Aachen Resonance", url: "http://www.aachen-resonance.com/", logo: "2016/04/Aachen_logo-1.png", categories: ["Interventional cardiology", "Interventional radiology"] },
  { name: "Acandis GmbH", url: "https://www.acandis.com/start-1-en", logo: "2019/05/acandis-formedics.png", categories: ["Interventional cardiology"] },
  { name: "Alvimedica", url: "http://www.alvimedica.com/", logo: "2016/04/Alvimedica-CID-logo-1.png", categories: ["Interventional radiology"] },
  { name: "Asahi Intecc", url: "https://medical.asahi-intecc.com/en/?area=eu", logo: "2016/04/Asahi-Intecc-logo-1.png", categories: ["Interventional cardiology", "Interventional radiology"] },
  { name: "Audiotechnologies", url: "http://www.audiotechnologies.it/", logo: "2016/04/Audiotechnologies-logo-1.png", categories: ["Otorhinolaryngology"] },
  { name: "Bess GmbH", url: "http://www.bess.de/", logo: "2016/04/Bees-logo-1.png", categories: ["Surgery and intensive therapy"] },
  { name: "Biosensors International", url: "http://www.biosensors.com/intl/products-technology-interventional-cardiology", logo: "2016/04/Biosensors-International-logo-1.png", categories: ["Interventional cardiology"] },
  { name: "Boston Medical Products Inc.", url: "http://www.bosmed.com/", logo: "2016/04/Boston-logo-1.png", categories: ["Surgery and intensive therapy"] },
  { name: "Cardia Inc.", url: "http://www.cardia.com/products.html", logo: "2016/04/Cardia-Inc-logo-1.png", categories: ["Interventional cardiology"] },
  { name: "Ceraver", url: "http://www.ceraver.com/", logo: "2016/04/Ceraver_logo-1.png", categories: ["Orthopedics"] },
  { name: "CID", url: "http://www.alvimedica.com/", logo: "2016/04/CID.png", categories: ["Interventional radiology"] },
  { name: "Implanet", url: "https://www.implanet.com/us/", logo: "2019/02/implanetlogo.png", categories: ["Neurosurgery"] },
  { name: "InspireMD", url: "http://www.inspiremd.com/en/", logo: "2016/04/InspireMD-logo-1.png", categories: ["Interventional cardiology", "Interventional radiology"] },
  { name: "JOTEC GmbH", url: "https://www.jotec.com/en/", logo: "2019/05/jotec.png", categories: ["Interventional cardiology"] },
  { name: "KERIMEDICAL", url: "https://www.kerimedical.com/en/", logo: "2022/03/logo-kerimedical-Retina-02-1.png", categories: ["Hand surgery"] },
  { name: "KURZ Medical", url: "http://www.kurzmed.de/", logo: "2016/04/Kurz-logo-1.png", categories: ["Otorhinolaryngology"] },
  { name: "VYTIL", url: "https://www.vytil.com/en", logo: "2016/04/vytil-1.png", categories: ["Endoscopic medicine"] },
  { name: "Neitz", url: "https://www.neitz.co.jp/en/", logo: "2022/05/neitz_logo.png", categories: ["Optics"] },
  { name: "Novatech", url: "http://www.novatech.fr/en/metanavigation/bess-group.html", logo: "2016/04/Novatech-logo-1.png", categories: ["Surgery and intensive therapy"] },
  { name: "OVESCO GmbH", url: "http://www.ovesco.com/", logo: "2016/04/Ovesco_logo-1.png", categories: ["Endoscopic medicine"] },
  { name: "Penumbra Inc.", url: "http://www.penumbrainc.com/", logo: "2016/04/Penumbra-logo-1.png", categories: ["Interventional radiology"] },
  { name: "PharmaCept GmbH", url: "http://pharmacept.com/en/", logo: "2019/02/acandis-formedics-copy-1.png", categories: ["Interventional radiology"] },
  { name: "Philips", url: "https://www.philips.lt/healthcare/e/image-guided-therapy", logo: "2021/01/logo-philips-formedics-1.png", categories: ["Heart rhythm management", "Interventional cardiology", "Interventional radiology"] },
  { name: "SCW", url: "http://scwmedicath.gmc.globalmarket.com/", logo: "2016/04/SCV-logo-1.png", categories: ["Interventional cardiology"] },
  { name: "SIS MEDICAL", url: "https://www.sis-medical.com/", logo: "2019/03/sis-logoo.png", categories: ["Interventional cardiology"] },
  { name: "SMAIO", url: "https://smaio.com/", logo: "2022/03/smaio-1.png", categories: ["Neurosurgery"] },
  { name: "STERIS Endoscopy", url: "https://www.steris.com", logo: "2016/04/steris-endo.png", categories: ["Endoscopic medicine"] },
  { name: "Taewoong Medical", url: "https://formedics.lt/Produktai/taewoong-medical/", logo: "2018/12/teawong-logo.png", categories: ["Endoscopic medicine"] },
  { name: "Zephyr Surgical Implants", url: "http://www.zsimplants.ch/en/", logo: "2016/04/ZSI-logo-1.png", categories: ["Urology"] },
];

export const EU_LOGO = "2020/08/es-300x144.png";

export const NHIF_PDFS = {
  catalogue: "2023/03/1.-Kalbos-prietaiso-katalogas.-SERVOX-digital-XL-EN-LT.pdf",
  instruction: "2023/03/2.-Kalbos-prietaiso-instrukcija.-SERVOX-digital-XL-EN-LT.pdf",
};

/** Photos per Social Responsibility entry, keyed by the entry id used in the dictionaries. */
export const SOCIAL_PHOTOS: Record<string, string[]> = {
  "rotary-2021": ["2021/03/2021-Antazaves-vaikai.jpg", "2021/03/2021-Antazaves-Kristoforas-1.jpg", "2021/03/2021-Uztiltes-namo-remejai-1.jpg", "2021/03/Screenshot-2021-03-30-at-12.18.19-1.png"],
  "christmas-games-2019": [
    "2020/01/80112768_2848614085178235_3737616214701113344_o-1.jpg",
    "2020/01/79175652_2848607141845596_7927712585565077504_o-1.jpg",
    "2020/01/79278904_2848602831846027_4130254269406248960_o-1.jpg",
    "2020/01/79273280_2848602878512689_3990387452526198784_o-1.jpg",
    "2020/01/79836722_2848608321845478_6683246417139466240_o-1.jpg",
    "2020/01/kaledines-zaidynes-padeka-formedics-jpg-1.jpg",
  ],
  "maltese-soup-2018": ["2018/12/IMG_1013.jpg", "2018/12/IMG_1015.jpg"],
  "leader-club-2017": ["2016/04/Soc_ats_foto_01.jpg", "2016/04/Soc_ats_foto_02.jpg"],
  "happy-children-2016": ["2016/04/Laimingi_vaikai_04.jpg", "2016/04/Laimingi_vaikai_03.jpg", "2016/04/Laimingi_vaikai_02.jpg", "2016/04/Laimingi_vaikai_01.jpg"],
  "scholarship-2015": ["2016/04/Parama-fondui.jpg"],
};
