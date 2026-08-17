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

// Slider: photos from past meetups (folder `photos/`, not banner thumbnails)
const GALLERY_DIR = "photos";
const GALLERY_IMAGES = [
	{ file: "01-prelegent-scaling-test-automation.jpg", alt: "Prelekcja Scaling Test Automation" },
	{ file: "02-meetup-56-powitanie.jpg", alt: "Powitanie na spotkaniu ŁuczniczQA #56" },
	{ file: "03-prelekcja-qa-partner-biznesu.jpg", alt: "Prelekcja QA jako partner biznesu" },
	{ file: "04-hanna-markowicz-qa-partner-biznesu.jpg", alt: "Hanna Markowicz — QA jako partner biznesu" },
	{ file: "05-publicznosc-sala-kongresowa.jpg", alt: "Publiczność meetupu w sali Kongresowa" },
	{ file: "06-co-slychac-w-testerskim-swiecie.jpg", alt: "Prelekcja Co słychać w testerskim świecie" },
	{ file: "07-meetup-sii-x-luczniczqa.jpg", alt: "Meetup Sii x ŁuczniczQA" },
	{ file: "08-publicznosc-spotkanie-kongresowa.jpg", alt: "Uczestnicy spotkania w sali Kongresowa" },
	{ file: "09-prelekcja-kompetencje-testerskie.jpg", alt: "Prelekcja o kompetencjach testerskich" },
	{ file: "10-publicznosc-drewniana-sala.jpg", alt: "Publiczność spotkania w sali z drewnianymi belkami" },
	{ file: "11-prelegent-google-cloud-notebooks.jpg", alt: "Prelekcja o notebookach i Google Cloud" },
	{ file: "12-prelekcja-nie-tylko-ozn.jpg", alt: "Prelekcja Nie tylko OzN" },
	{ file: "13-prelekcja-stefania-winkel.jpg", alt: "Prelekcja Stefanii Winkel" },
];

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

async function loadGalleryImages() {
	const found = [];

	try {
		const manifestResponse = await fetch(`${GALLERY_DIR}/manifest.json`);
		if (manifestResponse.ok) {
			const manifest = await manifestResponse.json();
			for (const image of manifest) {
				const src = image.src.startsWith(GALLERY_DIR)
					? image.src
					: `${GALLERY_DIR}/${image.src || image.file}`;
				const loaded = await tryLoadImage(src);
				if (loaded) {
					found.push({ src: loaded, alt: image.alt || "Zdjęcie ze spotkania" });
				}
			}
			if (found.length) {
				return found;
			}
		}
	} catch (error) {
		// Fall through to the named file list.
	}

	for (const image of GALLERY_IMAGES) {
		const src = `${GALLERY_DIR}/${image.file}`;
		const loaded = await tryLoadImage(src);
		if (loaded) {
			found.push({ src: loaded, alt: image.alt });
		}
	}

	return found;
}

function createSlide({ src, alt }) {
	const slide = document.createElement("div");
	slide.className = "slide";

	const img = document.createElement("img");
	img.src = src;
	img.alt = alt;
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

async function initSlider() {
	slider = document.querySelector(".slider");
	const dotsContainer = document.querySelector(".slider-dots");
	prevBtn = document.getElementById("prevBtn");
	nextBtn = document.getElementById("nextBtn");

	const galleryImages = await loadGalleryImages();

	if (galleryImages.length === 0) {
		document.querySelector(".previous-meeting")?.remove();
		return;
	}

	slideCount = galleryImages.length;

	galleryImages.forEach((image, index) => {
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
