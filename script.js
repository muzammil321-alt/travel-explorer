/**
 * Explore Pakistan – Main JavaScript
 * Handles: Navigation, Destinations, Services, Gallery,
 *          Testimonials, Booking, FAQ, Security, Animations
 */

'use strict';

/* =====================================================
   SECURITY UTILITIES
   ===================================================== */
const Security = {
  /** Escape HTML to prevent XSS */
  escape(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  },
  /** Sanitize input – strip dangerous chars */
  sanitize(str) {
    return String(str)
      .replace(/[<>'"`;]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .slice(0, 1000);
  },
  /** Generate CSRF token */
  generateCSRF() {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  },
  /** Rate limiter – returns false if rate limited */
  rateLimiter: (() => {
    const map = {};
    return function (key, maxAttempts = 5, windowMs = 60000) {
      const now = Date.now();
      if (!map[key]) map[key] = [];
      map[key] = map[key].filter(t => now - t < windowMs);
      if (map[key].length >= maxAttempts) return false;
      map[key].push(now);
      return true;
    };
  })()
};

/* Init CSRF tokens */
document.querySelectorAll('[name="_csrf"]').forEach(el => {
  el.value = Security.generateCSRF();
});

/* =====================================================
   DATA
   ===================================================== */
const DESTINATIONS = [
  {
    id: 'hunza',
    name: 'Hunza Valley',
    region: 'Gilgit-Baltistan',
    tagline: 'The Valley of Kings',
    desc: 'Hunza Valley is a breathtaking highland valley nestled amidst the Karakoram mountains, known for its dramatic scenery, ancient forts, and warm hospitality.',
    image: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80',
      'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
      'https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=800&q=80',
    ],
    bestTime: 'April – October',
    attractions: ['Baltit Fort', 'Attabad Lake', 'Rakaposhi View', 'Eagle\'s Nest'],
    cost: 'PKR 25,000 – 60,000',
    duration: '5–7 Days',
    altitude: '2,438 m',
    weather: 'Cool summers (15–25°C), Cold winters (-5 to 5°C)',
    hotels: ['Serena Hotel Hunza', 'Eagle\'s Nest Hotel', 'Old Hunza Inn', 'Darbar Hotel'],
    transport: 'Fly to Gilgit, then 2-hour drive via Karakoram Highway',
    todo: ['Trek to Ultar Meadows', 'Visit Cherry Blossom Festival (April)', 'Boat ride on Attabad Lake', 'Explore Altit Fort', 'Photography at Rakaposhi Viewpoint'],
    tips: ['Book accommodations 2–3 months in advance for peak season', 'Carry warm clothing even in summer', 'Respect local culture and dress modestly', 'Acclimatize for 1–2 days before trekking'],
  },
  {
    id: 'skardu',
    name: 'Skardu',
    region: 'Gilgit-Baltistan',
    tagline: 'Gateway to K2',
    desc: 'Skardu is a high-altitude plateau surrounded by some of the world\'s tallest mountains. Home to the world\'s second highest peak, K2, it\'s a paradise for mountaineers and adventure seekers.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=800&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    ],
    bestTime: 'May – September',
    attractions: ['Deosai Plains', 'Sheosar Lake', 'Skardu Fort', 'Satpara Lake'],
    cost: 'PKR 30,000 – 80,000',
    duration: '6–8 Days',
    altitude: '2,228 m',
    weather: 'Warm summers (20–30°C), Harsh winters',
    hotels: ['Shangrila Resort', 'Mashabrum Hotel', 'K2 Motel', 'Desert Inn'],
    transport: 'Daily PIA flights from Islamabad (weather dependent), or 18-hour road trip',
    todo: ['Drive through Deosai National Park', 'Camp at Sheosar Lake', 'Visit Kachura Lake', 'Paragliding over Skardu', 'Shopping at local bazaars'],
    tips: ['Book flights early – cancellations are common due to weather', 'The Deosai Plains are best visited July–September', 'Hire a local guide for trekking', 'Keep emergency cash – ATMs are unreliable'],
  },
  {
    id: 'fairy-meadows',
    name: 'Fairy Meadows',
    region: 'Gilgit-Baltistan',
    tagline: 'Heaven on Earth',
    desc: 'Fairy Meadows is a lush alpine meadow at the base of Nanga Parbat – the world\'s 9th highest mountain. The stunning green pastures against the snow-capped giants make this one of Pakistan\'s most iconic sights.',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
      'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80',
    ],
    bestTime: 'May – September',
    attractions: ['Nanga Parbat Base Camp', 'Raikot Glacier', 'Sunset Views', 'Stargazing'],
    cost: 'PKR 15,000 – 35,000',
    duration: '3–5 Days',
    altitude: '3,300 m',
    weather: 'Cool and pleasant in summer (10–20°C)',
    hotels: ['Fairy Meadows Huts (Raikot Serai)', 'Wooden Cottages', 'Basic Camps', 'Forest Cottages'],
    transport: 'Drive to Raikot Bridge, then 3-hour jeep ride + 3-hour trek',
    todo: ['Trek to Nanga Parbat Base Camp', 'Star gazing at night', 'Photography of Nanga Parbat', 'Wildflower walks', 'Campfire evenings'],
    tips: ['Physical fitness required for the hike', 'Bring your own sleeping bag', 'No electricity or mobile network', 'Carry enough cash and supplies', 'Register with local authorities before trekking'],
  },
  {
    id: 'naran',
    name: 'Naran Kaghan',
    region: 'Khyber Pakhtunkhwa',
    tagline: 'The Valley of Waterfalls',
    desc: 'Naran Kaghan is a picturesque valley along the Kunhar River, dotted with alpine meadows, crystal-clear lakes, and thundering waterfalls. It\'s one of Pakistan\'s most popular family destinations.',
    image: 'https://images.unsplash.com/photo-1585016495481-91613b9c50ef?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1585016495481-91613b9c50ef?w=600&q=80',
      'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80',
    ],
    bestTime: 'June – September',
    attractions: ['Lake Saif-ul-Malook', 'Babusar Pass', 'Lulusar Lake', 'Ansoo Lake'],
    cost: 'PKR 18,000 – 45,000',
    duration: '4–6 Days',
    altitude: '2,409 m',
    weather: 'Pleasant summers (12–22°C), closed in winter due to snow',
    hotels: ['Pine Park Hotel', 'Lalazar Hotel', 'River Song Hotel', 'Crown Hotel Naran'],
    transport: 'Drive from Islamabad via Mansehra (5–6 hours)',
    todo: ['Sunrise/sunset at Lake Saif-ul-Malook', 'Horse-riding to Ansoo Lake', 'White-water rafting', 'Visit Sharan Forest', 'Photography at Babusar Top'],
    tips: ['July–August is peak season – book early', 'Road can be congested in summer', 'Night temperatures drop sharply', 'Take local 4x4 jeep from Naran to Babusar'],
  },
  {
    id: 'swat',
    name: 'Swat Valley',
    region: 'Khyber Pakhtunkhwa',
    tagline: 'Switzerland of the East',
    desc: 'Swat Valley, often called the "Switzerland of the East," is a lush green paradise with verdant forests, rushing rivers, and ancient Buddhist ruins. A perfect blend of nature and history.',
    image: 'https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=600&q=80',
      'https://images.unsplash.com/photo-1585016495481-91613b9c50ef?w=600&q=80',
      'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80',
    ],
    bestTime: 'March – October',
    attractions: ['Mingora City', 'Malam Jabba Ski Resort', 'Swat River', 'Udegram Ruins'],
    cost: 'PKR 12,000 – 30,000',
    duration: '3–5 Days',
    altitude: '980 m',
    weather: 'Warm summers (25–35°C), snowy winters for skiing',
    hotels: ['Pearl Continental Swat', 'Serena Hotel Swat', 'Rock City Hotel', 'Madyan Hotel'],
    transport: 'Drive from Islamabad via Mardan (4–5 hours) or from Peshawar (2 hours)',
    todo: ['Skiing at Malam Jabba (Nov–Feb)', 'Trout fishing in Swat River', 'Visit Buddhist archaeological sites', 'Explore Fizagat Park', 'Shop for local handicrafts and gemstones'],
    tips: ['Check road conditions before travel', 'Local transportation (wagons) very affordable', 'Try the local trout fish restaurants', 'Swat has good mobile network coverage'],
  },
  {
    id: 'neelum',
    name: 'Neelum Valley',
    region: 'Azad Kashmir',
    tagline: 'The Blue River Valley',
    desc: 'Neelum Valley is a jewel of Azad Kashmir, with its turquoise Neelum River, dense pine forests, and snow-capped peaks. The 200km-long valley is one of the most scenic drives in all of South Asia.',
    image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600&q=80',
      'https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=600&q=80',
      'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800&q=80',
    ],
    bestTime: 'May – October',
    attractions: ['Shounter Lake', 'Ratti Gali Lake', 'Kutton Waterfall', 'Arang Kel'],
    cost: 'PKR 20,000 – 50,000',
    duration: '4–6 Days',
    altitude: '1,500–4,200 m',
    weather: 'Cool summers (15–25°C), heavy snowfall in winter',
    hotels: ['Pine Huts Keran', 'PTDC Motel Kel', 'Shounter View Hotel', 'Forest Rest Houses'],
    transport: 'Drive from Muzaffarabad (2–6 hours depending on destination)',
    todo: ['Trek to Ratti Gali Lake', 'Chair-lift ride to Arang Kel', 'Camping by Neelum River', 'Visit Shounter Valley', 'Bird watching and wildlife photography'],
    tips: ['NOC required for areas near the Line of Control', 'Carry Pakistani ID card or passport', 'Book accommodation early in peak season', 'Mobile connectivity limited beyond Kel'],
  },
  {
    id: 'gwadar',
    name: 'Gwadar Beach',
    region: 'Balochistan',
    tagline: 'The Pearl of Arabia',
    desc: 'Gwadar is Pakistan\'s crown jewel on the Arabian Sea. With its pristine beaches, dramatic cliffs, and rich marine life, it\'s an emerging destination unlike anywhere else in Pakistan. The CPEC development is transforming it into a world-class port city.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
    ],
    bestTime: 'October – March',
    attractions: ['Hammerhead (Koh-e-Batil)', 'Ormara Beach', 'Gwadar Port', 'Omara'],
    cost: 'PKR 25,000 – 60,000',
    duration: '3–5 Days',
    altitude: 'Sea level',
    weather: 'Hot in summer (35–44°C), mild winters (20–28°C)',
    hotels: ['Pearl Continental Gwadar', 'Gwadar Marriott (upcoming)', 'City Gate Hotel', 'Marina Hotel'],
    transport: 'Fly from Karachi (1 hour) or Islamabad (2 hours), or drive from Karachi (12+ hours)',
    todo: ['Sunrise at Hammerhead', 'Deep-sea fishing', 'Visit fish harbor and market', 'Swimming and water sports', 'Photography at Kund Malir Beach (en route)'],
    tips: ['Visit in winter for best weather', 'Bring sunscreen and hats', 'Fresh seafood is incredibly cheap and delicious', 'NOC may be required for some areas – check with local authorities'],
  },
  {
    id: 'ziarat',
    name: 'Ziarat',
    region: 'Balochistan',
    tagline: 'City of Juniper Forests',
    desc: 'Ziarat is a serene mountain retreat in the heart of Balochistan, home to one of the world\'s largest and oldest juniper forests. At 2,449m, its cool climate, colonial heritage, and silence make it a hidden gem.',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80',
    ],
    bestTime: 'April – September',
    attractions: ['Juniper Forest', 'Quaid-e-Azam Residency', 'Ziarat Valley', 'Prospect Point'],
    cost: 'PKR 8,000 – 20,000',
    duration: '2–3 Days',
    altitude: '2,449 m',
    weather: 'Cool summers (12–22°C), cold snowy winters',
    hotels: ['Ziarat Residency', 'PTDC Motel', 'Juniper Hotel', 'Green View Hotel'],
    transport: 'Drive from Quetta (3–4 hours, 130km)',
    todo: ['Walk through ancient juniper forests', 'Visit Quaid-e-Azam Residency Museum', 'Trekking to Prospect Point', 'Experience snow in winter', 'Apple and cherry orchards'],
    tips: ['Best day trip or weekend from Quetta', 'Weather can be unpredictable – carry layers', 'Winter road can be slippery', 'A hidden gem with very few foreign tourists'],
  },
];

const SERVICES = [
  { icon: 'fas fa-suitcase-rolling', title: 'Tour Packages', desc: 'All-inclusive tour packages to every corner of Pakistan, from budget to luxury options.', price: 'From PKR 15,000/person', color: '#2d6a4f' },
  { icon: 'fas fa-hotel', title: 'Hotel Booking', desc: 'Book verified hotels, guesthouses and camps across all destinations with best price guarantee.', price: 'From PKR 2,500/night', color: '#1a6fa0' },
  { icon: 'fas fa-car', title: 'Transport Rental', desc: '4x4 jeeps, coasters, and luxury SUVs with experienced drivers for mountain roads.', price: 'From PKR 5,000/day', color: '#e8a020' },
  { icon: 'fas fa-users', title: 'Family Tours', desc: 'Safe, comfortable, and fun family packages designed for all ages including children.', price: 'From PKR 20,000/family', color: '#6f42c1' },
  { icon: 'fas fa-mountain', title: 'Adventure Tours', desc: 'Trekking, mountaineering, rock climbing, river rafting, and paragliding experiences.', price: 'From PKR 10,000/person', color: '#e74c3c' },
  { icon: 'fas fa-briefcase', title: 'Corporate Tours', desc: 'Team retreats, conferences, and corporate travel packages tailored for businesses.', price: 'Custom pricing', color: '#20c997' },
  { icon: 'fas fa-user-tie', title: 'Tour Guide Services', desc: 'Certified, multilingual local guides who know every trail, pass, and cultural site.', price: 'From PKR 2,000/day', color: '#fd7e14' },
  { icon: 'fas fa-map-marked-alt', title: 'Custom Planning', desc: 'Tell us your dream trip. We\'ll plan every detail – routes, stays, activities, and backup plans.', price: 'Free consultation', color: '#0dcaf0' },
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=500&q=80', alt: 'Hunza Valley panorama', tall: false },
  { src: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=500&q=80', alt: 'K2 mountain peak', tall: true },
  { src: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=500&q=80', alt: 'Attabad Lake', tall: false },
  { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80', alt: 'Skardu landscape', tall: false },
  { src: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&q=80', alt: 'Fairy Meadows with Nanga Parbat', tall: true },
  { src: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=500&q=80', alt: 'Neelum Valley river', tall: false },
  { src: 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=500&q=80', alt: 'Green valley Pakistan', tall: false },
  { src: 'https://images.unsplash.com/photo-1585016495481-91613b9c50ef?w=500&q=80', alt: 'Naran Kaghan valley', tall: true },
  { src: 'https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=500&q=80', alt: 'Swat Valley forest', tall: false },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80', alt: 'Gwadar beach sunset', tall: false },
  { src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=500&q=80', alt: 'Ziarat juniper forest', tall: false },
  { src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80', alt: 'Arabian Sea coast', tall: true },
];

const TESTIMONIALS = [
  {
    text: 'The Hunza tour exceeded every expectation. From the moment we landed in Gilgit to our last night at Eagle\'s Nest watching the stars, every detail was perfectly arranged. Explore Pakistan truly knows their country.',
    name: 'Ahmed Raza',
    location: 'Lahore, Pakistan',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    text: 'We did the Naran Kaghan family package and our kids still talk about it. The Lake Saif-ul-Malook sunrise was magical. Professional guides, clean accommodation, and always on time. Highly recommended!',
    name: 'Fatima Malik',
    location: 'Karachi, Pakistan',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    text: 'As a solo female traveler, safety was my top concern. Explore Pakistan\'s team made me feel completely secure throughout my Neelum Valley trip. The female guide was incredibly knowledgeable and warm.',
    name: 'Sarah Johnson',
    location: 'London, UK',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    text: 'The K2 base camp trek organized by Explore Pakistan was life-changing. Our guide had summited several 8000m peaks. The logistics were flawless – we could focus entirely on the mountain.',
    name: 'Marco Bianchi',
    location: 'Milan, Italy',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    text: 'The Swat Valley and Fairy Meadows trip was incredible value for money. Beautiful places, great food, and a guide who knew the history of every ruin and mountain. Will definitely book again!',
    name: 'Usman Sheikh',
    location: 'Islamabad, Pakistan',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    text: 'Corporate retreat in Skardu – our whole team of 25 loved it! Explore Pakistan handled everything from transport to team activities. Deosai Plains was absolutely surreal. 10/10 experience.',
    name: 'Nida Hussain',
    location: 'Dubai, UAE',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=7',
  },
];

const FAQS = [
  {
    q: 'Is Pakistan safe to travel?',
    a: 'Pakistan is significantly safer than most Western media portrays. Millions of domestic and international tourists visit every year without incident. Tourist areas in the north (Hunza, Skardu, Swat) are extremely welcoming and safe. We monitor conditions closely and always provide up-to-date safety guidance to our travelers.',
  },
  {
    q: 'What is the best time to visit Pakistan?',
    a: 'It depends on the region. For the northern mountains (Hunza, Skardu, Fairy Meadows), April–October is ideal. For beach destinations like Gwadar, October–March is best. Swat and Naran are wonderful June–September. Year-round destinations include Lahore, Islamabad, and Karachi.',
  },
  {
    q: 'Do I need a visa to travel to Pakistan?',
    a: 'Pakistan offers visa-on-arrival and e-visa facilities to citizens of over 50 countries. Visitors from most Western countries, GCC nations, and neighboring countries can get a tourist e-visa online. We recommend checking the Pakistan government\'s official portal for the latest visa requirements.',
  },
  {
    q: 'What should I pack for a trip to northern Pakistan?',
    a: 'Pack layers – even in summer, nights can be cold at high altitudes. Essentials include: warm jacket, trekking shoes, sunscreen, sunglasses, headlamp, first-aid kit, water purification tablets, and modest clothing. We provide a detailed packing list after booking.',
  },
  {
    q: 'How do I book a tour with Explore Pakistan?',
    a: 'Use our booking form on this page, call us directly, or WhatsApp us. After receiving your request, our team will contact you within 24 hours to confirm availability, customize the itinerary, and process payment. We accept bank transfer, Easypaisa, JazzCash, and credit cards.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Free cancellation up to 14 days before departure. 50% refund for cancellations 7–13 days before. No refund within 7 days, but you can reschedule at no extra cost. Travel insurance is strongly recommended – we can connect you with our insurance partners.',
  },
  {
    q: 'Do you cater to foreign tourists?',
    a: 'Absolutely! We have guided English, Urdu, and Chinese-speaking tourists. Our guides are trained in English and we handle all NOC (No Objection Certificate) paperwork required for foreign nationals visiting certain border areas.',
  },
  {
    q: 'Is food halal in Pakistan?',
    a: 'Yes, virtually all food in Pakistan is halal. Pakistani cuisine is diverse and delicious. Vegetarian options are available everywhere. Remote northern areas may have limited menu options, so we recommend informing us of any dietary requirements when booking.',
  },
];

/* =====================================================
   NAVIGATION
   ===================================================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll behavior
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });

  // Back to top
  const btt = document.getElementById('backToTop');
  btt.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// Mobile toggle
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =====================================================
   DESTINATIONS
   ===================================================== */
function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  if (!grid) return;

  grid.innerHTML = DESTINATIONS.map(dest => `
    <article class="dest-card reveal" data-id="${Security.escape(dest.id)}" tabindex="0" role="button" aria-label="View details for ${Security.escape(dest.name)}">
      <div class="dest-card-img">
        <img src="${Security.escape(dest.image)}" alt="${Security.escape(dest.name)} landscape" loading="lazy" />
        <span class="dest-badge">${Security.escape(dest.region)}</span>
      </div>
      <div class="dest-card-body">
        <h3>${Security.escape(dest.name)}</h3>
        <p>${Security.escape(dest.desc.substring(0, 110))}…</p>
        <div class="dest-meta">
          <span class="dest-meta-item"><i class="fas fa-calendar"></i>${Security.escape(dest.bestTime)}</span>
          <span class="dest-meta-item"><i class="fas fa-clock"></i>${Security.escape(dest.duration)}</span>
        </div>
        <p class="dest-cost"><i class="fas fa-wallet"></i> ${Security.escape(dest.cost)}</p>
        <button class="btn btn-outline view-dest-btn">
          <i class="fas fa-compass"></i> View Details
        </button>
      </div>
    </article>
  `).join('');

  // Event listeners
  grid.querySelectorAll('.dest-card').forEach(card => {
    const open = () => openDestModal(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

/* =====================================================
   DESTINATION MODAL
   ===================================================== */
const destModal = document.getElementById('destModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');
let activeTab = 'guide';

function openDestModal(id) {
  const dest = DESTINATIONS.find(d => d.id === id);
  if (!dest) return;
  activeTab = 'guide';

  modalContent.innerHTML = `
    <div class="modal-gallery">
      ${dest.images.map((img, i) => `<img src="${Security.escape(img)}" alt="${Security.escape(dest.name)} photo ${i + 1}" loading="lazy" />`).join('')}
    </div>
    <div class="modal-content">
      <h2 id="modalTitle">${Security.escape(dest.name)}</h2>
      <p style="color:var(--grey-600);font-size:.95rem;margin-bottom:4px;">${Security.escape(dest.tagline)} · ${Security.escape(dest.region)}</p>
      <p style="color:var(--grey-600);font-size:.9rem;margin-bottom:16px;">${Security.escape(dest.desc)}</p>

      <div class="modal-info-grid">
        <div class="modal-info-card"><i class="fas fa-calendar-alt"></i><strong>Best Time</strong><span>${Security.escape(dest.bestTime)}</span></div>
        <div class="modal-info-card"><i class="fas fa-clock"></i><strong>Duration</strong><span>${Security.escape(dest.duration)}</span></div>
        <div class="modal-info-card"><i class="fas fa-mountain"></i><strong>Altitude</strong><span>${Security.escape(dest.altitude)}</span></div>
        <div class="modal-info-card"><i class="fas fa-wallet"></i><strong>Estimated Cost</strong><span>${Security.escape(dest.cost)}</span></div>
      </div>

      <div class="modal-tabs" role="tablist">
        <button class="modal-tab active" data-tab="guide" role="tab" aria-selected="true">Travel Guide</button>
        <button class="modal-tab" data-tab="stay" role="tab" aria-selected="false">Where to Stay</button>
        <button class="modal-tab" data-tab="todo" role="tab" aria-selected="false">Things to Do</button>
        <button class="modal-tab" data-tab="tips" role="tab" aria-selected="false">Travel Tips</button>
      </div>

      <div class="modal-tab-content active" data-panel="guide">
        <h4><i class="fas fa-cloud-sun"></i> Weather</h4>
        <p>${Security.escape(dest.weather)}</p>
        <h4><i class="fas fa-car"></i> Getting There</h4>
        <p>${Security.escape(dest.transport)}</p>
        <h4><i class="fas fa-star"></i> Popular Attractions</h4>
        <ul>${dest.attractions.map(a => `<li>${Security.escape(a)}</li>`).join('')}</ul>
      </div>

      <div class="modal-tab-content" data-panel="stay">
        <h4><i class="fas fa-bed"></i> Recommended Hotels</h4>
        <ul>${dest.hotels.map(h => `<li>${Security.escape(h)}</li>`).join('')}</ul>
        <p style="margin-top:12px;font-size:.85rem;color:var(--grey-400);">Contact us for special hotel rates exclusively for Explore Pakistan customers.</p>
      </div>

      <div class="modal-tab-content" data-panel="todo">
        <h4><i class="fas fa-hiking"></i> Activities & Experiences</h4>
        <ul>${dest.todo.map(t => `<li>${Security.escape(t)}</li>`).join('')}</ul>
      </div>

      <div class="modal-tab-content" data-panel="tips">
        <h4><i class="fas fa-lightbulb"></i> Insider Tips</h4>
        <ul>${dest.tips.map(t => `<li>${Security.escape(t)}</li>`).join('')}</ul>
      </div>

      <div style="margin-top:28px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="#booking" class="btn btn-primary" onclick="closeDest()">
          <i class="fas fa-compass"></i> Book This Trip
        </a>
        <a href="#contact" class="btn btn-outline" onclick="closeDest()">
          <i class="fas fa-comment"></i> Ask a Question
        </a>
      </div>
    </div>
  `;

  // Tab switching
  modalContent.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      modalContent.querySelectorAll('.modal-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      modalContent.querySelectorAll('.modal-tab-content').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      modalContent.querySelector(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });

  destModal.hidden = false;
  destModal.focus();
  document.body.style.overflow = 'hidden';
}

window.closeDest = function () {
  destModal.hidden = true;
  document.body.style.overflow = '';
};

modalClose.addEventListener('click', closeDest);
destModal.addEventListener('click', e => { if (e.target === destModal) closeDest(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !destModal.hidden) closeDest(); });

/* =====================================================
   SERVICES
   ===================================================== */
function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card reveal">
      <div class="service-icon" style="background:${Security.escape(s.color)}18">
        <i class="${Security.escape(s.icon)}" style="color:${Security.escape(s.color)}"></i>
      </div>
      <h3>${Security.escape(s.title)}</h3>
      <p>${Security.escape(s.desc)}</p>
      <span class="service-price">${Security.escape(s.price)}</span>
      <a href="#booking" class="btn btn-outline">
        <i class="fas fa-calendar-check"></i> Book Now
      </a>
    </div>
  `).join('');
}

/* =====================================================
   GALLERY
   ===================================================== */
let currentGalleryIdx = 0;

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = GALLERY_IMAGES.map((img, i) => `
    <div class="gallery-item reveal" data-idx="${i}" style="${img.tall ? 'margin-bottom:16px' : ''}" tabindex="0" role="button" aria-label="View ${Security.escape(img.alt)}">
      <img src="${Security.escape(img.src)}" alt="${Security.escape(img.alt)}" loading="lazy" style="${img.tall ? 'height:320px;object-fit:cover' : 'height:200px;object-fit:cover'}" />
      <div class="gallery-zoom"><i class="fas fa-search-plus"></i></div>
    </div>
  `).join('');

  grid.querySelectorAll('.gallery-item').forEach(item => {
    const open = () => openLightbox(parseInt(item.dataset.idx));
    item.addEventListener('click', open);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
}

const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');

function openLightbox(idx) {
  currentGalleryIdx = idx;
  const img = GALLERY_IMAGES[idx];
  lbImg.src = img.src.replace('w=500', 'w=1200');
  lbImg.alt = img.alt;
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  openLightbox(currentGalleryIdx);
});
document.getElementById('lbNext').addEventListener('click', () => {
  currentGalleryIdx = (currentGalleryIdx + 1) % GALLERY_IMAGES.length;
  openLightbox(currentGalleryIdx);
});
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
});

/* =====================================================
   TESTIMONIALS CAROUSEL
   ===================================================== */
let currentSlide = 0;
const PER_SLIDE = 3;

function renderTestimonials() {
  const carousel = document.getElementById('testimonialsCarousel');
  const dots = document.getElementById('carouselDots');
  if (!carousel || !dots) return;

  const slides = [];
  for (let i = 0; i < TESTIMONIALS.length; i += PER_SLIDE) {
    slides.push(TESTIMONIALS.slice(i, i + PER_SLIDE));
  }

  carousel.innerHTML = `
    <div class="testimonials-track" id="testimTrack">
      ${slides.map(slide => `
        <div class="testimonial-slide">
          <div class="testimonials-inner">
            ${slide.map(t => `
              <div class="testimonial-card">
                <div class="t-stars">${'<i class="fas fa-star"></i>'.repeat(t.rating)}</div>
                <p class="t-text">"${Security.escape(t.text)}"</p>
                <div class="t-author">
                  <img class="t-avatar" src="${Security.escape(t.avatar)}" alt="${Security.escape(t.name)}" loading="lazy" />
                  <div>
                    <div class="t-name">${Security.escape(t.name)}</div>
                    <div class="t-location"><i class="fas fa-map-marker-alt" style="color:var(--green-mid);font-size:.75rem"></i> ${Security.escape(t.location)}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  dots.innerHTML = slides.map((_, i) => `
    <button class="cdot ${i === 0 ? 'active' : ''}" data-slide="${i}" role="tab" aria-label="Go to slide ${i + 1}" aria-selected="${i === 0}"></button>
  `).join('');

  dots.querySelectorAll('.cdot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.slide)));
  });

  // Auto-advance
  let autoplay = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);
  });
}

function goToSlide(idx) {
  currentSlide = idx;
  const track = document.getElementById('testimTrack');
  if (track) track.style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.cdot').forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
    dot.setAttribute('aria-selected', i === idx);
  });
}

/* =====================================================
   FAQ
   ===================================================== */
function renderFAQ() {
  const list = document.getElementById('faqList');
  if (!list) return;

  list.innerHTML = FAQS.map((faq, i) => `
    <div class="faq-item reveal" id="faq-${i}">
      <div class="faq-q" role="button" tabindex="0" aria-expanded="false" aria-controls="faq-a-${i}">
        <span>${Security.escape(faq.q)}</span>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-a" id="faq-a-${i}" role="region">
        <p>${Security.escape(faq.a)}</p>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const toggle = () => {
      const isOpen = item.classList.toggle('open');
      q.setAttribute('aria-expanded', isOpen);
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  });
}

/* =====================================================
   FORM VALIDATION & SUBMISSION
   ===================================================== */
function validateField(input) {
  const group = input.closest('.form-group');
  const errorEl = group?.querySelector('.field-error');
  let error = '';

  const value = input.value.trim();

  if (input.required && !value) {
    error = 'This field is required.';
  } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error = 'Please enter a valid email address.';
  } else if (input.type === 'tel' && value && !/^[\d\s\+\-\(\)]{7,20}$/.test(value)) {
    error = 'Please enter a valid phone number.';
  } else if (input.minLength > 0 && value && value.length < input.minLength) {
    error = `Must be at least ${input.minLength} characters.`;
  } else if (input.type === 'date' && value) {
    const selected = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) error = 'Please select a future date.';
  }

  if (errorEl) errorEl.textContent = error;
  input.classList.toggle('error', !!error);
  return !error;
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('input[required],select[required],textarea[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

// Set minimum date to today
const dateInputs = document.querySelectorAll('input[type="date"]');
dateInputs.forEach(inp => {
  const today = new Date().toISOString().split('T')[0];
  inp.min = today;
});

// Booking form
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

if (bookingForm) {
  bookingForm.querySelectorAll('input,select,textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  bookingForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!Security.rateLimiter('booking', 3, 60000)) {
      alert('Too many submissions. Please wait a minute before trying again.');
      return;
    }

    if (!validateForm(bookingForm)) return;

    // Sanitize all values
    const data = {};
    new FormData(bookingForm).forEach((val, key) => {
      data[key] = Security.sanitize(val);
    });

    console.log('Booking data (sanitized):', data);

    // Simulate submission
    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      bookingForm.hidden = true;
      bookingSuccess.hidden = false;
    }, 1500);
  });
}

document.getElementById('bookingReset')?.addEventListener('click', () => {
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  const btn = bookingForm.querySelector('button[type="submit"]');
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Booking Request';
});

// Contact form
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.querySelectorAll('input,textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!Security.rateLimiter('contact', 3, 60000)) {
      alert('Too many submissions. Please wait a minute before trying again.');
      return;
    }

    if (!validateForm(contactForm)) return;

    const data = {};
    new FormData(contactForm).forEach((val, key) => {
      data[key] = Security.sanitize(val);
    });

    console.log('Contact data (sanitized):', data);

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      contactSuccess.hidden = false;
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }, 1200);
  });
}

/* =====================================================
   SCROLL REVEAL ANIMATION
   ===================================================== */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* Lazy loading images */
function initLazyLoad() {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          io.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => io.observe(img));
  }
}

/* =====================================================
   SMOOTH SCROLL FOR CTA
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* =====================================================
   INIT
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderDestinations();
  renderServices();
  renderGallery();
  renderTestimonials();
  renderFAQ();
  initLazyLoad();

  // Delay reveal init to allow render
  requestAnimationFrame(() => {
    requestAnimationFrame(initScrollReveal);
  });
});
