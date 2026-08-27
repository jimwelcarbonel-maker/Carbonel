document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  // Load saved content from local storage on page load
  loadSavedData('tab-activity', 'gallery-activity');
  loadSavedData('tab-quizzes', 'gallery-quizzes');
  loadSavedData('tab-assignment', 'gallery-assignment');

  // Navigation Logic
  nextBtn.addEventListener('click', () => {
    page1.classList.remove('active');
    page2.classList.add('active');
  });

  backBtn.addEventListener('click', () => {
    page2.classList.remove('active');
    page1.classList.add('active');
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      e.target.classList.add('active');
      const targetPanelId = e.target.getAttribute('data-tab');
      document.getElementById(targetPanelId).classList.add('active');
    });
  });

  // Event Delegation for Delete Buttons (Card or Single Image)
  document.getElementById('page-2').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const card = e.target.closest('.card');
      const imageItem = e.target.closest('.image-item');

      if (card) {
        card.remove();
      } else if (imageItem) {
        imageItem.remove();
      }
    }
  });

  // Clear all images in a section
  document.querySelectorAll('.clear-img-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const galleryId = e.target.getAttribute('data-gallery');
      const gallery = document.getElementById(galleryId);
      gallery.innerHTML = '';
    });
  });

  // Save current section layout to LocalStorage
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const panelId = e.target.getAttribute('data-panel');
      const panel = document.getElementById(panelId);
      
      const cardsHtml = panel.querySelector('.cards-container').innerHTML;
      const galleryHtml = panel.querySelector('.image-gallery').innerHTML;

      localStorage.setItem(`${panelId}_cards`, cardsHtml);
      localStorage.setItem(`${panelId}_gallery`, galleryHtml);

      alert('Changes saved successfully!');
    });
  });

  // Image Upload Handlers
  setupImageUploader('upload-activity', 'gallery-activity');
  setupImageUploader('upload-quizzes', 'gallery-quizzes');
  setupImageUploader('upload-assignment', 'gallery-assignment');

  function setupImageUploader(inputId, galleryId) {
    const fileInput = document.getElementById(inputId);
    const gallery = document.getElementById(galleryId);

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-item';

          const img = document.createElement('img');
          img.src = event.target.result;
          img.className = 'uploaded-img';

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.innerHTML = '&times;';

          wrapper.appendChild(img);
          wrapper.appendChild(deleteBtn);
          gallery.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
      }
      fileInput.value = '';
    });
  }

  // Helper to load data from localStorage
  function loadSavedData(panelId, galleryId) {
    const savedCards = localStorage.getItem(`${panelId}_cards`);
    const savedGallery = localStorage.getItem(`${panelId}_gallery`);

    if (savedCards) {
      document.querySelector(`#${panelId} .cards-container`).innerHTML = savedCards;
    }
    if (savedGallery) {
      document.getElementById(galleryId).innerHTML = savedGallery;
    }
  }
});