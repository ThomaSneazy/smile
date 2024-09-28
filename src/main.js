
document.addEventListener('DOMContentLoaded', function() {
  const sliderWraps = document.querySelectorAll(".slider_wrap");
  
  sliderWraps.forEach(function(slider) {
    const slides = slider.querySelectorAll(".slider_cms_item");
    const dots = slider.querySelectorAll(".slider_dot");
    const totalSlides = slides.length;
    let currentIndex = 0;
    let slideInterval;
    let dotLineInterval;

    // Initialiser SplitType pour tous les titres
    const titles = slider.querySelectorAll('.h1__cms__title');
    titles.forEach(title => {
      new SplitType(title, { types: 'lines' });
      gsap.set(title.querySelectorAll('.line'), { 
        yPercent: 100,
        rotateX: -20,
        opacity: 0
      });
    });

    // Initialiser les boutons
    slides.forEach(slide => {
      const button = slide.querySelector('.button.is-slider-item');
      if (button) {
        gsap.set(button, {
          yPercent: 50,
          opacity: 0
        });
      }
    });

    function showSlide(index) {
      const prevItem = slides[currentIndex];
      const nextItem = slides[index];
      
      slides.forEach(slide => slide.style.display = "none");
      prevItem.style.display = "flex";
      nextItem.style.display = "flex";

      const direction = index > currentIndex ? 'right' : 'left';
      
      // Animation du clip-path
      if (direction === 'right') {
        gsap.fromTo(nextItem, 
          { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, -70% 100%)", duration: 1, ease: "power2.inOut" }
        );
        gsap.fromTo(prevItem,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 0% 0%, -70% 100%, 0% 100%)", duration: 1, ease: "power2.inOut" }
        );
      } else {
        gsap.fromTo(nextItem,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1, ease: "power2.inOut" }
        );
        gsap.fromTo(prevItem,
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
          { clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)", duration: 1, ease: "power2.inOut" }
        );
      }

      // Animation des titres
      const prevTitle = prevItem.querySelector('.h1__cms__title');
      const nextTitle = nextItem.querySelector('.h1__cms__title');
      
      // Faire descendre le titre précédent
      gsap.to(prevTitle.querySelectorAll('.line'), {
        yPercent: 100,
        rotateX: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.in"
      });

      // Faire monter le nouveau titre
      gsap.fromTo(nextTitle.querySelectorAll('.line'),
        { yPercent: 100, rotateX: -20, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.5 // Délai pour laisser le temps au titre précédent de descendre
        }
      );

      // Animation des boutons
      const prevButton = prevItem.querySelector('.button.is-slider-item');
      const nextButton = nextItem.querySelector('.button.is-slider-item');

      if (prevButton) {
        gsap.to(prevButton, {
          yPercent: 50,
          opacity: 0,
          duration: 0.5,
          ease: "power3.in"
        });
      }

      if (nextButton) {
        gsap.fromTo(nextButton,
          { yPercent: 50, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.7 // Délai pour que le bouton apparaisse après le titre
          }
        );
      }

      updateDots(index);
      currentIndex = index;
    }

    function updateDots(index) {
      dots.forEach((dot, i) => {
        const dotLine = dot.querySelector('.slider_dot_line');
        if (i === index) {
          dot.classList.add('active');
          animateDotLine(dotLine);
        } else {
          dot.classList.remove('active');
          dotLine.style.width = '0%';
        }
      });
    }

    function animateDotLine(dotLine) {
      let width = 0;
      if (dotLineInterval) clearInterval(dotLineInterval);
      
      dotLineInterval = setInterval(() => {
        width += 100 / (6000 / 16); // 16ms is approx. one frame at 60fps
        dotLine.style.width = `${width}%`;
        
        if (width >= 100) {
          clearInterval(dotLineInterval);
        }
      }, 16);
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % totalSlides;
      showSlide(nextIndex);
    }

    function startSlider() {
      slides.forEach(slide => slide.style.display = "none");
      slides[0].style.display = "flex";
      updateDots(0);
      
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      
      slideInterval = setInterval(nextSlide, 6000);

      // Animer le premier titre
      const firstTitle = slides[0].querySelector('.h1__cms__title');
      gsap.to(firstTitle.querySelectorAll('.line'), {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.2
      });

      // Animer le premier bouton
      const firstButton = slides[0].querySelector('.button.is-slider-item');
      if (firstButton) {
        gsap.to(firstButton, {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          delay: 0.7 
        });
      }
    }

    startSlider();
  });
});
