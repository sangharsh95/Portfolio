// Reveal animation
const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
},{threshold:0.15});

reveals.forEach(el => observer.observe(el));

// EmailJS init
(function(){
  emailjs.init("A7UV0jvX80HU2xNGA");
})();

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", function(e){
  e.preventDefault();
  status.textContent = "Sending message...";

  emailjs.sendForm(
    "service_inkz10e",
    "template_g9hpu4i",
    this
  )
  .then(() => {
    status.textContent = "Message sent successfully ✔";
    form.reset();
  })
  .catch(() => {
    status.textContent = "Failed to send message. Please try again.";
  });
});
