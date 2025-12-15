package unitTests;

import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.Login;
import pageObject.Navigation;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

public class NavigationTests extends testListener {

  testListener testListen;
  Login loginPage;
  Navigation navigation;

  public NavigationTests() {
    super();
  }

  @BeforeMethod(alwaysRun = true)
  public void setUpTest() {
    testListen = new testListener();
    commonFunctions cf = new commonFunctions();
    loginPage = new Login();
    navigation = new Navigation();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Click the 'All' tracker filter — verify the 'All' filter is highlighted.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAllTracker() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.clickTrackerItemButtonAll();
    navigation.validateTrackerItemAllSelected();
    navigation.validateTrackerItemsPageLoaded();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Click the 'Non-compliant' tracker filter — verify the 'Non-compliant' filter is highlighted.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectNonCompliantTracker() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.clickTrackerItemButtonNonCompliant();
    navigation.validateTrackerItemNonCompliantSelected();
    navigation.validateTrackerItemsPageLoaded();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Click the 'Compliant' tracker filter — verify the 'Compliant' filter is highlighted.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectCompliantTracker() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.clickTrackerItemButtonCompliant();
    navigation.validateTrackerItemCompliantSelected();
    navigation.validateTrackerItemsPageLoaded();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Click the 'Coming up' tracker filter — verify the 'Coming up' filter is highlighted.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectComingUpTracker() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.clickTrackerItemButtonComingUp();
    navigation.validateTrackerItemComingUpSelected();
    navigation.validateTrackerItemsPageLoaded();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that clicking 'Tracker items' in the Admin sidebar selects the 'Tracker items' menu item and loads the Tracker Items header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminTrackerItemsAndDisplayTrackerItemsHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.TRACKER_ITEMS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.TRACKER_ITEMS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.TRACKER_ITEMS);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Regulatory bodies' in the Admin sidebar marks it as selected and displays the Regulatory Bodies header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminRegulatoryBodiesAndDisplayRegulatoryBodiesHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.REGULATORY_BODIES);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.REGULATORY_BODIES);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.REGULATORY_BODIES);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Categories' in the Admin sidebar marks it as selected and displays the Categories header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminCategoriesAndDisplayCategoriesHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.CATEGORIES);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.CATEGORIES);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.CATEGORIES);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Locations' in the Admin sidebar marks it as selected and displays the Locations header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminLocationsAndDisplayLocationsHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.LOCATIONS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.LOCATIONS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.LOCATIONS);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Business units' in the Admin sidebar marks it as selected and displays the Business Units header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminBusinessUnitsAndDisplayBusinessUnitsHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.BUSINESS_UNITS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.BUSINESS_UNITS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.BUSINESS_UNITS);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Users' in the Admin sidebar marks it as selected and displays the Users header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminUsersAndDisplayUsersHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.USERS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.USERS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.USERS);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Audit log' in the Admin sidebar marks it as selected and displays the Audit Log header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminAuditLogAndDisplayAuditLogHeader() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.AUDIT_LOG);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.AUDIT_LOG);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.AUDIT_LOG);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Other settings' in the Admin sidebar marks it as selected and displays the Other Settings header.")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminOtherSettingsAndDisplayOtherSettingsHeader () throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.OTHER_SETTINGS);
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Admin' tab the Admin sidebar marks it as selected")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldSelectAdminTabAndIsHighlighted() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.validateAdminButtonSelected();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Admin' tab shows all sub categories in the Admin sidebar")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldShowAllSubAdminTabCategory() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.validateAllAdminSectionsLoad();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that selecting 'Admin' tab shows all sub categories in the Admin sidebar")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void shouldShowAllSubTrackingItemsCategory() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.assertAllTrackerItemsSubCategoriesVisible();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Sidebar 'Tracker items' selection persists after page refresh")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void testSidebarStatePersistAfterRefreshTrackerItems() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickTrackerItemsButton();
    navigation.clickTrackerItemButtonComingUp();
    navigation.validateTrackerItemComingUpSelected();
    navigation.validateTrackerItemsPageLoaded();
    navigation.pageRefresh();
    navigation.waitForSpinnerToDisappear();
    navigation.validateTrackerItemComingUpSelected();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Admin submenu 'Users' selection persists after page refresh")
  @Owner("Dave Cheever")
  @Tag("Navigation")
  @Story("Align and Implement Unified Navigation Structure")
  public void testSidebarStatePersistAfterRefreshAdminUsers() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    navigation.clickAdminButton();
    navigation.openAdminSection(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.assertAdminSectionSelected(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.pageRefresh();
    navigation.waitForSpinnerToDisappear();
    navigation.assertAdminSectionSelected(Navigation.AdminSection.OTHER_SETTINGS);
    navigation.assertAdminHeaderLoaded(Navigation.AdminSection.OTHER_SETTINGS);
  }









}
