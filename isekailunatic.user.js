// ==UserScript==
// @name         https://isekailunatic.com better reader mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  isekailunatic website better reader mode
// @author       boydaihungst
// @include      https://www.isekailunatic.com/*
// @downloadURL  https://github.com/boydaihungst/miotranslator-better-reader-script/raw/main/isekailunatic.user.js
// @updateURL    https://raw.githubusercontent.com/boydaihungst/miotranslator-better-reader-script/main/isekailunatic.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const bodyDom = document.querySelector('body');
    const secondaryDom = document.querySelector('#secondary');
    const mainDom = document.querySelector('#main');
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
        bodyDom.style.fontFamily = FONT_TO_LOAD + ', sans-serif';
        bodyDom.style.fontSize = '20px';
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

    if (isReadPage) {
        if(secondaryDom) {
            secondaryDom.style.display= 'none'
            mainDom.style.width ='auto';
        }
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
            node.style.lineHeight = 'normal';
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
