package pageObject;

import com.microsoft.playwright.Locator;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

public class Logout extends base.commonFunctions {
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator welcomeBackMessage = getPage().locator("//div[@data-id=\"000229\" and text()='Welcome back!']");

  public void validateUserIsLoggedOut() {
    Allure.step("Validating that user is logged out");
    waitForVisibility(welcomeBackMessage, timeout, "Welcome back message on login page");
    Assert.assertTrue(welcomeBackMessage.isVisible(), "Welcome back message should be visible on login page");
  }
}
