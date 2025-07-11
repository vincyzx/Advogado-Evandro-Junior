document.addEventListener('DOMContentLoaded',function(){
const whatsappNumber='5515997206188';
function openWhatsAppChat(message){
const encodedNumber=encodeURIComponent(whatsappNumber);
const encodedMessage=encodeURIComponent(message);
const isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let url;
if(isMobile){
url=`https://wa.me/${encodedNumber}?text=${encodedMessage}`;
const newWindow=window.open(url,'_blank');
setTimeout(()=>{
if(newWindow&&!newWindow.closed&&(newWindow.location.href.startsWith('about:blank')||!newWindow.location.href.includes('whatsapp.com'))){
newWindow.location.href=`https://web.whatsapp.com/send/?phone=${encodedNumber}&text=${encodedMessage}`;
}},500);
}else{
url=`https://web.whatsapp.com/send/?phone=${encodedNumber}&text=${encodedMessage}`;
window.open(url,'_blank');
}}
const whatsappFixedButton=document.getElementById('whatsappFixedButton');
if(whatsappFixedButton){
whatsappFixedButton.addEventListener('click',function(){
openWhatsAppChat('Olá! Vim do seu site e gostaria de conversar sobre um assunto jurídico.');
});
}
const contactButton=document.getElementById('contactButton');
if(contactButton){
contactButton.addEventListener('click',function(){
openWhatsAppChat('Olá! Vim do seu site e gostaria de saber mais sobre seus serviços em Direito de Família e Sucessões.');
});
}
const scheduleButton=document.getElementById('scheduleButton');
if(scheduleButton){
scheduleButton.addEventListener('click',function(){
openWhatsAppChat('Olá! Gostaria de agendar um atendimento online para discutir meu caso de Direito de Família/Sucessões.');
});
}
const contactForm=document.querySelector('.faleConosco form');
const submitButton=contactForm?contactForm.querySelector('button[type="submit"]'):null;
const formMessageContainer=document.createElement('div');
formMessageContainer.id='form-message-container';
if(contactForm){
contactForm.prepend(formMessageContainer);
}
if(contactForm&&submitButton){
contactForm.addEventListener('submit',async function(event){
event.preventDefault();
formMessageContainer.innerHTML='';
formMessageContainer.className='';
submitButton.disabled=true;
submitButton.innerHTML='Enviando... <i class="fas fa-spinner fa-spin"></i>';
const formData=new FormData(contactForm);
const formspreeEndpoint=contactForm.action;
try{
const response=await fetch(formspreeEndpoint,{
method:'POST',
body:formData,
headers:{'Accept':'application/json'}
});
if(response.ok){
contactForm.reset();
formMessageContainer.textContent='Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.';
formMessageContainer.className='form-success-message';
submitButton.innerHTML='Mensagem Enviada! <i class="fas fa-check"></i>';
submitButton.style.backgroundColor='var(--secondary-color)';
setTimeout(()=>{
formMessageContainer.textContent='';
formMessageContainer.className='';
submitButton.innerHTML='Enviar Mensagem <i class="fas fa-paper-plane"></i>';
submitButton.style.backgroundColor='var(--primary-color)';
submitButton.disabled=false;
},5000);
}else{
const data=await response.json();
let errorMessage='Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.';
if(data&&data.errors){
errorMessage=data.errors.map(err=>err.message).join(', ');
}
formMessageContainer.textContent=errorMessage;
formMessageContainer.className='form-error-message';
submitButton.innerHTML='Tentar Novamente <i class="fas fa-times-circle"></i>';
submitButton.style.backgroundColor='red';
submitButton.disabled=false;
}
}catch(error){
formMessageContainer.textContent='Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
formMessageContainer.className='form-error-message';
submitButton.innerHTML='Enviar Mensagem <i class="fas fa-paper-plane"></i>';
submitButton.style.backgroundColor='var(--primary-color)';
submitButton.disabled=false;
}
});
}
function isElementInViewport(el){
const rect=el.getBoundingClientRect();
return(rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth));
}
const cards=document.querySelectorAll('.card');
const stepCards=document.querySelectorAll('.step-card');
function animateOnScroll(){
cards.forEach(card=>{
if(isElementInViewport(card)&&!card.classList.contains('fade-in-up')){
card.classList.add('fade-in-up');
}
});
stepCards.forEach(stepCard=>{
if(isElementInViewport(stepCard)&&!stepCard.classList.contains('fade-in-zoom')){
stepCard.classList.add('fade-in-zoom');
}
});
}
window.addEventListener('scroll',animateOnScroll);
animateOnScroll();
});