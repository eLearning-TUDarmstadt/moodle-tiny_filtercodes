<?php
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

namespace tiny_filtercodes;

use context;
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_menuitems;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;

/**
 * Plugin for Moodle 'Filtercodes plugin' drop down menu in TinyMCE 6.
 *
 * @package     tiny_filtercodes
 * @author      Leon Camus
 * @copyright   2025 onwards Leon Camus
 * @license     https://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements plugin_with_menuitems, plugin_with_buttons, plugin_with_configuration {
    /**
     * Check if user has sufficient rights to use the plugin.
     *
     * @param context $context
     * @param array $options
     * @param array $fpoptions
     * @param editor|null $editor
     * @return bool
     * @throws \coding_exception
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?\editor_tiny\editor $editor = null
    ): bool {
        // Users must have permission to embed content.
        return has_capability('tiny/filtercodes:viewfiltercodesmenu', $context);
    }

    /**
     * Get a list of the menu items provided by this plugin.
     *
     * @return string[]
     */
    public static function get_available_menuitems(): array {
        return [
            'tiny_filtercodes',
        ];
    }

    /**
     * Get a list of the buttons provided by this plugin.
     * @return string[]
     */
    public static function get_available_buttons(): array {
        return [
            'tiny_filtercodes',
        ];
    }

    /**
     * There is a config setting that can be set to true for testing purposes so that even though the
     * filtercodes filter is missing, the behat tests can be executed pretending that the filtercodes filter
     * is installed.
     * @return bool is simulated
     */
    public static function is_filtercodes_simulated_for_test(): bool {
        return \behat_util::is_test_site() && get_config('tiny_filtercodes', 'simulatefiltercodes');
    }

    /**
     * Returns the configuration values the plugin needs to take into consideration
     *
     * @param context $context
     * @param array $options
     * @param array $fpoptions
     * @param editor|null $editor
     * @return array
     * @throws \dml_exception
     */
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        // Check, if the filtercodes filter is active.
        $filters = filter_get_active_in_context($context);
        $mfiltercodesfilter = array_key_exists('filtercodes', $filters);

        return [
            'mfiltercodesfilter' => $mfiltercodesfilter || self::is_filtercodes_simulated_for_test(),
            'css' => self::get_default_css(), // TODO get from settings.
        ];
    }

    /**
     * Return the default css for highlighting tags.
     * @return string
     */
    public static function get_default_css(): string {
        return '
            .filtercodes-tag {
                outline: 1px dotted;
                padding: 0.1em;
                margin: 0em 0.1em;
                background-color: #ffffaa;
            }
            .filtercodes-level-0 {
                background-color: hsl(40, 100%, 70%);
            }
            .filtercodes-level-1 {
                background-color: hsl(65, 100%, 70%);
            }
            .filtercodes-level-2 {
                background-color: hsl(90, 100%, 70%);
            }
            .filtercodes-level-3 {
                background-color: hsl(115, 100%, 70%);
            }
            .filtercodes-level-4 {
                background-color: hsl(140, 100%, 70%);
            }
            .filtercodes-level-5 {
                background-color: hsl(165, 100%, 70%);
            }
            .filtercodes-level-6 {
                background-color: hsl(190, 100%, 70%);
            }
            .filtercodes-level-7 {
                background-color: hsl(215, 100%, 70%);
            }
            .filtercodes-level-8 {
                background-color: hsl(240, 100%, 70%);
            }
            .filtercodes-level-9 {
                background-color: hsl(165, 100%, 70%);
            }
            .filtercodes-error {
                background-color: #ffaaaa !important;
            }
        ';
    }
}
