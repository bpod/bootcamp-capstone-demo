// Demo App JavaScript - Intentional Performance and Accessibility Issues

// ISSUE: No 'use strict'
// ISSUE: Global variables polluting namespace
var currentPage = 'home';
var modalOpen = false;
var userData = {};

// ISSUE: Function declarations in global scope
function navigate(page) {
    // ISSUE: Direct DOM manipulation without checking if element exists
    console.log('Navigating to:', page);
    currentPage = page;
    
    // ISSUE: Using innerHTML instead of textContent (potential XSS)
    document.querySelector('h1').innerHTML = 'Welcome to ' + page;
    
    // ISSUE: Not preventing default on anchor click (handled inline with onclick)
}

function showModal() {
    // ISSUE: Using getElementById without checking if exists
    var modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modalOpen = true;
    
    // ISSUE: No focus management - focus should move to modal
    // ISSUE: No focus trap within modal
    // ISSUE: No keyboard event handlers for ESC key
}

function closeModal() {
    var modal = document.getElementById('modal');
    modal.style.display = 'none';
    modalOpen = false;
    
    // ISSUE: No focus return to triggering element
}

function submitForm(event) {
    event.preventDefault();
    
    // ISSUE: Using getElementById repeatedly (inefficient)
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    
    // ISSUE: No input validation
    // ISSUE: No sanitization of user input
    
    console.log('Form submitted:', { name, email, message });
    
    // ISSUE: Alert instead of accessible feedback
    alert('Form submitted! (This is a demo)');
    
    // ISSUE: Not clearing form after submission
}

function viewProduct(id) {
    console.log('Viewing product:', id);
    
    // ISSUE: No keyboard support for "clickable div"
    // ISSUE: No ARIA attributes to indicate interactivity
    
    // ISSUE: Synchronous operation that could block UI
    var productDetails = getProductDetails(id);
    alert('Product: ' + productDetails.name);
}

// ISSUE: Synchronous function that simulates slow operation
function getProductDetails(id) {
    // Simulating slow operation
    var start = Date.now();
    while (Date.now() - start < 100) {
        // Blocking loop
    }
    
    return {
        id: id,
        name: 'Product ' + id,
        price: id * 50
    };
}

// ISSUE: DOMContentLoaded listener added after potential DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // ISSUE: Querying all elements at once instead of caching
    var cards = document.querySelectorAll('.feature-card');
    
    // ISSUE: Adding event listeners in a loop without event delegation
    cards.forEach(function(card, index) {
        card.addEventListener('click', function() {
            console.log('Card clicked:', index);
            // ISSUE: No actual functionality
        });
    });
    
    // ISSUE: Unnecessary interval that runs continuously
    setInterval(function() {
        // ISSUE: Reading from DOM in every interval (causes reflow)
        var timestamp = Date.now();
        console.log('Interval tick:', timestamp);
    }, 5000);
    
    // ISSUE: Loading data on page load instead of lazy loading
    loadAllData();
});

// ISSUE: Function that makes synchronous operations
function loadAllData() {
    // ISSUE: No error handling
    // ISSUE: Synchronous loop that blocks main thread
    var data = [];
    for (var i = 0; i < 1000; i++) {
        data.push({
            id: i,
            value: Math.random(),
            timestamp: Date.now()
        });
    }
    
    userData.cachedData = data;
    console.log('Loaded', data.length, 'items');
}

// ISSUE: No debouncing for scroll/resize handlers
window.addEventListener('resize', function() {
    // ISSUE: Expensive operation on every resize event
    console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
    
    // ISSUE: Forcing synchronous layout
    var elements = document.querySelectorAll('.feature-card');
    elements.forEach(function(el) {
        var height = el.offsetHeight; // Forces reflow
        console.log('Element height:', height);
    });
});

// ISSUE: Scroll event without throttling/debouncing
window.addEventListener('scroll', function() {
    // ISSUE: Reading scroll position on every scroll event
    var scrollPosition = window.scrollY;
    
    // ISSUE: Adding/removing classes on scroll (causes layout thrashing)
    if (scrollPosition > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

// ISSUE: Using lodash but only for one simple operation
function processArray(arr) {
    // ISSUE: Could use native .map() instead of lodash
    return _.map(arr, function(item) {
        return item * 2;
    });
}

// ISSUE: Memory leak - event listeners not cleaned up
function createTemporaryElement() {
    var div = document.createElement('div');
    div.addEventListener('click', function() {
        console.log('Clicked temporary element');
    });
    // ISSUE: Element and listener never properly removed
    return div;
}

// ISSUE: No module pattern or IIFE to encapsulate code
// ISSUE: No polyfills for older browsers
// ISSUE: No feature detection
// ISSUE: Mixing ES5 and modern patterns inconsistently

// ISSUE: Global error handling missing
// window.addEventListener('error', errorHandler);

// ISSUE: No service worker for offline functionality
// ISSUE: No lazy loading implementation
// ISSUE: No code splitting or dynamic imports
