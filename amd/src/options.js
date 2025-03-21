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
 * Options helper for tiny_filtercodes plugin.
 *
 * @module      tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from './common';

const mfiltercodesfilter = getPluginOptionName(pluginName, 'mfiltercodesfilter');
const highlightcss = getPluginOptionName(pluginName, 'css');

/**
 * Register the options for the Tiny Equation plugin.
 *
 * @param {Editor} editor
 */
export const register = (editor) => {
    editor.options.register(mfiltercodesfilter, {
        processor: 'boolean',
        "default": false,
    });
    editor.options.register(highlightcss, {
        processor: 'string',
        "default": '',
    });
};

/**
 * Get the highlight css in case the language dependent block are supposed to be emphasized.
 *
 * @param {Editor} editor
 * @returns {string}
 */
export const getHighlightCss = (editor) => editor.options.get(highlightcss);

/**
 * Get if the filter codes filter is enabled for this text editor.
 *
 * @param {Editor} editor
 * @returns {boolean}
 */
export const filterCodesFilterExists = (editor) => editor.options.get(mfiltercodesfilter);
