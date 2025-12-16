package unitTests;

import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.Login;
import pageObject.ModuleSwitcher;
import pageObject.Navigation;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

public class ModuleSwitcherTests extends testListener {

  testListener testListen;
  Login loginPage;
  Navigation navigation;
  ModuleSwitcher moduleSwitcher;

  public ModuleSwitcherTests() {
    super();
  }

  @BeforeMethod(alwaysRun = true)
  public void setUpTest() {
    testListen = new testListener();
    moduleSwitcher = new ModuleSwitcher();
    commonFunctions cf = new commonFunctions();
    loginPage = new Login();
    navigation = new Navigation();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when the user clicks the current module name in the header, " +
    "the module switcher opens and becomes visible, showing the list of available modules.")
  @Owner("Dave Cheever")
  @Tag("Module Switcher")
  @Story("Unified Module Switcher with Configurable Labels and External Links")
  public void shouldOpenModuleSwitcherWhenClickingHeaderModuleName() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.verifyGlobalViewTextIsVisible();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when the module switcher is open and the user clicks anywhere" +
    " outside the switcher panel, the switcher closes and is no longer visible.")
  @Owner("Dave Cheever")
  @Tag("Module Switcher")
  @Story("Unified Module Switcher with Configurable Labels and External Links")
  public void shouldCloseModuleSwitcherWhenClickingOutside() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.verifyGlobalViewTextIsVisible();
    moduleSwitcher.clickProfileButton();
    moduleSwitcher.verifyGlobalViewTextNotVisible();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when the user opens the module switcher and selects a different internal module " +
    "(e.g. switching from Audit to Tracker), the application navigates to the selected module and the new module " +
    "is shown as the active module in the header and module switcher.")
  @Owner("Dave Cheever")
  @Tag("Module Switcher")
  @Story("Unified Module Switcher with Configurable Labels and External Links")
  public void shouldSwitchBetweenInternalModules() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.verifyGlobalViewTextIsVisible();
    moduleSwitcher.clickModulesTrackerModuleButton();
    moduleSwitcher.validateTrackerItemsTextVisible();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.clickModulesAuditModuleButton();
    moduleSwitcher.validateAuditsTextVisible();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that when the user opens the module switcher and selects a different internal module " +
    "(e.g. switching from Audit to Tracker), the application navigates to the selected module and the new module " +
    "is shown as the active module in the header and module switcher.")
  @Owner("Dave Cheever")
  @Tag("Module Switcher")
  @Story("Unified Module Switcher with Configurable Labels and External Links")
  public void shouldSwitchBetweenInternalModulesAndUpdateActiveModuleIndicators() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.verifyGlobalViewTextIsVisible();
    moduleSwitcher.clickModulesTrackerModuleButton();
    moduleSwitcher.validateTrackerItemsTextVisible();
    moduleSwitcher.clickTrackerModuleButton();
    moduleSwitcher.validateModulesTrackerModuleButtonIsSelected();
  }
}
