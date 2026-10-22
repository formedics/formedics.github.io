/**
 * Site-wide content mirrored from formedics.lt (English).
 * Wording is kept as on the original site; only clear grammatical slips were fixed.
 * Images are served from the original WordPress uploads, as on the live site.
 */

export const W = "https://formedics.lt/wp-content/uploads";

export type NavItem = { label: string; to: string; hash?: string };

/** Primary navigation, in the original site's order. About and Policy are sections of the homepage. */
export const NAV: NavItem[] = [
  { label: "Homepage", to: "/" },
  { label: "About", to: "/", hash: "about" },
  { label: "Policy", to: "/", hash: "policy" },
  { label: "Products", to: "/products" },
  { label: "EU Projects", to: "/eu-projects" },
  { label: "Social Responsibility", to: "/social-responsibility" },
  { label: "Contacts", to: "/contacts" },
];

export type Office = {
  country: string;
  code: "LT" | "LV" | "EE";
  title: string;
  company?: string;
  address: string;
  phone: string;
  phoneHref: string;
  fax?: string;
  email: string;
  details: string[];
  /** Google Maps query for the address */
  maps: string;
};

export const OFFICES: Office[] = [
  {
    country: "Lithuania",
    code: "LT",
    title: "Lithuanian office",
    company: "UAB „Formedics“",
    address: "Senosios Pilaitės kelias 1, LT-06229 Vilnius",
    phone: "+370 5 262 30 70",
    phoneHref: "tel:+37052623070",
    fax: "+370 5 213 75 63",
    email: "info@formedics.lt",
    details: ["Company code: 124980311", "VAT: LT100001278310"],
    maps: "Senosios Pilaitės kelias 1, Vilnius, Lithuania",
  },
  {
    country: "Latvia",
    code: "LV",
    title: "Latvian office",
    address: "Zemgaļu street 8, Rīga, LV-1006",
    phone: "+371 23 205 334",
    phoneHref: "tel:+37123205334",
    email: "eduards@formedics.lv",
    details: ["Representative office of a foreign merchant UAB “Formedics” with the Latvian registration No. 50006025601"],
    maps: "Zemgaļu iela 8, Rīga, Latvia",
  },
  {
    country: "Estonia",
    code: "EE",
    title: "Estonian office",
    address: "Veskiposti 2, 10138 Tallinn, Estonia",
    phone: "+372 591 952 90",
    phoneHref: "tel:+37259195290",
    email: "rep@formedics.ee",
    details: [],
    maps: "Veskiposti 2, Tallinn, Estonia",
  },
];

export const SERVICE_HOURS = "8:30 a.m.–5:00 p.m.";

/** The seven product areas shown on the homepage, with the original icons. */
export const PRODUCT_AREAS: { name: Category; icon: string }[] = [
  { name: "Interventional cardiology", icon: "2014/11/Intervencine-kardiologija_logo.png" },
  { name: "Interventional radiology", icon: "2014/11/Intervencine-radiologija_logo.png" },
  { name: "Endoscopic medicine", icon: "2014/11/Endoskopine-medicina_logo.png" },
  { name: "Orthopedics", icon: "2014/11/Ortopedija_logo.png" },
  { name: "Otorhinolaryngology", icon: "2014/11/Otolarinolaringologija_logo.png" },
  { name: "Urology", icon: "2014/11/Urologija_logo.png" },
  { name: "Surgery and intensive therapy", icon: "2014/11/Chirurgija-logo.png" },
];

/** Product categories used to filter partner manufacturers, in the original order. */
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

export const EU_PROJECT = {
  logo: "2020/08/es-300x144.png",
  title: "Development of a prototype of medical neuro-wire for mechanical thrombectomy in the case of ischemic stroke",
  intro: [
    "The project applicant is UAB “Formedics”, a company that has been operating successfully for more than 20 years, whose main field of activity is wholesale of medical devices. The long-term goal of the company is to remain a reliable partner in the field of medical equipment trade, to provide quality and the latest equipment and devices for medical institutions.",
    "The company has now started implementing the project funded by the European Regional Development Fund to develop a prototype and a test batch of medical neuro-wire, which is expected to be successfully commercialized later.",
    "The main goal of the project is to investigate and develop an innovative device to improve the functional outcome of ischemic stroke treatment.",
  ],
  goals: [
    "To acquire and accumulate knowledge about the latest research results and achievements, and to develop concepts for the application of knowledge for the development of medical neuro-wire for mechanical thrombectomy in the case of ischemic stroke.",
    "Based on the latest research results and using modern technologies, to develop an efficient and relatively low-cost new medical device – a neuro-wire for mechanical thrombectomy during an ischemic stroke.",
    "To create a prototype of an innovative medical neuro-wire, confirming the possibilities of successful use and efficiency.",
    "To produce a test batch of the product in order to accelerate the commercialization of the product.",
  ],
  outcome:
    "The project is expected to successfully develop a product that will allow mechanical thrombectomy to be performed more quickly in the event of an ischemic stroke, providing better outcomes for the surgery. A lower price than the closest analogues currently on the market will ensure that the device becomes available to medical institutions that currently cannot afford these devices due to the high cost and do not provide the best possible treatment conditions for patients.",
  facts: [
    ["Project code", "01.2.1-LVPA-K-856-01-0034"],
    ["Total amount of eligible costs for funding the project", "EUR 116 838"],
    ["Amount financed by the European Regional Development Fund", "EUR 71 526.85"],
    ["Start of project activities", "March 2020"],
    ["End of the project", "July 2022"],
  ] as [string, string][],
};

export const SOCIAL_INTRO = [
  "We cannot focus only on our own success or on that of our immediate environment. For various reasons, there are many sensitive issues in the world, and they often cause hatred, discontent, and even violent outbreaks. These often stem from our childhood and adolescence environment and experiences, which form our perception of the world and dictate our actions throughout the rest of our lives.",
  "Our whole team feels the responsibility and the need to contribute to the child care and youth education institutions of Lithuania. We try as much as we can to support such activities, and our support is not limited to financial contributions – we believe that there are many other things that we can share with these children and youth. With our participation we want to give them a belief in kindness and in their own potential to grow up as strong and good people.",
];

export type SocialEntry = { title: string; date: string; paragraphs: string[]; photos: string[] };

export const SOCIAL_ENTRIES: SocialEntry[] = [
  {
    title: "We support sports and responsible future generations",
    date: "December 2019",
    paragraphs: [
      "The good news is that Formedics had an opportunity to contribute with a socially responsible event, “Christmas Games.”",
      "The event has already become a cherished tradition that not only develops children’s awareness of sport as a great form of leisure; it encourages preparation and performance throughout the year. The event also develops team spirit, mutual trust, and brings many good emotions before Christmas.",
    ],
    photos: [
      "2020/01/80112768_2848614085178235_3737616214701113344_o-1.jpg",
      "2020/01/79175652_2848607141845596_7927712585565077504_o-1.jpg",
      "2020/01/79278904_2848602831846027_4130254269406248960_o-1.jpg",
      "2020/01/79273280_2848602878512689_3990387452526198784_o-1.jpg",
      "2020/01/79836722_2848608321845478_6683246417139466240_o-1.jpg",
      "2020/01/kaledines-zaidynes-padeka-formedics-jpg-1.jpg",
    ],
  },
  {
    title: "Charity event to support lonely and forgotten people",
    date: "December 2018",
    paragraphs: [
      "„Formedics“ continues its socially responsible activities. On December 14, 2018, the Formedics team, together with other major Lithuanian companies, took part in the charity event „Maltiečių sriuba“.",
      "The Formedics team served soup to passers-by in the centre of Vilnius and asked for donations in return.",
      "The donations are used to support lonely and elderly people throughout the whole year.",
    ],
    photos: ["2018/12/IMG_1013.jpg", "2018/12/IMG_1015.jpg"],
  },
  {
    title: "Formedics meets the youth Leader Club",
    date: "October 2017",
    paragraphs: [
      "The company Formedics continues its socially responsible activity. On October 8, 2017, the head of the company Formedics met the members of the Leader Club of Vilnius Simonas Daukantas Progymnasium.",
      "It is a group of initiative-taking and curious students, and it is also a great initiative. During the meeting, the investor and head of the company Formedics, Vytautas Pranulis, shared with the members of the Leader Club his knowledge, insights and advice on how to encourage one’s own creativity, enterprise and ability to pursue one’s goals. Everyone’s responsible contribution to the development of contemporary youth will guarantee a more sustainable future for Lithuania.",
    ],
    photos: ["2016/04/Soc_ats_foto_01.jpg", "2016/04/Soc_ats_foto_02.jpg"],
  },
  {
    title: "Social project “Happy children = children around us”",
    date: "August 2016",
    paragraphs: [
      "We support the idea of the painters, brothers Algirdas and Remigijus Gataveckai: abandoned children do not need plush-toy love; what they need is a family and loving people.",
      "With our own labour and resources, we contributed to and helped to create the social artwork on a house wall in Vilnius. Inspired by the noble purpose and the successful realisation of the idea, we will continue to implement such initiatives.",
      "We hope it will inspire you to do good works too.",
    ],
    photos: ["2016/04/Laimingi_vaikai_04.jpg", "2016/04/Laimingi_vaikai_03.jpg", "2016/04/Laimingi_vaikai_02.jpg", "2016/04/Laimingi_vaikai_01.jpg"],
  },
  {
    title: "Support for a scholarship fund for socially disadvantaged youth",
    date: "December 2015",
    paragraphs: [
      "For us it is important that young and talented people be able to acquire a proper education and build their future. Therefore, we have provided support for young people from poor families to study at ISM University. One of the recipients of a social scholarship thanked us in the following words: “You have given me an opportunity to become part of the ISM community. The dreams of people like me can come true thanks to people like you.” This thank-you note motivated our company to grow and develop even more so that we can continue providing help where there is a real need.",
    ],
    photos: ["2016/04/Parama-fondui.jpg"],
  },
];
