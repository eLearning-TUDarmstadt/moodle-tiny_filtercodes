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
 * Commands helper for the Moodle tiny_filtercodes plugin.
 *
 * @module     tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {classFiltercode, classFiltercodeError, component, filtercodeNameMap, filtercodes} from './common';
import {getStrings} from 'core/str';
import {applyFiltercode, onBeforeGetContent, onDelete, onEdit, onFocus, onInit, onSubmit} from './ui';
import {filterCodesFilterExists} from "./options";

/**
 * @typedef {Editor} Editor
 */

/**
 * Get the setup function for the button and the menu entry.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {(Editor) => void} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const filtercodeNameMapKeys = Object.keys(filtercodeNameMap);
    const filtercodeNameMapValues = Object.values(filtercodeNameMap);
    const [
        buttonText,
        removeTag,
        editTag,
        ...filtercodeStrings
    ] = await getStrings([
            {key: 'filtercodes:filtercodes', component},
            {key: 'filtercodes:removetag', component},
            {key: 'filtercodes:edittag', component},
            ...filtercodeNameMapValues
        ]
    );
    const langKeys = Object.fromEntries(Array(filtercodeNameMapKeys.length).fill(0)
        .map((_, i) => [filtercodeNameMapKeys[i], filtercodeStrings[i]]));

    return (editor) => {
        if (filterCodesFilterExists(editor)) {
            editor.ui.registry.addNestedMenuItem(component, {
                text: buttonText,
                getSubmenuItems: () => filtercodes.map((codeorgroup) => {
                    if (codeorgroup.codes) {
                        return {
                            type: 'nestedmenuitem',
                            text: langKeys[codeorgroup.getKey()],
                            getSubmenuItems: () => codeorgroup.codes.map((code) => ({
                                type: 'menuitem',
                                text: langKeys[code.getKey()],
                                onAction: () => applyFiltercode(editor, code.id),
                            })),
                        };
                    } else {
                        return {
                            type: 'menuitem',
                            text: langKeys[codeorgroup.getKey()],
                            onAction: () => applyFiltercode(editor, codeorgroup.id),
                        };
                    }
                }),
            });
            editor.ui.registry.addButton(component + '_remove', {
                icon: 'remove',
                tooltip: removeTag,
                onAction: () => onDelete(editor, event),
            });
            editor.ui.registry.addButton(component + '_edit', {
                icon: 'edit-block',
                tooltip: editTag,
                onAction: () => onEdit(editor, event),
            });
            editor.ui.registry.addContextToolbar(component + '_0', {
                predicate: (node) => node.classList.contains(classFiltercode)
                    && !node.classList.contains(classFiltercodeError)
                    && node.hasAttribute('data-filtercodeargs'),
                items: [
                    `${component}_edit`,
                    `${component}_remove`,
                ].join(' '),
                position: 'node',
                scope: 'node'
            });
            editor.ui.registry.addContextToolbar(component + '_1', {
                predicate: (node) => node.classList.contains(classFiltercode)
                    && !node.classList.contains(classFiltercodeError)
                    && !node.hasAttribute('data-filtercodeargs'),
                items: [
                    `${component}_remove`,
                ].join(' '),
                position: 'node',
                scope: 'node'
            });
            editor.on('init', () => {
                onInit(editor);
            });
            editor.on('BeforeGetContent', (format) => {
                onBeforeGetContent(editor, format);
            });
            editor.on('focus', () => {
                onFocus(editor);
            });
            editor.on('submit', () => {
                onSubmit(editor);
            });
            editor.on('keydown', (event) => {
                onDelete(editor, event);
            });
        }
    };
};
