document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('main-container');
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');

  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  // Profile Modal Elements
  const profileImg = document.getElementById('profile-trigger');
  const profileModal = document.getElementById('profile-modal');
  const fullProfileView = document.getElementById('full-profile-view');
  const closeProfile = document.getElementById('close-profile');

  // Gallery Modal Elements
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

  // Open Profile Picture Modal on Click
  if (profileImg) {
    profileImg.addEventListener('click', () => {
      fullProfileView.src = profileImg.src;
      profileModal.style.display = 'flex';
    });
  }

  // Close Profile Picture Modal
  if (closeProfile) {
    closeProfile.addEventListener('click', () => {
      profileModal.style.display = 'none';
    });
  }

  // Lightbox Image Viewer for Gallery Items
  document.querySelectorAll('.image-gallery').forEach(gallery => {
    gallery.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        viewerImg.src = e.target.src;
        viewerModal.style.display = 'flex';
      }
    });
  });

  // Close Gallery Modal
  if (closeViewer) {
    closeViewer.addEventListener('click', () => {
      viewerModal.style.display = 'none';
    });
  }

  // Close Modals when clicking outside the content area
  window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
    if (e.target === viewerModal) {
      viewerModal.style.display = 'none';
    }
  });
});