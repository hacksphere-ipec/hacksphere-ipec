// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navHamburger = document.getElementById('nav-hamburger');
const eventsGrid = document.getElementById('events-grid');
const eventsLoading = document.getElementById('events-loading');
const leadershipGrid = document.getElementById('leadership-grid');
const contactForm = document.getElementById('contact-form');

// State
let events = [];
let leadership = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeCounters();
    loadEvents();
    loadLeadership();
    
    // Load years first, then teams
    await loadYears();
    await loadTeams(currentYear);
    
    initializeContactForm();
    initializeSmoothScrolling();
    initializeSponsorsCarousel();
});

// Navigation functionality
function initializeNavigation() {
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navHamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navHamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navHamburger.classList.remove('active');
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', updateActiveNavigation);
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });

    // Add animation classes to elements (skip about cards to keep them always visible)
    document.querySelectorAll('.achievement-item').forEach((item, index) => {
        item.classList.add('slide-in-left');
        item.style.transitionDelay = `${index * 0.01}s`;
    });
}

// Animated counters
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Load events from API
async function loadEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        
        events = await response.json();
        displayEvents();
    } catch (error) {
        console.error('Error loading events:', error);
        showEventsError();
    } finally {
        eventsLoading.style.display = 'none';
    }
}

function displayEvents() {
    eventsGrid.innerHTML = '';
    
    events.forEach((event, index) => {
        const eventCard = createEventCard(event);
        eventCard.classList.add('fade-in');
        eventCard.style.transitionDelay = `${index * 0.01}s`;
        eventsGrid.appendChild(eventCard);
    });

    // Re-observe new elements
    document.querySelectorAll('.event-card.fade-in').forEach(card => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    const images = event.images || [event.thumbnail];
    const slidesHtml = images.map((img, i) => `
        <div class="event-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${img}" alt="${event.title}" class="event-image" loading="lazy">
        </div>
    `).join('');
    
    const dotsHtml = images.map((_, i) => `
        <span class="event-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></span>
    `).join('');
    
    card.innerHTML = `
        <div class="event-slider">
            <div class="event-slides">
                ${slidesHtml}
            </div>
            <div class="event-dots">${dotsHtml}</div>
        </div>
        <div class="event-content">
            <span class="event-category">${event.category}</span>
            <h3 class="event-title">${event.title}</h3>
            <div class="event-date">
                <i class="fas fa-calendar-alt"></i>
                ${event.date}
            </div>
            <p class="event-description">${event.shortDescription}</p>
            <div class="event-footer">
                <span class="event-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${event.location}
                </span>
            </div>
        </div>
    `;
    
    // Initialize slider
    initEventSlider(card, images.length);
    
    return card;
}

function initEventSlider(card, totalSlides) {
    const slides = card.querySelectorAll('.event-slide');
    const dots = card.querySelectorAll('.event-dot');
    let currentIndex = 0;
    let interval;
    
    function goToSlide(index) {
        currentIndex = (index + totalSlides) % totalSlides;
        slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(i);
            resetInterval();
        });
    });
    
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 4000);
    }
    
    interval = setInterval(nextSlide, 4000);
}

function showEventsError() {
    eventsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load events</h3>
            <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
    `;
}

// Load leadership from API
async function loadLeadership() {
    try {
        const response = await fetch('/api/leadership');
        if (!response.ok) {
            throw new Error('Failed to fetch leadership');
        }
        
        leadership = await response.json();
        displayLeadership();
    } catch (error) {
        console.error('Error loading leadership:', error);
        showLeadershipError();
    }
}

function displayLeadership() {
    leadershipGrid.innerHTML = '';
    
    leadership.forEach((leader, index) => {
        const leaderCard = createLeaderCard(leader);
        leaderCard.classList.add('fade-in');
        leaderCard.style.transitionDelay = `${index * 0.01}s`;
        leadershipGrid.appendChild(leaderCard);
    });

    // Re-observe new elements
    document.querySelectorAll('.leader-card.fade-in').forEach(card => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(card);
    });
}

function createLeaderCard(leader) {
    const card = document.createElement('div');
    card.className = 'leader-card';
    
    card.innerHTML = `
        <img src="${leader.photo}" alt="${leader.name}" class="leader-photo" loading="lazy">
        <h3 class="leader-name">${leader.name}</h3>
        <div class="leader-position">${leader.position}</div>
        <p class="leader-bio">${leader.bio}</p>
        <div class="leader-links">
            <a href="mailto:${leader.email}" class="leader-link">
                <i class="fas fa-envelope"></i>
                Email
            </a>
            <a href="${leader.linkedin}" target="_blank" class="leader-link">
                <i class="fab fa-linkedin"></i>
                LinkedIn
            </a>
        </div>
    `;
    
    return card;
}

function showLeadershipError() {
    leadershipGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Unable to load leadership information</h3>
            <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
    `;
}

// Teams Section  
let teamsData = null;
let currentTeam = null;
let currentYear = null;
let availableYears = [];

// Configuration - Set default year to display
// Change this to set which year shows by default (e.g., 'fy26', 'fy27')
const DEFAULT_TEAM_YEAR = 'fy26';

// Load available years
async function loadYears() {
    try {
        const response = await fetch('/api/teams/years');
        if (!response.ok) throw new Error('Failed to load years');
        
        availableYears = await response.json();
        
        // Populate year selectors (both desktop and mobile)
        const yearSelect = document.getElementById('team-year-select');
        const yearSelectMobile = document.getElementById('team-year-select-mobile');
        
        if (availableYears.length > 0) {
            const yearOptions = availableYears.map(year => {
                const yearLabel = formatYearLabel(year);
                return `<option value="${year}">${yearLabel}</option>`;
            }).join('');
            
            // Set current year - use configured default if available, otherwise use most recent
            if (availableYears.includes(DEFAULT_TEAM_YEAR)) {
                currentYear = DEFAULT_TEAM_YEAR;
            } else {
                currentYear = availableYears[0]; // Most recent available
            }
            
            // Update desktop selector
            if (yearSelect) {
                yearSelect.innerHTML = yearOptions;
                yearSelect.value = currentYear;
                
                // Add change listener for desktop
                yearSelect.addEventListener('change', (e) => {
                    currentYear = e.target.value;
                    // Sync mobile selector
                    if (yearSelectMobile) yearSelectMobile.value = currentYear;
                    loadTeams(currentYear);
                });
            }
            
            // Update mobile selector
            if (yearSelectMobile) {
                yearSelectMobile.innerHTML = yearOptions;
                yearSelectMobile.value = currentYear;
                
                // Add change listener for mobile
                yearSelectMobile.addEventListener('change', (e) => {
                    currentYear = e.target.value;
                    // Sync desktop selector
                    if (yearSelect) yearSelect.value = currentYear;
                    loadTeams(currentYear);
                });
            }
        }
    } catch (error) {
        console.error('Error loading years:', error);
        currentYear = DEFAULT_TEAM_YEAR; // Use configured default as fallback
    }
}

// Format year label for display
function formatYearLabel(year) {
    // Convert 'fy26' to 'FY 2025-26', 'fy27' to 'FY 2026-27', etc.
    if (year.startsWith('fy')) {
        const yearNum = parseInt(year.substring(2));
        const startYear = 2000 + yearNum - 1;
        const endYear = yearNum;
        return `FY ${startYear}-${endYear}`;
    }
    return year;
}

async function loadTeams(year = null) {
    try {
        // Use provided year or current year
        const targetYear = year || currentYear || 'fy26';
        
        const response = await fetch(`/api/teams/${targetYear}`);
        if (!response.ok) throw new Error('Failed to load teams data');
        
        teamsData = await response.json();
        
        // Update description
        const descElement = document.getElementById('teams-description');
        if (descElement && teamsData.description) {
            descElement.textContent = teamsData.description;
        }
        
        // Load first team by default (Core Team)
        if (teamsData.teams) {
            currentTeam = 'core';
        }
        
        // Initialize navigation
        initializeTeamsNavigation();
        
        // Display the core team
        if (teamsData.teams) {
            displayTeam(currentTeam);
        }
    } catch (error) {
        console.error('Error loading teams:', error);
        const teamsGrid = document.getElementById('teams-grid');
        if (teamsGrid) {
            teamsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                    <i class="fas fa-exclamation-circle" style="font-size: 4rem; color: var(--primary-red); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-light); font-size: 1.6rem;">Failed to load team members</p>
                </div>
            `;
        }
    }
}

function initializeTeamsNavigation() {
    if (!teamsData || !teamsData.teams) return;
    
    const sidebar = document.getElementById('teams-nav');
    const mobileTabs = document.getElementById('teams-mobile-tabs');
    
    // Clear existing content
    if (sidebar) sidebar.innerHTML = '';
    
    // For mobile tabs, preserve the year selector and only clear team tabs
    if (mobileTabs) {
        const existingContainer = mobileTabs.querySelector('.mobile-tabs-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }
    
    // Get team keys
    const teamKeys = Object.keys(teamsData.teams);
    
    // Desktop sidebar
    if (sidebar) {
        teamKeys.forEach(teamKey => {
            const team = teamsData.teams[teamKey];
            const tab = document.createElement('button');
            tab.className = 'team-tab';
            tab.textContent = team.name;
            tab.dataset.team = teamKey;
            
            if (teamKey === currentTeam) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => {
                currentTeam = teamKey;
                updateActiveTab();
                displayTeam(teamKey);
            });
            
            sidebar.appendChild(tab);
        });
    }
    
    // Mobile tabs
    if (mobileTabs) {
        const container = document.createElement('div');
        container.className = 'mobile-tabs-container';
        
        teamKeys.forEach(teamKey => {
            const team = teamsData.teams[teamKey];
            const tab = document.createElement('button');
            tab.className = 'mobile-tab';
            tab.textContent = team.name;
            tab.dataset.team = teamKey;
            
            if (teamKey === currentTeam) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => {
                currentTeam = teamKey;
                updateActiveTab();
                displayTeam(teamKey);
            });
            
            container.appendChild(tab);
        });
        
        mobileTabs.appendChild(container);
    }
}

function updateActiveTab() {
    // Update desktop tabs
    document.querySelectorAll('.team-tab').forEach(tab => {
        if (tab.dataset.team === currentTeam) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update mobile tabs
    document.querySelectorAll('.mobile-tab').forEach(tab => {
        if (tab.dataset.team === currentTeam) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Fix president image paths based on current year
function fixPresidentImagePaths(president, year) {
    if (!president || !president.image) return president;
    
    // Clone the president object to avoid modifying the original
    const fixedPresident = { ...president };
    
    // Update image path to use current year
    // Convert /images/presidents/fy26/name.webp to /images/presidents/fy27/name.webp
    fixedPresident.image = president.image.replace(
        /\/images\/presidents\/fy\d+\//,
        `/images/presidents/${year}/`
    );
    
    return fixedPresident;
}

async function displayTeam(teamKey) {
    const teamsGrid = document.getElementById('teams-grid');
    if (!teamsGrid || !teamsData) return;
    
    const team = teamsData.teams[teamKey];
    if (!team) return;
    
    // Clear grid
    teamsGrid.innerHTML = '';
    teamsGrid.className = 'teams-grid';
    
    let members = [];
    
    // Handle Core Team - presidents + all team heads
    if (teamKey === 'core' && team.useLeadership) {
        // Add presidents first with corrected image paths
        if (teamsData.presidents) {
            if (teamsData.presidents.president) {
                const fixedPresident = fixPresidentImagePaths(teamsData.presidents.president, currentYear);
                members.push(fixedPresident);
            }
            if (teamsData.presidents.vp) {
                const fixedVP = fixPresidentImagePaths(teamsData.presidents.vp, currentYear);
                members.push(fixedVP);
            }
        }
        
        // Add all heads from other teams
        const teamKeys = Object.keys(teamsData.teams);
        teamKeys.forEach(key => {
            if (key !== 'core') {
                const otherTeam = teamsData.teams[key];
                if (otherTeam.head) {
                    members.push(otherTeam.head);
                }
            }
        });
    } else {
        // Regular team structure
        if (team.head) {
            members.push(team.head);
        }
        
        if (team.subHeads && Array.isArray(team.subHeads)) {
            members = members.concat(team.subHeads);
        }
        
        if (team.volunteers && Array.isArray(team.volunteers)) {
            members = members.concat(team.volunteers);
        }
    }
    
    // Create member cards
    members.forEach(member => {
        const card = createTeamCard(member);
        teamsGrid.appendChild(card);
    });
    
    // Trigger scroll animations
    document.querySelectorAll('.team-card.fade-in').forEach(card => {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        observer.observe(card);
    });
}

function createTeamCard(member) {
    const card = document.createElement('div');
    card.className = 'team-card fade-in';
    
    // Create image element with loading state
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'team-photo-wrapper';
    imgWrapper.innerHTML = '<div class="team-photo-skeleton"></div>';
    
    const img = document.createElement('img');
    img.className = 'team-photo';
    img.alt = member.name;
    img.loading = 'lazy';
    
    // Handle image load
    img.onload = function() {
        imgWrapper.classList.add('loaded');
    };
    
    // Handle image error with fallback
    img.onerror = function() {
        this.src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop';
        imgWrapper.classList.add('loaded');
    };
    
    img.src = member.image;
    imgWrapper.appendChild(img);
    
    card.innerHTML = `
        <h3 class="team-name">${member.name}</h3>
        <div class="team-card-divider"></div>
        <p class="team-role">${member.role}</p>
        <a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="team-link" aria-label="LinkedIn Profile">
            <i class="fab fa-linkedin-in"></i>
        </a>
    `;
    
    // Insert image wrapper at the beginning
    card.insertBefore(imgWrapper, card.firstChild);
    
    return card;
}

// Contact form functionality
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form data
        if (!validateContactForm(data)) {
            return;
        }
        
        // Simulate form submission
        submitContactForm(data);
    });
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name.trim()) {
        errors.push('Name is required');
    }
    
    if (!data.email.trim() || !isValidEmail(data.email)) {
        errors.push('Valid email is required');
    }
    
    if (!data.subject.trim()) {
        errors.push('Subject is required');
    }
    
    if (!data.message.trim()) {
        errors.push('Message is required');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-errors';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <h4>Please fix the following errors:</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
    
    // Remove existing error messages
    const existingErrors = contactForm.querySelector('.form-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

async function submitContactForm(data) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormSuccess();
        contactForm.reset();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showFormErrors(['Failed to send message. Please try again.']);
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showFormSuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Message sent successfully!</h4>
                <p>We'll get back to you as soon as possible.</p>
            </div>
        </div>
    `;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Sponsors carousel - 3 visible (left, center, right), infinite seamless loop
function initializeSponsorsCarousel() {
    const viewport = document.querySelector('.sponsors-viewport');
    const track = document.getElementById('sponsors-track');
    if (!track || !viewport) return;

    const originalItems = Array.from(track.querySelectorAll('.sponsor-item'));
    const count = originalItems.length;
    if (count === 0) return;

    // Duplicate items for seamless infinite loop
    originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
    const items = track.querySelectorAll('.sponsor-item');

    let currentIndex = 0;
    let isTransitioning = false;

    function applyTransform(useTransition = true) {
        if (useTransition) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            track.style.transition = 'none';
        }

        items.forEach((item) => item.classList.remove('center'));
        const centerEl = items[currentIndex];
        
        if (centerEl) {
            centerEl.classList.add('center');
            
            // Calculate exact center position
            // offset = (viewport_width / 2) - (distance_from_track_start + item_width / 2)
            const itemCenter = centerEl.offsetLeft + (centerEl.offsetWidth / 2);
            const offset = (viewport.offsetWidth / 2) - itemCenter;
            
            track.style.transform = `translateX(${offset}px)`;
        }
    }

    function next() {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex++;
        applyTransform(true);

        if (currentIndex >= count) {
            track.addEventListener('transitionend', function onEnd() {
                track.removeEventListener('transitionend', onEnd);
                currentIndex = 0;
                applyTransform(false);
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            }, { once: true });
        } else {
            setTimeout(() => {
                isTransitioning = false;
            }, 650);
        }
    }

    applyTransform(false);
    window.addEventListener('resize', debounce(() => {
        if (!isTransitioning) applyTransform(false);
    }, 250));
    setInterval(next, 3500);
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimizations
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments if needed
}, 250));

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        '/api/events',
        '/api/leadership'
    ];
    
    criticalImages.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = 'fetch';
        document.head.appendChild(link);
    });
}

// Call preload function
preloadCriticalResources();

// Add styles for form messages
const formStyles = `
.form-errors, .form-success {
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    animation: slideDown 0.3s ease-out;
}

.form-errors {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
    color: #ff4444;
}

.form-success {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.3);
    color: #44ff44;
}

.error-content, .success-content {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.error-content i, .success-content i {
    font-size: 1.5rem;
    margin-top: 0.2rem;
}

.form-errors h4, .form-success h4 {
    margin-bottom: 0.5rem;
    font-size: 1.4rem;
}

.form-errors ul {
    margin: 0;
    padding-left: 1.5rem;
}

.form-errors li {
    margin-bottom: 0.3rem;
    font-size: 1.3rem;
}

.error-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.2);
    border-radius: 12px;
    color: var(--text-light);
}

.error-message i {
    font-size: 3rem;
    color: var(--primary-red);
    margin-bottom: 1rem;
}

.error-message h3 {
    font-size: 2rem;
    color: var(--white);
    margin-bottom: 1rem;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);