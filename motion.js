(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map();
  const seen = new WeakSet();
  let observer;

  // Content is visible by default, including when scripts or animation APIs fail.
  function enter(node, delay = 0) {
    if (reduced.matches || typeof node.animate !== 'function' || seen.has(node)) return;
    seen.add(node);
    const animation = node.animate([
      { opacity: 0, translate: '0 22px' },
      { opacity: 1, translate: '0 0' }
    ], { duration: 720, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
    animations.set(node, animation);
    animation.finished.then(() => animations.delete(node), () => animations.delete(node));
  }

  function cancelEntries() {
    animations.forEach(animation => animation.cancel());
    animations.clear();
  }

  function start() {
    observer?.disconnect();
    cancelEntries();
    root.classList.toggle('motion-ready', !reduced.matches);
    if (reduced.matches || !('IntersectionObserver' in window)) return;

    const candidates = [...document.querySelectorAll(
      '.section-heading,.commerce-feature,.project,.personal-heading,.personal-copy,' +
      '.personal-note,.personal-bottom,.contact-top>div,.reading-hero,.reading-main>section,.evidence-content>section'
    )];
    // Direct links open readable content immediately; later sections still reveal on scroll.
    if (location.hash || window.scrollY > 80) {
      candidates.forEach(node => {
        const box = node.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0) seen.add(node);
      });
    } else {
      document.querySelectorAll('.intro-label,.hero h1,.hero-copy,.hero-actions,.hero-caption')
        .forEach((node, i) => enter(node, i * 65));
    }

    observer = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const delay = entry.target.matches('.personal-note,.project')
          ? [...entry.target.parentElement.children].indexOf(entry.target) * 100
          : Math.min(order++ * 80, 160);
        enter(entry.target, delay);
      });
    }, { threshold: 0, rootMargin: '0px 0px -28px 0px' });
    candidates.forEach(node => { if (!seen.has(node)) observer.observe(node); });
  }

  // Keyboard and anchor navigation never have to wait for an entrance animation.
  document.addEventListener('focusin', event => {
    animations.forEach((animation, node) => {
      if (node.contains(event.target)) { animation.cancel(); animations.delete(node); }
    });
  });
  window.addEventListener('hashchange', cancelEntries);
  window.addEventListener('beforeprint', cancelEntries);
  reduced.addEventListener('change', start);

  const header = document.querySelector('.site-header');
  let scheduled = false;
  function updateProgress() {
    const range = root.scrollHeight - innerHeight;
    const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    root.style.setProperty('--page-progress', String(progress));
    header?.classList.toggle('is-scrolled', window.scrollY > 16);
    scheduled = false;
  }
  function queueProgress() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress);
  window.addEventListener('load', queueProgress);
  window.addEventListener('pageshow', queueProgress);
  start();
  updateProgress();
})();
