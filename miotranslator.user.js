// ==UserScript==
// @name         https://miotranslator.com better reader mode
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  miotranslator website better reader mode
// @author       boydaihungst
// @include      https://miotranslator.com/*
// @include      https://tsukiteam.wordpress.com/*
// @icon         https://www.google.com/s2/favicons?domain=wordpress.com
// @downloadURL  https://github.com/boydaihungst/miotranslator-better-reader-script/raw/main/miotranslator.user.js
// @updateURL    https://raw.githubusercontent.com/boydaihungst/miotranslator-better-reader-script/main/miotranslator.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // Setting css
    const contentAreaSelector =
          location.host === 'tsukiteam.wordpress.com'
    ? '.content-area'
    : '.entry-content';
    const contentArea = document.querySelector(contentAreaSelector);
    // better view in mobile device
    if(document.documentElement.clientWidth <= 600) {
        const hentryDom = document.querySelector('.hentry');
        if (!!hentryDom) {
            hentryDom.style.paddingRight = '0px';
            hentryDom.style.paddingLeft = '0px';
        }
    }
    //
    contentArea.style.maxWidth = 'unset';
    contentArea.style.paddingLeft = '0px';
    contentArea.style.paddingRight = '0px';
    if (location.host === 'miotranslator.com' && !!document.querySelector('html[data-darkreader-scheme]')) {
        setTimeout(() => {
            const darkReaderDom = document.querySelector('html[data-darkreader-scheme]');
            if(darkReaderDom) {
                const body = document.querySelector('body');
                body.style.backgroundColor = 'unset';
                body.style.color = '#444';
                const siteNavs = document.querySelectorAll('#menu-tsuki-ga-michibiku-isekai-douchuu > li > a')
                if (siteNavs && siteNavs.length > 0) {
                    siteNavs.forEach(navItem => {
                        navItem.style.color = '#444';
                    });
                }
            }
        }, 200)
    }
    const FONT_TO_LOAD = 'Nunito';
    var fontLoader = function (param) {
        var headID = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';

        headID.appendChild(link);
        link.href =
            'https://fonts.googleapis.com/css2?family=' +
            param.family +
            ':ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap';
        contentArea.style.fontFamily = FONT_TO_LOAD + ', sans-serif';
        contentArea.style.fontSize = '20px';
    };
    // Load font Nunito
    fontLoader({
        family: FONT_TO_LOAD,
    });
    let mouseTimer = null,
        cursorVisible = true;
    const isReadPage = /(^\/\d+\/\d+\/\d+\/\w+).+/g.test(location.pathname);
    const LAST_KNOWN_READ_PAGE_KEY = 'lastKnownReadPage_' + location.host;
    const lastReadPage = localStorage.getItem(LAST_KNOWN_READ_PAGE_KEY);
    const waitActionBarShownInterval = setInterval(function () {
        const actionBar = document.querySelector('#actionbar>ul');
        if (actionBar) {
            const marketingBarDom = document.querySelector('#marketingbar');
            // hide marking bar
            if(!!marketingBarDom){
                marketingBarDom.style.display = 'none';
            }
            clearInterval(waitActionBarShownInterval);
            if (lastReadPage) {
                const resumePageLi = document.createElement('li');
                const resumeLastPageLink = document.createElement('a');
                const resumeLastPageLinkSpan = document.createElement('span');
                resumePageLi.classList.add('actnbr-btn');
                resumePageLi.classList.add('actnbr-hidden');
                resumeLastPageLinkSpan.innerHTML = 'Tiếp tục chương mới đọc';
                resumeLastPageLink.appendChild(resumeLastPageLinkSpan);
                resumeLastPageLink.href = lastReadPage;
                resumeLastPageLink.classList.add('actnbr-action');
                resumeLastPageLink.style.padding = '0';
                resumePageLi.appendChild(resumeLastPageLink);
                actionBar.insertBefore(resumePageLi, actionBar.firstChild);
            }
        }
    }, 100);
    if (isReadPage) {
        localStorage.setItem(LAST_KNOWN_READ_PAGE_KEY, location.href);
        // Auto hide mouse if not move after 2s
        function disappearCursor() {
            mouseTimer = null;
            document.body.style.cursor = 'none';
            cursorVisible = false;
        }

        document.onmousemove = function () {
            if (mouseTimer) {
                window.clearTimeout(mouseTimer);
            }
            if (!cursorVisible) {
                document.body.style.cursor = 'default';
                cursorVisible = true;
            }
            mouseTimer = window.setTimeout(disappearCursor, 2000);
        };
        // Add line'id by index
        const contentEntries = document.querySelectorAll('.entry-content > p');
        contentEntries.forEach((node, index) => {
            node.id = 'line-' + index;
            node.style.maxWidth = '100%';
            if (location.host !== 'miotranslator.com' || document.documentElement.clientWidth >= 600) {
                node.style.marginLeft = '5%';
                node.style.marginRight = '5%';
            }
            node.style.textAlign = 'justify';
            node.style.fontWeight = '300';
        });

        // Bookmark last read position
        const LAST_KNOWN_SCROLL_POSITION_KEY_BY_PATH =
              'lastKnownScrollPosition_' + location.pathname;
        let lastKnownScrollPosition = localStorage.getItem(
            LAST_KNOWN_SCROLL_POSITION_KEY_BY_PATH,
        );
        let ticking = false;

        // Jump to last read position on loaded
        if (lastKnownScrollPosition && lastKnownScrollPosition > 0) {
            window.scrollTo(0, lastKnownScrollPosition);
        }

        function saveLastKnownScrollPosition(scrollPos) {
            localStorage.setItem(LAST_KNOWN_SCROLL_POSITION_KEY_BY_PATH, scrollPos);
        }

        document.addEventListener('scroll', function (e) {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    saveLastKnownScrollPosition(lastKnownScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        });
    }
})();
