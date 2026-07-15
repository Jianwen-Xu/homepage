(function () {
  const GITHUB_USER = 'Jianwen-Xu';
  const REPOS_PER_PAGE = 6;

  // ---- GitHub API ----

  async function fetchRepos() {
    const grid = document.getElementById('project-grid');
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=${REPOS_PER_PAGE}&type=owner`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
      const repos = await res.json();
      if (repos.length === 0) {
        grid.innerHTML = '<div class="col-12"><p class="projects__loading">No public repos yet.</p></div>';
        return;
      }
      renderRepos(grid, repos);
    } catch (err) {
      grid.innerHTML =
        '<div class="col-12"><p class="projects__loading">Could not load projects from GitHub.</p></div>';
      console.error(err);
    }
  }

  function renderRepos(grid, repos) {
    const colors = {
      JavaScript: '#F7DF1E',
      TypeScript: '#3178C6',
      Python: '#3776AB',
      Rust: '#DEA584',
      Java: '#B07219',
      'C#': '#178600',
      HTML: '#E34F26',
      CSS: '#563D7C',
      R: '#198CE7',
    };

    const cards = repos
      .map((repo) => {
        const lang = repo.language || '';
        const color = colors[lang] || '#888';
        const desc = repo.description
          ? repo.description.length > 120
            ? repo.description.slice(0, 120) + '…'
            : repo.description
          : 'No description provided.';
        const stars = repo.stargazers_count || 0;
        const updated = new Date(repo.updated_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });

        return `
        <div class="col-4">
          <div class="p-card project-card">
            <h3 class="p-heading--4"><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
            <p class="project-card__desc">${escapeHtml(desc)}</p>
            <div class="project-card__footer">
              ${lang ? `<span class="project-card__lang"><span class="lang-dot" style="background:${color}"></span> ${escapeHtml(lang)}</span>` : ''}
              <span class="project-card__stars"><i class="fa-regular fa-star"></i> ${stars}</span>
              <span>Updated ${updated}</span>
            </div>
          </div>
        </div>`;
      })
      .join('');

    grid.innerHTML = cards;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Nav scroll effect ----

  function initNav() {
    const nav = document.getElementById('nav-bar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        nav.classList.add('nav-bar--solid');
      } else {
        nav.classList.remove('nav-bar--solid');
      }
    });

    toggle.addEventListener('click', function () {
      links.classList.toggle('nav-bar__links--open');
    });

    document.querySelectorAll('.nav-bar__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('nav-bar__links--open');
      });
    });
  }

  // ---- Smooth scroll for anchor links ----

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---- Init ----

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initSmoothScroll();
    fetchRepos();
  });
})();
