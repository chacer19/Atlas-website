// Atlas Investment Management — renders data-driven content blocks (advisors,
// insights, whitepapers, testimonials) and link destinations from /data/*.json
// into their mount points. Runs after main.js's interaction bindings so it only
// has to opt new elements into the existing reveal/observer behavior.

(function () {
  function fetchJSON(name) {
    return fetch('data/' + name, { cache: 'no-cache' }).then((r) => {
      if (!r.ok) throw new Error('Failed to load ' + name);
      return r.json();
    });
  }

  function revealClass(i, wrap) {
    const d = wrap ? i % wrap : i;
    return d === 0 ? '' : ' reveal-delay-' + d;
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function teamPhotoHTML(a, extraH3Style) {
    const alt = escapeHTML(`${a.name}, ${a.title} at Atlas Investment Management`);
    const photo = a.photo
      ? `<img src="${escapeHTML(a.photo)}" alt="${alt}" loading="lazy">`
      : `<span class="initials">${escapeHTML(a.initials || '')}</span>`;
    return `<div class="team-photo">${photo}</div>`;
  }

  function renderExecutives(el, advisors) {
    el.innerHTML = advisors.filter((a) => a.section === 'executive').map((a, i) => `
      <div class="team-card reveal${revealClass(i, 3)}">
        ${teamPhotoHTML(a)}
        <h3>${escapeHTML(a.name)}</h3>
        <span class="role">${escapeHTML(a.title)}</span>
        <p>${escapeHTML(a.bio || '')}</p>
      </div>`).join('');
  }

  function renderAdvisorGrid(el, advisors) {
    el.innerHTML = advisors.filter((a) => a.section === 'advisor').map((a) => `
      <div class="team-card reveal">${teamPhotoHTML(a)}<h3 style="color:var(--off-white);">${escapeHTML(a.name)}</h3><span class="role">${escapeHTML(a.title)}</span></div>`).join('');
  }

  function renderPlainList(el, advisors, section) {
    const items = advisors.filter((a) => a.section === section);
    el.innerHTML = items.map((a, i) => `
      <div style="display:flex; justify-content:space-between; ${i < items.length - 1 ? 'padding-bottom:18px; border-bottom:1px solid var(--line);' : ''}">
        <span style="font-weight:600;">${escapeHTML(a.name)}</span><span class="role" style="margin:0;">${escapeHTML(a.title)}</span>
      </div>`).join('');
  }

  function renderTeamPreview(el, advisors) {
    el.innerHTML = advisors.filter((a) => a.featured).map((a, i) => `
      <div class="team-card reveal${revealClass(i)}">
        ${teamPhotoHTML(a)}
        <h3>${escapeHTML(a.name)}</h3>
        <span class="role">${escapeHTML(a.title)}</span>
      </div>`).join('');
  }

  function renderInsightCards(el, posts) {
    el.innerHTML = posts.map((p, i) => `
      <article class="insight-card reveal${revealClass(i, 3)}">
        <div class="thumb"><svg class="topo-bg" viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#D3B276" stroke-width="1"><path d="M-20 200 Q 80 140 150 190 T 300 160 T 450 200"/><path d="M-20 150 Q 80 90 150 140 T 300 110 T 450 150"/></g></svg></div>
        <div class="insight-card-body">
          <span class="tag">${escapeHTML(p.tag)}</span>
          <h3>${escapeHTML(p.title)}</h3>
          <p>${escapeHTML(p.summary)}</p>
          <div class="meta">By ${escapeHTML(p.author)} · ${escapeHTML(p.dateLabel)}</div>
        </div>
      </article>`).join('');
  }

  function renderWhitepapers(el, papers) {
    el.innerHTML = papers.map((w, i) => `
      <div class="card reveal${revealClass(i, 2)}" style="background:var(--charcoal-deep); border-color:var(--line-dark); display:flex; align-items:center; gap:26px; padding:32px;">
        <div class="icon-badge" style="flex-shrink:0; margin:0;"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M6 2h9l5 5v15H6V2z" stroke-linejoin="round"/><path d="M14 2v6h6" stroke-linejoin="round"/></svg></div>
        <div>
          <h3 style="color:var(--off-white); font-size:1.1rem;">${escapeHTML(w.title)}</h3>
          <p style="color:var(--cream); font-size:13.5px;">${escapeHTML(w.description)}</p>
        </div>
      </div>`).join('');
  }

  function renderTestimonialGrid(el, items) {
    el.innerHTML = items.map((t, i) => `
      <div class="reveal${revealClass(i, 3)}">
        <div class="quote-block">
          <p>"${escapeHTML(t.quote)}"</p>
          <div class="attribution">${escapeHTML(t.attribution)}</div>
        </div>
      </div>`).join('');
  }

  function renderTestimonialStack(el, items) {
    el.innerHTML = items.filter((t) => t.featured).map((t, i) => `
      <div class="quote-block"${i > 0 ? ' style="margin-top:56px;"' : ''}>
        <p>"${escapeHTML(t.quote)}"</p>
        <div class="attribution">${escapeHTML(t.attribution)}</div>
      </div>`).join('');
  }

  function applyLinks(links) {
    document.querySelectorAll('[data-link]').forEach((el) => {
      const key = el.getAttribute('data-link');
      if (links[key]) el.setAttribute('href', links[key]);
    });
    const disclosure = document.getElementById('footer-disclosure');
    if (disclosure && links.footerDisclosure) {
      disclosure.innerHTML = links.footerDisclosure.map((p) => `<p>${p}</p>`).join('');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tasks = [];

    const execGrid = document.getElementById('executive-team-grid');
    const advisorGrid = document.getElementById('advisor-team-grid');
    const opsList = document.getElementById('operations-team-list');
    const bizdevList = document.getElementById('bizdev-team-list');
    const teamPreview = document.getElementById('team-preview-grid');
    if (execGrid || advisorGrid || opsList || bizdevList || teamPreview) {
      tasks.push(fetchJSON('advisors.json').then((advisors) => {
        if (execGrid) renderExecutives(execGrid, advisors);
        if (advisorGrid) renderAdvisorGrid(advisorGrid, advisors);
        if (opsList) renderPlainList(opsList, advisors, 'operations');
        if (bizdevList) renderPlainList(bizdevList, advisors, 'business-development');
        if (teamPreview) renderTeamPreview(teamPreview, advisors);
      }));
    }

    const memoGrid = document.getElementById('memo-grid');
    if (memoGrid) {
      tasks.push(fetchJSON('insights.json').then((posts) => renderInsightCards(memoGrid, posts)));
    }

    const whitepapersGrid = document.getElementById('whitepapers-grid');
    if (whitepapersGrid) {
      tasks.push(fetchJSON('whitepapers.json').then((papers) => renderWhitepapers(whitepapersGrid, papers)));
    }

    const testimonialsGrid = document.getElementById('testimonials-grid');
    const homeTestimonials = document.getElementById('home-testimonials');
    if (testimonialsGrid || homeTestimonials) {
      tasks.push(fetchJSON('testimonials.json').then((items) => {
        if (testimonialsGrid) renderTestimonialGrid(testimonialsGrid, items);
        if (homeTestimonials) renderTestimonialStack(homeTestimonials, items);
      }));
    }

    tasks.push(fetchJSON('links.json').then(applyLinks));

    Promise.all(tasks)
      .catch((err) => console.error('Content load failed:', err))
      .finally(() => {
        if (window.AtlasObserveReveals) window.AtlasObserveReveals(document);
      });
  });
})();
