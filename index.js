document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  // Load saved gallery content from LocalStorage on page load
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

  // Event Delegation for Image Delete Buttons
  document.getElementById('page-2').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const imageItem = e.target.closest('.image-item');
      if (imageItem) {
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

  // Save gallery images array to LocalStorage
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const panelId = e.target.getAttribute('data-panel');
      const galleryId = panelId === 'tab-assignment' ? 'gallery-assignment' : `gallery-${panelId.replace('tab-', '')}`;
      const gallery = document.getElementById(galleryId);
      
      const images = Array.from(gallery.querySelectorAll('.uploaded-img')).map(img => img.src);
      
      try {
        localStorage.setItem(`${panelId}_images`, JSON.stringify(images));
        alert('Images saved successfully!');
      } catch (err) {
        alert('Storage limit reached! Please try saving smaller images or delete unused ones.');
      }
    });
  });

  // Setup Upload Logic for Each Section
  setupImageUploader('upload-activity', 'gallery-activity');
  setupImageUploader('upload-quizzes', 'gallery-quizzes');
  setupImageUploader('upload-assignment', 'gallery-assignment');

  function setupImageUploader(inputId, galleryId) {
    const fileInput = document.getElementById(inputId);
    const gallery = document.getElementById(galleryId);

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        compressImage(file, 600, 0.7, (compressedBase64) => {
          createImageElement(compressedBase64, gallery);
        });
      }
      fileInput.value = '';
    });
  }

  // Helper to create and insert image markup
  function createImageElement(src, gallery) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-item';

    const img = document.createElement('img');
    img.src = src;
    img.className = 'uploaded-img';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '&times;';

    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    gallery.appendChild(wrapper);
  }

  // Compress image dimensions and quality before saving to fit LocalStorage
  function compressImage(file, maxWidth, quality, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Helper to load saved image arrays from LocalStorage
  function loadSavedData(panelId, galleryId) {
    const savedImages = localStorage.getItem(`${panelId}_images`);
    const gallery = document.getElementById(galleryId);

    if (savedImages && gallery) {
      const imageArray = JSON.parse(savedImages);
      imageArray.forEach(src => createImageElement(src, gallery));
    }
  }
});