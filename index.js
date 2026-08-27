document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-container');
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');

  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  const viewerModal = document.getElementById('viewer-modal');
  const viewerImg = document.getElementById('viewer-img-src');
  const closeViewer = document.getElementById('close-viewer');

  // Page Navigation
  nextBtn.addEventListener('click', () => {
    page1.classList.remove('active');
    page2.classList.add('active');
    container.classList.add('wide-container');
  });

  backBtn.addEventListener('click', () => {
    page2.classList.remove('active');
    page1.classList.add('active');
    container.classList.remove('wide-container');
  });

  // Tab Switching Logic
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetTab = tab.getAttribute('data-tab');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
    });
  });

  // Lightbox Image Viewer for Gallery Images
  document.querySelectorAll('.image-gallery').forEach(gallery => {
    gallery.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        viewerImg.src = e.target.src;
        viewerModal.style.display = 'flex';
      }
    });
  });

  closeViewer.addEventListener('click', () => {
    viewerModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === viewerModal) {
      viewerModal.style.display = 'none';
    }
  });
});