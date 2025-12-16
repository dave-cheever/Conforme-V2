package pageObject;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.assertions.LocatorAssertions;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;
import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

public class Navigation extends base.commonFunctions {
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator overviewButton = getPage().locator("//div[text()='Overview']/ancestor::div[2]");
  private final Locator trackerItemsButton = getPage().locator("//div[text()='Tracker items']/ancestor::div[2]");
  private final Locator adminButton = getPage().locator("//div[text()='Admin']/ancestor::div[2]");
  private final Locator helpSupportButton = getPage().locator("//div[text()='Help & support']/ancestor::div[2]");
  private final Locator trackerItemsHeaderText = getPage().locator("//div[@data-id=\"000272\"]/p[text()='Tracker items']");
  private final Locator spinner = getPage().locator("//div[@class='chakra-spinner css-1cse1gr']");
  private final Locator adminButtonTextSelected = getPage().locator("xpath=//div[@class='css-5wa6mo']/div[2]/div[text()='Admin']");

  public enum AdminSection {
    TRACKER_ITEMS("Tracker items", "000274"),
    REGULATORY_BODIES("Regulatory bodies", "000274"),
    CATEGORIES("Categories", "000274"),
    LOCATIONS("Locations", "000274"),
    BUSINESS_UNITS("Business units", "000274"),
    USERS("Users", "000274"),
    AUDIT_LOG("Audit log", "000274"),
    OTHER_SETTINGS("Other settings", "000274");

    private final String label;
    private final String headerDataId;

    AdminSection(String label, String headerDataId) {
      this.label = label;
      this.headerDataId = headerDataId;
    }

    public String label() {
      return label;
    }

    public String headerDataId() {
      return headerDataId;
    }
  }

  // base XPaths – easier to tweak when DOM changes
  private static final String ADMIN_BUTTON_XPATH_TEMPLATE =
    "//p[text()='%s']/ancestor::div[@data-id='000586']";

  private static final String ADMIN_SELECTED_TEXT_XPATH_TEMPLATE =
    "//div[@class='css-131iez4']/p[text()='%s']";

  private static final String ADMIN_HEADER_XPATH_TEMPLATE =
    "//p[@data-id='%s' and text()='%s']";

  private Locator adminButton(AdminSection section) {
    return getPage().locator("xpath=" + ADMIN_BUTTON_XPATH_TEMPLATE.formatted(section.label()));
  }

  private Locator adminSelectedText(AdminSection section) {
    return getPage().locator("xpath=" + ADMIN_SELECTED_TEXT_XPATH_TEMPLATE.formatted(section.label()));
  }

  private Locator adminHeader(AdminSection section) {
    return getPage().locator("xpath=" + ADMIN_HEADER_XPATH_TEMPLATE.formatted(
      section.headerDataId(), section.label()));
  }

  public void openAdminSection(AdminSection section) {
    String desc = "'" + section.label() + "' button in Admin";
    Allure.step("Clicking on " + desc);
    Locator button = adminButton(section);
    waitForVisibility(button, timeout, desc);
    click(button, desc);
  }

  public void validateAllAdminSectionsLoad() {
    Allure.step("Validating all Admin sections load properly");
    for (AdminSection section : AdminSection.values()) {
      openAdminSection(section);
    }
  }

  //I want to assert that all the sub categories under tracker items are visible upon clicking tracker items
  public void assertAllTrackerItemsSubCategoriesVisible() {
    Allure.step("Validating all sub-categories under 'Tracker items' are visible");
    String[] subCategories = {"All", "Non-compliant", "Compliant", "Coming up"};
    for (String subCategory : subCategories) {
      Locator subCategoryLocator = getPage().locator("xpath=//div[@data-id='000541' and text()='"+subCategory+"']");
      waitForVisibility(subCategoryLocator, timeout, "'" + subCategory + "' sub-category");
      Assert.assertTrue(subCategoryLocator.isVisible(), "'" + subCategory + "' sub-category is not visible");
    }
  }

  public void assertAdminSectionSelected(AdminSection section) {
    String desc = "'" + section.label() + "' in Admin is selected";
    Allure.step("Validating " + desc);
    Locator selected = adminSelectedText(section);
    waitForVisibility(selected, timeout, desc);
    Assert.assertTrue(selected.isVisible(), desc + " (visible check failed)");
  }

  public void assertAdminHeaderLoaded(AdminSection section) {
    String desc = section.label() + " header is loaded";
    Allure.step("Validating " + desc);
    Locator header = adminHeader(section);
    waitForVisibility(header, timeout, desc);
    Assert.assertTrue(header.isVisible(), desc + " (visible check failed)");
  }

  public void pageRefresh() {
    Allure.step("Refreshing the page");
    getPage().reload();
  }





  private Locator trackerItem(String label) {
    return getPage().locator("xpath=//div[contains(@class,'css-1frlo8')]/div[normalize-space()='" + label + "']");
  }
  private Locator trackerItemsAll() { return trackerItem("All"); }
  private Locator trackerItemsNonCompliant() { return trackerItem("Non-compliant"); }
  private Locator trackerItemsCompliant() { return trackerItem("Compliant"); }
  private Locator trackerItemsComingUp() { return trackerItem("Coming up"); }

  private Locator trackerItemButton(String label) {
    return getPage().locator(
      "xpath=//div[@data-id='000571']/div/div/div[text()='" + label + "']"
    );
  }
  private Locator trackerItemAllButton() { return trackerItemButton("All"); }
  private Locator trackerItemNonCompliantButton() { return trackerItemButton("Non-compliant"); }
  private Locator trackerItemCompliantButton() { return trackerItemButton("Compliant"); }
  private Locator trackerItemComingUpButton() { return trackerItemButton("Coming up"); }

  public void validateTrackerItemsPageLoaded() {
    Allure.step("Validating Tracker Items page is loaded");
    waitForVisibility(trackerItemsHeaderText, timeout, "Tracker Items header text");
    Assert.assertTrue(trackerItemsHeaderText.isVisible(), "Tracker Items page is not loaded");
  }

  public void clickTrackerItemButtonAll() {
    Allure.step("Clicking on 'All' tracker item button");
    waitForVisibility(trackerItemAllButton(), timeout, "'All' tracker item button");
    click(trackerItemAllButton(), "'All' tracker item button");
  }

  public void clickTrackerItemButtonNonCompliant() {
    Allure.step("Clicking on 'Non-compliant' tracker item button");
    waitForVisibility(trackerItemNonCompliantButton(), timeout, "'Non-compliant' tracker item button");
    click(trackerItemNonCompliantButton(), "'Non-compliant' tracker item button");
  }

  public void clickTrackerItemButtonCompliant() {
    Allure.step("Clicking on 'Compliant' tracker item button");
    waitForVisibility(trackerItemCompliantButton(), timeout, "'Compliant' tracker item button");
    click(trackerItemCompliantButton(), "'Compliant' tracker item button");
  }

  public void clickTrackerItemButtonComingUp() {
    Allure.step("Clicking on 'Coming up' tracker item button");
    waitForVisibility(trackerItemComingUpButton(), timeout, "'Coming up' tracker item button");
    click(trackerItemComingUpButton(), "'Coming up' tracker item button");
  }

  public void validateTrackerItemAllSelected() {
    Allure.step("Validating 'All' tracker item is selected");
    waitForVisibility(trackerItemsAll(), timeout, "'All' tracker item");
    Assert.assertTrue(trackerItemsAll().isVisible(), "'All' tracker item is not selected");
  }

  public void validateTrackerItemNonCompliantSelected() {
    Allure.step("Validating 'Non-compliant' tracker item is selected");
    waitForVisibility(trackerItemsNonCompliant(), timeout, "'Non-compliant' tracker item");
    Assert.assertTrue(trackerItemsNonCompliant().isVisible(), "'Non-compliant' tracker item is not selected");
  }

  public void validateTrackerItemCompliantSelected() {
    Allure.step("Validating 'Compliant' tracker item is selected");
    waitForVisibility(trackerItemsCompliant(), timeout, "'Compliant' tracker item");
    Assert.assertTrue(trackerItemsCompliant().isVisible(), "'Compliant' tracker item is not selected");
  }

  public void validateTrackerItemComingUpSelected() {
    Allure.step("Validating 'Coming up' tracker item is selected");
    waitForVisibility(trackerItemsComingUp(), timeout, "'Coming up' tracker item");
    Assert.assertTrue(trackerItemsComingUp().isVisible(), "'Coming up' tracker item is not selected");
  }

  public void clickOverviewButton() {
    Allure.step("Clicking on 'Overview' button");
    waitForVisibility(overviewButton, timeout, "Overview button");
    click(overviewButton, "Overview button");
  }

  public void clickTrackerItemsButton() {
    Allure.step("Clicking on 'Tracker items' button");
    waitForVisibility(trackerItemsButton, timeout, "Tracker items button");
    click(trackerItemsButton, "Tracker items button");
  }

  public void clickAdminButton() {
    Allure.step("Clicking on 'Admin' button");
    waitForVisibility(adminButton, timeout, "Admin button");
    click(adminButton, "Admin button");
  }

  public void clickHelpSupportButton() {
    Allure.step("Clicking on 'Help & support' button");
    waitForVisibility(helpSupportButton, timeout, "Help & support button");
    click(helpSupportButton, "Help & support button");
  }

  public void waitForSpinnerToDisappear() {
    // If the spinner is visible, wait until it's hidden/detached
    if (spinner.isVisible()) {
      assertThat(spinner).isHidden(new LocatorAssertions.IsHiddenOptions()
        .setTimeout(20_000));
    }
  }

  public void validateAdminButtonSelected() throws InterruptedException {
    Allure.step("Validating 'Admin' button is selected");
    Thread.sleep(1000);
    waitForVisibility(adminButtonTextSelected, timeout, "'Admin' button text selected");
    Assert.assertTrue(adminButtonTextSelected.isVisible(), "'Admin' button is not selected");
  }


}
