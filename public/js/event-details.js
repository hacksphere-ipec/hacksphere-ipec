// Event Details Page JavaScript
let currentEvent = null;
let currentImageIndex = 0;
let allEvents = [];

// Initialize the event details page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventDetailsPage();
});

async function initializeEventDetailsPage() {
    // Get event ID from URL
    const eventId = getEventIdFromURL();
    
    if (!eventId) {
        showErrorState();
        return;
    }

    try {
        // Load the specific event and all events
        await Promise.all([
            loadEventDetails(eventId),
            loadAllEvents()
        ]);
        
        if (currentEvent) {
            displayEventDetails();
            initializeImageGallery();
            displayRelatedEvents();
        } else {
            showErrorState();
        }
        
    } catch (error) {
        console.error('Error loading event details:', error);
        showErrorState();
    } finally {
        hideLoading();
    }
}

function getEventIdFromURL() {
    const pathParts = window.location.pathname.split('/');
    const eventId = pathParts[pathParts.length - 1];
    return eventId ? parseInt(eventId) : null;
}

async function loadEventDetails(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (response.ok) {
            currentEvent = await response.json();
        } else if (response.status === 404) {
            currentEvent = null;
        } else {
            throw new Error('Failed to fetch event details');
        }
    } catch (error) {
        console.error('Error loading event details:', error);
        throw error;
    }
}

async function loadAllEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        allEvents = await response.json();
    } catch (error) {
        console.error('Error loading all events:', error);
        // This is not critical, so we don't throw
        allEvents = [];
    }
}

function displayEventDetails() {
    if (!currentEvent) return;

    // Update document title
    document.title = `${currentEvent.title} - TechNova Society`;

    // Update event header
    document.getElementById('event-category').textContent = currentEvent.category;
    document.getElementById('event-title').textContent = currentEvent.title;
    document.querySelector('#event-date span').textContent = currentEvent.date;
    document.querySelector('#event-location span').textContent = currentEvent.location;

    // Update description
    const descriptionElement = document.getElementById('description-text');
    descriptionElement.innerHTML = formatDescription(currentEvent.fullDescription);

    // Show the event content
    document.getElementById('event-content').style.display = 'block';
}

function formatDescription(description) {
    // Split description into paragraphs and format them
    const paragraphs = description.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
}

function initializeImageGallery() {
    if (!currentEvent || !currentEvent.images || currentEvent.images.length === 0) {
        document.querySelector('.image-gallery').style.display = 'none';
        return;
    }

    const images = currentEvent.images;
    const mainImage = document.getElementById('main-image');
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    const indicatorsContainer = document.getElementById('gallery-indicators');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');

    // Set initial image
    currentImageIndex = 0;
    updateMainImage();

    // Create thumbnails
    createThumbnails();

    // Create indicators
    createIndicators();

    // Add event listeners
    prevBtn.addEventListener('click', () => navigateGallery(-1));
    nextBtn.addEventListener('click', () => navigateGallery(1));

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Auto-hide controls on mobile
    let hideControlsTimeout;
    const galleryMain = document.getElementById('gallery-main');
    
    galleryMain.addEventListener('touchstart', () => {
        document.querySelector('.gallery-controls').style.opacity = '1';
        clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            document.querySelector('.gallery-controls').style.opacity = '0';
        }, 3000);
    });

    function updateMainImage() {
        if (images[currentImageIndex]) {
            mainImage.src = images[currentImageIndex];
            mainImage.alt = `${currentEvent.title} - Image ${currentImageIndex + 1}`;
            
            // Update active states
            updateActiveThumbnail();
            updateActiveIndicator();
            updateNavigationButtons();
        }
    }

    function createThumbnails() {
        thumbnailsContainer.innerHTML = '';
        images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.className = 'thumbnail';
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage();
            });
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        images.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => {
                currentImageIndex = index;
                updateMainImage();
            });
            indicatorsContainer.appendChild(indicator);
        });
    }

    function updateActiveThumbnail() {
        const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.classList.toggle('active', index === currentImageIndex);
        });
    }

    function updateActiveIndicator() {
        const indicators = indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentImageIndex);
        });
    }

    function updateNavigationButtons() {
        prevBtn.disabled = currentImageIndex === 0;
        nextBtn.disabled = currentImageIndex === images.length - 1;
    }

    function navigateGallery(direction) {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < images.length) {
            currentImageIndex = newIndex;
            updateMainImage();
        }
    }

    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            navigateGallery(1);
        } else if (e.key === 'Escape') {
            // Could be used for closing a modal version of the gallery
            e.preventDefault();
        }
    }
}

function displayRelatedEvents() {
    const relatedEventsGrid = document.getElementById('related-events-grid');
    
    if (!currentEvent || !allEvents || allEvents.length <= 1) {
        document.querySelector('.related-events').style.display = 'none';
        return;
    }

    // Filter out current event and get up to 3 related events
    const relatedEvents = allEvents
        .filter(event => event.id !== currentEvent.id)
        .slice(0, 3);

    if (relatedEvents.length === 0) {
        document.querySelector('.related-events').style.display = 'none';
        return;
    }

    relatedEventsGrid.innerHTML = '';
    
    relatedEvents.forEach(event => {
        const eventCard = createRelatedEventCard(event);
        relatedEventsGrid.appendChild(eventCard);
    });

    // Add scroll animations
    relatedEventsGrid.querySelectorAll('.related-event-card').forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // Observe for animations
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    relatedEventsGrid.querySelectorAll('.related-event-card.fade-in').forEach(card => {
        observer.observe(card);
    });
}

function createRelatedEventCard(event) {
    const card = document.createElement('div');
    card.className = 'related-event-card';
    card.addEventListener('click', () => navigateToEvent(event.id));
    
    card.innerHTML = `
        <img src="${event.thumbnail}" alt="${event.title}" class="related-event-image" loading="lazy">
        <div class="related-event-content">
            <h3 class="related-event-title">${event.title}</h3>
            <div class="related-event-date">
                <i class="fas fa-calendar-alt"></i>
                ${event.date}
            </div>
            <p class="related-event-description">${event.shortDescription}</p>
            <span class="related-event-category">${event.category}</span>
        </div>
    `;
    
    return card;
}

function navigateToEvent(eventId) {
    // Add loading animation
    document.body.style.cursor = 'wait';
    
    // Navigate to event details page
    setTimeout(() => {
        window.location.href = `/event/${eventId}`;
    }, 300);
}

function showErrorState() {
    document.getElementById('error-container').style.display = 'block';
    document.getElementById('event-content').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading-container').style.display = 'none';
}

// Enhanced navigation with browser history
function enhancedNavigateToEvent(eventId) {
    // Update the URL without reloading the page
    const newURL = `/event/${eventId}`;
    
    // Add loading state
    document.body.style.cursor = 'wait';
    document.getElementById('loading-container').style.display = 'flex';
    document.getElementById('event-content').style.display = 'none';
    document.getElementById('error-container').style.display = 'none';
    
    // Update browser history
    history.pushState({ eventId }, '', newURL);
    
    // Load new event details
    setTimeout(async () => {
        try {
            await loadEventDetails(eventId);
            if (currentEvent) {
                displayEventDetails();
                initializeImageGallery();
                displayRelatedEvents();
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showErrorState();
            }
        } catch (error) {
            console.error('Error loading new event:', error);
            showErrorState();
        } finally {
            hideLoading();
            document.body.style.cursor = 'default';
        }
    }, 500);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.eventId) {
        enhancedNavigateToEvent(e.state.eventId);
    } else {
        // If no state, redirect to home
        window.location.href = '/';
    }
});

// Image lazy loading optimization
function optimizeImageLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        // Apply lazy loading to images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Add error handling for images
function handleImageErrors() {
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            console.warn('Failed to load image:', e.target.src);
        }
    }, true);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    handleImageErrors();
    optimizeImageLoading();
});

// Cleanup function for when leaving the page
window.addEventListener('beforeunload', function() {
    // Remove keyboard event listener to prevent memory leaks
    document.removeEventListener('keydown', handleKeyboardNavigation);
});

// Share functionality (if needed in the future)
function shareEvent() {
    if (navigator.share && currentEvent) {
        navigator.share({
            title: currentEvent.title,
            text: currentEvent.shortDescription,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                // Show success message
                console.log('Event URL copied to clipboard');
            })
            .catch(console.error);
    }
}