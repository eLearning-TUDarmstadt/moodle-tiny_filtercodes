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

namespace MoodleHQ\editor\tiny\plugins\filtercodes\classes\external;

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
class get_categories extends external_api {
    /**
     * Parameters for execute.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        global $CFG;
        require_once($CFG->dirroot . "/course/externallib.php");
        return \core_course_external::get_categories_parameters();
    }

    /**
     * Process the request.
     *
     * @param array   $criteria Criteria to match the results
     * @param boolean $addsubcategories obtain only the category (false) or its subcategories (true - default)
     * @return array list of categories
     */
    public static function execute($criteria = [], $addsubcategories = true): array {
        global $CFG;
        require_once($CFG->dirroot . "/course/externallib.php");
        return \core_course_external::get_categories($criteria, $addsubcategories);
    }

    /**
     * Return for execute.
     */
    public static function execute_returns(): external_multiple_structure {
        global $CFG;
        require_once($CFG->dirroot . "/course/externallib.php");
        return \core_course_external::get_categories_returns();
    }
}
