// Set current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Add click animation to links and buttons
const links = document.querySelectorAll(".link-card, .meeting-btn, .calendar-split-part");

links.forEach(link => {
	link.addEventListener("click", function () {
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
const SLIDER_IMAGE_COUNT = 5;
const SLIDER_MAX_ARCHIVE_NUM = 100;

let currentSlide = 0;
let slideCount = 0;
let slider, dots, prevBtn, nextBtn;
let autoSlideInterval;

function tryLoadImage(src) {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => resolve(src);
		img.onerror = () => resolve(null);
		img.src = src;
	});
}

async function discoverArchiveImages(maxImages = SLIDER_IMAGE_COUNT) {
	const found = [];

	for (let num = SLIDER_MAX_ARCHIVE_NUM; num >= 1 && found.length < maxImages; num--) {
		const pngSrc = `images/archive/${num}.png`;
		const jpgSrc = `images/archive/${num}.jpg`;
		const src = (await tryLoadImage(pngSrc)) || (await tryLoadImage(jpgSrc));

		if (src) {
			found.push({ num, src });
		}
	}

	return found;
}

function createSlide({ num, src }) {
	const slide = document.createElement("div");
	slide.className = "slide";

	const img = document.createElement("img");
	img.src = src;
	img.alt = `Spotkanie #${num}`;
	img.loading = "lazy";

	slide.appendChild(img);
	return slide;
}

function createDot(index) {
	const dot = document.createElement("div");
	dot.className = index === 0 ? "dot active" : "dot";
	dot.addEventListener("click", () => {
		goToSlide(index);
		resetAutoSlide();
	});
	return dot;
}

// Initialize slider with the latest archive images
async function initSlider() {
	slider = document.querySelector(".slider");
	const dotsContainer = document.querySelector(".slider-dots");
	prevBtn = document.getElementById("prevBtn");
	nextBtn = document.getElementById("nextBtn");

	const archiveImages = await discoverArchiveImages();

	if (archiveImages.length === 0) {
		document.querySelector(".previous-meeting")?.remove();
		return;
	}

	slideCount = archiveImages.length;

	archiveImages.forEach((image, index) => {
		slider.appendChild(createSlide(image));
		dotsContainer.appendChild(createDot(index));
	});

	prevBtn.addEventListener("click", () => {
		prevSlide();
		resetAutoSlide();
	});

	nextBtn.addEventListener("click", () => {
		nextSlide();
		resetAutoSlide();
	});

	dots = document.querySelectorAll(".dot");
	updateSlider();
	startAutoSlide();
}

function goToSlide(index) {
	currentSlide = index;
	updateSlider();
}

function nextSlide() {
	if (slideCount === 0) {
		return;
	}

	currentSlide = (currentSlide + 1) % slideCount;
	updateSlider();
}

function prevSlide() {
	if (slideCount === 0) {
		return;
	}

	currentSlide = (currentSlide - 1 + slideCount) % slideCount;
	updateSlider();
}

function updateSlider() {
	if (!slider || slideCount === 0) {
		return;
	}

	slider.style.transform = `translateX(-${currentSlide * 100}%)`;

	dots.forEach((dot, index) => {
		dot.classList.toggle("active", index === currentSlide);
	});
}

function startAutoSlide() {
	if (slideCount <= 1) {
		return;
	}

	autoSlideInterval = setInterval(() => {
		nextSlide();
	}, 5000);
}

function resetAutoSlide() {
	clearInterval(autoSlideInterval);
	startAutoSlide();
}

// Add smooth page load
document.addEventListener("DOMContentLoaded", function () {
	document.body.classList.add("loaded");

	// Stagger the appearance of links
	const links = document.querySelectorAll(".links > *");
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

		setTimeout(
			() => {
				section.style.transition = "all 0.5s ease";
				section.style.opacity = 1;
				section.style.transform = "translateY(0)";
			},
			500 + 300 * index,
		);
	});

	initSlider();
});
