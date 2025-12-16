package pageObject;

import com.microsoft.playwright.Locator;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

public class ModuleSwitcher extends base.commonFunctions{
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator trackerModuleButton = getPage().locator("(//div[@data-id='000421']/button)[1]");
  private final Locator governanceSuite = getPage().locator("(//button[@data-id='000436' and @data-index='0'])[1]");

  private final Locator modulesTrackerModuleButton = getPage().locator("(//button[@data-id='000436' and @data-index='1'])[1]");
  private final Locator modulesAuditModuleButton = getPage().locator("(//button[@data-id='000436' and @data-index='2'])[1]");
  private final Locator modulesConformerModuleManagementButton = getPage().locator("(//button[@data-id='000436' and @data-index='3'])[1]");
  private final Locator modulesConformeV2ModuleLinkButton = getPage().locator("(//button[@data-id='000436' and @data-index='4'])[1]");

  private final Locator globalViewText = getPage().locator("(//p[text()='Global view'])[1]");
  private final Locator profileButtonLocator = getPage().locator("//button[@data-id='000519']");

  private final Locator trackerItemsText = getPage().locator("(//p[@data-id='000274' and text()='Tracker items'])[1]");
  private final Locator auditsText = getPage().locator("(//p[@data-id='000274' and text()='Audits'])[1]");


  private final Locator modulesTrackerModuleButtonSelected = getPage().locator("(//button[@data-id='000436' and @data-index='1' and @class='chakra-menu__menuitem css-1l7awrz' ])[1]");
  private final Locator modulesAuditModuleButtonSelected = getPage().locator("(//button[@data-id='000436' and @data-index='2' and @class='chakra-menu__menuitem css-1l7awrz' ])[1]");
  private final Locator modulesConformerModuleManagementButtonSelected = getPage().locator("(//button[@data-id='000436' and @data-index='3' and @class='chakra-menu__menuitem css-1l7awrz' ])[1]");

  public void validateModulesTrackerModuleButtonIsSelected() {
    Allure.step("Validating 'Modules Tracker Module' button is selected");
    waitForVisibility(modulesTrackerModuleButtonSelected, 30, "'Modules Tracker Module' button selected");
    Assert.assertTrue(modulesTrackerModuleButtonSelected.isVisible(),"'Modules Tracker Module' button is not selected");
  }

  public void validateModulesAuditModuleButtonIsSelected() {
    Allure.step("Validating 'Modules Audit Module' button is selected");
    waitForVisibility(modulesAuditModuleButtonSelected, 30, "'Modules Audit Module' button selected");
    Assert.assertTrue(modulesAuditModuleButtonSelected.isVisible(),"'Modules Audit Module' button is not selected");
  }

  public void validateModulesConformerModuleManagementButtonIsSelected() {
    Allure.step("Validating 'Modules Conformer Module Management' button is selected");
    waitForVisibility(modulesConformerModuleManagementButtonSelected, 30, "'Modules Conformer Module Management' button selected");
    Assert.assertTrue(modulesConformerModuleManagementButtonSelected.isVisible(),"'Modules Conformer Module Management' button is not selected");
  }

  public void validateTrackerItemsTextVisible() throws InterruptedException {
    Allure.step("Validating 'Tracker items' text is visible");
    waitForVisibility(trackerItemsText, 30, "'Tracker items' text");
    Assert.assertTrue(trackerItemsText.isVisible(),"'Tracker items' text is not visible");
    Thread.sleep(500);
  }

  public void validateAuditsTextVisible() {
    Allure.step("Validating 'Audits' text is visible");
    waitForVisibility(auditsText, 30, "'Audits' text");
    Assert.assertTrue(auditsText.isVisible(),"'Audits' text is not visible");
  }

  public void clickProfileButton() throws InterruptedException {
    Allure.step("Clicking on profile button");
    waitForVisibility(profileButtonLocator, 30, "Profile button");
    click(profileButtonLocator, "Profile button");
    Thread.sleep(500);
  }

  public void verifyGlobalViewTextNotVisible() {
    Allure.step("Verifying 'Global view' text is not visible");
    Assert.assertFalse(globalViewText.isVisible(),"'Global view' text is visible");
  }

  public void verifyGlobalViewTextIsVisible() {
    Allure.step("Verifying 'Global view' text is visible");
    waitForVisibility(globalViewText, 30, "'Global view' text");
    Assert.assertTrue(globalViewText.isVisible(),"'Global view' text is not visible");
  }

  public void clickTrackerModuleButton() {
    Allure.step("Clicking on 'Tracker Module' button");
    waitForVisibility(trackerModuleButton, 30, "Tracker Module button");
    click(trackerModuleButton, "Tracker Module button");
  }

  public void clickGovernanceSuite() {
    Allure.step("Clicking on 'Governance Suite' button");
    waitForVisibility(governanceSuite, 30, "Governance Suite button");
    click(governanceSuite, "Governance Suite button");
  }

  public void clickModulesTrackerModuleButton() {
    Allure.step("Clicking on 'Modules Tracker Module' button");
    waitForVisibility(modulesTrackerModuleButton, 30, "Modules Tracker Module button");
    click(modulesTrackerModuleButton, "Modules Tracker Module button");
  }

  public void clickModulesAuditModuleButton() {
    Allure.step("Clicking on 'Modules Audit Module' button");
    waitForVisibility(modulesAuditModuleButton, 30, "Modules Audit Module button");
    click(modulesAuditModuleButton, "Modules Audit Module button");
  }

  public void clickModulesConformerModuleManagementButton() {
    Allure.step("Clicking on 'Modules Conforme Module Management' button");
    waitForVisibility(modulesConformerModuleManagementButton, 30, "Modules Conforme Module Management button");
    click(modulesConformerModuleManagementButton, "Modules Conforme Module Management button");
  }

  public void clickModulesConformeV2ModuleLinkButton() {
    Allure.step("Clicking on 'Modules Conforme V2 Module Link' button");
    waitForVisibility(modulesConformeV2ModuleLinkButton, 30, "Modules Conforme V2 Module Link button");
    click(modulesConformeV2ModuleLinkButton, "Modules Conforme V2 Module Link button");
  }



}
