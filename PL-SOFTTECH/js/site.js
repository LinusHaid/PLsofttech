document.addEventListener('DOMContentLoaded', function () {

  // Strip .html from the address bar so URLs look clean
  if (window.location.pathname.endsWith('.html')) {
    let cleanPath = window.location.pathname.slice(0, -5);
    if (cleanPath.endsWith('/index')) cleanPath = cleanPath.slice(0, -6) || '/';
    history.replaceState(null, '', cleanPath + location.search + location.hash);
  }

  // Mark the right nav link active based on the current page
  let currentFile = location.pathname.split('/').pop() || 'home.html';
  if (!currentFile.includes('.')) currentFile += '.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').split('?')[0].split('#')[0];
    link.classList.toggle('active', href === currentFile);
  });

  // Scroll to contact form if URL has #contact-form
  if (location.hash === '#contact-form') {
    setTimeout(() => {
      const target = document.getElementById('contact-form');
      const navbar = document.querySelector('.navbar');
      if (!target) return;
      const offset = (navbar ? navbar.offsetHeight : 80) + 16;
      window.scrollTo({ top: target.getBoundingClientRect().top + pageYOffset - offset, behavior: 'smooth' });
    }, 200);
  }

  // Sticky navbar shadow on scroll
  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Animated number counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse');
      if (collapse?.classList.contains('show') && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(collapse).hide();
      }
    });
  });

  // Smooth scroll for in-page anchor links
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = (navbar ? navbar.offsetHeight : 80) + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + pageYOffset - offset, behavior: 'smooth' });
    });
  });

  // Scroll-to-top button
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top-btn';
  scrollBtn.setAttribute('aria-label', 'Back to top');
  scrollBtn.innerHTML = '<i class="fa-solid fa-chevron-up" aria-hidden="true"></i>';
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  // ---- Service detail modals ----

  const services = {
    'software-development': {
      title: 'Software Development',
      icon: 'fa-code',
      badge: 'Enterprise & MVP Engineering',
      desc: 'We engineer custom enterprise software built around your exact workflows and business rules. Whether you are building a new SaaS product, launching a startup MVP, or integrating legacy platforms, we provide secure, scalable architectures with robust API backends.',
      bullets: [
        'Custom SaaS Platforms & Enterprise Solutions',
        'Robust API design, development, and third-party integrations',
        'Legacy system modernization and database refactoring',
        'Workflow automation and enterprise resource planning (ERP)'
      ],
      tech: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'API']
    },
    'web-development': {
      title: 'Web Development',
      icon: 'fa-globe',
      badge: 'Modern Web Apps & SaaS Solutions',
      desc: 'Fast, responsive web applications built on modern, maintainable architectures. We focus on speed, performance, SEO optimization, and smooth interface design to convert visitors into customers.',
      bullets: [
        'Single Page Applications (SPAs) and Progressive Web Apps (PWAs)',
        'Custom SaaS portal engineering and dashboard systems',
        'Seamless third-party API integration and microservices',
        'Search Engine Optimization (SEO) & Web Accessibility (WCAG) compliance'
      ],
      tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'SaaS']
    },
    'mobile-app-development': {
      title: 'Mobile App Development',
      icon: 'fa-mobile-screen',
      badge: 'Native & Cross-Platform Apps',
      desc: 'Native and cross-platform Android and iOS apps built for usability, high performance, and speed. We help you build mobile products from MVP prototyping to production-grade SaaS solutions.',
      bullets: [
        'Cross-platform mobile apps using Flutter and React Native',
        'Native iOS (Swift) & Android (Kotlin) development',
        'Offline-first databases and local sync engine integrations',
        'App Store and Google Play deployment, testing, and optimization'
      ],
      tech: ['Flutter', 'Kotlin', 'React Native', 'Swift', 'Firebase', 'MVP']
    },
    'ui-ux-design': {
      title: 'UI/UX Design',
      icon: 'fa-palette',
      badge: 'Research-Led Interface Design',
      desc: 'Research-led user interface and user experience design that improves engagement, clarity, and conversion. We build modern design systems and interactive wireframes for digital products and SaaS platforms.',
      bullets: [
        'User journey mapping, wireframing, and interactive prototyping',
        'Comprehensive UI/UX design systems in Figma',
        'Usability reviews, heuristic evaluations, and A/B test styling',
        'Responsive, mobile-first design tailored for modern SaaS and startups'
      ],
      tech: ['Figma', 'Adobe XD', 'HTML5', 'CSS3', 'SVG Animations', 'Design']
    },
    'cloud-solutions': {
      title: 'Cloud Solutions',
      icon: 'fa-cloud',
      badge: 'DevOps & Scalable Cloud Infrastructure',
      desc: 'Secure cloud infrastructure, deployment automation, and container orchestration. We optimize hosting costs, configure CI/CD pipelines, and design highly available environments for SaaS products.',
      bullets: [
        'AWS, GCP, and Azure cloud migrations and setup',
        'Docker containerization and Kubernetes orchestration',
        'Continuous integration and deployment (CI/CD) pipeline design',
        'Infrastructure as Code (IaC) for automated environment replication'
      ],
      tech: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'SaaS']
    },
    'ai-solutions': {
      title: 'AI Solutions',
      icon: 'fa-brain',
      badge: 'Applied AI & Machine Learning Systems',
      desc: 'AI-powered features, workflow automation, and custom Machine Learning models tailored to your business rules. We build intelligent systems that drive efficiency and automate repetitive processes.',
      bullets: [
        'Large Language Model (LLM) integration and API engineering',
        'Custom ML data pipelines and model training',
        'Natural Language Processing (NLP) for automated text mining',
        'Predictive analytics, intelligent recommendation, and automation'
      ],
      tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenAI API', 'Hugging Face', 'ML']
    },
    'digital-marketing': {
      title: 'Digital Marketing',
      icon: 'fa-bullhorn',
      badge: 'SEO & Performance Campaigns',
      desc: 'SEO optimization, performance marketing campaigns, and content strategy designed to bring the right customers to your product and boost conversion.',
      bullets: [
        'Technical and on-page Search Engine Optimization (SEO)',
        'Google Ads and performance-oriented social campaign design',
        'Conversion Rate Optimization (CRO) and funnel analytics audit',
        'Content marketing strategy and competitive positioning'
      ],
      tech: ['Google Analytics', 'Semrush', 'HubSpot', 'Meta Ads', 'Search Console', 'Digital']
    },
    'it-consulting': {
      title: 'IT Consulting',
      icon: 'fa-comments',
      badge: 'Strategic Architecture & Modernization',
      desc: 'Strategic technology consulting, architecture reviews, and modernization roadmaps for existing systems. We align software engineering decisions with your actual business workflows.',
      bullets: [
        'Comprehensive legacy system evaluation and refactoring planning',
        'Tech stack evaluation, architecture design, and cost analysis',
        'API integration strategy and microservices migration consulting',
        'Security, scalability, and disaster recovery roadmap audits'
      ],
      tech: ['Enterprise Architecture', 'Agile', 'UML', 'API Design', 'Consulting']
    },
    'networking': {
      title: 'Networking',
      icon: 'fa-network-wired',
      badge: 'Enterprise Infrastructure & Security',
      desc: 'We design, deploy, and maintain secure, high-performance networking infrastructures for businesses. From structured cabling and multi-office LAN/WAN setup to enterprise routing, switching, and robust firewall security, we keep your business connected and protected.',
      bullets: [
        'Enterprise LAN/WAN Architecture, Structured Cabling & Topology Design',
        'Router, Switch & Gateway Configuration (Cisco, MikroTik, Juniper)',
        'Next-Gen Firewall Deployment, VPN & Cyber Threat Protection',
        'Wi-Fi Access Point Planning, Mesh Networks & Wireless Controllers',
        'Network Performance Monitoring, Bandwidth Optimization & QoS',
        'Disaster Recovery, Network Redundancy & 24/7 Troubleshooting'
      ],
      tech: ['Cisco', 'MikroTik', 'Fortinet', 'Wireshark', 'TCP/IP', 'VLAN', 'VPN', 'Firewall']
    },
    'data-analytics': {
      title: 'Data Analytics',
      icon: 'fa-chart-pie',
      badge: 'Business Intelligence & Data-Driven Insights',
      desc: 'We transform raw and complex business data into meaningful insights that support smarter decisions and measurable business growth. From data cleaning and analysis to interactive dashboards and business intelligence solutions, we help organizations uncover trends, monitor key metrics, and turn data into actionable strategies.',
      bullets: [
        'Data Cleaning, Transformation & Preparation',
        'Exploratory Data Analysis and Business Performance Analysis',
        'Interactive Power BI & Tableau Dashboards',
        'KPI Reporting and Automated Business Reports',
        'Customer, Sales, Financial & Operational Analytics',
        'Predictive Analytics and Data-Driven Forecasting',
        'Data Integration and Database Analytics'
      ],
      tech: ['Python', 'Pandas', 'NumPy', 'SQL', 'MySQL', 'PostgreSQL', 'Excel', 'Power BI', 'Tableau']
    }
  };

  const serviceKeys = Object.keys(services);
  let activeKey = null;

  function resolveKey(title) {
    const s = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (s.includes('software'))                                   return 'software-development';
    if (s.includes('web'))                                        return 'web-development';
    if (s.includes('mobile') || s.includes('app'))               return 'mobile-app-development';
    if (s.includes('ui') || s.includes('ux') || s.includes('design')) return 'ui-ux-design';
    if (s.includes('cloud'))                                      return 'cloud-solutions';
    if (s.includes('ai') || s.includes('artificial'))            return 'ai-solutions';
    if (s.includes('marketing') || s.includes('digital'))        return 'digital-marketing';
    if (s.includes('consulting') || s.includes('it'))            return 'it-consulting';
    if (s.includes('network'))                                   return 'networking';
    if (s.includes('data') || s.includes('analytics'))            return 'data-analytics';
    return s;
  }

  function buildModal() {
    if (document.getElementById('serviceDetailModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal fade" id="serviceDetailModal" tabindex="-1" aria-labelledby="serviceDetailModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content custom-modal-content">
            <div class="modal-header custom-modal-header border-0 pb-0">
              <span class="eyebrow modal-eyebrow" id="serviceDetailModalLabel">Service Detail</span>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body custom-modal-body pt-3">
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="modal-service-icon" id="modalServiceIcon"><i class="fa-solid fa-code"></i></div>
                <div>
                  <h2 class="modal-title h3 mb-0" id="modalServiceTitle"></h2>
                  <span class="modal-badge-tag" id="modalServiceBadge"></span>
                </div>
              </div>
              <div class="row g-4">
                <div class="col-lg-7">
                  <p class="mb-4" id="modalServiceDesc"></p>
                  <h4 class="modal-deliverables-heading">Key Deliverables</h4>
                  <ul class="modal-service-bullets ps-3 mb-0" id="modalServiceBullets"></ul>
                </div>
                <div class="col-lg-5">
                  <div class="modal-tech-box">
                    <h4 class="modal-deliverables-heading">Core Toolkit</h4>
                    <div class="d-flex flex-wrap gap-2" id="modalServiceTech"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer custom-modal-footer border-0 justify-content-between pt-0 mt-4">
              <div class="d-flex gap-2">
                <button type="button" class="btn-nav-modal prev-service"><i class="fa-solid fa-arrow-left"></i> Prev</button>
                <button type="button" class="btn-nav-modal next-service">Next <i class="fa-solid fa-arrow-right"></i></button>
              </div>
              <a href="#" class="btn-brand modal-cta-btn m-0">Discuss Your Project <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    `);
  }

  function fillModal(key) {
    const d = services[key];
    if (!d) return;
    activeKey = key;

    document.getElementById('modalServiceTitle').textContent = d.title;
    document.getElementById('modalServiceBadge').textContent = d.badge;
    document.getElementById('modalServiceDesc').textContent  = d.desc;
    document.getElementById('modalServiceIcon').innerHTML    = `<i class="fa-solid ${d.icon}"></i>`;

    document.getElementById('modalServiceBullets').innerHTML = d.bullets
      .map(b => `<li class="mb-2">${b}</li>`)
      .join('');

    document.getElementById('modalServiceTech').innerHTML = d.tech
      .map(t => `<span class="modal-tech-badge">${t}</span>`)
      .join('');

    const cta = document.querySelector('.modal-cta-btn');
    if (cta) {
      const subject = encodeURIComponent(`Project Inquiry - ${d.title} - From PL Soft Website`);
      const body    = encodeURIComponent(`Service of Interest: ${d.title}\r\n\r\nPlease describe your project:\r\n`);
      cta.href = `mailto:hr@plsofttech.com?subject=${subject}&body=${body}`;
    }
  }

  if (!window.bootstrap) return;

  buildModal();
  const modalEl = document.getElementById('serviceDetailModal');
  if (!modalEl) return;

  const bsModal = new bootstrap.Modal(modalEl);

  modalEl.querySelector('.prev-service').addEventListener('click', () => {
    let i = serviceKeys.indexOf(activeKey);
    fillModal(serviceKeys[(i - 1 + serviceKeys.length) % serviceKeys.length]);
  });

  modalEl.querySelector('.next-service').addEventListener('click', () => {
    let i = serviceKeys.indexOf(activeKey);
    fillModal(serviceKeys[(i + 1) % serviceKeys.length]);
  });

  document.querySelectorAll('.service-card').forEach(card => {
    const btn = card.querySelector('.learn-more');
    if (!btn) return;
    btn.href = '#';
    btn.addEventListener('click', e => {
      e.preventDefault();
      const key = resolveKey(card.querySelector('h3').textContent.trim());
      if (services[key]) { fillModal(key); bsModal.show(); }
    });
  });

  // Deep-link via ?service= or URL hash
  const params  = new URLSearchParams(location.search);
  const initial = params.get('service') || (location.hash ? location.hash.slice(1) : null);
  if (initial) {
    const key = resolveKey(initial.replace(/-/g, ' '));
    if (services[key]) setTimeout(() => { fillModal(key); bsModal.show(); }, 150);
  }

});
