document.addEventListener('DOMContentLoaded', function() {
    // --- Funções para os Botões do WhatsApp (já existentes) ---
    const whatsappNumber = '5515997206188';
    const whatsappWebBaseUrl = 'https://web.whatsapp.com/send/';

    function openWhatsAppChat(message) {
        const encodedNumber = encodeURIComponent(whatsappNumber);
        const encodedMessage = encodeURIComponent(message);
        window.open(`${whatsappWebBaseUrl}?phone=${encodedNumber}&text=${encodedMessage}`, '_blank');
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
});