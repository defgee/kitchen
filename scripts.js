
const video = document.querySelector('video[data-autoplay]');

if (video) {
  let hasInteracted = false;
  video.pause();
  video.playbackRate = 4;

  const isInView = (node) => {
    const rect = node.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.7;
    return rect.top < triggerPoint && rect.bottom > triggerPoint * 0.35;
  };

  const tryPlay = () => {
    if (!hasInteracted) return;
    if (isInView(video)) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const observer =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([entry]) => {
            if (!hasInteracted) {
              video.pause();
              return;
            }
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          },
          { threshold: 0.7, rootMargin: '0px 0px -25% 0px' }
        )
      : null;

  if (observer) {
    observer.observe(video);
  }

  const onFirstInteract = () => {
    hasInteracted = true;
    if (observer) {
      observer.unobserve(video);
      observer.observe(video);
    } else {
      tryPlay();
    }
  };

  const onScroll = () => {
    onFirstInteract();
    tryPlay();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('wheel', onFirstInteract, { passive: true });
  window.addEventListener('touchstart', onFirstInteract, { passive: true });
  window.addEventListener('keydown', onFirstInteract);
}
