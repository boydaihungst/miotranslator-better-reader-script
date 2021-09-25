// ==UserScript==
// @name         https://miotranslator.com better reader mode
// @namespace    http://tampermonkey.net/
// @version      1.0.3
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
  contentArea.style.maxWidth = 'unset';
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
      '&display=swap';
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
  const waitActionBarShownInterval = setInterval(() => {
    const actionBar = document.querySelector('#actionbar>ul');
    if (actionBar) {
      clearInterval(waitActionBarShownInterval);
      if (localStorage.getItem(LAST_KNOWN_READ_PAGE_KEY)) {
        const resumePageLi = document.createElement('li');
        const resumeLastPageLink = document.createElement('a');
        const resumeLastPageLinkSpan = document.createElement('span');
        resumePageLi.classList.add('actnbr-btn');
        resumePageLi.classList.add('actnbr-hidden');
        resumeLastPageLinkSpan.innerHTML = 'Tiếp tục chương mới đọc';
        resumeLastPageLink.appendChild(resumeLastPageLinkSpan);
        resumeLastPageLink.href = localStorage.getItem(
          LAST_KNOWN_READ_PAGE_KEY,
        );
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
      node.style.marginLeft = '5%';
      node.style.marginRight = '5%';
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
