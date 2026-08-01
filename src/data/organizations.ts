export type Organization = {
  id: string;
  name: string;
  category: string;
  description: string;
  logo?: string;
  link?: string;
};

export const organizations: Organization[] = [
  // Student Government
  {
    id: "el-consejo-atenista",
    name: "El Consejo Atenista",
    category: "Student Government",
    description:
      "The supreme student government of Ateneo de Zamboanga University, representing and advocating for the interests of the student body. Guided by Ignatian values, it promotes accountable leadership, participatory governance, and meaningful service.",
    logo: "/logos/El Consejo Atenista.jpg",
    link: "https://www.facebook.com/adzueca",
  },

  // Academic Cluster
  {
    id: "society-of-ateneo-scholars",
    name: "Society of Ateneo Scholars",
    category: "Academic Cluster",
    description:
      "The official organization of Ateneo scholars that fosters leadership, scholarship, and community among student scholars.",
    logo: "/logos/Society of Ateneo Scholars.jpg",
    link: "https://www.facebook.com/SocietyOfAteneoScholars",
  },
  {
    id: "adzu-ignatian-civil-engineering-students-organization",
    name: "Ateneo de Zamboanga University Ignatian Civil Engineering Students Organization (AdZU-ICES)",
    category: "Academic Cluster",
    description:
      "Supports the academic and professional development of civil engineering students while integrating Ignatian values into engineering practice.",
    logo: "/logos/ADZU Ignatian Civil Engineering Students Organization.jpg",
    link: "https://www.facebook.com/adzuices",
  },
  {
    id: "the-ateneo-communicators",
    name: "The Ateneo Communicators (AtComm)",
    category: "Academic Cluster",
    description:
      "The academic organization for students in the communications field, fostering skills in media production, writing, and strategic communication.",
  },
  {
    id: "ateneo-psych-icare",
    name: "Ateneo Psych Icare",
    category: "Academic Cluster",
    description:
      "The academic organization for Psychology students, promoting mental health awareness, research, and professional development in the field.",
  },
  {
    id: "samahang-pilosopiya-ng-ateneo",
    name: "Samahang Pilosopiya ng Ateneo",
    category: "Academic Cluster",
    description:
      "The co-curricular organization for philosophy students that promotes intellectual inquiry, ethical reflection, and meaningful discussion.",
    logo: "/logos/Samahang Pilosopiya ng Ateneo.jpg",
    link: "https://www.facebook.com/ateneo.spa",
  },
  {
    id: "ateneo-biological-society",
    name: "Ateneo Biological Society",
    category: "Academic Cluster",
    description:
      "Unites students passionate about biology and the natural sciences through scientific learning, environmental awareness, and community engagement.",
    logo: "/logos/Ateneo Biological Society.jpg",
    link: "https://www.facebook.com/AteneoBioSociety",
  },
  {
    id: "aicg",
    name: "Ateneo Informatics and Computing Guild (AICG)",
    category: "Academic Cluster",
    description:
      "Brings together students from Information Technology, Computer Science, and New Media and Computer Animation programs to foster technical growth and innovation.",
    logo: "/logos/Ateneo Informatics Computing Guild.jpg",
    link: "https://www.facebook.com/profile.php?id=61572308169719",
  },
  {
    id: "jieep-adzu",
    name: "Institute of Computer Engineering in the Philippines – Ateneo de Zamboanga University Chapter (ICEP)",
    category: "Academic Cluster",
    description:
      "Supports computer engineering students through technical learning, leadership opportunities, and professional development.",
    logo: "/logos/Junior Institute of Electronics Engineers of the Philippines- ADZU Chapter.jpg",
    link: "https://www.facebook.com/JIECEPADZUChapter",
  },
  {
    id: "jpia",
    name: "Junior Philippine Institute of Accountants – Ateneo de Zamboanga University",
    category: "Academic Cluster",
    description:
      "Represents students pursuing accounting and related disciplines. It prepares members for the accounting profession through leadership, training, and professional development.",
    logo: "/logos/Junior Philippine Institute of Accountants.jpg",
    link: "https://www.facebook.com/JPIA.AdZULocalChapter",
  },
  {
    id: "international-studies-organization",
    name: "International Studies Organization of Ateneo",
    category: "Academic Cluster",
    description:
      "Serves students of the BA International Studies program while promoting global awareness and cultural understanding.",
    logo: "/logos/International Studies Organization.jpg",
    link: "https://www.facebook.com/intsisoa",
  },
  {
    id: "jma-adzu",
    name: "Junior Marketing Association – Ateneo de Zamboanga University",
    category: "Academic Cluster",
    description:
      "Develops future marketing professionals through leadership opportunities, strategic thinking, and practical learning experiences.",
    logo: "/logos/Junior Institute for Marketing Association - Ateneo de Zamboanga University.jpg",
    link: "https://www.facebook.com/profile.php?id=61578253216803",
  },

  // Culture, Arts and Multimedia
  {
    id: "ateneo-music-club",
    name: "Ateneo Music Club",
    category: "Culture, Arts and Multimedia",
    description:
      "Brings together students who share a passion for music through collaboration, performance, and skill development.",
    logo: "/logos/Ateneo Music Club.jpg",
    link: "https://www.facebook.com/profile.php?id=61552065752807",
  },
  {
    id: "ateneo-art-company",
    name: "Ateneo Art Company (ArtCo AdZU)",
    category: "Culture, Arts and Multimedia",
    description:
      "Promotes artistic expression and cultural awareness through workshops, exhibits, and collaborative projects.",
    logo: "/logos/ArtCo.jpg",
    link: "https://www.facebook.com/profile.php?id=61576945077566",
  },
  {
    id: "ateneo-blue-vigors",
    name: "Ateneo Blue Vigors",
    category: "Culture, Arts and Multimedia",
    description:
      "The official dance organization of Ateneo de Zamboanga University. It develops performance skills while promoting teamwork, discipline, and artistic expression.",
    logo: "/logos/Ateneo Blue Vigors.jpg",
    link: "https://www.facebook.com/ateneobluevigor",
  },
  {
    id: "ateneo-de-zamboanga-university-glee-club",
    name: "Ateneo de Zamboanga University Glee Club",
    category: "Culture, Arts and Multimedia",
    description:
      "The university's official choral group, cultivating vocal artistry and performance excellence among student singers.",
  },
  {
    id: "teatro-ateneo-de-zamboanga",
    name: "Teatro Ateneo de Zamboanga (TAZ)",
    category: "Culture, Arts and Multimedia",
    description:
      "Dedicated to theater and performance arts, fostering creativity, storytelling, and cultural appreciation.",
    logo: "/logos/Teatro Ateneo de Zamboanga.jpg",
    link: "https://www.facebook.com/AdZUTeatro",
  },
  {
    id: "ateneo-eagle-pep-squad",
    name: "Azul Eagles Pep Squad",
    category: "Culture, Arts and Multimedia",
    description:
      "The university's official cheerleading team that energizes school events through athleticism, teamwork, and school spirit.",
    logo: "/logos/Ateneo Eagle Pep Squad.jpg",
    link: "https://www.facebook.com/profile.php?id=61563191549045",
  },

  // Publications and Communications
  {
    id: "ateneo-debate-union",
    name: "Ateneo Debate Union",
    category: "Publications and Communications",
    description:
      "Develops students' critical thinking, public speaking, and argumentation skills through competitive debate and forensic activities, representing AdZU in local and national competitions.",
    logo: "/logos/Ateneo Debate Union.jpg",
    link: "https://www.facebook.com/ateneodebateunion",
  },
  {
    id: "the-beacon-publications",
    name: "The Beacon Publications",
    category: "Publications and Communications",
    description:
      "AdZU's official student publication that upholds press freedom and journalistic excellence through news reporting, feature writing, and campus advocacy.",
    logo: "/logos/The Beacon Publications.jpg",
    link: "https://www.facebook.com/BeaconOfficial",
  },

  // Socio-Civic and Political
  {
    id: "rotaract-club-adzu",
    name: "Rotaract Club of Ateneo de Zamboanga University",
    category: "Socio-Civic and Political",
    description:
      "A service-oriented youth club affiliated with Rotary International, developing leadership through community service and humanitarian projects.",
  },
  {
    id: "la-liga-historia-zamboanguena",
    name: "La Liga Historia Zamboangueña – AdZU Chapter",
    category: "Socio-Civic and Political",
    description:
      "Promotes historical awareness, cultural preservation, and meaningful dialogue about Zamboanga's heritage and identity.",
    logo: "/logos/La liga.jpg",
    link: "https://www.facebook.com/profile.php?id=61576886223702",
  },
  {
    id: "ateneo-pride-network",
    name: "Ateneo Pride Network (APN)",
    category: "Socio-Civic and Political",
    description:
      "Advocates for LGBTQ+ awareness, inclusivity, and safe spaces within the Ateneo community through education and dialogue.",
  },
  {
    id: "el-fuente-ph",
    name: "El Fuente PH (EFPH)",
    category: "Socio-Civic and Political",
    description:
      "Empowers youth to become active contributors to society through leadership, advocacy, and civic engagement.",
    logo: "/logos/El Fluente.jpg",
    link: "https://www.facebook.com/elfuenteph",
  },
  {
    id: "ipadz",
    name: "Indigenous Peoples' Alliance for Development in Zamboanga (IPAdZ)",
    category: "Socio-Civic and Political",
    description:
      "Advocates for the rights, welfare, and cultural preservation of indigenous communities.",
    logo: "/logos/Indigenous Peoples’ Alliance for Development in Zamboanga - IPAdZ.jpg",
    link: "https://www.facebook.com/profile.php?id=61578016242276",
  },
  {
    id: "sadaqah",
    name: "Service for Actual Development and Quick Action for Hope (SADAQAH)",
    category: "Socio-Civic and Political",
    description:
      "A socio-civic organization focused on community development and humanitarian service through initiatives addressing education, health, and wellness.",
    logo: "/logos/SADAQAH.jpg",
    link: "https://www.facebook.com/sadaqahadzu",
  },
  {
    id: "usad-adzu",
    name: "Union of Students for the Advancement of Democracy – Ateneo de Zamboanga (USAD)",
    category: "Socio-Civic and Political",
    description:
      "The premier social-democratic student-led political party-organization in AdZU since 2014, fostering unity and advocating for student welfare.",
    logo: "/logos/USAD Ateneo de Zamboanga.jpg",
    link: "https://www.facebook.com/USADAdZU",
  },
  {
    id: "junior-jaycees-chamber-adzu",
    name: "Junior Jaycees – Ateneo de Zamboanga University",
    category: "Socio-Civic and Political",
    description:
      "The AdZU chapter of the Junior Chamber International, developing young leaders through civic projects, community service, and hands-on leadership training.",
    logo: "/logos/Junior Jaycees Chamber - AdZU.jpg",
    link: "https://www.facebook.com/jjcateneo",
  },

  // Wellness and Environmental
  {
    id: "the-ecowatch-organization",
    name: "ECOWATCH",
    category: "Wellness and Environmental",
    description:
      "Promotes environmental awareness, sustainability, and conservation efforts while encouraging responsible stewardship of the environment.",
    logo: "/logos/EcoWatch.jpg",
    link: "https://www.facebook.com/ecowatchadzu",
  },
  {
    id: "fable-adzu",
    name: "Foundation for Animal Betterment, Love and Education (FABLE)",
    category: "Wellness and Environmental",
    description:
      "Advocates for animal welfare, responsible pet care, and community action to protect the well-being of animals.",
  },
  {
    id: "adzu-judo-club",
    name: "Ateneo de Zamboanga University Judo Club",
    category: "Wellness and Environmental",
    description:
      "Promotes physical fitness and discipline through the practice and competitive sport of judo.",
  },
  {
    id: "ateneo-peers-circle",
    name: "Ateneo Peers' Circle",
    category: "Wellness and Environmental",
    description:
      "The official student peer group of the College Guidance and Counseling Office, promoting emotional well-being, active listening, and psychological health awareness among AdZU students.",
    logo: "/logos/Ateneo Peers' Circle.jpg",
    link: "https://www.facebook.com/adzupeerscircle",
  },

  // Faith and Formation
  {
    id: "ateneo-liturgical-society",
    name: "Ateneo Liturgical Society (ALS)",
    category: "Faith and Formation",
    description:
      "Enriches the university's liturgical life by forming student lectors, commentators, and ministers who lead communal worship with reverence and excellence.",
    logo: "/logos/Ateneo Liturgical Society.jpg",
    link: "https://www.facebook.com/profile.php?id=61578927987749",
  },
  {
    id: "ateneo-lectors-society",
    name: "Ateneo Lectors Society",
    category: "Faith and Formation",
    description:
      "A faith-based student organization dedicated to the formation of lectors through spiritual growth, liturgical service, and servant leadership, fostering a deeper commitment to God and the Ateneo community.",
    link: "https://www.facebook.com/profile.php?id=61590342519957",
  },
  {
    id: "ateneo-catechetical-instruction-league",
    name: "Ateneo Catechetical Instruction League (ACIL)",
    category: "Faith and Formation",
    description:
      "Trains students as catechists and faith educators, deepening their understanding of Catholic doctrine and preparing them for meaningful service in their communities.",
    logo: "/logos/Ateneo Catechetical Instruction League ADZU.jpg",
    link: "https://www.facebook.com/adzuacil",
  },
  {
    id: "christian-life-community-adzu",
    name: "Christian Life Community (CLC)",
    category: "Faith and Formation",
    description:
      "A Jesuit-inspired faith community that accompanies students in their spiritual journey through prayer, discernment, and apostolic service grounded in Ignatian spirituality.",
    logo: "/logos/Christian Life Community - Ateneo de Zamboanga University .jpg",
    link: "https://www.facebook.com/profile.php?id=61551053695948",
  },
  {
    id: "cfc-youth-for-christ-adzu",
    name: "CFC Youth For Christ",
    category: "Faith and Formation",
    description:
      "A faith-based youth community rooted in the Couples for Christ charism, fostering spiritual growth, discipleship, and Christian living among students.",
    logo: "/logos/CFC Youth For Christ - ADZU Campus Based.jpg",
    link: "https://www.facebook.com/profile.php?id=61550069305588",
  },
  {
    id: "muslim-students-association-adzu",
    name: "Muslim Students' Association – AdZU",
    category: "Faith and Formation",
    description:
      "The only officially recognized Muslim youth organization at AdZU, providing a safe haven for Muslim students to freely express their faith and fostering harmony and inter-religious dialogue on campus.",
    logo: "/logos/Muslim Students Association - Ateneo de Zamboanga University.jpg",
    link: "https://www.facebook.com/msaadzu",
  },
  {
    id: "psalm-adzu",
    name: "Philippine Student Alliance Law Movement (PSALM AdZU)",
    category: "Faith and Formation",
    description:
      "A praise and worship community that leads the student body in musical ministry, fostering spiritual growth and a deeper relationship with God through song and service.",
    logo: "/logos/Psalm AdZU .jpg",
  },
  {
    id: "society-of-the-knights-of-ignatius",
    name: "Society of the Knights of Ignatius (SKI)",
    category: "Faith and Formation",
    description:
      "The official organization of altar servers of AdZU, forming students into servant-leaders through liturgical ministry and Ignatian spirituality.",
    logo: "/logos/Society of the Knights of Ignatius - ADZU College.jpg",
    link: "https://www.facebook.com/profile.php?id=100085256014063",
  },
  {
    id: "salt-community",
    name: "SELF-ACTUALIZATION AND LEADERSHIP TRAINING (SALT) Community",
    category: "Faith and Formation",
    description:
      "A faith-based leadership formation community fostering self-actualization, discipleship, and servant leadership among students.",
  },
];
