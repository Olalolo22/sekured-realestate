import { PROJECTS_DATA, COMPANY_DETAILS, TESTIMONIALS_DATA, ProjectItem, UnitOption } from './data/projects';

// Helper: Format Naira currency cleanly
function formatNaira(val: number): string {
  if (val >= 1000000) {
    const m = val / 1000000;
    return `₦${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  return `₦${val.toLocaleString()}`;
}

function formatNairaFull(val: number): string {
  return `₦${val.toLocaleString()}`;
}

// Helper: WhatsApp URL Generator
function createWhatsAppUrl(message: string): string {
  return `https://wa.me/${COMPANY_DETAILS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// ---------------------------------------------------------------------------
// 1. RENDER DEVELOPMENTS / PROJECTS
// ---------------------------------------------------------------------------
function renderProjects(filterSlug: string = 'all') {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  const filtered = filterSlug === 'all' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.slug === filterSlug);

  container.innerHTML = filtered.map(project => {
    const unitsRowsHtml = project.units.map(u => `
      <div class="unit-row">
        <span class="unit-name-cell">${u.name}</span>
        <span class="unit-deposit-cell">${formatNaira(u.initialDepositNgn)}</span>
        <span class="unit-roi-cell">${formatNaira(u.projectedAnnualRoiNgn)}/yr</span>
      </div>
    `).join('');

    const amenitiesHtml = project.amenities.slice(0, 4).map(a => `
      <span class="amenity-tag">${a}</span>
    `).join('');

    const topUnit = project.units[0];
    const defaultMsg = `Hello SEKURED Real Estate! I am inquiring about pre-launch unit allocations for ${project.name} (Ref: ${topUnit.refCode}).`;
    const waUrl = createWhatsAppUrl(defaultMsg);

    return `
      <div class="project-card" data-slug="${project.slug}">
        <div class="card-media">
          <img src="${project.heroImage}" alt="${project.name}" loading="lazy">
          <span class="card-badge">${project.badge}</span>
          <div class="card-status-indicator">
            <div class="progress-info">
              <span>Construction: <strong>${project.status}</strong></span>
              <span class="num-metric">${project.completionPercentage}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar-fill" style="width: ${project.completionPercentage}%;"></div>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="card-title-block">
            <h3 class="card-name">${project.name}</h3>
            <span class="card-tagline">${project.tagline}</span>
            <div class="card-location">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${project.location}</span>
            </div>
          </div>

          <div class="card-units-table">
            <div class="unit-row header-row">
              <span>Unit Type</span>
              <span>Deposit Entry</span>
              <span style="text-align: right;">Audited ROI</span>
            </div>
            ${unitsRowsHtml}
          </div>

          <div class="card-amenities-tags">
            ${amenitiesHtml}
          </div>

          <div class="card-actions">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1.2;">
              Claim Allocation
            </a>
            <button class="btn btn-secondary card-inspect-btn" data-project="${project.name}" style="flex: 0.8;">
              Inspect Site
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach inspection button triggers from cards
  container.querySelectorAll('.card-inspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projName = (btn as HTMLElement).dataset.project;
      openInspectionDrawer(projName);
    });
  });
}

// ---------------------------------------------------------------------------
// 2. RENDER TESTIMONIALS
// ---------------------------------------------------------------------------
function renderTestimonials() {
  const container = document.getElementById('testimonialsGrid');
  if (!container) return;

  container.innerHTML = TESTIMONIALS_DATA.map(t => `
    <div class="testimonial-card">
      <p class="testimonial-quote">“${t.quote}”</p>
      <div class="testimonial-author-block">
        <span class="testimonial-name">${t.author}</span>
        <span class="testimonial-role">${t.role}</span>
        <span class="testimonial-unit">Allocated: ${t.unitBought}</span>
      </div>
    </div>
  `).join('');
}

// ---------------------------------------------------------------------------
// 3. OFFICIAL INVESTMENT & CASHFLOW MATRIX (NO SLIDERS — LOCKED AUDITED DATA)
// ---------------------------------------------------------------------------
interface MatrixState {
  unitId: string;
  isDepositMode: boolean;
}

const matrixState: MatrixState = {
  unitId: 'belmont-studio',
  isDepositMode: true
};

function getAllUnits(): { project: ProjectItem; unit: UnitOption }[] {
  const list: { project: ProjectItem; unit: UnitOption }[] = [];
  PROJECTS_DATA.forEach(p => {
    p.units.forEach(u => {
      list.push({ project: p, unit: u });
    });
  });
  return list;
}

function updateMatrix() {
  const all = getAllUnits();
  const selected = all.find(item => item.unit.id === matrixState.unitId) || all[0];
  const unit = selected.unit;
  const project = selected.project;

  // DOM Elements
  const annualRoiElem = document.getElementById('matrixAnnualRoi');
  const yieldPercentElem = document.getElementById('matrixRoiYieldPercent');
  const quarterlyElem = document.getElementById('matrixQuarterlyPayout');
  const initialEntryElem = document.getElementById('matrixInitialEntry');
  const outrightPriceElem = document.getElementById('matrixOutrightPrice');
  const capitalGainElem = document.getElementById('matrixCapitalGain');
  const stepsList = document.getElementById('milestoneStepsList');
  const planBadge = document.getElementById('milestonePlanBadge');
  const requestBtn = document.getElementById('matrixRequestPlanBtn') as HTMLAnchorElement;

  // Locked Official Figures
  const quarterlyPayout = Math.round(unit.projectedAnnualRoiNgn / 4);
  const capitalBase = matrixState.isDepositMode ? unit.initialDepositNgn : unit.outrightPriceNgn;
  const capitalGainAmount = Math.round(unit.outrightPriceNgn * 0.35);

  if (annualRoiElem) annualRoiElem.textContent = formatNairaFull(unit.projectedAnnualRoiNgn);
  if (yieldPercentElem) yieldPercentElem.textContent = `${unit.projectedRoiPercent}% Published Annual Yield`;
  if (quarterlyElem) quarterlyElem.textContent = `${formatNairaFull(quarterlyPayout)}/qtr`;
  if (initialEntryElem) initialEntryElem.textContent = formatNairaFull(capitalBase);
  if (outrightPriceElem) outrightPriceElem.textContent = formatNairaFull(unit.outrightPriceNgn);
  if (capitalGainElem) capitalGainElem.textContent = `+35% (${formatNaira(capitalGainAmount)})`;

  // Milestone Schedule Breakdown
  if (stepsList && planBadge) {
    if (matrixState.isDepositMode) {
      planBadge.textContent = '3 Milestone Tranches';
      const balance = unit.outrightPriceNgn - unit.initialDepositNgn;
      const tranche2 = Math.round(balance * 0.5);
      const tranche3 = balance - tranche2;

      stepsList.innerHTML = `
        <div class="timeline-step">
          <div class="step-num">1</div>
          <div class="step-content">
            <div class="step-flex-row">
              <span class="step-heading">Initial Allocation Deposit</span>
              <span class="step-val">${formatNairaFull(unit.initialDepositNgn)}</span>
            </div>
            <span class="step-caption">Due upon contract signing</span>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-num">2</div>
          <div class="step-content">
            <div class="step-flex-row">
              <span class="step-heading">Superstructure Milestone</span>
              <span class="step-val">${formatNairaFull(tranche2)}</span>
            </div>
            <span class="step-caption">Due upon roofing & MEP rough-in</span>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-num">3</div>
          <div class="step-content">
            <div class="step-flex-row">
              <span class="step-heading">Handover & Legal Title</span>
              <span class="step-val">${formatNairaFull(tranche3)}</span>
            </div>
            <span class="step-caption">Due upon completion & key handover</span>
          </div>
        </div>
      `;
    } else {
      planBadge.textContent = 'Single Outright Payment';
      stepsList.innerHTML = `
        <div class="timeline-step">
          <div class="step-num">✓</div>
          <div class="step-content">
            <div class="step-flex-row">
              <span class="step-heading">100% Outright Acquisition</span>
              <span class="step-val">${formatNairaFull(unit.outrightPriceNgn)}</span>
            </div>
            <span class="step-caption">Immediate Contract of Sale & Deed of Conveyance</span>
          </div>
        </div>
      `;
    }
  }

  // WhatsApp Button URL
  if (requestBtn) {
    const planName = matrixState.isDepositMode ? 'Deposit-to-Own Milestone Plan' : 'Outright Single Payment Plan';
    const message = `*OFFICIAL ALLOCATION & CASHFLOW SCHEDULE REQUEST — SEKURED GROUP*
*Development:* ${project.name}
*Unit:* ${unit.name} (Ref: ${unit.refCode})
*Payment Structure:* ${planName}
*Initial Capital Entry:* ${formatNairaFull(capitalBase)}
*Outright Asset Value:* ${formatNairaFull(unit.outrightPriceNgn)}
*Audited Annual ROI:* ${formatNairaFull(unit.projectedAnnualRoiNgn)} (${unit.projectedRoiPercent}% Yield)
*Quarterly Payout:* ${formatNairaFull(quarterlyPayout)}/qtr

Hello SEKURED! Please send me the official contract documents and allocation form for this unit.`;
    requestBtn.href = createWhatsAppUrl(message);
  }
}

function initMatrix() {
  const select = document.getElementById('matrixUnitSelect') as HTMLSelectElement;
  const toggleDeposit = document.getElementById('toggleDepositPlanBtn');
  const toggleOutright = document.getElementById('toggleOutrightPlanBtn');

  if (select) {
    select.addEventListener('change', (e) => {
      matrixState.unitId = (e.target as HTMLSelectElement).value;
      updateMatrix();
    });
  }

  if (toggleDeposit && toggleOutright) {
    toggleDeposit.addEventListener('click', () => {
      matrixState.isDepositMode = true;
      toggleDeposit.classList.add('active');
      toggleOutright.classList.remove('active');
      updateMatrix();
    });

    toggleOutright.addEventListener('click', () => {
      matrixState.isDepositMode = false;
      toggleOutright.classList.add('active');
      toggleDeposit.classList.remove('active');
      updateMatrix();
    });
  }

  updateMatrix();
}

// ---------------------------------------------------------------------------
// 4. INSPECTION BOOKING DRAWER
// ---------------------------------------------------------------------------
function openInspectionDrawer(preSelectedProject?: string) {
  const drawer = document.getElementById('inspectionDrawer');
  const select = document.getElementById('inspTargetProject') as HTMLSelectElement;
  if (drawer) {
    drawer.classList.add('open');
    if (preSelectedProject && select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].text.toLowerCase().includes(preSelectedProject.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }
}

function closeInspectionDrawer() {
  const drawer = document.getElementById('inspectionDrawer');
  if (drawer) drawer.classList.remove('open');
}

function initInspectionDrawer() {
  const headerBtn = document.getElementById('headerInspectionBtn');
  const heroBtn = document.getElementById('heroBookInspectionBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('inspectionDrawer');
  const form = document.getElementById('inspectionBookingForm') as HTMLFormElement;

  headerBtn?.addEventListener('click', () => openInspectionDrawer());
  heroBtn?.addEventListener('click', () => openInspectionDrawer('Belmont Residence'));
  closeBtn?.addEventListener('click', closeInspectionDrawer);

  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) closeInspectionDrawer();
  });

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const project = (document.getElementById('inspTargetProject') as HTMLSelectElement).value;
      const mode = (document.getElementById('inspTourMode') as HTMLSelectElement).value;
      const name = (document.getElementById('inspClientName') as HTMLInputElement).value;
      const phone = (document.getElementById('inspClientPhone') as HTMLInputElement).value;
      const location = (document.getElementById('inspClientLocation') as HTMLInputElement).value;
      const date = (document.getElementById('inspPreferredDate') as HTMLInputElement).value;
      const notes = (document.getElementById('inspNotes') as HTMLTextAreaElement).value;

      const message = `*VIP SITE INSPECTION / TOUR PASS — SEKURED GROUP*
*Client Name:* ${name}
*Client WhatsApp/Phone:* ${phone}
*Current Location:* ${location}
*Target Development:* ${project}
*Tour Format:* ${mode}
*Preferred Date:* ${date}
*Client Notes:* ${notes || 'Standard executive tour'}

Hello SEKURED Sales Desk! I would like to confirm my inspection reservation for this date.`;

      const waUrl = createWhatsAppUrl(message);
      closeInspectionDrawer();
      window.open(waUrl, '_blank');
    });
  }
}

// ---------------------------------------------------------------------------
// 5. TABS & INITIALIZATION
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 6. BELMONT FLOOR PLAN VISUALIZER
// ---------------------------------------------------------------------------
const FLOORPLAN_DATA = {
  studio: {
    title: 'Studio Executive Suite',
    areaSqm: 42,
    areaSqft: 452,
    priceNgn: 55000000,
    depositNgn: 20000000,
    refCode: 'SEK-BELMONT-STD',
    dimensions: [
      { label: 'Studio Living & Bedroom Lounge', value: '5.2m x 4.4m (22.8 m²)' },
      { label: 'Executive Chef Kitchenette', value: '2.6m x 1.8m (4.7 m²)' },
      { label: 'Ensuite Designer Bathroom', value: '2.4m x 1.6m (3.8 m²)' },
      { label: 'Private Sunset Balcony', value: '2.8m x 1.4m (3.9 m²)' },
      { label: 'Ceiling Height Void', value: '3.0m Clear Height' }
    ],
    inclusions: [
      'Biometric Keyless Entry & Remote Guest Access Code',
      'Acoustic Double-Glazed Soundproof Window Assemblies',
      'Concealed European Sanitary Ware & Rain Shower',
      'Pre-Wired High-Speed Dedicated Fiber Conduit'
    ]
  },
  '1bed': {
    title: '1-Bedroom Luxury Residence',
    areaSqm: 68,
    areaSqft: 732,
    priceNgn: 85000000,
    depositNgn: 30000000,
    refCode: 'SEK-BELMONT-1BED',
    dimensions: [
      { label: 'Open-Plan Living & Dining Salon', value: '6.4m x 4.2m (26.9 m²)' },
      { label: 'Master Bedroom Suite', value: '4.8m x 3.8m (18.2 m²)' },
      { label: 'Gourmet Island Kitchen', value: '3.2m x 2.2m (7.0 m²)' },
      { label: 'Ensuite Bathroom + Guest Cloakroom', value: '2.8m x 2.0m (5.6 m²)' },
      { label: 'Covered Al-Fresco Terrace', value: '3.6m x 1.6m (5.8 m²)' }
    ],
    inclusions: [
      'Dual-Zone App-Controlled Climate Air Conditioning',
      'Solid Quartz Countertops & Soft-Close Italian Cabinetry',
      'Built-in Floor-to-Ceiling Wardrobes with LED Reveal',
      'Dedicated Car Parking Space Allocated On Title'
    ]
  },
  penthouse: {
    title: '2-Bedroom Regal Penthouse',
    areaSqm: 125,
    areaSqft: 1345,
    priceNgn: 150000000,
    depositNgn: 50000000,
    refCode: 'SEK-BELMONT-PENT',
    dimensions: [
      { label: 'Double-Volume Penthouse Grand Salon', value: '8.2m x 5.4m (44.3 m²)' },
      { label: 'Primary Master Suite with Walk-In Closet', value: '5.8m x 4.6m (26.7 m²)' },
      { label: 'Secondary Ensuite Guest Bedroom', value: '4.4m x 3.8m (16.7 m²)' },
      { label: 'Chef Prep Island Kitchen & Pantry', value: '4.0m x 2.8m (11.2 m²)' },
      { label: 'Wrap-Around Panoramic Horizon Terrace', value: '7.8m x 2.2m (17.2 m²)' }
    ],
    inclusions: [
      '3.4m Cathedral Ceiling Heights in Main Living Area',
      'Private Keycard Elevator Access Direct to Penthouse Landing',
      'Dual Ensuite Italian Stone Baths & Freestanding Soaking Tub',
      'Two (2) Covered Reserved Parking Bays in Secured Basement'
    ]
  }
};

function renderFloorplan(unitKey: 'studio' | '1bed' | 'penthouse') {
  const container = document.getElementById('floorplanContentGrid');
  if (!container) return;

  const data = FLOORPLAN_DATA[unitKey];
  const dimensionsHtml = data.dimensions.map(d => `
    <div class="clean-dim-row">
      <span class="dim-label">${d.label}</span>
      <span class="dim-value">${d.value}</span>
    </div>
  `).join('');

  const inclusionsHtml = data.inclusions.map(inc => `
    <div class="clean-inc-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--brand-orange); flex-shrink: 0; margin-top: 3px;"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${inc}</span>
    </div>
  `).join('');

  const waMsg = `*BELMONT ARCHITECTURAL BLUEPRINT REQUEST*
Unit: ${data.title} (${data.areaSqm} m² / ${data.areaSqft} sqft)
Ref: ${data.refCode}
Outright Price: ${formatNairaFull(data.priceNgn)}
Initial Deposit: ${formatNairaFull(data.depositNgn)}

Hello SEKURED! Please send me the complete architectural blueprint PDF and specification sheet for this unit.`;
  const waUrl = createWhatsAppUrl(waMsg);

  container.innerHTML = `
    <div class="floorplan-clean-card">
      <div class="floorplan-hero-row">
        <div>
          <h4 class="floorplan-title">${data.title}</h4>
          <span class="floorplan-meta">${data.areaSqm} m² (${data.areaSqft} sqft) • Ref: ${data.refCode}</span>
        </div>
        <div class="floorplan-price-block">
          <span class="floorplan-price-kicker">From</span>
          <span class="floorplan-price-val">${formatNaira(data.priceNgn)}</span>
        </div>
      </div>

      <div class="floorplan-dims-list">
        ${dimensionsHtml}
      </div>

      <div class="floorplan-inc-list">
        ${inclusionsHtml}
      </div>

      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-orange btn-block" style="margin-top: 0.5rem;">
        Download Architectural Blueprint PDF
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
      </a>
    </div>
  `;
}

function initFloorplans() {
  renderFloorplan('studio');
  const pills = document.querySelectorAll('.floorplan-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const unit = (pill as HTMLElement).dataset.unit as 'studio' | '1bed' | 'penthouse';
      renderFloorplan(unit);
    });
  });
}

// ---------------------------------------------------------------------------
// 7. INVESTOR FAQ ACCORDION
// ---------------------------------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  renderTestimonials();
  initMatrix();
  initInspectionDrawer();
  initFloorplans();
  initFaqAccordion();

  // Set default date for inspection (tomorrow)
  const dateInput = document.getElementById('inspPreferredDate') as HTMLInputElement;
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Filter tabs click
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = (btn as HTMLElement).dataset.filter || 'all';
      renderProjects(filter);
    });
  });
});
