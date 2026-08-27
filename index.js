document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  // Profile Modal Elements
  const profileImgTrigger = document.getElementById('profile-img-trigger');
  const profileModal = document.getElementById('profile-modal');
  const closeModal = document.querySelector('.close-modal');
  const fullProfileView = document.getElementById('full-profile-view');
  const uploadProfile = document.getElementById('upload-profile');
  const deleteProfileBtn = document.getElementById('delete-profile-btn');
  const saveProfileBtn = document.getElementById('save-profile-btn');

  // Default image placeholder
  const defaultPlaceholder = 'https://via.placeholder.com/150';
  let tempProfileSrc = '';

  // Load Saved Data on Startup
  loadSavedProfile();
  loadSavedData('tab-activity', 'gallery-activity');
  loadSavedData('tab-quizzes', 'gallery-quizzes');
  loadSavedData('tab-assignment', 'gallery-assignment');

  // Page Navigation
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

  // Modal Open & Close Logic
  profileImgTrigger.addEventListener('click', () => {
    profileModal.style.display = 'flex';
    fullProfileView.src = profileImgTrigger.src;
    tempProfileSrc = profileImgTrigger.src;
  });

  closeModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      profileModal.style.display = 'none';
    }
  });

  // Modal Function 1: Add Image
  uploadProfile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 400, 0.8, (compressedBase64) => {
        fullProfileView.src = compressedBase64;
        tempProfileSrc = compressedBase64;
      });
    }
    uploadProfile.value = '';
  });

  // Modal Function 2: Delete Image
  deleteProfileBtn.addEventListener('click', () => {
    fullProfileView.src = defaultPlaceholder;
    tempProfileSrc = defaultPlaceholder;
  });

  // Modal Function 3: Save Image
  saveProfileBtn.addEventListener('click', () => {
    profileImgTrigger.src = tempProfileSrc;
    try {
      localStorage.setItem('user_profile_img', tempProfileSrc);
      alert('Profile image saved successfully!');
      profileModal.style.display = 'none';
    } catch (err) {
      alert('Failed to save. File size might be too large.');
    }
  });

  // Delete Individual Gallery Image
  document.getElementById('page-2').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const imageItem = e.target.closest('.image-item');
      if (imageItem) imageItem.remove();
    }
  });

  // Clear Gallery Images
  document.querySelectorAll('.clear-img-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const galleryId = e.target.getAttribute('data-gallery');
      if (galleryId) {
        document.getElementById(galleryId).innerHTML = '';
      }
    });
  });

  // Save Gallery Images
  document.querySelectorAll('.save-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const panelId = e.target.getAttribute('data-panel');
      if (!panelId) return;

      const galleryId = panelId === 'tab-assignment' ? 'gallery-assignment' : `gallery-${panelId.replace('tab-', '')}`;
      const gallery = document.getElementById(galleryId);
      const images = Array.from(gallery.querySelectorAll('.uploaded-img')).map(img => img.src);

      try {
        localStorage.setItem(`${panelId}_images`, JSON.stringify(images));
        alert('Images saved successfully!');
      } catch (err) {
        alert('Storage limit reached! Try removing some images.');
      }
    });
  });

  // Setup Gallery Uploads
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

  function loadSavedProfile() {
    const savedProfile = localStorage.getItem('user_profile_img');
    if (savedProfile) {
      profileImgTrigger.src = savedProfile;
      fullProfileView.src = savedProfile;
    }
  }

  function loadSavedData(panelId, galleryId) {
    const savedImages = localStorage.getItem(`${panelId}_images`);
    const gallery = document.getElementById(galleryId);

    if (savedImages && gallery) {
      const imageArray = JSON.parse(savedImages);
      imageArray.forEach(src => createImageElement(src, gallery));
    }
  }
});