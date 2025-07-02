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
 * Argument modal for the Moodle tiny_filtercodes plugin.
 *
 * @module     tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import Templates from "core/templates";
import {getString, getStrings} from "core/str";
import ModalSaveCancel from "core/modal_save_cancel";
import ModalEvents from "core/modal_events";
import {component, filtercodeMap, isNull, QuotedTextArg, SelectArg, TextArg} from "./common";
import {getCategoriesData, getCourseGroupingsData, getCourseGroupsData, getCoursesData} from "./ajax";

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {boolean} multiple
 * @return {Promise<{html: string, js: string}>}
 */
const renderGroupIdNumber = async function(argid, currentArg, multiple = false) {
    // Get Current Course ID
    const courseid = M.cfg.courseId;
    if (isNull(courseid)) {
        throw new Error('Course ID is not found');
    }
    // Fetch all groups in the course
    const groups = await getCourseGroupsData(courseid);
    if (isNull(groups) || groups.length === 0) {
        throw new Error('No groups found in the course');
    }
    // Render the select.
    return await Templates.renderForPromise('tiny_filtercodes/autocomplete', {
        name: argid,
        id: argid,
        options: groups.map((group) => {
            return {
                value: group.idnumber || `${group.id}`,
                text: group.name,
                selected: group.idnumber === currentArg || `${group.id}` === currentArg,
            };
        }),
        multiple,
        ajax: null,
        tags: false,
        casesensitive: false,
        showsuggestions: true,
    });
};

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {boolean} multiple
 * @return {Promise<{html: string, js: string}>}
 */
const renderGroupingIdNumber = async function(argid, currentArg, multiple = false) {
    // Get Current Course ID
    const courseid = M.cfg.courseId;
    if (isNull(courseid)) {
        throw new Error('Course ID is not found');
    }
    // Fetch all groups in the course
    const groupings = await getCourseGroupingsData(courseid);
    if (isNull(groupings) || groupings.length === 0) {
        throw new Error('No groups found in the course');
    }
    // Render the select.
    return await Templates.renderForPromise('tiny_filtercodes/autocomplete', {
        name: argid,
        id: argid,
        options: groupings.map((grouping) => {
            return {
                value: grouping.idnumber || `${grouping.id}`,
                text: grouping.name,
                selected: grouping.idnumber === currentArg || `${grouping.id}` === currentArg,
            };
        }),
        multiple,
        ajax: null,
        tags: false,
        casesensitive: false,
        showsuggestions: true,
    });
};

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {boolean} multiple
 * @return {Promise<{html: string, js: string}>}
 */
const renderCourseId = async function(argid, currentArg, multiple = false) {
    // Fetch all groups in the course
    const courses = await getCoursesData();
    if (isNull(courses) || courses.length === 0) {
        throw new Error('No courses found');
    }
    // Render the select.
    return await Templates.renderForPromise('tiny_filtercodes/autocomplete', {
        name: argid,
        id: argid,
        options: courses.map((course) => {
            return {
                value: course.idnumber || `${course.id}`,
                text: course.displayname,
                selected: course.idnumber === currentArg || `${course.id}` === currentArg,
            };
        }),
        multiple,
        ajax: null, // TODO: Implement AJAX
        tags: false,
        casesensitive: false,
        showsuggestions: true,
    });
};

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {boolean} multiple
 * @return {Promise<{html: string, js: string}>}
 */
const renderCategoryId = async function(argid, currentArg, multiple = false) {
    // Fetch all groups in the course
    const categories = await getCategoriesData();
    if (isNull(categories) || categories.length === 0) {
        throw new Error('No courses found');
    }
    // Render the select.
    return await Templates.renderForPromise('tiny_filtercodes/autocomplete', {
        name: argid,
        id: argid,
        options: categories.map((category) => {
            return {
                value: category.idnumber || `${category.id}`,
                text: category.name,
                selected: category.idnumber === currentArg || `${category.id}` === currentArg,
            };
        }),
        multiple,
        ajax: null, // TODO: Implement AJAX
        tags: false,
        casesensitive: false,
        showsuggestions: true,
    });
};

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {({langkey: string, value: string}|string)[]} values
 * @param {boolean} allowCustom
 * @param {boolean} multiple
 * @param {boolean} empty
 * @return {Promise<{html: string, js: string}>}
 */
const renderSelect = async function(argid, currentArg, values, allowCustom = false, multiple = false, empty = false) {
    if (empty) {
        // Prepend an empty value.
        values = [
            {
                langkey: 'empty',
                value: '',
            },
            ...values,
        ];
    }
    const langKeys = await getStrings(values.map((value) => ({
        key: `filtercodes:argument:value:${value.langkey === undefined ? value : value.langkey}`,
        component,
    })));
    if (allowCustom || multiple) {
        // TODO ALLOW CUSTOM
        return await Templates.renderForPromise('tiny_filtercodes/autocomplete', {
            name: argid,
            id: argid,
            options: values.map((value, i) => {
                return {
                    value: value.value === undefined ? value : value.value,
                    text: langKeys[i],
                    selected: (value.value === undefined ? value : value.value) === currentArg,
                };
            }),
            multiple,
            ajax: null,
            tags: false,
            casesensitive: false,
            showsuggestions: true,
        });
    }

    return await Templates.renderForPromise('tiny_filtercodes/select', {
        name: argid,
        id: argid,
        options: values.map((value, i) => {
            return {
                value: value.value === undefined ? value : value.value,
                text: langKeys[i],
                selected: (value.value === undefined ? value : value.value) === currentArg,
            };
        }),
    });
};

/**
 * @param {string} argid
 * @param {string} currentArg
 * @param {string} placeholder
 * @return {Promise<{html: string, js: string}>}
 */
const renderText = async function(argid, currentArg, placeholder) {
    return await Templates.renderForPromise('tiny_filtercodes/text', {
        name: argid,
        id: argid,
        value: currentArg,
        placeholder,
    });
};

/**
 * @param {string} key
 * @param {(string|null)[]} currentArgs
 * @return {Promise<string[]|null>}
 */
// eslint-disable-next-line complexity
export const openArgumentModal = async function(key, currentArgs) {
    const filtercode = filtercodeMap[key];
    if (isNull(filtercode)) {
        return null;
    }
    const data = {
        args: [],
    };
    // Generate a random postfix for the argument ids.
    const postfix = Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    for (let i = 0; i < filtercode.args.length; i++) {
        const argid = `arg${i}-${postfix}`;
        const arg = filtercode.args[i];
        if (arg instanceof SelectArg) {
            let currentArg = currentArgs[0];
            if (arg.multiple) {
                currentArg = currentArgs.join(',');
            } else {
                currentArgs = currentArgs.splice(1);
            }
            data.args.push((async() => ({
                id: argid,
                label: await getString(`filtercodes:argument:${arg.id}`, component),
                ...await renderSelect(argid, currentArg, arg.values, arg.allowCustom, arg.multiple, arg.empty),
            }))());
            continue;
        }
        if (arg instanceof QuotedTextArg) {
            let currentArg = '';
            if (!isNull(currentArgs[0])) {
                if (!currentArgs[0].startsWith('"')) {
                    throw new Error('Quoted text argument must start with a double quote');
                }

                let j = 0;
                while (j < currentArgs.length && !currentArgs[j].endsWith('"')) {
                    j++;
                }
                if (j === currentArgs.length) {
                    throw new Error('Quoted text argument must end with a double quote');
                }
                currentArg = currentArgs.splice(0, j + 1).join(' ');
                currentArgs = currentArgs.splice(j);
                // Remove the quotes.
                currentArg = currentArg.substring(1, currentArg.length - 1);
            }
            data.args.push((async() => ({
                id: argid,
                label: await getString(`filtercodes:argument:${arg.id}`, component),
                ...await renderText(argid, currentArg, arg.placeholder),
            }))());
            continue;
        }
        if (arg instanceof TextArg) {
            const currentArg = currentArgs.join(',');
            data.args.push((async() => ({
                id: argid,
                label: await getString(`filtercodes:argument:${arg.id}`, component),
                ...await renderText(argid, currentArg, arg.placeholder),
            }))());
            continue;
        }
        const multiple = arg.endsWith('+') || arg.endsWith('*');
        const empty = arg.endsWith('*') || arg.endsWith('?');
        // Fail if the argument is empty or multiple and not the last argument.
        if (i < filtercode.args.length - 1 && (empty || multiple)) {
            throw new Error('Empty or multiple arguments are only allowed as the last argument');
        }
        let currentArg = currentArgs[0];
        if (multiple) {
            currentArg = currentArgs.splice(i).join(',');
        } else {
            currentArgs = currentArgs.splice(1);
        }
        if (arg.startsWith('groupidnumber')) {
            data.args.push((async() => ({
                id: argid,
                multiple,
                empty,
                label: await getString(`filtercodes:argument:groupidnumber${multiple ? 's' : ''}`, component),
                ...await renderGroupIdNumber(argid, currentArg, multiple),
            }))());
            continue;
        }
        if (arg.startsWith('groupingidnumber')) {
            data.args.push((async() => ({
                id: argid,
                multiple,
                empty,
                label: await getString(`filtercodes:argument:groupingidnumber${multiple ? 's' : ''}`, component),
                ...await renderGroupingIdNumber(argid, currentArg, multiple),
            }))());
            continue;
        }
        if (arg.startsWith('courseid')) {
            data.args.push((async() => ({
                id: argid,
                multiple,
                empty,
                label: await getString(`filtercodes:argument:courseid${multiple ? 's' : ''}`, component),
                ...await renderCourseId(argid, currentArg, multiple),
            }))());
            continue;
        }
        if (arg.startsWith('categoryid')) {
            data.args.push((async() => ({
                id: argid,
                multiple,
                empty,
                label: await getString(`filtercodes:argument:categoryid${multiple ? 's' : ''}`, component),
                ...await renderCategoryId(argid, currentArg, multiple),
            }))());
            continue;
        }

        data.args.push((async() => ({
            id: argid,
            multiple,
            empty,
            label: 'Unknown argument type',
            value: '<span>Unknown argument type</span>',
            js: '',
        }))());
    }
    // Await all async functions at once.
    const [args, [title, description]] = await Promise.all([
        Promise.all(data.args),
        getStrings([
            {key: `filtercodes:argumentmodal:title`, component, param: key},
            filtercode.getDescriptionStringRequest(),
        ]),
    ]);
    data.args = args;
    data.description = description;

    const modal = await ModalSaveCancel.create({
        title,
        body: Templates.render('tiny_filtercodes/argumentmodal', data),
        large: true,
        show: true,
    });
    modal.getRoot().on(ModalEvents.bodyRendered, () => {
        data.args.forEach((arg) => {
            if (arg.js) {
                Templates.runTemplateJS(arg.js);
            }
        });
    });

    return await (new Promise((resolve) => {
        modal.getRoot().on(ModalEvents.save, () => {
            const values = [];
            let empty = false;
            data.args.forEach((arg, i) => {
                const val = modal.getRoot().find(`#${arg.id}`).val();
                if (filtercode.args[i] instanceof QuotedTextArg) {
                    values.push(`"${val}"`);
                    return;
                }
                if (val === '') {
                    empty = true;
                    return;
                }
                if (empty) {
                    throw new Error('Cannot have non-empty arguments after an empty argument');
                }
                if (val instanceof Array && arg.multiple) {
                    values.push(...val);
                    return;
                }
                values.push(val);
            });
            resolve(values);
        });
        modal.getRoot().on(ModalEvents.cancel, () => {
            resolve(null);
        });
    }));
};
