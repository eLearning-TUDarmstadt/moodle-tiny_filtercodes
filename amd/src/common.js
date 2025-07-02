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

import customcontent from "./staticajax!getCustomContentData";
import coursecustomfields from "./staticajax!getCourseCustomFields";

/**
 * Common values helper for the Moodle tiny_filtercodes plugin.
 *
 * @module     tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

export const pluginName = 'tiny_filtercodes/plugin';
export const component = 'tiny_filtercodes';
export const classNonEditable = 'mceNonEditable';
export const classFiltercode = 'filtercodes-tag';
export const classFiltercodeBegin = 'filtercodes-begin';
export const classFiltercodeEnd = 'filtercodes-end';
export const classFiltercodeError = 'filtercodes-error';
export const classFiltercodeLevel = (i) => 'filtercodes-level-' + (i % 10);
export const classFiltercodeLevels = Array.from({length: 10}, (_, i) => classFiltercodeLevel(i));
export const regexTagStartEnd = /\{(\/)?\s*([a-zA-Z0-9]+)((?:\s+[^}\s]+)+)?\s*}/g;

/**
 * @typedef {'groupidnumber'
 * | 'groupidnumber*'
 * | 'groupidnumber+'
 * | 'groupidnumber?'
 * | 'groupingidnumber'
 * | 'groupingidnumber*'
 * | 'groupingidnumber+'
 * | 'groupingidnumber?'
 * | 'courseid'
 * | 'courseid*'
 * | 'courseid+'
 * | 'courseid?'
 * | 'categoryid'
 * | 'categoryid*'
 * | 'categoryid+'
 * | 'categoryid?'
 * | SelectArg
 * | TextArg
 * } FiltercodeArgType
 */


export class SelectArg {
    /**
     * @param {string} id
     * @param {({langkey: string, value: string}|string)[]} values
     * @param {boolean} allowCustom
     * @param {boolean} multiple
     * @param {boolean} empty
     */
    constructor(id, values, allowCustom = false, multiple = false, empty = false) {
        this.id = id;
        this.values = values;
        this.allowCustom = allowCustom;
        this.multiple = multiple;
        this.empty = empty;
    }
}

export class TextArg {
    /**
     * @param {string} id
     * @param {boolean} empty
     * @param {string} placeholder
     */
    constructor(id, empty = false, placeholder = '') {
        this.id = id;
        this.empty = empty;
        this.placeholder = placeholder;
    }
}

export class QuotedTextArg {
    /**
     * @param {string} id
     * @param {string} placeholder
     */
    constructor(id, placeholder = '') {
        this.id = id;
        this.placeholder = placeholder;
    }
}

export class Filtercode {
    /**
     * @param {string} id
     * @param {FiltercodeArgType[]} args
     * @param {boolean} around
     * @param {StringRequest|null} stringRequest
     * @param {StringRequest|null} descriptionStringRequest
     */
    constructor(id, args, around, stringRequest = null, descriptionStringRequest = null) {
        this.id = id;
        this.args = args;
        this.around = around;
        this.stringRequest = stringRequest;
        this.descriptionStringRequest = descriptionStringRequest;
    }

    /**
     * @param  {string[]} args
     * @param  {string?} color
     * @returns {HTMLSpanElement}
     */
    beginSpan(args, color) {
        const node = document.createElement('span');
        node.classList.add(classFiltercode);
        node.classList.add(classNonEditable);
        if (color) {
            node.style.backgroundColor = color;
        }
        node.setAttribute('contenteditable', 'false');
        node.dataset.filtercodekey = this.id;
        if (args.length > 0) {
            node.dataset.filtercodeargs = args.join(' ');
        }
        if (this.around) {
            node.classList.add(classFiltercodeBegin);
        }
        node.appendChild(document.createTextNode(`{${[this.id, ...args].join(' ')}}`));

        return node;
    }

    /**
     * @param  {string?} color
     * @returns {HTMLSpanElement|null}
     */
    endSpan(color) {
        const node = document.createElement('span');
        node.classList.add(classFiltercode);
        node.classList.add(classNonEditable);
        if (color) {
            node.style.backgroundColor = color;
        }
        node.setAttribute('contenteditable', 'false');
        node.dataset.filtercodekey = this.id;
        if (this.around) {
            node.classList.add(classFiltercodeEnd);
        }
        node.appendChild(document.createTextNode(`{/${this.id}}`));

        return node;
    }

    /**
     * @return {StringRequest} a string request for the filtercode name
     */
    getStringRequest() {
        if (this.stringRequest) {
            return this.stringRequest;
        }

        return {
            key: `filtercodes:code:${this.id}`,
            component,
        };
    }

    /**
     * @return {StringRequest} a string request for the filtercode description
     */
    getDescriptionStringRequest() {
        if (this.descriptionStringRequest) {
            return this.descriptionStringRequest;
        }

        return {
            key: `filtercodes:description:${this.id}`,
            component,
        };
    }

    /**
     * @return {string} the unique key for this filtercode.
     */
    getKey() {
        return `code:${this.id}`;
    }
}

export class Group {
    /**
     * @param {string} id
     * @param {Filtercode[]} codes
     */
    constructor(id, codes) {
        this.id = id;
        this.codes = codes;
    }

    /**
     * @return {StringRequest} a string request for the group name
     */
    getStringRequest() {
        return {
            key: `filtercodes:group:${this.id}`,
            component,
        };
    }

    /**
     * @return {string} the unique key for this group.
     */
    getKey() {
        return `group:${this.id}`;
    }
}

const selectImagesize = new SelectArg('imagesize', ['sm', 'md', 'lg'], false, false, false);
const selectDatetimeformat = new SelectArg('datetimeformat', [
    'backupnameformat',
    'strftimedate',
    'strftimedatemonthabbr',
    'strftimedatefullshort',
    'strftimedateshort',
    'strftimedateshortmonthabbr',
    'strftimedatetime',
    'strftimedaydate',
    'strftimedaydatetime',
    'strftimedayshort',
    'strftimedaytime',
    'strftimemonthyear',
    'strftimerecent',
    'strftimerecentfull',
    'strftimetime',
    'strftimetime12',
    'strftimetime24',
], false, false, true);
const raw = new TextArg('raw', true);

/**
 * @type {(Group | Filtercode)[]}
 */
export const filtercodes = [
    new Group('profile', [
        new Filtercode('firstname', [], false),
        new Filtercode('surname', [], false),
        new Filtercode('lastname', [], false),
        new Filtercode('alternatename', [], false),
        new Filtercode('city', [], false),
        new Filtercode('country', [], false),
        new Filtercode('timezone', [], false),
        new Filtercode('preferredlanguage', [], false),
        new Filtercode('email', [], false),
        new Filtercode('userid', [], false),
        new Filtercode('idnumber', [], false),
        new Filtercode('username', [], false),
        new Filtercode('userdescription', [], false),
        new Filtercode('webpage', [], false),
        new Filtercode('institution', [], false),
        new Filtercode('department', [], false),
        new Filtercode('userpictureurl', [selectImagesize], false),
        new Filtercode('userpictureimg', [selectImagesize], false),
        new Filtercode('profile_field_shortname', [], false),
        new Filtercode('profilefullname', [], false),
        new Filtercode('firstaccessdate', [selectDatetimeformat], false),
        new Filtercode('lastlogin', [selectDatetimeformat], false),
    ]),
    new Group('systeminformation', [
        new Filtercode('filtercodes', [], false),
        new Filtercode('usercount', [], false),
        new Filtercode('usersactive', [], false),
        new Filtercode('usersonline', [], false),
        new Filtercode('userscountrycount', [], false),
        new Filtercode('siteyear', [], false),
        new Filtercode('sitename', [], false),
        new Filtercode('sitesummary', [], false),
        new Filtercode('sitelogourl', [], false),
        new Filtercode('now', [selectDatetimeformat], false),
        new Filtercode('coursecount', [], false),
        new Filtercode('diskfreespace', [], false),
        new Filtercode('diskfreespacedata', [], false),
        new Filtercode('wwwroot', [], false),
        new Filtercode('supportname', [], false),
        new Filtercode('supportemail', [], false),
        new Filtercode('supportpage', [], false),
        new Filtercode('supportservicespage', [], false),
    ]),
    new Group('uielements', [
        new Filtercode('teamcards', [], false),
        new Filtercode('coursecards', ['categoryid?'], false),
        new Filtercode('coursecard', ['courseid+'], false),
        new Filtercode('coursecardsbyenrol', [], false),
        new Filtercode('courseprogress', [], false),
        new Filtercode('courseprogresspercent', [], false),
        new Filtercode('courseprogressbar', [], false),
        new Filtercode('categorycards', ['categoryid?'], false),
        new Filtercode('mycourses', [], false),
        new Filtercode('myccourses', [], false),
        new Filtercode('mycoursescards', ['categoryid+'], false),
        new Filtercode('courserequest', [], false),
        new Filtercode('label', [
            new SelectArg('labeltype', ['info', 'important', 'secondary', 'success', 'warning'], true),
        ], true),
        new Filtercode('button', [new TextArg('url')], true),
        new Filtercode('chart', [
            new SelectArg('charttype', ['radial', 'pie', 'progressbar', 'progresspie']),
            raw,
        ], false),
        new Filtercode('showmore', [], true),
        new Filtercode('qrcode', [], true),
        new Filtercode('dashboard_siteinfo', [], false),
        new Filtercode('keyboard', [], true),
    ]),
    new Group('course', [].concat([
        new Filtercode('coursename', ['courseid?'], false),
        new Filtercode('courseshortname', [], false),
        new Filtercode('coursestartdate', [selectDatetimeformat, 'courseid?'], false),
        new Filtercode('courseenddate', [selectDatetimeformat], false),
        new Filtercode('courseenrolmentdate', [selectDatetimeformat], false),
        new Filtercode('coursecompletiondate', [selectDatetimeformat], false),
        new Filtercode('coursegradepercent', [], false),
        new Filtercode('coursegrade', [], false),
        new Filtercode('courseprogress', [], false),
        new Filtercode('courseprogressbar', [], false),
        new Filtercode('course_fields', [], false),
        ],
        coursecustomfields.map(field => new Filtercode(
            `course_field_${field}`,
            [],
            false,
            {
                key: 'filtercodes:code:course_field',
                component,
                param: `course_field_${field}`,
            },
            {
                key: 'filtercodes:description:course_field',
                component,
                param: `course_field_${field}`,
            },
        )),
        [
            new Filtercode('coursesummary', ['courseid?'], false),
            new Filtercode('courseimage', [], false),
            new Filtercode('courseimage-url', [], false),
            new Filtercode('courseparticipantcount', [], false),
            new Filtercode('coursecount', [new TextArg('coursecountrole')], false), // TODO IMPLEMENT COURSECOUNTROLE
            new Filtercode('courseid', [], false),
            new Filtercode('coursecontextid', [], false),
            new Filtercode('coursemoduleid', [], false),
            new Filtercode('courseidnumber', [], false),
            new Filtercode('sectionid', [], false),
            new Filtercode('sectionname', [], false),
            new Filtercode('coursecontacts', [], false),
            new Filtercode('mygroups', [], false),
            new Filtercode('mygroupings', [], false),
        ],
    )),
    new Group('categories', [
        new Filtercode('categoryid', [], false),
        new Filtercode('categoryname', [], false),
        new Filtercode('categorynumber', [], false),
        new Filtercode('categorydescription', [], false),
        new Filtercode('categories', [], false),
        new Filtercode('categories0', [], false),
        new Filtercode('categoriesx', [], false),
    ]),
    new Group('custommenu', [
        new Filtercode('categoriesmenu', [], false),
        new Filtercode('categories0menu', [], false),
        new Filtercode('categoriesxmenu', [], false),
        new Filtercode('toggleeditingmenu', [], false),
        new Filtercode('mycoursesmenu', [], false),
        new Filtercode('courserequestmenu0', [], false),
        new Filtercode('courserequestmenu', [], false),
        new Filtercode('menuadmin', [], false),
        new Filtercode('menudev', [], false),
        new Filtercode('menuthemes', [], false),
        new Filtercode('menucoursemore', [], false),
        new Filtercode('menuwishlist', [], false),
    ]),
    new Group('url', [
        new Filtercode('pagepath', [], false),
        new Filtercode('thisurl', [], false),
        new Filtercode('thisurl_enc', [], false),
        new Filtercode('urlencode', [], true),
        new Filtercode('rawurlencode', [], true),
        new Filtercode('referer', [], false),
        new Filtercode('protocol', [], false),
        new Filtercode('referrer', [], false),
        new Filtercode('ipaddress', [], false),
        new Filtercode('sesskey', [], false),
        new Filtercode('wwwcontactform', [], false),
    ]),
    new Group('content', [
        new Filtercode('note', [], true),
        new Filtercode('help', [], true),
        new Filtercode('info', [], true),
        new Filtercode('alert',
            [new SelectArg('alerttype', [
                'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'border',
            ], false)],
            true
        ),
        new Filtercode('highlight', [], true),
        new Filtercode('marktext', [], true),
        new Filtercode('markborder', [], true),
        new Filtercode('getstring', [new TextArg('component_name', true)], true), // TODO Fetch available components
        new Filtercode('fa', [new TextArg('faicon')], false),
        new Filtercode('fas', [new TextArg('faicon')], false),
        new Filtercode('fab', [new TextArg('faicon')], false),
        new Filtercode('fa-solid', [new TextArg('faicon')], false),
        new Filtercode('fa-brands', [new TextArg('faicon')], false),
        new Filtercode('glyphicon', [new TextArg('glyphicon')], false),
    ]),
    new Group('customcontent', customcontent.map(content => new Filtercode(
        `global_${content.key}`,
        [],
        false,
        {
            key: 'filtercodes:code:global',
            component,
            param: `global_${content.key}`,
        },
        {
            key: 'filtercodes:description:global',
            component,
            param: `global_${content.key}`,
        },
    ))),
    new Group('conditionallogin', [
        new Filtercode('ifloggedin', [], true),
        new Filtercode('ifloggedout', [], true),
        new Filtercode('ifloggedinas', [], true),
        new Filtercode('ifnotloggedinas', [], true),
    ]),
    new Group('conditionalcourse', [
        new Filtercode('ifenrolpage', [], true),
        new Filtercode('ifnotenrolpage', [], true),
        new Filtercode('ifenrolled', [], true),
        new Filtercode('ifnotenrolled', [], true),
        new Filtercode('ifincourse', [], true),
        new Filtercode('ifnotincourse', [], true),
        new Filtercode('ifinsection', [], true),
        new Filtercode('ifnotinsection', [], true),
        new Filtercode('ifingroup', ['groupidnumber'], true),
        new Filtercode('ifnotingroup', ['groupidnumber'], true),
        new Filtercode('ifingrouping', ['groupingidnumber'], true),
        new Filtercode('ifnotingrouping', ['groupingidnumber'], true),
        new Filtercode('ifvisible', [], true),
        new Filtercode('ifnotvisible', [], true),
        new Filtercode('ifinactivity', [], true),
        new Filtercode('ifnotinactivity', [], true),
        new Filtercode('ifactivitycompleted', [new TextArg('activityid')], true), // TODO IMPLEMENT ACTIVITYID
        new Filtercode('ifnotactivitycompleted', [new TextArg('activityid')], true), // TODO IMPLEMENT ACTIVITYID
    ]),
    new Group('conditionalrole', [
        new Filtercode('ifguest', [], true),
        new Filtercode('ifstudent', [], true),
        new Filtercode('ifminstudent', [], true),
        new Filtercode('ifassistant', [], true),
        new Filtercode('ifminassistant', [], true),
        new Filtercode('ifteacher', [], true),
        new Filtercode('ifminteacher', [], true),
        new Filtercode('ifcreator', [], true),
        new Filtercode('ifmincreator', [], true),
        new Filtercode('ifmanager', [], true),
        new Filtercode('ifminmanager', [], true),
        new Filtercode('ifminsitemanager', [], true),
        new Filtercode('ifadmin', [], true),
        new Filtercode('ifcustomrole', [new TextArg('roleshortname')], true), // TODO IMPLEMENT ROLESHORTNAME
        new Filtercode('ifnotcustomrole', [new TextArg('roleshortname')], true), // TODO IMPLEMENT ROLESHORTNAME
        new Filtercode('ifincohort', [new TextArg('cohortidnumber')], true), // TODO IMPLEMENT COHORTIDNUMBER
        new Filtercode('ifnotincohort', [new TextArg('cohortidnumber')], true), // TODO IMPLEMENT COHORTIDNUMBER
        new Filtercode('ifhasarolename', [new TextArg('roleshortname')], true), // TODO IMPLEMENT ROLESHORTNAME
    ]),
    new Group('miscellaneous', [
        new Filtercode('ifdev', [], true),
        new Filtercode('ifhome', [], true),
        new Filtercode('ifnothome', [], true),
        new Filtercode('ifdashboard', [], true),
        new Filtercode('ifcourserequests', [], true),
        new Filtercode('ifeditmode', [], true),
        // TODO Fetch available themes
        new Filtercode('iftheme', [new TextArg('themename')], true),
        new Filtercode('ifnottheme', [new TextArg('themename')], true),
        new Filtercode('ifprofile_field_shortname', [], true),
        new Filtercode('ifprofile', [
            new SelectArg('profilefieldname', [
                'firstname', 'lastname', 'alternatename', 'city', 'country', 'timezone', 'preferredlanguage', 'email',
                'userid', 'idnumber', 'username', 'userdescription', 'webpage', 'institution', 'department',
                'profile_field_shortname', 'profilefullname', 'firstaccessdate', 'lastlogin',
            ]),
            new SelectArg('operator', ['is', 'not', 'contains']),
            new QuotedTextArg('value'),
        ], true),
    ]),
    new Group('conditionalmobile', [
        new Filtercode('ifmobile', [], true),
        new Filtercode('ifnotmobile', [], true),
    ]),
    new Group('conditionalworkplace', [
        new Filtercode('iftenant', [new TextArg('tenantidnumber')], true), // TODO IMPLEMENT TENANTIDNUMBER
        new Filtercode('ifworkplace', [], true),
    ]),
    new Group('lang', [
        new Filtercode('-', [], false),
        new Filtercode('nbsp', [], false),
        new Filtercode('hr', [], false),
        new Filtercode('multilang', [new TextArg('langcode')], true),
        new Filtercode('langx', [new TextArg('langcode')], true),
    ]),
];

/**
 * @type {{[key: string]: Filtercode}}
 */
export const filtercodeMap = (() => {
    const map = {};
    for (const grouporcode of filtercodes) {
        if (grouporcode instanceof Group) {
            for (const code of grouporcode.codes) {
                map[code.id] = code;
            }
        } else {
            map[grouporcode.id] = grouporcode;
        }
    }
    return map;
})();

/**
 * @type {{[key: string]: StringRequest}}
 */
export const filtercodeNameMap = (() => {
    const map = {};
    for (const grouporcode of filtercodes) {
        if (grouporcode instanceof Group) {
            map[grouporcode.getKey()] = grouporcode.getStringRequest();
            for (const code of grouporcode.codes) {
                map[code.getKey()] = code.getStringRequest();
            }
        } else {
            map[grouporcode.getKey()] = grouporcode.getStringRequest();
        }
    }

    return map;
})();

export const trim = v => v.toString().replace(/^\s+/, '').replace(/\s+$/, '');
export const isNull = a => a === null || a === undefined;
