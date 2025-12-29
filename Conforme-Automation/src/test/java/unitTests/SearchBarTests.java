package unitTests;

import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.Login;
import pageObject.ModuleSwitcher;
import pageObject.Navigation;
import pageObject.SearchBar;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

public class SearchBarTests extends testListener {
  testListener testListen;
  Login loginPage;
  SearchBar searchBar;
  ModuleSwitcher moduleSwitcher;
  Navigation navigation;
  base.commonFunctions cf;

  public SearchBarTests() {
    super();
  }

  @BeforeMethod(alwaysRun = true)
  public void setUpTest() {
    moduleSwitcher = new ModuleSwitcher();
    testListen = new testListener();
    navigation = new Navigation();
     cf = new base.commonFunctions();
    loginPage = new Login();
    searchBar = new SearchBar();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that as the user types characters into the search bar (without pressing Enter), the search results automatically and continuously refresh to reflect the most recent input.")
  @Owner("Dave Cheever")
  @Tag("Search Bar")
  @Story("Unified Search Results Display")
  public void shouldContinuouslyRefreshSearchResultsAsUserTypes() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    searchBar.enterSearchTextWithLoadingValidation("DMC item");
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when a search category (e.g. Locations, Audits, Actions, Complaints) contains more than three matching results, only the top three are displayed initially and a “View more results” link is shown for that category.")
  @Owner("Dave Cheever")
  @Tag("Search Bar")
  @Story("Unified Search Results Display")
  public void shouldLimitCategoryResultsToTopThreeWithViewMoreLink() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    searchBar.enterTextInSearchBar("fire");
    navigation.waitForSpinnerToDisappear();
    searchBar.validateViewMoreResultsLinkIsDisplayed();
    searchBar.validateThreeResultsAreDisplayed();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when the user clicks the “View more results” link for a category, the system navigates to the full results page for that specific category with the current search term applied.")
  @Owner("Dave Cheever")
  @Tag("Search Bar")
  @Story("Unified Search Results Display")
  public void shouldNavigateToCategoryResultsPageWhenViewMoreResultsClicked() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    searchBar.enterTextInSearchBar("fire");
    navigation.waitForSpinnerToDisappear();
    searchBar.validateViewMoreResultsLinkIsDisplayed();
    searchBar.validateThreeResultsAreDisplayed();
    searchBar.clickViewMoreResultsLink();
    searchBar.validateTrackerItemsPageIsDisplayed();
  }


  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that if the search cannot load due to a technical issue, the system displays an error message (e.g. “Search could not be completed. Please try again.”) instead of results.")
  @Owner("Dave Cheever")
  @Tag("Search Bar")
  @Story("Unified Search Results Display")
  public void shouldDisplayTechnicalErrorMessageWhenSearchCannotLoad() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    base.commonFunctions.setPlaywrightOffline(true);
    searchBar.enterTextInSearchBar("fire");
    searchBar.validateSearchCouldNotBeCompletedMessageIsDisplayed();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when a technical issue persists, the error message continues to be displayed on subsequent search attempts until the underlying issue is resolved.")
  @Owner("Dave Cheever")
  @Tag("Search Bar")
  @Story("Unified Search Results Display")
  public void shouldPersistErrorMessageUntilIssueIsResolved() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    base.commonFunctions.setPlaywrightOffline(true);
    searchBar.enterTextInSearchBar("fire");
    searchBar.validateSearchCouldNotBeCompletedMessageIsDisplayed();
    searchBar.clearSearchBar();
    searchBar.enterTextInSearchBar("fire");
    searchBar.validateSearchCouldNotBeCompletedMessageIsDisplayed();
  }

}
