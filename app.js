const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
const nav = document.querySelector("nav");
const linksA = document.querySelectorAll(".navlinks li a");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  links.forEach(link => {
    link.classList.toggle("fade");
  });
});

window.addEventListener("scroll", function(event) {
  // To listen for event
  event.preventDefault();

  if (window.scrollY < 100) {
    // Just an example

    nav.style.backgroundColor = "transparent";

    // or default color
  } else {
    nav.style.backgroundColor = "#f89421";
  }
});
//  nav = document.querySelector('nav'); // Identify target
// var ul = document.querySelector('');

// window.addEventListener('scroll', function (event) { // To listen for event
//     event.preventDefault();

//     if (window.scrollY < 100) { // Just an example

//         nav.style.backgroundColor = 'green';
//         ul.style.color = 'red';

//         // or default color
//     } else {

//         nav.style.backgroundColor = '#f89421';
//         ul.style.color = 'blue';
//     }
// });

// window.onscroll = () => {
//     const nav = document.querySelector('.navbar');
//     if (this.scrollY < 10)
//      nav.className = '';
//      nav.className = '';
// };
