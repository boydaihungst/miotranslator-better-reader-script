// ==UserScript==
// @name         https://webtruyenonlinez.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  webtruyenonlinez website better reader mode
// @author       boydaihungst
// @include      http://webtruyenonlinez.com/truyen/*
// @downloadURL  https://github.com/boydaihungst/miotranslator-better-reader-script/raw/main/webtruyenonlinez.user.js
// @updateURL    https://raw.githubusercontent.com/boydaihungst/miotranslator-better-reader-script/main/webtruyenonlinez.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const changeChapterBtns = document.querySelectorAll(".book-control a[href^='truyen/']");
    if(changeChapterBtns.length > 1) {
        document.addEventListener('keyup', (e) => {
            // forward
            if(e.keyCode === 39) {
                changeChapterBtns[1].click();
            }
            // backward
            if(e.keyCode === 37) {
                changeChapterBtns[0].click();
            }
        })
    }
    const contentArea = document.querySelector('.read-book-ct .main-ct');
    if(!contentArea) return;
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
        contentArea.style.setProperty("fontFamily", "Nunito", "important")
        contentArea.style.fontSize = '20px';
        contentArea.style.maxWidth = '100%';
        contentArea.style.lineHeight = 'normal';
        contentArea.style.textAlign = 'justify';
        contentArea.style.fontWeight = '300';
    };
    // Load font Nunito
    fontLoader({
        family: FONT_TO_LOAD,
    });
})();
