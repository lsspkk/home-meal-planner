export interface Recipe {
  id: string;
  title: string;
  links: string[];
  contents: string[];
  text: string;
}

export const recipes: Recipe[] = [
  {
    id: "A1b2C3d4",
    title: "Kana-kookoskeitto",
    links: ["https://www.k-ruoka.fi/reseptit/kookos-kanakeitto"],
    contents: [
      "450 g hunajamarinoitu broilerin fileesuikale",
      "4 perunaa",
      "2 porkkanaa",
      "1 chili",
      "1 paprika",
      "2 kookosmaito (200ml)",
      "persiljaa"
    ],
    text: "Maukas ja helppo kana-kookoskeitto arkeen."
  },
  {
    id: "E5f6G7h8",
    title: "Pinaattinen mifuaurajuustokiusaus",
    links: ["https://www.valio.fi/reseptit/pinaattinen-mifu-perunakiusaus/"],
    contents: [
      "yrtti-valkosipuli MIFU",
      "1kg peruna-sipulisekoitus",
      "ruokakerma",
      "150g pakastepinaattia",
      "auramuru"
    ],
    text: "Kasviskiusaus pinaatilla ja aurajuustolla."
  },
  {
    id: "I9j0K1l2",
    title: "Tofu limonello",
    links: ["https://chocochili.net/2019/01/tofu-limonello/"],
    contents: [
      "maustamaton tofu",
      "kaurakerma",
      "2 valkosipulinkynttä",
      "1rkl inkivääriä",
      "2 rkl sitruunamehua",
      "2 rkl agavesiirappia",
      "1 dl juhamietoa",
      "150 g täysjyväspagettia",
      "persiljaa"
    ],
    text: "Raikas ja sitruunainen tofuruoka."
  },
  {
    id: "M3n4O5p6",
    title: "Siskonmakkarakeitto",
    links: [],
    contents: [
      "peruna",
      "porkkana",
      "siskonmakkara",
      "palsternakka"
    ],
    text: "Perinteinen suomalainen keitto."
  },
  {
    id: "Q7r8S9t0",
    title: "Uunikasvikset ja kalaa",
    links: [],
    contents: [
      "pakastekalaa",
      "peruna",
      "porkkana",
      "punajuuri"
    ],
    text: "Helppo uuniruoka kasviksilla ja kalalla."
  },
  {
    id: "U1v2W3x4",
    title: "Uunifetapasta / uunitofupasta",
    links: [
      "https://liemessa.fi/2019/02/uunifetapasta/",
      "https://chocochili.net/2021/05/uunitofupasta-eli-vegaaninen-uunifetapasta/"
    ],
    contents: [
      "hyvää pastaa",
      "feta / tofukuutio",
      "chili",
      "kirsikkatomaatteja",
      "basilika",
      "(valkosipuli)"
    ],
    text: "Suosittu uunipasta fetalla tai tofulla."
  },
  {
    id: "Y5z6A7b8",
    title: "Makaronilaatikko",
    links: ["https://www.k-ruoka.fi/reseptit/liha-makaronilaatikko"],
    contents: [
      "makaroni 400g",
      "jauheliha 400g",
      "sipuli",
      "sinistä maitoa",
      "emmental-mozzarella juustoraaste",
      "2-3 munaa"
    ],
    text: "Klassinen makaronilaatikko."
  },
  {
    id: "Z9x8C7v6",
    title: "Palakpaneer kotijuustolla tai kaurapalalla",
    links: ["https://viimeistamuruamyoten.com/palak-paneer-kaurapalalla-v/"],
    contents: [
      "kaurapala/kotijuusto/paneerjuusto 200-400g",
      "500g pakastepinaattia",
      "chili",
      "valkosipuli",
      "sipuli",
      "kauramaito",
      "2 rkl tomaattipyre"
    ],
    text: "Intialainen pinaatti-juustoruoka."
  },
  {
    id: "B2n3M4k5",
    title: "Perunapelti Resepti. Nachovuoka:",
    links: ["https://www.k-ruoka.fi/reseptit/nachovuoka"],
    contents: [
      "quorn - Pilko perunat, paprika ja kesäkurpitsa. Sekoita öljyyn ja puolikkaaseen tacomausteeseen",
      "peruna (8) - Paista quorn paloja pannulla ja lisää loput tacomaustepussista",
      "paprika (1) - Levitä kaikki uunipellille ja lisää päälle juustoraaste. Paista 200C 20-30min.",
      "puolikas kesäkurpitsa",
      "100g vihreitä papuja",
      "1 ps tacomausteseos",
      "cheddar-raaste",
      "Gochujang kanakastike",
      "4 dl kookoskermaa",
      "1 sipuli kuutioituna",
      "1 tl currya",
      "1 rkl gochujang -chilitahnaa",
      "(korianteri)"
    ],
    text: "Nachovuoka perunapellillä."
  },
  {
    id: "C6v5B4n3",
    title: "Kalakeitto",
    links: [],
    contents: [
      "kalaa",
      "perunaa",
      "porkkanaa",
      "kerma",
      "tilli"
    ],
    text: "Helppo ja maukas kalakeitto."
  },
  {
    id: "D7m8N9b0",
    title: "Tofukookoskorma",
    links: ["https://viimeistamuruamyoten.com/tofu-kookoskorma-v-gf/"],
    contents: [
      "jalotofu marinoitu",
      "sipuli",
      "valkosipuli",
      "inkivääri",
      "kookoskerma 250 ml",
      "paseerattu tomaatti 500g"
    ],
    text: "Kermainen tofu-kookoskorma."
  },
  {
    id: "E8k7L6j5",
    title: "Ponzu-marinoitua broileria ja marinoituja kasviksia",
    links: ["https://www.mtvuutiset.fi/makuja/reseptit/resepti/makujen-aamu-ponzu-marinoitua-broileria-ja-paahdettuja-kasviksia-pellilla/7319510"],
    contents: [
      "500g broilerinfilee",
      "ponzukastiketta",
      "hunajaa",
      "minttu rk",
      "parsakaali 400g",
      "2 paprikaa",
      "valkosipulia",
      "turkkilaista jugurttia 2dl",
      "sitruuna"
    ],
    text: "Ponzu-broileria ja kasviksia pellillä."
  },
  {
    id: "F1g2H3i4",
    title: "Lihapullat",
    links: ["https://www.valio.fi/reseptit/isoaidin-lihapullat---resepti/"],
    contents: [
      "kermaviili",
      "korppujauhot",
      "sipuli",
      "naudan jauhelihaa",
      "kananmuna",
      "(valio ruokakerma 3 sipulia kastikkeeseen)"
    ],
    text: "Isoäidin lihapullat."
  },
  {
    id: "G5h6I7j8",
    title: "Tofukarbonara",
    links: [
      "https://jalotofu.fi/reseptit/vegaaninen-pasta-carbonara/",
      "https://viimeistamuruamyoten.com/vegaaninen-pasta-carbonara/"
    ],
    contents: [
      "kylmäsavutofu",
      "spagetti",
      "sitruunamehu",
      "250g kaurakerma (pippuri/juusto)",
      "1 dl parmesan",
      "persilja"
    ],
    text: "Vegaaninen pasta carbonara."
  },
  {
    id: "H9i8J7k6",
    title: "Kanarisotto",
    links: ["https://www.k-ruoka.fi/reseptit/kanarisotto"],
    contents: [
      "250g broilerin fileesuikale",
      "hemapa",
      "kanaliemikuutio",
      "risottoriisi"
    ],
    text: "Helppo kanarisotto."
  },
  {
    id: "J1k2L3m4",
    title: "Perunamuusi ja kuhaa",
    links: [],
    contents: [
      "kuhaa",
      "muusipernaa"
    ],
    text: "Perinteinen perunamuusi ja kuhaa."
  },
  {
    id: "K5l6M7n8",
    title: "Avocadopasta",
    links: [],
    contents: [
      "chili",
      "lime",
      "basilika",
      "lehtipersilja",
      "parmesan 60 g",
      "400-500g spaghetti"
    ],
    text: "Raikas avocadopasta."
  },
  {
    id: "L9m8N7o6",
    title: "Yhden pannun pasta",
    links: [
      "https://www.valio.fi/reseptit/yhden-pannun-pasta/",
      "https://www.k-ruoka.fi/reseptit/nopea-kanapasta?gclsrc=aw.ds&gclid=CjwKCAiAprGRBhBgEiwANJEY7AEww7P6xx6WKHVwjEh2MQioUR5ju0O51s8tmqLtOHAIc5seX9X5oRoCXUQQAvD_BwE"
    ],
    contents: [
      "pesto tai 2x maustamaton broilerisuikale 300g",
      "2x miniluumutomaattirasia",
      "2 pkt tuorepastaa",
      "kanaliemikuutio",
      "Valio viola sitruuna tuorejuusto"
    ],
    text: "Kaikki yhdessä pannussa!"
  },
  {
    id: "M1n2O3p4",
    title: "Kasvissosekeitto",
    links: ["https://yhteishyva.fi/reseptit/kasvissosekeitto/recipe-4223"],
    contents: [
      "porkkana 500g",
      "palsternakka (1)",
      "sipuli",
      "kesäkurpitsa 300g",
      "yrtti tuorejuustoa"
    ],
    text: "Samettinen kasvissosekeitto."
  },
  {
    id: "N5o6P7q8",
    title: "Soijasuikalewokki OMA",
    links: [],
    contents: [
      "soijasuikaleet yms.",
      "parsakaali",
      "porkkana",
      "paprika",
      "papuja"
    ],
    text: "Wokki soijasuikaleista ja kasviksista."
  }
  // ... (add more recipes as needed to reach ~40)
]; 