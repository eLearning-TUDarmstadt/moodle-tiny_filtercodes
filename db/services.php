<?php
// This file is part of Moodle - http://moodle.org/
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
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * External functions and service definitions.
 *
 * The functions and services defined on this file are
 * processed and registered into the Moodle DB after any
 * install or upgrade operation. All plugins support this.
 *
 * @package    tiny_filtercodes
 * @category   webservice
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$functions = [
    'tiny_filtercodes_get_groups' => [
        'classname' => 'tiny_filtercodes\external\get_groups',
        'description' => 'Get all groups of a course',
        'type' => 'read',
        'ajax' => true,
        'loginrequired' => true,
        'readonlysession' => true,
        'capabilities' => 'moodle/course:managegroups',
    ],
    'tiny_filtercodes_get_groupings' => [
        'classname' => 'tiny_filtercodes\external\get_groupings',
        'description' => 'Get all groupings of a course',
        'type' => 'read',
        'ajax' => true,
        'loginrequired' => true,
        'readonlysession' => true,
        'capabilities' => 'moodle/course:managegroups',
    ],
    'tiny_filtercodes_get_categories' => [
        'classname' => 'tiny_filtercodes\external\get_categories',
        'description' => 'Return category details',
        'type' => 'read',
        'ajax' => true,
        'loginrequired' => true,
        'readonlysession' => true,
        'capabilities' => 'moodle/category:viewhiddencategories',
    ],
    'tiny_filtercodes_get_customcontent' => [
        'classname' => 'tiny_filtercodes\external\get_customcontent',
        'description' => 'Get all custom content',
        'type' => 'read',
        'ajax' => true,
        'loginrequired' => true,
        'readonlysession' => true,
        'capabilities' => 'tiny/filtercodes:get_customcontent',
    ],
    'tiny_filtercodes_get_course_customfields' => [
        'classname' => 'tiny_filtercodes\external\get_course_customfields',
        'description' => 'Get all custom fields of a course',
        'type' => 'read',
        'ajax' => true,
        'loginrequired' => true,
        'readonlysession' => true,
        'capabilities' => 'moodle/course:manageactivities',
    ],
];
