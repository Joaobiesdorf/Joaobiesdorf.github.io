document.addEventListener('DOMContentLoaded', function() {
    // Elementos principais
    const projectCards = document.querySelectorAll('.project-card');
    const cardsHand = document.querySelector('.cards-hand');
    const header = document.querySelector('.dark-header');
    
    // Configurações do leque
    const fanSettings = {
        maxAngle: 30,         // Ângulo máximo das cartas laterais
        maxActiveAngle: 15,   // Ângulo quando uma carta está ativa
        baseTranslateX: -30,  // Deslocamento horizontal base
        activeTranslateY: -120, // Translação vertical quando ativo
        hoverTranslateY: -60,  // Translação no hover
        cardSpacing: 30       // Espaçamento entre cartas
    };
    
    // Inicialização
    initPortfolio();
    
    function initPortfolio() {
        setupFanSpread();
        setupCardEvents();
        if (header) setupParallax();
        setupTypewriter();
        window.addEventListener('resize', handleResize);
    }
    
    function setupFanSpread() {
        const cards = Array.from(projectCards);
        const totalCards = cards.length;
        
        if (window.innerWidth <= 768) {
            setupVerticalLayout();
            return;
        }
        
        cards.forEach((card, index) => {
            const positionFactor = index / (totalCards - 1);
            
            // Ângulo diminui da direita para esquerda
            const angle = fanSettings.maxAngle * (1 - positionFactor * 2);
            
            // Deslocamento horizontal aumenta da direita para esquerda
            const translateX = fanSettings.baseTranslateX * positionFactor;
            
            // Pequeno deslocamento vertical para efeito de leque
            const translateY = Math.abs(angle) * 0.8;
            
            // Rotação adicional para efeito mais natural
            const rotateZ = angle * 0.3;
            
            card.style.transform = `
                rotate(${angle}deg) 
                rotateZ(${rotateZ}deg)
                translateX(${translateX}px) 
                translateY(${translateY}px)
            `;
            
            // Z-index mais alto para cartas mais à direita
            card.style.zIndex = totalCards - index;
            
            // Espaçamento entre cartas
            card.style.marginRight = `-${fanSettings.cardSpacing}px`;
        });
    }
    
    function setupVerticalLayout() {
        projectCards.forEach((card, index) => {
            card.style.transform = 'none';
            card.style.zIndex = projectCards.length - index;
            card.style.marginBottom = '-80px';
            card.style.marginRight = '0';
        });
    }
    
    function setupCardEvents() {
        projectCards.forEach(card => {
            card.addEventListener('click', handleCardClick);
            
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', handleCardHover);
                card.addEventListener('mouseleave', handleCardHoverOut);
            }
        });
        
        document.addEventListener('click', handleOutsideClick);
    }
    
    function handleCardClick(e) {
        e.stopPropagation();
        const clickedCard = e.currentTarget;
        
        if (clickedCard.classList.contains('active')) return;
        
        resetAllCards();
        activateCard(clickedCard);
        scrollToCard(clickedCard);
    }
    
    function resetAllCards() {
        projectCards.forEach(card => {
            card.classList.remove('active');
            resetCardPosition(card);
        });
    }
    
    function activateCard(card) {
        card.classList.add('active');
        
        if (window.innerWidth <= 768) {
            card.style.transform = 'translateY(-80px) scale(1.1)';
            card.style.zIndex = 100;
            return;
        }
        
        // Animação para desktop com sobreposição direita->esquerda
        card.style.transform = `
            rotate(0deg) 
            rotateZ(0deg)
            translateX(0px) 
            translateY(${fanSettings.activeTranslateY}px) 
            scale(1.1)
        `;
        card.style.zIndex = 100;
        card.style.boxShadow = '0 20px 40px rgba(230, 57, 70, 0.3)';
        
        adjustOtherCards(card);
    }
    
    function adjustOtherCards(activeCard) {
        const cards = Array.from(projectCards);
        const activeIndex = cards.indexOf(activeCard);
        const totalCards = cards.length;
        
        cards.forEach((card, index) => {
            if (card === activeCard) return;
            
            // Fator de distância do card ativo (0 a 1)
            const distanceFactor = Math.abs(index - activeIndex) / totalCards;
            
            // Cartas à direita do ativo têm ângulo positivo, à esquerda negativo
            const direction = index > activeIndex ? 1 : -1;
            const angle = direction * fanSettings.maxActiveAngle * distanceFactor * 2;
            
            // Deslocamento horizontal proporcional à distância
            const translateX = -50 * distanceFactor * direction;
            
            // Pequeno deslocamento vertical
            const translateY = 30 * distanceFactor;
            
            // Rotação Z para efeito de perspectiva
            const rotateZ = angle * 0.3;
            
            card.style.transform = `
                rotate(${angle}deg)
                rotateZ(${rotateZ}deg)
                translateX(${translateX}px)
                translateY(${translateY}px)
            `;
            
            // Z-index: cartas mais próximas do ativo ficam por cima
            card.style.zIndex = totalCards - Math.abs(index - activeIndex);
        });
    }
    
    function resetCardPosition(card) {
        if (window.innerWidth <= 768) {
            const index = Array.from(projectCards).indexOf(card);
            card.style.transform = 'none';
            card.style.zIndex = projectCards.length - index;
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
            return;
        }
        
        const cards = Array.from(projectCards);
        const index = cards.indexOf(card);
        const totalCards = cards.length;
        const positionFactor = index / (totalCards - 1);
        
        const angle = fanSettings.maxAngle * (1 - positionFactor * 2);
        const translateX = fanSettings.baseTranslateX * positionFactor;
        const translateY = Math.abs(angle) * 0.8;
        const rotateZ = angle * 0.2;
        
        card.style.transform = `
            rotate(${angle}deg)
            rotateZ(${rotateZ}deg)
            translateX(${translateX}px)
            translateY(${translateY}px)
        `;
        card.style.zIndex = totalCards - index;
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    }
    
    function handleCardHover(e) {
        const card = e.currentTarget;
        if (card.classList.contains('active')) return;
        
        const index = Array.from(projectCards).indexOf(card);
        const positionFactor = index / (projectCards.length - 1);
        
        // Mantém o ângulo original, apenas ajusta a posição Y
        const originalAngle = fanSettings.maxAngle * (1 - positionFactor * 2);
        const originalRotateZ = originalAngle * 0.2;
        const originalTranslateX = fanSettings.baseTranslateX * positionFactor;
        
        // Aplica apenas o deslocamento vertical mantendo outras transformações
        card.style.transform = `
            rotate(${originalAngle}deg)
            rotateZ(${originalRotateZ}deg)
            translateX(${originalTranslateX}px)
            translateY(${fanSettings.hoverTranslateY}px)
        `;
        card.style.zIndex = 50;
        
        // Efeito de sombra para dar profundidade
        card.style.boxShadow = '0 20px 40px rgba(230, 57, 70, 0.3)';
    }
    
    function handleCardHoverOut(e) {
        const card = e.currentTarget;
        if (card.classList.contains('active')) return;
        
        // Volta à posição original mantendo a transição suave
        resetCardPosition(card);
    }
    
    function handleOutsideClick() {
        resetAllCards();
        if (window.innerWidth > 768) {
            setupFanSpread();
        }
    }
    
    function handleResize() {
        if (window.innerWidth <= 768) {
            setupVerticalLayout();
        } else {
            setupFanSpread();
            resetAllCards();
        }
    }
    
    function scrollToCard(card) {
        setTimeout(() => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }, 300);
    }
    
    function setupParallax() {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            header.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    function setupTypewriter() {
        const tagline = document.querySelector('.tagline');
        if (!tagline) return;
        
        const texts = [
            "Desenvolvedor Full Stack",
            "Especialista em JavaScript",
            "Criador de Soluções Digitais"
        ];
        let currentTextIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let text = '';
        let i = 0;
        
        function typeWriter() {
            const currentText = texts[currentTextIndex];
            
            if (isDeleting) {
                text = currentText.substring(0, i - 1);
                i--;
                typingSpeed = 50;
            } else {
                text = currentText.substring(0, i + 1);
                i++;
                typingSpeed = 100;
            }
            
            tagline.textContent = text;
            
            if (!isDeleting && text === currentText) {
                isDeleting = true;
                typingSpeed = 1500; // Pausa no final
            } else if (isDeleting && text === '') {
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                typingSpeed = 500; // Pausa no início
            }
            
            setTimeout(typeWriter, typingSpeed);
        }
        
        setTimeout(typeWriter, 1000);
    }
});
document.addEventListener("DOMContentLoaded", function () {
        const modal = document.getElementById("videoModal");
        const video = document.getElementById("videoPlayer");
        const closeBtn = document.querySelector(".close");
        const demoBtn = document.getElementById("cervejariaDemo");

        if (demoBtn) {
          demoBtn.addEventListener("click", function (e) {
            e.preventDefault();
            modal.style.display = "flex";
            video.play();
          });
        }

        if (closeBtn) {
          closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            video.pause();
            video.currentTime = 0;
          });
        }

        window.addEventListener("click", function (event) {
          if (event.target === modal) {
            modal.style.display = "none";
            video.pause();
            video.currentTime = 0;
          }
        });
      });