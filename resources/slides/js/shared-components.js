/**
 * Shared Components for Laravel Training Slides
 * Automatically injects header, footer, and content frame into each slide.
 * Handles special slides (title page, closing page) differently.
 */

(function() {
    'use strict';

    const TOTAL_SLIDES = 50;

    // Slide metadata
    const slideMetadata = {
        1:  { section: 'INTRODUCTION', title: 'Course Introduction', color: 'blue', special: 'title' },
        2:  { section: 'INSTRUCTOR', title: 'ประวัติวิทยากร', color: 'blue' },
        3:  { section: 'TARGET AUDIENCE', title: 'กลุ่มเป้าหมาย', color: 'blue' },
        4:  { section: 'COURSE OVERVIEW', title: 'ภาพรวมหลักสูตร', color: 'blue' },
        5:  { section: 'WHY LARAVEL', title: 'ทำไมต้อง Laravel', color: 'blue' },
        6:  { section: 'AI TOOLS', title: 'AI Tools for Development', color: 'purple' },
        7:  { section: 'ENVIRONMENT SETUP', title: 'System Requirements', color: 'green' },
        8:  { section: 'ENVIRONMENT SETUP', title: 'PHP Installation', color: 'green' },
        9:  { section: 'ENVIRONMENT SETUP', title: 'Composer & Laravel Setup', color: 'green' },
        10: { section: 'ENVIRONMENT SETUP', title: 'IDE Setup - VS Code', color: 'green' },
        11: { section: 'LARAVEL FUNDAMENTALS', title: 'Project Structure', color: 'blue' },
        12: { section: 'LARAVEL ARCHITECTURE', title: 'MVC Pattern', color: 'blue' },
        13: { section: 'LARAVEL ARCHITECTURE', title: 'Service Container & DI', color: 'blue' },
        14: { section: 'LARAVEL ARCHITECTURE', title: 'Facades', color: 'blue' },
        15: { section: 'ROUTING', title: 'Routing Basics', color: 'indigo' },
        16: { section: 'ROUTING', title: 'Advanced Routing', color: 'indigo' },
        17: { section: 'CONTROLLERS', title: 'Controller Basics', color: 'green' },
        18: { section: 'CONTROLLERS', title: 'Resource Controllers', color: 'green' },
        19: { section: 'CONTROLLERS', title: 'Best Practices', color: 'green' },
        20: { section: 'MODELS & ELOQUENT', title: 'Eloquent Introduction', color: 'purple' },
        21: { section: 'ELOQUENT RELATIONSHIPS', title: 'Relationships Part 1', color: 'purple' },
        22: { section: 'ELOQUENT RELATIONSHIPS', title: 'Relationships Part 2', color: 'purple' },
        23: { section: 'ELOQUENT QUERY', title: 'Query Scopes', color: 'purple' },
        24: { section: 'ELOQUENT', title: 'Accessors & Mutators', color: 'purple' },
        25: { section: 'ELOQUENT', title: 'Attribute Casting', color: 'purple' },
        26: { section: 'ELOQUENT', title: 'Collections', color: 'purple' },
        27: { section: 'VIEWS & BLADE', title: 'Blade Basics', color: 'orange' },
        28: { section: 'BLADE', title: 'Components', color: 'orange' },
        29: { section: 'BLADE', title: 'Layouts', color: 'orange' },
        30: { section: 'BLADE', title: 'Frontend Assets', color: 'orange' },
        31: { section: 'FORMS', title: 'Forms & CSRF', color: 'red' },
        32: { section: 'FORMS', title: 'Validation', color: 'red' },
        33: { section: 'AUTHENTICATION', title: 'Authentication', color: 'pink' },
        34: { section: 'AUTHENTICATION', title: 'Starter Kits', color: 'pink' },
        35: { section: 'AUTHORIZATION', title: 'ACL & Authorization', color: 'yellow' },
        36: { section: 'SECURITY', title: 'Security Threats', color: 'red' },
        37: { section: 'SECURITY', title: 'Data Security', color: 'red' },
        38: { section: 'CRUD', title: 'CRUD System', color: 'teal' },
        39: { section: 'REPORTING', title: 'Reporting System', color: 'cyan' },
        40: { section: 'TESTING', title: 'Testing & Debugging', color: 'lime' },
        41: { section: 'PERFORMANCE', title: 'Caching', color: 'amber' },
        42: { section: 'PERFORMANCE', title: 'Queues & Jobs', color: 'amber' },
        43: { section: 'DEPLOYMENT', title: 'Deployment Guide', color: 'emerald' },
        44: { section: 'BEST PRACTICES', title: 'Laravel Best Practices', color: 'violet' },
        45: { section: 'WORKSHOP', title: 'Workshop Intro', color: 'rose' },
        46: { section: 'WORKSHOP', title: 'Step 1: Database', color: 'rose' },
        47: { section: 'WORKSHOP', title: 'Step 2: Logic', color: 'rose' },
        48: { section: 'WORKSHOP', title: 'Step 3: Frontend', color: 'rose' },
        49: { section: 'RESOURCES', title: 'Next Steps', color: 'sky' },
        50: { section: 'CLOSING', title: 'Q&A & Closing', color: 'purple', special: 'closing' }
    };

    function getCurrentPageNumber() {
        const path = window.location.pathname;
        const match = path.match(/page(\d+)\.html/);
        return match ? parseInt(match[1], 10) : 1;
    }

    function getSlideMeta(pageNum) {
        return slideMetadata[pageNum] || { section: 'LARAVEL', title: 'Slide', color: 'blue' };
    }

    // Generate header HTML
    function generateHeader(meta, pageNum, isSpecial) {
        const progress = (pageNum / TOTAL_SLIDES) * 100;
        const darkMode = (isSpecial === 'closing');
        
        return `
            <header class="slide-header ${darkMode ? 'slide-header--dark' : ''}">
                <div class="header-left">
                    <div class="header-logo">
                        <i class="fa-brands fa-laravel"></i>
                    </div>
                    <div class="header-info">
                        <span class="header-section">${meta.section}</span>
                        <span class="header-title">${meta.title}</span>
                    </div>
                </div>
                <div class="header-right">
                    <div class="header-progress">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <span class="header-page">${pageNum} / ${TOTAL_SLIDES}</span>
                </div>
            </header>
        `;
    }

    // Generate footer HTML
    function generateFooter(meta, pageNum, isSpecial) {
        const darkMode = (isSpecial === 'closing');
        
        return `
            <footer class="slide-footer ${darkMode ? 'slide-footer--dark' : ''}">
                <div class="footer-left">
                    <span class="footer-course">LARAVEL + AI TRAINING COURSE</span>
                </div>
                <div class="footer-center">
                    <span class="footer-section">${meta.section}</span>
                </div>
                <div class="footer-right">
                    <span class="footer-page">${String(pageNum).padStart(2, '0')} / ${TOTAL_SLIDES}</span>
                </div>
            </footer>
        `;
    }

    // Remove old inline header/footer elements from content
    function removeOldHeaderFooter(contentWrapper) {
        if (!contentWrapper) return;

        // Remove old inline footer: scan children from bottom up
        var children = Array.from(contentWrapper.children);
        for (var i = children.length - 1; i >= Math.max(0, children.length - 3); i--) {
            var el = children[i];
            var txt = (el.textContent || '').trim();
            var cls = el.className || '';
            // Match: "mt-auto ... border-t" with PAGE text, or just border-t with PAGE
            if (
                (cls.includes('mt-auto') && txt.includes('PAGE')) ||
                (cls.includes('border-t') && txt.includes('PAGE')) ||
                (cls.includes('border-t') && txt.includes('LARAVEL'))
            ) {
                el.style.display = 'none';
                break;
            }
        }

        // Remove absolute positioned elements (footers, taglines)
        document.querySelectorAll('.absolute').forEach(function(el) {
            // Skip our injected header/footer
            if (el.classList.contains('slide-header') || el.classList.contains('slide-footer')) return;
            var txt = (el.textContent || '').trim();
            if (
                txt.includes('PAGE') ||
                txt.includes('Powered by Laravel') ||
                txt.includes('พัฒนาระบบอย่างปลอดภัย') ||
                (txt.includes('LARAVEL') && txt.includes('TRAINING'))
            ) {
                el.style.display = 'none';
            }
        });
    }

    // Initialize shared components
    function initSharedComponents() {
        var pageNum = getCurrentPageNumber();
        var meta = getSlideMeta(pageNum);
        var isSpecial = meta.special || null;

        var slideContainer = document.querySelector('.slide-container');
        if (!slideContainer) return;

        // Prevent double injection
        if (document.querySelector('.slide-header')) return;

        var contentWrapper = document.querySelector('.content-wrapper');

        // Remove old inline headers/footers
        removeOldHeaderFooter(contentWrapper);

        // Add theme color class
        slideContainer.classList.add('theme-' + meta.color);

        // Inject header
        slideContainer.insertAdjacentHTML('afterbegin', generateHeader(meta, pageNum, isSpecial));

        // Inject footer
        slideContainer.insertAdjacentHTML('beforeend', generateFooter(meta, pageNum, isSpecial));

        // Frame the content area
        if (contentWrapper) {
            // Reset any existing padding/margin from inline styles
            contentWrapper.style.padding = '0';
            contentWrapper.style.height = 'auto';
            contentWrapper.style.overflow = 'hidden';

            // Add content-frame class for visual border
            contentWrapper.classList.add('content-frame');

            // For special pages, use different framing
            if (isSpecial === 'title') {
                contentWrapper.classList.add('content-frame--title');
            } else if (isSpecial === 'closing') {
                contentWrapper.classList.add('content-frame--closing');
            } else {
                contentWrapper.classList.add('content-frame--default');
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedComponents);
    } else {
        initSharedComponents();
    }

})();
