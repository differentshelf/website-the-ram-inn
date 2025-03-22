document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle code removed since we now use bottom navigation
    
    // Fetch menu data from the external JSON file
    fetch('menu-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Populate menu categories with the loaded data
            populateMenuCategory('specials', data.specials);
            populateMenuCategory('starters', data.starters);
            populateMainsCategory('mains', data.mains);
            populateDessertCategory('desserts', data.desserts);
            populateDrinksCategory('drinks', data.drinks);
        })
        .catch(error => {
            console.error('Error loading menu data:', error);
            document.getElementById('menu').innerHTML += '<p class="error-message">Sorry, there was an error loading the menu. Please try again later.</p>';
        });
    
    // Function to populate a simple menu category
    function populateMenuCategory(categoryId, categoryData) {
        const categoryElement = document.getElementById(categoryId);
        if (!categoryElement || !categoryData) return;
        
        // Add items directly without title
        if (categoryData.items && categoryData.items.length > 0) {
            categoryData.items.forEach(item => {
                const menuItem = createMenuItem(item);
                categoryElement.appendChild(menuItem);
            });
        }
        
        // Add note if exists
        if (categoryData.note) {
            const noteElement = document.createElement('p');
            noteElement.className = 'menu-note';
            noteElement.textContent = categoryData.note;
            categoryElement.appendChild(noteElement);
        }
    }
    
    // Function to populate the mains category with sections
    function populateMainsCategory(categoryId, categoryData) {
        const categoryElement = document.getElementById(categoryId);
        if (!categoryElement || !categoryData) return;
        
        // Add sections directly without main title
        if (categoryData.sections && categoryData.sections.length > 0) {
            categoryData.sections.forEach(section => {
                const sectionElement = document.createElement('div');
                sectionElement.className = 'menu-section';
                
                // Skip section title to just show cards
                
                // Add section note if exists
                if (section.note) {
                    const noteElement = document.createElement('p');
                    noteElement.className = 'menu-note';
                    noteElement.textContent = section.note;
                    sectionElement.appendChild(noteElement);
                }
                
                // Add section items
                if (section.items && section.items.length > 0) {
                    section.items.forEach(item => {
                        const menuItem = createMenuItem(item);
                        sectionElement.appendChild(menuItem);
                    });
                }
                
                categoryElement.appendChild(sectionElement);
            });
        }
        
        // Add allergen info
        if (categoryData.allergenInfo) {
            const allergenInfo = document.createElement('div');
            allergenInfo.className = 'allergen-info';
            
            const allergenTitle = document.createElement('h4');
            allergenTitle.textContent = categoryData.allergenInfo.title;
            allergenInfo.appendChild(allergenTitle);
            
            const allergenLegend = document.createElement('p');
            allergenLegend.className = 'menu-note';
            allergenLegend.textContent = categoryData.allergenInfo.legend;
            allergenInfo.appendChild(allergenLegend);
            
            if (categoryData.allergenInfo.warnings && categoryData.allergenInfo.warnings.length > 0) {
                categoryData.allergenInfo.warnings.forEach(warning => {
                    const warningElement = document.createElement('p');
                    warningElement.textContent = warning;
                    allergenInfo.appendChild(warningElement);
                });
            }
            
            categoryElement.appendChild(allergenInfo);
        }
    }
    
    // Function to populate the dessert category
    function populateDessertCategory(categoryId, categoryData) {
        const categoryElement = document.getElementById(categoryId);
        if (!categoryElement || !categoryData) return;
        
        // Add main dessert items directly without title
        if (categoryData.items && categoryData.items.length > 0) {
            categoryData.items.forEach(item => {
                const menuItem = createMenuItem(item);
                categoryElement.appendChild(menuItem);
            });
        }
        
        // Add note if exists
        if (categoryData.note) {
            const noteElement = document.createElement('p');
            noteElement.className = 'menu-note';
            noteElement.textContent = categoryData.note;
            categoryElement.appendChild(noteElement);
        }
        
        // Add extra items
        if (categoryData.extras && categoryData.extras.length > 0) {
            categoryData.extras.forEach(item => {
                const menuItem = createMenuItem(item);
                categoryElement.appendChild(menuItem);
            });
        }
    }
    
    // Function to populate the drinks category
    function populateDrinksCategory(categoryId, categoryData) {
        const categoryElement = document.getElementById(categoryId);
        if (!categoryElement || !categoryData) return;
        
        // Add sections
        if (categoryData.sections && categoryData.sections.length > 0) {
            categoryData.sections.forEach(section => {
                const sectionElement = document.createElement('div');
                sectionElement.className = 'menu-section';
                
                // Skip section title to just show cards
                
                // If section has subsections
                if (section.subsections && section.subsections.length > 0) {
                    section.subsections.forEach(subsection => {
                        // Skip subsection title to just show cards
                        
                        // Add subsection items
                        if (subsection.items && subsection.items.length > 0) {
                            subsection.items.forEach(item => {
                                const menuItem = createMenuItem(item);
                                sectionElement.appendChild(menuItem);
                            });
                        }
                    });
                } else if (section.items && section.items.length > 0) {
                    // Add section items directly if no subsections
                    section.items.forEach(item => {
                        const menuItem = createMenuItem(item);
                        sectionElement.appendChild(menuItem);
                    });
                }
                
                categoryElement.appendChild(sectionElement);
            });
        }
    }
    
    // Helper function to create a menu item
    function createMenuItem(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        const menuItemHeader = document.createElement('div');
        menuItemHeader.className = 'menu-item-header';
        
        const itemName = document.createElement('h3');
        itemName.textContent = item.name;
        menuItemHeader.appendChild(itemName);
        
        // Add dietary info if exists
        if (item.dietary) {
            const dietarySpan = document.createElement('span');
            dietarySpan.className = 'dietary';
            dietarySpan.textContent = item.dietary;
            menuItemHeader.appendChild(dietarySpan);
        }
        
        menuItem.appendChild(menuItemHeader);
        
        // Add description if exists
        if (item.description && item.description.trim() !== '') {
            const description = document.createElement('p');
            description.textContent = item.description;
            menuItem.appendChild(description);
        }
        
        return menuItem;
    }
    
    // Menu Tabs
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            
            // Hide all menu categories
            menuCategories.forEach(category => {
                category.classList.remove('active');
                category.setAttribute('hidden', '');
            });
            
            // Show the selected category
            const targetCategory = document.getElementById(tab.dataset.target);
            targetCategory.classList.add('active');
            targetCategory.removeAttribute('hidden');
            
            // Scroll to menu content if on mobile
            if (window.innerWidth < 768) {
                const menuContent = document.querySelector('.menu-content');
                if (menuContent) {
                    menuContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
        
        // Add keyboard support for tabs
        tab.addEventListener('keydown', (e) => {
            // Enter or Space activates the tab
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tab.click();
            }
            
            // Arrow keys for navigation between tabs
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                
                const tabArray = Array.from(menuTabs);
                const currentIndex = tabArray.indexOf(tab);
                let newIndex;
                
                if (e.key === 'ArrowRight') {
                    newIndex = (currentIndex + 1) % tabArray.length;
                } else {
                    newIndex = (currentIndex - 1 + tabArray.length) % tabArray.length;
                }
                
                tabArray[newIndex].focus();
            }
        });
    });
    
    // Initialize image slider for walks section
    let currentSlide = 0;
    const slides = document.querySelectorAll('.walks-gallery .gallery-item');
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Reset index if out of bounds
        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;
        
        // Show current slide
        if (slides[currentSlide]) {
            slides[currentSlide].style.display = 'block';
        }
    }
    
    // Auto advance slides every 5 seconds
    if (slides.length > 0) {
        showSlide(currentSlide);
        setInterval(() => {
            currentSlide++;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Reviews slider functionality
    const reviewCards = document.querySelectorAll('.review-card');
    let currentReview = 0;
    
    function showReviews() {
        // For mobile view, show only one review at a time
        if (window.innerWidth < 768) {
            reviewCards.forEach(card => {
                card.style.display = 'none';
            });
            
            if (currentReview >= reviewCards.length) currentReview = 0;
            if (currentReview < 0) currentReview = reviewCards.length - 1;
            
            if (reviewCards[currentReview]) {
                reviewCards[currentReview].style.display = 'block';
            }
        } else {
            // For desktop, show all reviews
            reviewCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }
    
    // Initialize reviews display
    showReviews();
    
    // Auto advance reviews on mobile every 7 seconds
    setInterval(() => {
        if (window.innerWidth < 768) {
            currentReview++;
            showReviews();
        }
    }, 7000);
    
    // Update reviews display on window resize
    window.addEventListener('resize', showReviews);
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const topBar = document.querySelector('.top-bar');
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (topBar) {
                topBar.style.opacity = '0.9';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (topBar) {
                topBar.style.opacity = '1';
            }
        }
    });
    
    // Active navigation link based on scroll position
    const sections = document.querySelectorAll('section');
    const menuNavLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        menuNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Highlight logo when home section is active
        const logo = document.querySelector('.logo h1');
        if (current === 'home' && logo) {
            logo.style.color = 'var(--secondary-color-light)';
        } else if (logo) {
            logo.style.color = 'var(--secondary-color)';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Set focus to the target element for better accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
                
                // Update URL without page reload
                history.pushState(null, '', targetId);
            }
        });
    });
    
    // Add accessibility support for keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes any open menus or modals
        if (e.key === 'Escape') {
            // Implementation would depend on specific modals or menus
            console.log('Escape key pressed - would close menus/modals');
        }
    });
    
    // Create folder structure for images
    // Note: This is just a placeholder comment as JavaScript can't create folders
    // You'll need to manually create the images folder and add your images
    
});
