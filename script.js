/**
 * İzmir Yol Yardım & Eve Gelen Mobil Tamir Servisi
 * Usta: Yusuf Musab Özdemir | Tel: 0536 429 08 61
 * Dynamic Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. Real-time Status & Clock
  function updateLiveStatus() {
    const statusDot = document.getElementById('liveStatusDot');
    const statusText = document.getElementById('liveStatusText');
    const liveClock = document.getElementById('liveClock');

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    if (liveClock) {
      liveClock.textContent = timeString;
    }
    if (statusText) {
      statusText.textContent = `Şu An Açık • 7/24 Aktif Sahadayız (${timeString})`;
    }
  }
  updateLiveStatus();
  setInterval(updateLiveStatus, 30000);

  // 3. District Estimated Arrival Time Dictionary
  const districtTimes = {
    'bornova': '15 - 20 Dakika',
    'karsiyaka': '15 - 20 Dakika',
    'cigli': '15 - 25 Dakika',
    'bayrakli': '15 - 20 Dakika',
    'konak': '15 - 25 Dakika',
    'buca': '20 - 25 Dakika',
    'karabaglar': '20 - 25 Dakika',
    'gaziemir': '20 - 30 Dakika (Havalimanı Çevresi)',
    'balcova': '20 - 25 Dakika',
    'narlidere': '20 - 25 Dakika',
    'guzelbahce': '25 - 30 Dakika',
    'urla': '30 - 40 Dakika',
    'cesme': '35 - 50 Dakika (Otoban Hattı)',
    'alacati': '35 - 50 Dakika',
    'menemen': '25 - 35 Dakika',
    'aliaga': '35 - 45 Dakika',
    'torbali': '30 - 40 Dakika',
    'menderes': '25 - 35 Dakika',
    'kemalpasa': '30 - 40 Dakika',
    'seferihisar': '35 - 45 Dakika',
    'diger': '20 - 35 Dakika'
  };

  const districtSelect = document.getElementById('districtSelect');
  const estimatedTimeBadge = document.getElementById('estimatedTimeBadge');
  const estimatedTimeVal = document.getElementById('estimatedTimeVal');

  if (districtSelect && estimatedTimeBadge && estimatedTimeVal) {
    districtSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (selected && districtTimes[selected]) {
        estimatedTimeVal.textContent = districtTimes[selected];
        estimatedTimeBadge.classList.remove('hidden');
      } else {
        estimatedTimeBadge.classList.add('hidden');
      }
    });
  }

  // 4. Interactive Request / Quote Generator to WhatsApp
  const requestForm = document.getElementById('smartRequestForm');
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const serviceType = document.getElementById('serviceTypeSelect')?.value || 'Belirtilmedi';
      const district = document.getElementById('districtSelect');
      const districtText = district ? district.options[district.selectedIndex].text : 'İzmir';
      const carBrand = document.getElementById('carBrandInput')?.value || 'Belirtilmedi';
      const userPhone = document.getElementById('userPhoneInput')?.value || '';
      const notes = document.getElementById('userNotesInput')?.value || 'Acil yardım rica ediyorum.';

      const message = `Merhaba Yusuf Usta,\n\nİzmir Yol Yardım & Mobil Servis sitenizden ulaşıyorum.\n\n*Hizmet Talebi:* ${serviceType}\n*Bölge/İlçe:* ${districtText}\n*Araç Marka/Model:* ${carBrand}\n*İletişim Numaram:* ${userPhone}\n*Açıklama / Durum:* ${notes}\n\nKonum ve müsaitlik hakkında bilgi alabilir miyim?`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/905364290861?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');
    });
  }

  // 5. Gallery Filter Tabs
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-orange-500', 'text-white');
        b.classList.add('bg-slate-800', 'text-slate-300');
      });
      btn.classList.add('bg-orange-500', 'text-white');
      btn.classList.remove('bg-slate-800', 'text-slate-300');

      const filterCategory = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterCategory === 'all' || itemCategory === filterCategory) {
          item.classList.remove('hidden');
          item.classList.add('block');
        } else {
          item.classList.add('hidden');
          item.classList.remove('block');
        }
      });
    });
  });

  // 6. Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightbox = document.getElementById('closeLightbox');

  document.querySelectorAll('.open-lightbox').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const imgUrl = el.getAttribute('data-img');
      const caption = el.getAttribute('data-caption') || 'İzmir Yol Yardım & Yusuf Usta';

      if (lightboxModal && lightboxImg && lightboxCaption) {
        lightboxImg.src = imgUrl;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.remove('hidden');
        lightboxModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeLightbox && lightboxModal) {
    closeLightbox.addEventListener('click', () => {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      document.body.style.overflow = '';
    });

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.add('hidden');
        lightboxModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // 7. Accordion FAQ
  const accordionButtons = document.querySelectorAll('.accordion-btn');
  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.accordion-icon');
      const isOpen = content.classList.contains('active');

      // Close all
      document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        content.classList.add('active');
        if (icon) icon.classList.add('active');
      }
    });
  });

  // 8. Location Modal (WhatsApp Konum Gönderme Rehberi)
  const locationModal = document.getElementById('locationGuideModal');
  const openLocationGuideBtns = document.querySelectorAll('.open-location-guide');
  const closeLocationGuide = document.getElementById('closeLocationGuide');

  if (openLocationGuideBtns && locationModal) {
    openLocationGuideBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        locationModal.classList.remove('hidden');
        locationModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  if (closeLocationGuide && locationModal) {
    closeLocationGuide.addEventListener('click', () => {
      locationModal.classList.add('hidden');
      locationModal.classList.remove('flex');
      document.body.style.overflow = '';
    });

    locationModal.addEventListener('click', (e) => {
      if (e.target === locationModal) {
        locationModal.classList.add('hidden');
        locationModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // 9. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
