// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands for the plugin logic of the Moodle tiny_filtercodes plugin.
 *
 * @module     tiny_filtercodes
 * @author     Leon Camus
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {
    isNull,
    filtercodeMap,
    regexTagStartEnd,
    classFiltercode,
    classFiltercodeBegin,
    classFiltercodeEnd, classFiltercodeLevel, classFiltercodeLevels, classFiltercodeError
} from "./common";
import {getHighlightCss} from "./options";
import {openArgumentModal} from "./arguments";

/**
 * Marker to remember that the submit button was hit.
 * @type {boolean}
 * @private
 */
let _isSubmit = false;

/**
 * @param {Text} node
 * @returns {Node[]}
 */
const replaceTextWithSpan = function(node) {
    let input = node.textContent;
    const output = [];
    const echo = function(text) {
        // If the last element is a text node, append the text to it.
        if (output.length > 0 && output[output.length - 1].nodeType === Node.TEXT_NODE) {
            output[output.length - 1].textContent += text;
        } else {
            output.push(document.createTextNode(text));
        }
    };

    while (input.length > 0) {
        // Search for the next filtercode start.
        const start = input.search(regexTagStartEnd);
        if (start >= 0) {
            // Add the text before the filtercode key.
            echo(input.substring(0, start));
            // Trim the input to the start of the filtercode key.
            input = input.substring(start);
            // Get the group matches of the regex.
            const match = input.matchAll(regexTagStartEnd).next().value;
            const isClosing = !isNull(match[1]);
            const key = match[2];
            const args = match[3];
            // Check if key is valid
            const filtercode = filtercodeMap[key];
            // If the filtercode is invalid
            // The filtercode is closing but the filtercode has no closing tag.
            // The filtercode is closing but has args.
            if (isNull(filtercode) || (isClosing && !filtercode.around) || (isClosing && !isNull(args))) {
                // Add the invalid filtercode as text.
                echo(input.substring(0, match[0].length));
            } else {
                // Add the span tag for the filtercode.
                if (isClosing) {
                    output.push(filtercode.endSpan());
                } else {
                    output.push(filtercode.beginSpan(args ? match[3].replace(/^\s+/, '').split(' ') : []));
                }
            }
            // Trim the input to the end of the filtercode key.
            input = input.substring(match[0].length);
            continue;
        }
        if (output.length === 0) {
            return [node]; // No filtercodes found, return the original node.
        }
        echo(input);
        input = "";
    }

    return output;
};

/**
 * @param {HTMLElement} node
 */
const transformDomToSpan = function(node) {
    let newchildren = [];
    node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
            newchildren.push(...replaceTextWithSpan(child));
        } else {
            if (child.nodeType !== Node.ELEMENT_NODE || !child.classList.contains(classFiltercode)) {
                transformDomToSpan(child);
            }
            newchildren.push(child);
        }
    });
    node.innerHTML = "";
    newchildren.forEach((child) => {
        node.appendChild(child);
    });
};

/**
 * Convert {key args}, {key}, {/key} strings to spans, so we can style them visually.
 * @param {Editor} ed
 * @return {string}
 */
export const addVisualStyling = function(ed) {
    let input = ed.getContent();
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const element = doc.body;
    transformDomToSpan(element);
    addVisualLevelIndicators(ed, element);
    return element.innerHTML;
};

/**
 * @param {Editor} ed
 * @param {HTMLElement} el
 */
export const addVisualLevelIndicators = function(ed, el) {
    const keyStack = [];
    const spans = el.querySelectorAll(`.${classFiltercode}`);
    for (const span of spans) {
        classFiltercodeLevels
            .filter((className) => span.classList.contains(className))
            .forEach((className) => span.classList.remove(className));
        // Remove the error class (we will re-add it if necessary later).
        if (span.classList.contains(classFiltercodeError)) {
            span.classList.remove(classFiltercodeError);
        }

        // Add begin tags to the stack.
        if (span.classList.contains(classFiltercodeBegin)) {
            keyStack.push(span);
            continue;
        }

        // Ignore spans that are not begin or end tags.
        if (!span.classList.contains(classFiltercodeEnd)) {
            continue;
        }

        // Match end tags with begin tags.
        const top = keyStack[keyStack.length - 1];
        // If the top of the stack is not the corresponding to a begin-tag, then we have an imbalanced filtercode.
        // We need to determine if the end tag is the correct one or if the begin-tag is missing.
        if (isNull(top) || top.dataset.filtercodekey !== span.dataset.filtercodekey) {
            // Check if there is a corresponding begin tag.
            if (keyStack.find((begin) => begin.dataset.filtercodekey === span.dataset.filtercodekey)) {
                // If the begin tag is found, remove all tags on top of it.
                while (keyStack.length > 0
                    && keyStack[keyStack.length - 1].dataset.filtercodekey !== span.dataset.filtercodekey) {
                    // Remove the top of the stack and mark it as imbalanced.
                    keyStack.pop().classList.add(classFiltercodeError);
                }
            } else {
                // If the begin tag is not found, then mark the end tag as imbalanced.
                span.classList.add(classFiltercodeError);
                continue;
            }
        }
        if (keyStack.length > 0) {
            // If the top of the stack is the corresponding begin tag, then remove it.
            keyStack.pop().classList.add(classFiltercodeLevel(keyStack.length));
            span.classList.add(classFiltercodeLevel(keyStack.length));
        } else {
            span.classList.add(classFiltercodeError);
        }
    }
    // If the stack is not empty, then we have an imbalanced filtercode.
    for (const span of keyStack) {
        span.classList.add(classFiltercodeError);
    }
};

/**
 * @param {Editor} ed
 */
export const updateVisualLevelIndicators = function(ed) {
    let keyStack = [];
    for (const span of ed.dom.select(`.${classFiltercode}`)) {
        classFiltercodeLevels
            .filter((className) => span.classList.contains(className))
            .forEach((className) => ed.dom.removeClass(span, className));
        // Remove the error class (we will re-add it if necessary later).
        if (span.classList.contains(classFiltercodeError)) {
            ed.dom.removeClass(span, classFiltercodeError);
        }

        // Add begin tags to the stack.
        if (span.classList.contains(classFiltercodeBegin)) {
            keyStack.push(span);
            continue;
        }

        // Ignore spans that are not begin or end tags.
        if (!span.classList.contains(classFiltercodeEnd)) {
            continue;
        }
        // Match end tags with begin tags.
        const top = keyStack[keyStack.length - 1];
        // If the top of the stack is not the corresponding begin tag, then we have an imbalanced filtercode.
        // We need to determine if the end tag is the correct one or if the begin tag is missing.
        if (isNull(top) || top.dataset.filtercodekey !== span.dataset.filtercodekey) {
            // Check if there is a corresponding begin tag.
            if (keyStack.find((begin) => begin.dataset.filtercodekey === span.dataset.filtercodekey)) {
                // If the begin tag is found, remove all tags on top of it.
                while (keyStack.length > 0
                    && keyStack[keyStack.length - 1].dataset.filtercodekey !== span.dataset.filtercodekey) {
                    // Remove the top of the stack and mark it as imbalanced.
                    ed.dom.addClass(keyStack.pop(), classFiltercodeError);
                }
            } else {
                // If the begin tag is not found, then mark the end tag as imbalanced.
                ed.dom.addClass(span, classFiltercodeError);
                continue;
            }
        }
        if (keyStack.length > 0) {
            // If the top of the stack is the corresponding begin tag, then remove it.
            ed.dom.addClass(keyStack.pop(), classFiltercodeLevel(keyStack.length));
            ed.dom.addClass(span, classFiltercodeLevel(keyStack.length));
        } else {
            ed.dom.addClass(span, classFiltercodeError);
        }
    }
    // If the stack is not empty, then we have an imbalanced filtercode.
    for (const span of keyStack) {
        ed.dom.addClass(span, classFiltercodeError);
    }
};

/**
 * When loading the editor for the first time, add the spans for highlighting the lang tags.
 * These are highlighted with the appropriate css only.
 * @param {Editor} ed
 */
export const onInit = function(ed) {
    ed.setContent(addVisualStyling(ed));
    ed.dom.addStyle(getHighlightCss(ed));
};

/**
 * Remove the spans we added in addVisualStyling() to leave only the {xxx} tags.
 * @param {Editor} ed
 */
export const removeVisualStyling = function(ed) {
    for (const span of ed.dom.select(`.${classFiltercode}`)) {
        ed.dom.setOuterHTML(span, span.innerHTML);
    }
    // Save to textarea.
    ed.save();
};

/**
 * When the submit button is hit, the marker spans are removed. However, if there's an error
 * in saving the content (via ajax) the editor remains with the cleaned content. Therefore,
 * we need to add the marker span elements once again when the user tries to change the content
 * of the editor.
 * @param {Editor} ed
 */
export const onFocus = function(ed) {
    if (_isSubmit) {
        // eslint-disable-next-line camelcase
        ed.setContent(addVisualStyling(ed), {no_events: true});
        _isSubmit = false;
    }
};

/**
 * Fires when the form containing the editor is submitted. Remove all the marker span elements.
 * @param {Editor} ed
 */
export const onSubmit = function(ed) {
    removeVisualStyling(ed);
    _isSubmit = true;
};

/**
 * When the source code view dialogue is show, we must remove the highlight spans from the editor content
 * and also add them again when the dialogue is closed.
 * @param {Editor} ed
 * @param {object} content
 */
export const onBeforeGetContent = function(ed, content) {
    if (!isNull(content.source_view) && content.source_view === true) {
        // If the user clicks on 'Cancel' or the close button on the html
        // source code dialog view, make sure we re-add the visual styling.
        const onClose = function(ed) {
            ed.off('close', onClose);
            ed.setContent(addVisualStyling(ed));
        };
        // Add an event listener to the editor to re-add the visual styling when the modal is closed.
        const observer = new MutationObserver((mutations, obs) => {
            const viewSrcModal = document.querySelector('[data-region="modal"]');
            if (viewSrcModal) {
                viewSrcModal.addEventListener('click', (event) => {
                    const {action} = event.target.dataset;
                    if (['cancel', 'save', 'hide'].includes(action)) {
                        onClose(ed);
                    }
                });
                // Stop observing once the modal is found.
                obs.disconnect();
                return;
            }
            const tinyMceModal = document.querySelector('.tox-dialog-wrap');
            if (tinyMceModal) {
                ed.on('CloseWindow', () => {
                    onClose(ed);
                });
                obs.disconnect();
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
        removeVisualStyling(ed);
    }
};

/**
 * @param {Editor} ed
 * @param {Node} node
 * @return {{start: Node, end: Node|null}|null}
 */
const getNodes = function(ed, node) {
    // Check if node is a filtercode span.
    if (!node.classList.contains(classFiltercode) || node.classList.contains(classFiltercodeError)) {
        return null;
    }
    // Get the filtercode key.
    const key = node.dataset.filtercodekey;
    // Check if the node is a begin or end span.
    if (node.classList.contains(classFiltercodeError)
        || (!node.classList.contains(classFiltercodeBegin) && !node.classList.contains(classFiltercodeEnd))) {
        return {start: node, end: null};
    }
    const isBegin = node.classList.contains(classFiltercodeBegin);
    // Find all filtercode spans with the same key (begin and end).
    const partners = ed.dom.select(`.${classFiltercode}[data-filtercodekey="${key}"]`);
    let currentlevel = 0;
    let expectedlevel = null;
    // Find the level of the node.
    for (const partner of (isBegin ? partners : [...partners].reverse())) {
        if (partner === node) {
            expectedlevel = currentlevel;
            if (partner.classList.contains(classFiltercodeBegin) && !partner.classList.contains(classFiltercodeError)) {
                currentlevel++;
            } else if (partner.classList.contains(classFiltercodeEnd) && !partner.classList.contains(classFiltercodeError)) {
                currentlevel--;
            }
            continue;
        }
        if (partner.classList.contains(classFiltercodeBegin) && !partner.classList.contains(classFiltercodeError)) {
            currentlevel++;
        } else if (partner.classList.contains(classFiltercodeEnd) && !partner.classList.contains(classFiltercodeError)) {
            currentlevel--;
        }
        if (currentlevel === expectedlevel) {
            return {
                start: isBegin ? node : partner,
                end: isBegin ? partner : node,
            };
        }
    }

    return null; // No partner found (possibly imbalanced filtercodes).
};

/**
 * At the current selection lookup for the current node. If we are inside a special span that encapsulates
 * the {lang} tag, then look for the corresponding opening or closing tag, depending on what's set in the
 * search param.
 * @param {Editor} ed
 * @return {{start: Node, end: Node|null}|null} The encapsulating span tag if found.
 */
const getHighlightNodesFromSelect = function(ed) {
    let nodes = null;
    ed.dom.getParents(ed.selection.getStart(), elm => {
        // Are we in a span that highlights the lang tag.
        if (!isNull(elm.classList) && elm.classList.contains(classFiltercode)) {
            nodes = getNodes(ed, elm);
        }
    });

    return nodes;
};

/**
 * Check for the parent hierarchy elements, if there's a context toolbar container, then hide it.
 * @param {Node} el
 */
const hideContentToolbar = function(el) {
    while (!isNull(el)) {
        if (el.nodeType === Node.ELEMENT_NODE &&
            !isNull(el.getAttribute('class')) &&
            el.getAttribute('class').indexOf('tox-pop-') != -1
        ) {
            el.style.display = 'none';
            return;
        }
        el = el.parentNode;
    }
};

/**
 * Check for key press <del> when something is deleted. If that happens inside a highlight span
 * tag, then remove this tag and the corresponding that open/closes this lang tag.
 * @param {Editor} ed
 * @param {Object} event
 */
export const onDelete = function(ed, event) {
    // We are not in composing mode, have not clicked and key <del> or <backspace> was not pressed.
    if (event.isComposing || (isNull(event.clientX) && event.keyCode !== 46 && event.keyCode !== 8)) {
        return;
    }
    // In case we clicked, check that we clicked an icon (this must have been the trash icon in the context menu).
    if (!isNull(event.clientX) &&
        (event.target.nodeType !== Node.ELEMENT_NODE || (event.target.nodeName !== 'path' && event.target.nodeName !== 'svg'))) {
        return;
    }
    // Conditions match either key <del> or <backspace> was pressed, or an click on an svg icon was done.
    // Check if we are inside a span for the language tag.
    const nodes = getHighlightNodesFromSelect(ed);
    // Only if both, start and end tags are found, then delete the nodes here and prevent the default handling
    // because the stuff to be deleted is already gone.
    if (!isNull(nodes)) {
        const {start, end} = nodes;
        event.preventDefault();
        ed.dom.remove(start);
        if (!isNull(end)) {
            ed.dom.remove(end);
        }
        if (!isNull(event.clientX)) {
            hideContentToolbar(event.target);
        }
        // Update color indicators.
        updateVisualLevelIndicators(ed);
    }
};

/**
 * The action when a menu entry is clicked. This adds the tags at the current content
 * position or around the selection.
 * @param {Editor} ed
 * @param {string} filtercodekey
 * @param {Event} event
 */
export const applyFiltercode = async function(ed, filtercodekey, event) {
    if (isNull(filtercodekey)) {
        return;
    }
    const filtercode = filtercodeMap[filtercodekey];
    if (isNull(filtercode)) {
        return;
    }
    let args = [];
    if (filtercode.args.length > 0) {
        args = await openArgumentModal(
            filtercodekey,
            filtercode.args.map(() => null)
        );
        if (isNull(args)) {
            return;
        }
    }
    let text = ed.selection.getContent();
    // Selection is empty, just insert the tag
    if (text.trim() === '') {
        // Event is set when the context menu was hit, here the editor lost the previously selected node. Therfore,
        // don't do anything.
        if (!isNull(event)) {
            hideContentToolbar(event.target);
            return;
        }
        if (filtercode.around) {
            ed.insertContent(filtercode.beginSpan(args).outerHTML + text + filtercode.endSpan().outerHTML);
        } else {
            ed.insertContent(filtercode.beginSpan(args).outerHTML);
        }
        // Update color indicators.
        updateVisualLevelIndicators(ed);
        return;
    }
    // // Hide context toolbar, because at any subsequent call the node is not selected anymore.
    if (!isNull(event)) {
        hideContentToolbar(event.target);
    }
    // No matter if we have syntax highlighting enabled or not, the spans around the tags exist
    // in the WYSIWYG mode. So check if we are on a special span that encapsulates the tags. Search
    // for the span tags.
    const nodes = getHighlightNodesFromSelect(ed);
    // If we have a span, then it's the opening tag, and we just replace this one with the new filtercode.
    if (!isNull(nodes)) {
        const {start, end} = nodes;
        if (filtercode.around && !isNull(end)) {
            // Both tags are found and we have a tag that need two tags.
            const color = start.style.backgroundColor;
            ed.dom.setOuterHTML(start, filtercode.beginSpan(args, color).outerHTML);
            ed.dom.setOuterHTML(end, filtercode.endSpan(color).outerHTML);
            return;
        }
        if (!filtercode.around && isNull(end)) {
            // One tag is found, but the new tag needs only one tag.
            const color = start.style.backgroundColor;
            ed.dom.setOuterHTML(start, filtercode.beginSpan(args, color).outerHTML);
            return;
        }
        if (filtercode.around && isNull(end)) {
            // One tag is found, but the new tag needs two tags.
            // Replace one tag with two tags.
            const color = start.style.backgroundColor;
            ed.dom.setOuterHTML(start, filtercode.beginSpan(args, color).outerHTML + filtercode.endSpan(color).outerHTML);
            return;
        }
        if (!filtercode.around && !isNull(end)) {
            // Both tags are found and we have a tag that needs only one tag.
            // Remove the closing tag.
            const color = start.style.backgroundColor;
            ed.dom.setOuterHTML(start, filtercode.beginSpan(args, color).outerHTML);
            ed.dom.remove(end);
            return;
        }
        return;
    }
    // Not inside a tag, insert a new opening and closing tag with the selection inside.
    if (filtercode.around) {
        ed.insertContent(filtercode.beginSpan(args).outerHTML + text + filtercode.endSpan().outerHTML);
    } else {
        ed.insertContent(filtercode.beginSpan(args).outerHTML);
    }
    // Update color indicators.
    updateVisualLevelIndicators(ed);
};

export const onEdit = async function(ed, event) {
    // Check if we are inside a span for the language tag.
    const nodes = getHighlightNodesFromSelect(ed);
    // Only if both, start and end tags are found, then delete the nodes here and prevent the default handling
    // because the stuff to be deleted is already gone.
    if (!isNull(nodes)) {
        const {start} = nodes;
        event.preventDefault();
        const filtercodekey = start.dataset.filtercodekey;
        if (isNull(filtercodekey)) {
            return;
        }
        const filtercode = filtercodeMap[filtercodekey];
        if (isNull(filtercode) || filtercode.args.length === 0) {
            // We don't know the filtercode, so we can't edit it.
            return;
        }
        let args = start.dataset.filtercodeargs.split(' ');
        args = await openArgumentModal(filtercodekey, args);
        if (isNull(args)) {
            return;
        }
        ed.dom.setOuterHTML(start, filtercode.beginSpan(args).outerHTML);
        updateVisualLevelIndicators(ed);
    }
};
