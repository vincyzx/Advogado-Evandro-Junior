document.addEventListener('DOMContentLoaded', function() {
    // --- Funções para os Botões do WhatsApp ---
    const whatsappNumber = '5515997206188'; // Seu número de WhatsApp com código do país (55) e DDD (15)

    function openWhatsAppChat(message) {
        const encodedNumber = encodeURIComponent(whatsappNumber);
        const encodedMessage = encodeURIComponent(message);
        
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        let url;
        if (isMobile) {
            // Tenta abrir o aplicativo do WhatsApp via link universal wa.me
            // Este link é o mais recomendado pelo WhatsApp para tentar abrir o app.
            url = `https://wa.me/${encodedNumber}?text=${encodedMessage}`;
            
            // Abre a URL em uma nova janela/aba.
            const newWindow = window.open(url, '_blank');

            // Adiciona um pequeno atraso e verifica o estado da nova janela.
            // Isso serve como um fallback para o WhatsApp Web se o app não abrir.
            setTimeout(() => {
                if (newWindow && !newWindow.closed && 
                    (newWindow.location.href.startsWith('about:blank') || !newWindow.location.href.includes('whatsapp.com'))) {
                    // Se a janela ainda estiver aberta e em 'about:blank' (não redirecionou para o app),
                    // OU se não contém "whatsapp.com" no URL (indicando falha no app),
                    // então força o redirecionamento da mesma janela para o WhatsApp Web.
                    newWindow.location.href = `https://web.whatsapp.com/send/?phone=${encodedNumber}&text=${encodedMessage}`;
                }
            }, 500); // Espera 500ms (meio segundo) antes de verificar
        } else {
            // No computador, abre no WhatsApp Web diretamente
            url = `https://web.whatsapp.com/send/?phone=${encodedNumber}&text=${encodedMessage}`;
            window.open(url, '_blank');
        }
    }

    // Botão WhatsApp Fixo
    const whatsappFixedButton = document.getElementById('whatsappFixedButton');
    if (whatsappFixedButton) {
        whatsappFixedButton.addEventListener('click', function() {
            openWhatsAppChat('Olá! Vim do seu site e gostaria de conversar sobre um assunto jurídico.');
        });
    }

    // Botão "Entrar em Contato" (banner)
    const contactButton = document.getElementById('contactButton');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            openWhatsAppChat('Olá! Vim do seu site e gostaria de saber mais sobre seus serviços em Direito de Família e Sucessões.');
        });
    }

    // Botão "Agendar Atendimento Online"
    const scheduleButton = document.getElementById('scheduleButton');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', function() {
            openWhatsAppChat('Olá! Gostaria de agendar um atendimento online para discutir meu caso de Direito de Família/Sucessões.');
        });
    }

    // --- Nova Lógica para o Formulário de Contato (AJAX com Formspree) ---
    const contactForm = document.querySelector('.faleConosco form');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    const formMessageContainer = document.createElement('div'); // Cria um container para mensagens do formulário
    formMessageContainer.id = 'form-message-container'; // Adiciona um ID para estilização
    if (contactForm) {
        contactForm.prepend(formMessageContainer); // Adiciona o container de mensagens antes do formulário
    }

    if (contactForm && submitButton) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário e o redirecionamento

            // Limpa mensagens anteriores
            formMessageContainer.innerHTML = '';
            formMessageContainer.className = ''; // Limpa classes de estilo

            // Desabilita o botão e mostra "Enviando..."
            submitButton.disabled = true;
            submitButton.innerHTML = 'Enviando... <i class="fas fa-spinner fa-spin"></i>';

            const formData = new FormData(contactForm);
            const formspreeEndpoint = contactForm.action;

            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Crucial para o Formspree responder em JSON para AJAX
                    }
                });

                if (response.ok) {
                    // Sucesso!
                    contactForm.reset(); // Limpa os campos do formulário
                    formMessageContainer.textContent = 'Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.';
                    formMessageContainer.className = 'form-success-message'; // Adiciona classe para estilização de sucesso

                    submitButton.innerHTML = 'Mensagem Enviada! <i class="fas fa-check"></i>';
                    submitButton.style.backgroundColor = 'var(--secondary-color)'; // Cor de sucesso

                    // Esconde a mensagem e reseta o botão após alguns segundos
                    setTimeout(() => {
                        formMessageContainer.textContent = '';
                        formMessageContainer.className = '';
                        submitButton.innerHTML = 'Enviar Mensagem <i class="fas fa-paper-plane"></i>';
                        submitButton.style.backgroundColor = 'var(--primary-color)'; // Volta à cor original
                        submitButton.disabled = false;
                    }, 5000); // Mensagem visível por 5 segundos

                } else {
                    // Erro no envio
                    const data = await response.json();
                    let errorMessage = 'Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
                    if (data && data.errors) {
                        errorMessage = data.errors.map(err => err.message).join(', ');
                    }
                    formMessageContainer.textContent = errorMessage;
                    formMessageContainer.className = 'form-error-message'; // Adiciona classe para estilização de erro

                    submitButton.innerHTML = 'Tentar Novamente <i class="fas fa-times-circle"></i>';
                    submitButton.style.backgroundColor = 'red';
                    submitButton.disabled = false;
                }
            } catch (error) {
                console.error('Erro na rede ou no envio:', error);
                formMessageContainer.textContent = 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
                formMessageContainer.className = 'form-error-message';

                submitButton.innerHTML = 'Enviar Mensagem <i class="fas fa-paper-plane"></i>';
                submitButton.style.backgroundColor = 'var(--primary-color)';
                submitButton.disabled = false;
            }
        });
    }

    // --- Lógica para Animações de Scroll (Nova Implementação) ---

    // Função para verificar se um elemento está visível na tela
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Seleciona todos os elementos que devem ter animação de "fade-in-up"
    const cards = document.querySelectorAll('.card');
    // Seleciona todos os elementos que devem ter animação de "fade-in-zoom"
    const stepCards = document.querySelectorAll('.step-card');

    // Função para adicionar as classes de animação quando os elementos estão visíveis
    function animateOnScroll() {
        cards.forEach(card => {
            if (isElementInViewport(card) && !card.classList.contains('fade-in-up')) {
                card.classList.add('fade-in-up');
            }
        });

        stepCards.forEach(stepCard => {
            if (isElementInViewport(stepCard) && !stepCard.classList.contains('fade-in-zoom')) {
                stepCard.classList.add('fade-in-zoom');
            }
        });
    }

    // Adiciona o event listener para o scroll
    window.addEventListener('scroll', animateOnScroll);

    // Executa a função uma vez ao carregar a página para animar elementos já visíveis
    animateOnScroll();
});