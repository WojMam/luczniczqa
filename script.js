// Set current year in the footer
document.getElementById("year").textContent = new Date().getFullYear();

// Add click animation to links
const links = document.querySelectorAll(".link-card");

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
});
