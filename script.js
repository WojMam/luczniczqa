// Set current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Add click animation to links and buttons
const links = document.querySelectorAll(".link-card, .meeting-btn");

links.forEach(link => {
	link.addEventListener("click", function (e) {
		// Add a ripple effect
		const ripple = document.createElement("span");
		ripple.classList.add("ripple");
		this.appendChild(ripple);

		// Remove the ripple after animation completes
		setTimeout(() => {
			ripple.remove();
		}, 500);
	});
});

// Slider functionality
let currentSlide = 0;
let slideImages = [];
let slider, dots, prevBtn, nextBtn;
let autoSlideInterval;

// Initialize slider with archive images
function initSlider() {
	slider = document.querySelector(".slider");
	const dotsContainer = document.querySelector(".slider-dots");
	prevBtn = document.getElementById("prevBtn");
	nextBtn = document.getElementById("nextBtn");

	// Archive images (descending order)
	slideImages = [
		"images/archive/52.png",
		"images/archive/51.png",
		"images/archive/50.png",
		"images/archive/49.png",
		"images/archive/48.png",
		"images/archive/47.png",
		"images/archive/46.png",
		"images/archive/45.png",
	];

	// Create slides
	slideImages.forEach((src, index) => {
		const slide = document.createElement("div");
		slide.className = "slide";

		const img = document.createElement("img");
		img.src = src;
		img.alt = `Spotkanie #${49 - index}`;
		img.onload = function () {
			// Ensure the slider updates once images are loaded
			if (index === 0) {
				updateSlider();
			}
		};

		slide.appendChild(img);
		slider.appendChild(slide);

		// Create dots
		const dot = document.createElement("div");
		dot.className = index === 0 ? "dot active" : "dot";
		dot.addEventListener("click", () => {
			goToSlide(index);
			resetAutoSlide();
		});
		dotsContainer.appendChild(dot);
	});

	// Set up event listeners
	prevBtn.addEventListener("click", () => {
		prevSlide();
		resetAutoSlide();
	});

	nextBtn.addEventListener("click", () => {
		nextSlide();
		resetAutoSlide();
	});

	// Set dots reference after they're created
	dots = document.querySelectorAll(".dot");

	// Start auto slide
	startAutoSlide();
}

function goToSlide(index) {
	currentSlide = index;
	updateSlider();
}

function nextSlide() {
	currentSlide = (currentSlide + 1) % slideImages.length;
	updateSlider();
}

function prevSlide() {
	currentSlide = (currentSlide - 1 + slideImages.length) % slideImages.length;
	updateSlider();
}

function updateSlider() {
	// Update slider position
	slider.style.transform = `translateX(-${currentSlide * 100}%)`;

	// Update dots
	dots.forEach((dot, index) => {
		if (index === currentSlide) {
			dot.classList.add("active");
		} else {
			dot.classList.remove("active");
		}
	});
}

function startAutoSlide() {
	autoSlideInterval = setInterval(() => {
		nextSlide();
	}, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
	clearInterval(autoSlideInterval);
	startAutoSlide();
}

// Add smooth page load
document.addEventListener("DOMContentLoaded", function () {
	document.body.classList.add("loaded");

	// Stagger the appearance of links
	const links = document.querySelectorAll(".link-card");
	links.forEach((link, index) => {
		setTimeout(() => {
			link.style.opacity = 1;
			link.style.transform = "translateY(0)";
		}, 100 * index);
	});

	// Animate meeting sections
	const meetingSections = document.querySelectorAll(".meeting-section");
	meetingSections.forEach((section, index) => {
		section.style.opacity = 0;
		section.style.transform = "translateY(20px)";

		setTimeout(() => {
			section.style.transition = "all 0.5s ease";
			section.style.opacity = 1;
			section.style.transform = "translateY(0)";
		}, 500 + 300 * index);
	});

	// Initialize slider
	initSlider();
});
