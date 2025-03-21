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
 * Custom Content external api.
 *
 * @package    tiny_filtercodes
 * @category   webservice
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace tiny_filtercodes\external;

use core_external\external_api;
use core_external\external_function_parameters;
use core_external\external_multiple_structure;
use core_external\external_single_structure;
use core_external\external_value;

defined('MOODLE_INTERNAL') || die;

class get_customcontent extends external_api {
    /**
     * Parameters for execute.
     *
     * @return external_function_parameters
     */
    public static function execute_parameters(): external_function_parameters {
        return new external_function_parameters([]);
    }

    /**
     * Process the request.
     *
     * @return array The custom content.
     */
    public static function execute(): array {
        $globaltagcount = get_config('filter_filtercodes', 'globaltagcount');
        $tags = [];
        for ($i = 1; $i <= $globaltagcount; $i++) {
            $tags[] = [
                'id' => $i,
                'key' => get_config('filter_filtercodes', 'globalname' . $i),
                'value' => get_config('filter_filtercodes', 'globalcontent' . $i),
            ];
        }

        return $tags;
    }

    /**
     * Return for execute.
     */
    public static function execute_returns(): external_multiple_structure {
        return new external_multiple_structure(
            new external_single_structure([
                'id' => new external_value(PARAM_INT, 'id'),
                'key' => new external_value(PARAM_TEXT, 'key'),
                'value' => new external_value(PARAM_RAW, 'value'),
            ])
        );
    }
}
