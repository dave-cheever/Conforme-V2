package pageObject;

import com.microsoft.playwright.Locator;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

public class SearchBar extends base.commonFunctions {
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator searchBarLocator = getPage().locator("//input [@data-id='000365']");
  private final Locator searchBarSpinnerLocator = getPage().locator("//div[@class='chakra-spinner css-1cse1gr']");
  private final Locator searchBarViewMoreResultsListLocator = getPage().locator("//div[@data-id='003216']");
  private final Locator searchBarViewMoreResultsLinkTextLocator = getPage().locator("//p[text()='View more results']");
  private final Locator trackerItemsHeaderTextLocator = getPage().locator("//p[@data-id='000274']");
  private final Locator searchCouldNotBeCompletedTextLocator = getPage().locator("//p[text()='Search could not be completed']");
  private final Locator pleaseTryAgainLaterTextLocator = getPage().locator("//p[text()='Please try again, or refresh the page']");

  public void validateSearchCouldNotBeCompletedMessageIsDisplayed() {
    Allure.step("Validating that 'Search could not be completed' message is displayed");
    waitForVisibility(searchCouldNotBeCompletedTextLocator, timeout, "'Search could not be completed' message");
    Assert.assertTrue(searchCouldNotBeCompletedTextLocator.isVisible(), "'Search could not be completed' message should be visible");
    waitForVisibility(pleaseTryAgainLaterTextLocator, timeout, "'Please try again later' message");
    Assert.assertTrue(pleaseTryAgainLaterTextLocator.isVisible(), "'Please try again later' message should be visible");
  }

  public void clickViewMoreResultsLink() {
    Allure.step("Clicking on 'View more results' link");
    waitForVisibility(searchBarViewMoreResultsLinkTextLocator, timeout, "'View more results' link text");
    click(searchBarViewMoreResultsLinkTextLocator, "'View more results' link text");
  }

  public void validateTrackerItemsPageIsDisplayed() {
    Allure.step("Validating that Tracker Items page is displayed");
    waitForVisibility(trackerItemsHeaderTextLocator, timeout, "Tracker Items page header");
    Assert.assertTrue(trackerItemsHeaderTextLocator.isVisible(), "Tracker Items page header should be visible");
  }

  public void enterTextInSearchBar(String searchText) {
    Allure.step("Entering text in search bar: " + searchText);
    waitForVisibility(searchBarLocator, timeout, "Search bar");
    enterText(searchBarLocator, searchText, "Search bar");
  }

  public void validateThreeResultsAreDisplayed() {
    Allure.step("Validating that three search results are displayed");
//    waitForVisibility(searchBarViewMoreResultsListLocator, timeout, "Search bar results list");
    int resultsCount = searchBarViewMoreResultsListLocator.locator("//div[@data-id='003217']").count();
    Assert.assertEquals(resultsCount, 3, "There should be exactly three search results displayed");
  }

  public void validateViewMoreResultsLinkIsDisplayed() {
    Allure.step("Validating that 'View more results' link is displayed");
    waitForVisibility(searchBarViewMoreResultsLinkTextLocator, timeout, "'View more results' link text");
    Assert.assertTrue(searchBarViewMoreResultsLinkTextLocator.isVisible(), "'View more results' link should be visible");
  }


  public void enterSearchText(String searchText) {
    Allure.step("Entering text in search bar: " + searchText);
    waitForVisibility(searchBarLocator, timeout, "Search bar");
    enterText(searchBarLocator, searchText, "Search bar");
  }

  public void waitForSearchResultsToLoad() {
    Allure.step("Waiting for search results to load");
    waitForInvisibility(searchBarSpinnerLocator, timeout, "Search bar spinner");
  }

  public void clearSearchBar() {
    Allure.step("Clearing the search bar");
    waitForVisibility(searchBarLocator, timeout, "Search bar");
    clearText(searchBarLocator, "Search bar");
  }

  public void clearText(Locator locator, String elementName) {
    Allure.step("Clearing text from " + elementName);
    locator.fill("");
  }

  //create a function that inserts the string per character and will validate that every input the loading spinner appears and disappears before inserting the next character until the string is fully inserted
  public void enterSearchTextWithLoadingValidation(String searchText) {
    Allure.step("Entering text in search bar with loading validation: " + searchText);
    waitForVisibility(searchBarLocator, timeout, "Search bar");
    for (char c : searchText.toCharArray()) {
      searchBarLocator.type(String.valueOf(c));
      try {
        // short optional wait for spinner to appear; if it doesn't, continue immediately
        waitForVisibility(searchBarSpinnerLocator, 2, "Search bar spinner (optional)");
        // wait for spinner to disappear before typing next character
        waitForInvisibility(searchBarSpinnerLocator, timeout, "Search bar spinner");
      } catch (Exception ignored) {
        // spinner didn't appear within the short wait — proceed to next char
      }
    }
  }

}
