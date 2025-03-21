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
 * Ajax methods for the Moodle tiny_filtercodes plugin.
 *
 * @module     tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
import Ajax from 'core/ajax';

/**
 * Get the groups by course id.
 *
 * @param {number} courseId The course id to fetch the groups from.
 * @return {Promise<{
 *     id: number,
 *     name: string,
 *     idnumber: string,
 * }[]>} Resolved with the course groups.
 */
export const getCourseGroupsData = function(courseId) {
    return Ajax.call([{
        methodname: 'tiny_filtercodes_get_groups',
        args: {
            courseid: courseId,
        },
    }])[0];
};

/**
 * Get the groupings by course id.
 *
 * @param {number} courseId The course id to fetch the groupings from.
 * @return {Promise<{
 *   id: number,
 *   name: string,
 *   idnumber: string,
 * }[]>} Resolved with the course groupings.
 */
export const getCourseGroupingsData = function(courseId) {
    return Ajax.call([{
        methodname: 'tiny_filtercodes_get_groupings',
        args: {
            courseid: courseId,
        },
    }])[0];
};

/**
 * Get the custom content from the database.
 * @return {Promise<{
 *   id: number,
 *   key: string,
 *   value: string,
 * }[]>} Resolved with the custom content.
 */
export const getCustomContentData = function() {
    return Ajax.call([{
        methodname: 'tiny_filtercodes_get_customcontent',
        args: {},
    }])[0];
};

/**
 * Get the custom content from the database.
 * @return {Promise<{
 *   id: number,
 *   key: string,
 *   value: string,
 * }[]>} Resolved with the custom content.
 */
export const getCourseCustomFields = function() {
    const courseId = M.cfg.courseId;
    if (!courseId) {
        return Promise.resolve([]);
    }

    return Ajax.call([{
        methodname: 'tiny_filtercodes_get_course_customfields',
        args: {
            courseid: courseId,
        },
    }])[0];
};


/**
 * Get courses.
 * @param {string} query The query to search for.
 * @param {number} page The page number.
 * @param {number} perpage The number of courses per page.
 * @return {Promise<{
 *     id: number,
 *     shortname: string,
 *     categoryid: number,
 *     categorysortorder?: number,
 *     fullname: string,
 *     displayname: string,
 *     idnumber?: string,
 *     summary: string,
 *     summaryformat: string,
 *     format: string,
 *     showgrades?: number,
 *     newsitems?: number,
 *     startdate: number,
 *     enddate: number,
 *     numsections?: number,
 *     maxbytes?: number,
 *     showreports?: number,
 *     visible?: number,
 *     hiddensections?: number,
 *     groupmode?: number,
 *     groupmodeforce?: number,
 *     defaultgroupingid?: number,
 *     timecreated?: number,
 *     timemodified?: number,
 *     enablecompletion?: number,
 *     completionnotify?: number,
 *     lang?: string,
 *     forcetheme?: string,
 *     courseformatoptions?: {
 *         name: string,
 *         value: string
 *     }[],
 *     showactivitydates: boolean,
 *     showcompletionconditions: boolean,
 *     customfields?: {
 *         name: string,
 *         shortname: string,
 *         type: string,
 *         valueraw: string,
 *         value: string
 *     }[],
 * }[]>} Resolved with the courses data.
 */
export const getCoursesData = function(query = "", page = 0, perpage = 10) {
    if (query) {
        return Ajax.call([{
            methodname: 'core_course_search_courses',
            args: {
                searchargs: {
                    criterianame: 'search',
                    criteriavalue: query,
                    page,
                    perpage,
                }
            },
        }])[0];
    }

    return Ajax.call([{
        methodname: 'core_course_get_courses',
        args: {},
    }])[0];
};

/**
 * Get the categories from the database.
 * @return {Promise<{
 *   id: number,
 *   name: string,
 *   idnumber?: string,
 *   description: string,
 *   descriptionformat: string,
 *   parent: number,
 *   sortorder: number,
 *   coursecount: number,
 *   visible?: number,
 *   visibleold?: number,
 *   timemodified?: number,
 *   depth: number,
 *   path: string,
 *   theme?: string,
 * }[]>} Resolved with the custom content.
 */
export const getCategoriesData = function() {
    return Ajax.call([{
        methodname: 'tiny_filtercodes_get_categories',
        args: {},
    }])[0];
};
