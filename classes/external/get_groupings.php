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
 * Grouping external api.
 *
 * @package    tiny_filtercodes
 * @category   webservice
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_filtercodes\external;

use context_course;
use core\exception\moodle_exception;
use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;
use core_external\external_warnings;
use core_external\util;
use Exception;

/**
 * Grouping external api.
 *
 * @package    tiny_filtercodes
 * @category   webservice
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class get_groupings extends external_api {
    /**
     * Parameters for execute.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([
            'courseid' => new external_value(PARAM_INT, 'Course ID', VALUE_REQUIRED),
        ]);
    }

    /**
     * Process the request.
     *
     * @param int $courseid The course ID.
     * @return array The groupings.
     */
    public static function execute(
        int $courseid,
    ): array {
        [
            'courseid' => $courseid,
        ] = self::validate_parameters(
            self::execute_parameters(),
            [
                'courseid' => $courseid,
            ]
        );

        $context = context_course::instance($courseid, IGNORE_MISSING);
        try {
            self::validate_context($context);
        } catch (Exception $e) {
            throw new moodle_exception('errorcoursecontextnotvalid' , 'webservice', '', (object) [
                'message' => $e->getMessage(),
                'courseid' => $courseid,
            ]);
        }
        require_capability('moodle/course:managegroups', $context);

        $gs = groups_get_all_groupings($courseid);

        return array_map(function ($grouping) use ($context) {
            return [
                'id' => $grouping->id,
                'name' => util::format_string($grouping->name, $context),
                'idnumber' => $grouping->idnumber,
            ];
        }, $gs);
    }

    /**
     * Return for execute.
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(
            new external_single_structure([
                'id' => new external_value(PARAM_INT, 'group record id'),
                'name' => new external_value(PARAM_TEXT, 'group name'),
                'idnumber' => new external_value(PARAM_RAW, 'id number'),
            ])
        );
    }
}
