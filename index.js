document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

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

  // Attach Delete functionality using Event Delegation
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

  // Image Upload Logic for Each Category
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
      fileInput.value = ''; // Reset input to allow re-uploading the same file if needed
    });
  }
});