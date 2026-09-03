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
      planBadge.textContent = '3 Milestones';
      const balance = unit.outrightPriceNgn - unit.initialDepositNgn;
      const tranche2 = Math.round(balance * 0.5);
      const tranche3 = balance - tranche2;

      stepsList.innerHTML = `
        <div class="milestone-step-item">
          <div class="step-info-col">
            <span class="step-title">Tranche 1: Initial Allocation Deposit</span>
            <span class="step-timing">Upon signing allocation agreement</span>
          </div>
          <span class="step-amount">${formatNairaFull(unit.initialDepositNgn)}</span>
        </div>
        <div class="milestone-step-item">
          <div class="step-info-col">
            <span class="step-title">Tranche 2: Superstructure Milestone</span>
            <span class="step-timing">Upon roofing & MEP rough-in completion</span>
          </div>
          <span class="step-amount">${formatNairaFull(tranche2)}</span>
        </div>
        <div class="milestone-step-item">
          <div class="step-info-col">
            <span class="step-title">Tranche 3: Handover & Deed Execution</span>
            <span class="step-timing">Upon completion & key handover</span>
          </div>
          <span class="step-amount">${formatNairaFull(tranche3)}</span>
        </div>
      `;
    } else {
      planBadge.textContent = 'Outright Single Payment';
      stepsList.innerHTML = `
        <div class="milestone-step-item">
          <div class="step-info-col">
            <span class="step-title">100% Outright Purchase & Title Conveyance</span>
            <span class="step-timing">Immediate contract execution, deed conveyance & priority key handover</span>
          </div>
          <span class="step-amount">${formatNairaFull(unit.outrightPriceNgn)}</span>
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
document.addEventListener('DOMContentLoaded', () => {
  renderProjects('all');
  renderTestimonials();
  initMatrix();
  initInspectionDrawer();

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
