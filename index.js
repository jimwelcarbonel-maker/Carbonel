document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.tab-panel');

  // Switch to Page 2
  nextBtn.addEventListener('click', () => {
    page1.classList.remove('active');
    page2.classList.add('active');
  });

  // Switch back to Page 1
  backBtn.addEventListener('click', () => {
    page2.classList.remove('active');
    page1.classList.add('active');
  });

  // Handle Tab Switching on Page 2
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      e.target.classList.add('active');
      const targetPanelId = e.target.getAttribute('data-tab');
      document.getElementById(targetPanelId).classList.add('active');
    });
  });
});