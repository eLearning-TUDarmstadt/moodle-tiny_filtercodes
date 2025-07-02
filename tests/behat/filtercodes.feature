@editor @editor_tiny @tiny @tiny_filtercodes @javascript
Feature: Tiny editor plugin with filtercodes
  To put dynamic content into text, I use the filtercodes button to encapsulate the text in filtercodes tags.

  Background: I login as admin and add a text to the description with two paragraphs.
    Given the following config values are set as admin:
      | simulatefiltercodes | 1 | tiny_filtercodes |
    And I change viewport size to "1920x4000"
    And I log in as "admin"
    And I open my profile in edit mode
    And I wait until the page is ready
    And I set the field "Description" to "<p>Some plain text</p><p>Ein anderer Text</p>"
    And I press "Update profile"
    Then I should see "Some plain text"
    And I should see "Ein anderer Text"

  Scenario: I login as admin and add a firstname tag at the beginning of the description.
    Given I log in as "admin"
    And I open my profile in edit mode
    And I wait until the page is ready
    And I click on the "Format > Filtercodes > Profile > First Name (firstname)" submenu item for the "Description" TinyMCE editor
    And I press "Update profile"
    Then I should see "{firstname}Some plain text"
    And I should see "Ein anderer Text"
    And I should not see "Ein anderer Text{firstname}"
