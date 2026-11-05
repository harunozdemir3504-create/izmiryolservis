/**
 * İzmir Yol Servis & 7/24 Acil Yol Yardım ve Mobil Servis
 * Tel: 0536 429 08 61
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

      const message = `Merhaba İzmir Yol Servis,\n\nsitenizden ulaşıyorum.\n\n*Hizmet Talebi:* ${serviceType}\n*Bölge/İlçe:* ${districtText}\n*Araç Marka/Model:* ${carBrand}\n*İletişim Numaram:* ${userPhone}\n*Açıklama / Durum:* ${notes}\n\nKonum ve müsaitlik hakkında bilgi alabilir miyim?`;

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
      const caption = el.getAttribute('data-caption') || 'İzmir Yol Servis & 7/24 Acil Yardım';

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

  // 10. Smart GPS Live Location Detection & WhatsApp Sender
  const sendLocationBtn = document.getElementById('sendCurrentLocationBtn');
  if (sendLocationBtn) {
    sendLocationBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Tarayıcınız anlık GPS konum servisini desteklemiyor. WhatsApp üzerinden sohbet ekranında ataç simgesine basıp "Konum Paylaş" seçeneğini kullanabilirsiniz.');
        window.open('https://wa.me/905364290861?text=Merhaba%20İzmir%20Yol%20Servis,%20yolda%20kaldım.%20Konumumu%20iletiyorum.', '_blank');
        return;
      }

      sendLocationBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> <span>GPS Konumunuz Alınıyor...</span>';
      if (window.lucide) lucide.createIcons();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
          const message = `Merhaba İzmir Yol Servis,\n\nsitenizden yazıyorum. Bulunduğum canlı GPS konumum:\n${mapsUrl}\n\nAcil yol yardım / mobil servis desteği rica ediyorum.`;

          window.open(`https://wa.me/905364290861?text=${encodeURIComponent(message)}`, '_blank');

          sendLocationBtn.innerHTML = '<i data-lucide="check" class="w-4 h-4 text-emerald-300"></i> <span>Konum WhatsApp\'a Gönderildi!</span>';
          if (window.lucide) lucide.createIcons();

          setTimeout(() => {
            sendLocationBtn.innerHTML = '<i data-lucide="crosshair" class="w-4 h-4"></i> <span>Canlı GPS Konumumu Bul ve Servise Gönder</span>';
            if (window.lucide) lucide.createIcons();
          }, 4000);
        },
        (error) => {
          alert('GPS konumunuza izin verilmedi veya ulaşılamadı. WhatsApp üzerinden doğrudan sohbet ekranında "Konum Paylaş" simgesine basabilirsiniz.');
          window.open('https://wa.me/905364290861?text=Merhaba%20İzmir%20Yol%20Servis,%20yolda%20kaldım.%20Konumumu%20iletiyorum.', '_blank');
          sendLocationBtn.innerHTML = '<i data-lucide="crosshair" class="w-4 h-4"></i> <span>Canlı GPS Konumumu Bul ve Servise Gönder</span>';
          if (window.lucide) lucide.createIcons();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // 11. Hero Background Crossfading Slideshow
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (bgSlides.length > 1) {
    let currentBgIndex = 0;
    setInterval(() => {
      bgSlides[currentBgIndex].classList.remove('opacity-100');
      bgSlides[currentBgIndex].classList.add('opacity-0');

      currentBgIndex = (currentBgIndex + 1) % bgSlides.length;

      bgSlides[currentBgIndex].classList.remove('opacity-0');
      bgSlides[currentBgIndex].classList.add('opacity-100');
    }, 4500);
  }

  // 12. Hero Right Card Real Photo Carousel (Çekici, Usta, Kapıda Tamir)
  const carouselContainer = document.getElementById('heroPhotoCarousel');
  const carouselItems = document.querySelectorAll('.hero-carousel-item');
  const carouselDots = document.querySelectorAll('.hero-dot');
  const carouselPrevBtn = document.getElementById('heroCarouselPrev');
  const carouselNextBtn = document.getElementById('heroCarouselNext');

  if (carouselItems.length > 1) {
    let currentSlide = 0;
    let carouselTimer = null;

    function goToSlide(index) {
      carouselItems.forEach((item, i) => {
        if (i === index) {
          item.classList.remove('opacity-0', 'pointer-events-none');
          item.classList.add('opacity-100');
        } else {
          item.classList.remove('opacity-100');
          item.classList.add('opacity-0', 'pointer-events-none');
        }
      });

      carouselDots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.remove('bg-white/40');
          dot.classList.add('bg-white', 'w-5');
        } else {
          dot.classList.remove('bg-white', 'w-5');
          dot.classList.add('bg-white/40');
        }
      });

      const tabBtns = document.querySelectorAll('.hero-tab-btn');
      tabBtns.forEach((tab, i) => {
        if (i === index) {
          tab.classList.remove('bg-slate-800', 'text-slate-300');
          tab.classList.add('bg-amber-500', 'text-black', 'shadow');
        } else {
          tab.classList.remove('bg-amber-500', 'text-black', 'shadow');
          tab.classList.add('bg-slate-800', 'text-slate-300');
        }
      });

      currentSlide = index;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % carouselItems.length);
    }

    function prevSlide() {
      goToSlide((currentSlide - 1 + carouselItems.length) % carouselItems.length);
    }

    function startAutoPlay() {
      if (carouselTimer) clearInterval(carouselTimer);
      carouselTimer = setInterval(nextSlide, 3500);
    }

    function stopAutoPlay() {
      if (carouselTimer) clearInterval(carouselTimer);
    }

    if (carouselNextBtn) carouselNextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
    if (carouselPrevBtn) carouselPrevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

    carouselDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoPlay();
      });
    });

    const tabBtns = document.querySelectorAll('.hero-tab-btn');
    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        goToSlide(idx);
        startAutoPlay();
      });
    });

    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoPlay);
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    goToSlide(0);
    startAutoPlay();
  }

  // 13. Interactive Appointment & Availability Calendar
  const calendarGrid = document.getElementById('calendarGrid');
  const calMonthTitle = document.getElementById('calMonthTitle');
  const calPrevMonth = document.getElementById('calPrevMonth');
  const calNextMonth = document.getElementById('calNextMonth');
  const calendarDetailCard = document.getElementById('calendarDetailCard');
  const calSelectedDateText = document.getElementById('calSelectedDateText');
  const calCloseDetail = document.getElementById('calCloseDetail');
  const calCallLink = document.getElementById('calCallLink');
  const calWaLink = document.getElementById('calWaLink');
  const timeSlotBtns = document.querySelectorAll('.cal-time-slot');

  if (calendarGrid && calMonthTitle) {
    const monthNames = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

    let currentDate = new Date();
    let selectedDateObj = new Date();
    let selectedTimeSlot = 'Sabah (09:00 - 13:00)';

    function updateActionLinks(dateObj, slot) {
      const dayNum = dateObj.getDate();
      const monthName = monthNames[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      const dayName = dayNames[dateObj.getDay()];
      const fullDateStr = `${dayNum} ${monthName} ${year}, ${dayName}`;

      if (calSelectedDateText) {
        calSelectedDateText.textContent = fullDateStr;
      }

      const waMessage = `Merhaba İzmir Yol Servis,\n\n${fullDateStr} tarihi (${slot}) için kapıda bakım / yol servis randevusu almak istiyorum. Müsaitlik durumunu teyit edebilir misiniz?`;
      if (calWaLink) {
        calWaLink.href = `https://wa.me/905364290861?text=${encodeURIComponent(waMessage)}`;
      }
      if (calCallLink) {
        calCallLink.href = 'tel:05364290861';
      }
    }

    function renderCalendar(date) {
      calendarGrid.innerHTML = '';
      const year = date.getFullYear();
      const month = date.getMonth();

      calMonthTitle.textContent = `${monthNames[month]} ${year}`;

      const firstDayOfMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Monday is index 0 in TR calendar: Sunday=0 -> 6, Mon=1 -> 0
      let startDay = firstDayOfMonth.getDay() - 1;
      if (startDay === -1) startDay = 6;

      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

      // Empty padding cells for previous month
      for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'p-2 sm:p-3 rounded-xl bg-slate-950/30 opacity-20 pointer-events-none text-center text-xs';
        calendarGrid.appendChild(emptyCell);
      }

      // Real days
      for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, month, day);
        const isToday = isCurrentMonth && today.getDate() === day;
        const isSelected = selectedDateObj &&
          selectedDateObj.getFullYear() === year &&
          selectedDateObj.getMonth() === month &&
          selectedDateObj.getDate() === day;

        const dayBtn = document.createElement('button');
        dayBtn.type = 'button';
        dayBtn.className = `cal-day-cell group relative p-2 sm:p-3 rounded-2xl border text-center transition flex flex-col items-center justify-between min-h-[58px] sm:min-h-[72px] cursor-pointer ${
          isSelected 
            ? 'bg-amber-500 text-black border-amber-300 font-black shadow-lg shadow-amber-500/20 scale-105 z-10' 
            : isToday 
              ? 'bg-slate-800/90 border-emerald-500/80 text-white font-bold ring-2 ring-emerald-500/30' 
              : 'bg-slate-900/80 border-slate-800 hover:border-amber-400/50 text-slate-200 hover:bg-slate-800'
        }`;

        let statusBadge = isSelected
          ? '<span class="text-[9px] font-black uppercase text-black">Seçildi</span>'
          : isToday
            ? '<span class="text-[9px] font-extrabold uppercase bg-emerald-500 text-black px-1 rounded animate-pulse">Bugün</span>'
            : '<span class="text-[9px] text-emerald-400 font-semibold group-hover:text-amber-300">7/24 Açık</span>';

        dayBtn.innerHTML = `
          <span class="text-xs sm:text-base font-black ${isSelected ? 'text-black' : isToday ? 'text-emerald-400' : 'text-white'}">${day}</span>
          ${statusBadge}
        `;

        dayBtn.addEventListener('click', () => {
          selectedDateObj = cellDate;
          renderCalendar(currentDate);
          updateActionLinks(selectedDateObj, selectedTimeSlot);
          if (calendarDetailCard) {
            calendarDetailCard.classList.remove('hidden');
            calendarDetailCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });

        calendarGrid.appendChild(dayBtn);
      }

      if (window.lucide) lucide.createIcons();
    }

    if (calPrevMonth) {
      calPrevMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
      });
    }

    if (calNextMonth) {
      calNextMonth.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
      });
    }

    if (calCloseDetail && calendarDetailCard) {
      calCloseDetail.addEventListener('click', () => {
        calendarDetailCard.classList.add('hidden');
      });
    }

    timeSlotBtns.forEach(slotBtn => {
      slotBtn.addEventListener('click', () => {
        timeSlotBtns.forEach(b => {
          b.classList.remove('bg-amber-500/20', 'border-amber-500/50', 'text-amber-300', 'font-bold');
          b.classList.add('bg-slate-800/80', 'border-slate-700', 'text-slate-200', 'font-medium');
        });
        slotBtn.classList.remove('bg-slate-800/80', 'border-slate-700', 'text-slate-200', 'font-medium');
        slotBtn.classList.add('bg-amber-500/20', 'border-amber-500/50', 'text-amber-300', 'font-bold');

        selectedTimeSlot = slotBtn.getAttribute('data-slot') || 'Sabah (09:00 - 13:00)';
        updateActionLinks(selectedDateObj, selectedTimeSlot);
      });
    });

    renderCalendar(currentDate);
    updateActionLinks(selectedDateObj, selectedTimeSlot);
  }
});

