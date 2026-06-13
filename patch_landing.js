const fs = require('fs');

const enPath = 'src/messages/en.json';
const idPath = 'src/messages/id.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const idData = JSON.parse(fs.readFileSync(idPath, 'utf8'));

const newStrings = {
  News: {
    news_articles: "News & Articles",
    view_journal: "View Journal",
    no_news_yet: "No news yet",
    check_back_later: "Check back later for updates and insights."
  },
  Projects: {
    projects: "Projects",
    past_experiences: "Past Experiences",
    projects_description: "A curated selection of the digital products and web experiences we've crafted.",
    no_projects_yet: "No projects yet",
    projects_will_appear_here: "Projects will appear here once they are published from the dashboard."
  },
  Services: {
    expertise: "Expertise",
    services: "Services",
    services_description: "Clean, purposeful design and solid engineering to genuinely empower your business to stand out.",
    no_services_yet: "No services yet",
    services_will_appear_here: "Services will appear here once they are published from the dashboard."
  },
  FaqSection: {
    frequently_asked: "Frequently Asked",
    question: "Question",
    faq_description: "Everything you need to know about our process, pricing, and how we deliver award-winning digital experiences."
  },
  Hero: {
    portfolio_showcase: "Portfolio showcase"
  }
};

const newStringsId = {
  News: {
    news_articles: "Berita & Artikel",
    view_journal: "Lihat Jurnal",
    no_news_yet: "Belum ada berita",
    check_back_later: "Periksa kembali nanti untuk pembaruan dan wawasan."
  },
  Projects: {
    projects: "Proyek",
    past_experiences: "Pengalaman Lalu",
    projects_description: "Pilihan kurasi dari produk digital dan pengalaman web yang telah kami buat.",
    no_projects_yet: "Belum ada proyek",
    projects_will_appear_here: "Proyek akan muncul di sini setelah diterbitkan dari dasbor."
  },
  Services: {
    expertise: "Keahlian",
    services: "Layanan",
    services_description: "Desain yang bersih, bermakna, dan pengembangan yang solid untuk memberdayakan bisnis Anda agar menonjol.",
    no_services_yet: "Belum ada layanan",
    services_will_appear_here: "Layanan akan muncul di sini setelah diterbitkan dari dasbor."
  },
  FaqSection: {
    frequently_asked: "Pertanyaan yang Sering",
    question: "Diajukan",
    faq_description: "Semua yang perlu Anda ketahui tentang proses, penetapan harga, dan cara kami memberikan pengalaman digital peraih penghargaan."
  },
  Hero: {
    portfolio_showcase: "Pameran portofolio"
  }
};

Object.assign(enData, newStrings);
Object.assign(idData, newStringsId);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2) + '\n');
fs.writeFileSync(idPath, JSON.stringify(idData, null, 2) + '\n');
