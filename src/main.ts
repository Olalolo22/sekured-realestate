import { PROJECTS_DATA, COMPANY_DETAILS, TESTIMONIALS_DATA, ProjectItem } from './data/projects';

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
              Claim Unit Allocation
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
// 3. INTERACTIVE SHORT-LET YIELD CALCULATOR
// ---------------------------------------------------------------------------
interface CalcState {
  unitId: string;
  isDepositMode: boolean;
  nightlyRate: number;
  occupancyPercent: number;
}

const calcState: CalcState = {
  unitId: 'belmont-studio',
  isDepositMode: false,
  nightlyRate: 65000,
  occupancyPercent: 65
};

// All available units flattened for quick lookup
function getAllUnits() {
  const list: { project: ProjectItem; unit: typeof PROJECTS_DATA[0]['units'][0] }[] = [];
  PROJECTS_DATA.forEach(p => {
    p.units.forEach(u => {
      list.push({ project: p, unit: u });
    });
  });
  return list;
}

function updateCalculator() {
  const allUnits = getAllUnits();
  const selected = allUnits.find(item => item.unit.id === calcState.unitId) || allUnits[0];
  const unit = selected.unit;
  const project = selected.project;

  // Sync inputs
  const nightlyDisplay = document.getElementById('nightlyRateDisplay');
  const occupancyDisplay = document.getElementById('occupancyDisplay');
  const annualYieldResult = document.getElementById('annualYieldResult');
  const roiPercentResult = document.getElementById('roiPercentResult');
  const monthlyCashflowResult = document.getElementById('monthlyCashflowResult');
  const capitalEntryResult = document.getElementById('capitalEntryResult');
  const fiveYearNetResult = document.getElementById('fiveYearNetResult');
  const capitalGainResult = document.getElementById('capitalGainResult');
  const lockInYieldBtn = document.getElementById('lockInYieldBtn') as HTMLAnchorElement;

  if (nightlyDisplay) nightlyDisplay.textContent = formatNairaFull(calcState.nightlyRate);
  if (occupancyDisplay) {
    const days = Math.round(30 * (calcState.occupancyPercent / 100));
    occupancyDisplay.textContent = `${calcState.occupancyPercent}% (~${days} days/mo)`;
  }

  // Financial calculations
  const occupiedNightsPerYear = Math.round(365 * (calcState.occupancyPercent / 100));
  const grossAnnualIncome = occupiedNightsPerYear * calcState.nightlyRate;
  
  // Turnkey operating & management expense estimate (20% for cleaning, concierge, marketing)
  const netAnnualYield = Math.round(grossAnnualIncome * 0.80);
  const monthlyCashflow = Math.round(netAnnualYield / 12);
  const fiveYearNet = netAnnualYield * 5;

  // Capital base depending on acquisition mode
  const capitalBase = calcState.isDepositMode ? unit.initialDepositNgn : unit.outrightPriceNgn;
  const calculatedRoi = (netAnnualYield / unit.outrightPriceNgn) * 100;
  const capitalAppreciation = Math.round(unit.outrightPriceNgn * 0.35);

  if (annualYieldResult) annualYieldResult.textContent = formatNairaFull(netAnnualYield);
  if (roiPercentResult) {
    roiPercentResult.textContent = calcState.isDepositMode 
      ? `~${calculatedRoi.toFixed(1)}% Yield (${formatNaira(unit.initialDepositNgn)} Initial Deposit Plan)`
      : `~${calculatedRoi.toFixed(1)}% Net Annual ROI (Outright Asset)`;
  }
  if (monthlyCashflowResult) monthlyCashflowResult.textContent = formatNairaFull(monthlyCashflow);
  if (capitalEntryResult) capitalEntryResult.textContent = formatNairaFull(capitalBase);
  if (fiveYearNetResult) fiveYearNetResult.textContent = formatNaira(fiveYearNet);
  if (capitalGainResult) capitalGainResult.textContent = `+35% (${formatNaira(capitalAppreciation)})`;

  // WhatsApp Lock-in link
  if (lockInYieldBtn) {
    const message = `*SEKURED YIELD SIMULATION LOCK-IN*
Project: ${project.name}
Unit: ${unit.name} (Ref: ${unit.refCode})
Acquisition: ${calcState.isDepositMode ? 'Deposit-to-Own Plan' : 'Outright Purchase'}
Initial Entry: ${formatNairaFull(capitalBase)}
Nightly Rate Assumption: ${formatNairaFull(calcState.nightlyRate)}
Occupancy Assumption: ${calcState.occupancyPercent}%
Projected Annual Net Yield: ${formatNairaFull(netAnnualYield)} (~${calculatedRoi.toFixed(1)}%)

Hello SEKURED! I ran this yield simulation on your website and would like to lock in this allocation.`;
    lockInYieldBtn.href = createWhatsAppUrl(message);
  }
}

function initCalculator() {
  const unitSelect = document.getElementById('calcUnitSelect') as HTMLSelectElement;
  const toggleOutright = document.getElementById('toggleOutrightBtn');
  const toggleDeposit = document.getElementById('toggleDepositBtn');
  const nightlySlider = document.getElementById('nightlyRateSlider') as HTMLInputElement;
  const occupancySlider = document.getElementById('occupancySlider') as HTMLInputElement;

  if (unitSelect) {
    unitSelect.addEventListener('change', (e) => {
      calcState.unitId = (e.target as HTMLSelectElement).value;
      const all = getAllUnits();
      const match = all.find(item => item.unit.id === calcState.unitId);
      if (match && nightlySlider) {
        calcState.nightlyRate = match.unit.estimatedNightlyRateNgn;
        nightlySlider.value = String(match.unit.estimatedNightlyRateNgn);
      }
      updateCalculator();
    });
  }

  if (toggleOutright && toggleDeposit) {
    toggleOutright.addEventListener('click', () => {
      calcState.isDepositMode = false;
      toggleOutright.classList.add('active');
      toggleDeposit.classList.remove('active');
      updateCalculator();
    });

    toggleDeposit.addEventListener('click', () => {
      calcState.isDepositMode = true;
      toggleDeposit.classList.add('active');
      toggleOutright.classList.remove('active');
      updateCalculator();
    });
  }

  if (nightlySlider) {
    nightlySlider.addEventListener('input', (e) => {
      calcState.nightlyRate = Number((e.target as HTMLInputElement).value);
      updateCalculator();
    });
  }

  if (occupancySlider) {
    occupancySlider.addEventListener('input', (e) => {
      calcState.occupancyPercent = Number((e.target as HTMLInputElement).value);
      updateCalculator();
    });
  }

  updateCalculator();
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
  initCalculator();
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
