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
 * Loader for static ajax calls.
 *
 * @module     tiny_filtercodes
 * @author     Leon Camus
 * @copyright  2025 onwards Leon Camus
 * @license    https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define({
    load: function(name, req, onload, config) {
        req(['./ajax'], function(ajax) {
            if (config.isBuild) {
                onload();
                return;
            }
            const promise = ajax[name]();
            promise.then(function(result) {
                onload(result);
                return result;
            }).catch(function() {
                onload([]);
            });
        });
    }
});