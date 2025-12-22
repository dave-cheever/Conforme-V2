package pageObject;

import com.microsoft.playwright.Locator;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;

public class HeaderProfile extends base.commonFunctions{
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator headerProfileButton = getPage().locator("//button[@data-id=\"000519\"]");
  private final Locator notificationSettingsButton = getPage().locator("//button[@data-id=\"000530\"]//div/p[text()='Notification settings']");
  private final Locator termsAndConditionsButton = getPage().locator("//button[@data-id=\"000530\"]//div/p[text()='Terms and conditions']");
  private final Locator privacyPolicyButton = getPage().locator("//button[@data-id=\"000530\"]//div/p[text()='Privacy policy']");
  private final Locator helpAndSupportButton = getPage().locator("//button[@data-id=\"000530\"]//div/p[text()='Help & support']");
  private final Locator logoutButton = getPage().locator("//button[@data-id=\"000531\"]");

  private final Locator notificationSettingsPageHeader = getPage().locator("//div[@data-id=\"000272\"]/p[text()='Notification settings']");
  private final Locator termsAndConditionsPageHeader = getPage().locator("//div[@data-id=\"000272\"]/p[text()='Terms and conditions']");
  private final Locator privacyPolicyPageHeader = getPage().locator("//div[@data-id=\"000272\"]/p[text()='Privacy policy']");
  private final Locator helpAndSupportPageHeader = getPage().locator("//div[@data-id=\"000272\"]/p[text()='Help']");



  public void validateNotificationsSettingsPageIsDisplayed() {
    Allure.step("Validating that Notifications Settings page is displayed");
    waitForVisibility(notificationSettingsPageHeader, timeout, "Notification Settings page header");
    Assert.assertTrue(notificationSettingsPageHeader.isVisible(), "Notification Settings page header should be visible");
  }

  public void validateTermsAndConditionsPageIsDisplayed() {
    Allure.step("Validating that Terms and Conditions page is displayed");
    waitForVisibility(termsAndConditionsPageHeader, timeout, "Terms and Conditions page header");
    Assert.assertTrue(termsAndConditionsPageHeader.isVisible(), "Terms and Conditions page header should be visible");
  }
  public void validatePrivacyPolicyPageIsDisplayed() {
    Allure.step("Validating that Privacy Policy page is displayed");
    waitForVisibility(privacyPolicyPageHeader, timeout, "Privacy Policy page header");
    Assert.assertTrue(privacyPolicyPageHeader.isVisible(), "Privacy Policy page header should be visible");
  }
  public void validateHelpAndSupportPageIsDisplayed() {
    Allure.step("Validating that Help and Support page is displayed");
    waitForVisibility(helpAndSupportPageHeader, timeout, "Help & Support page header");
    Assert.assertTrue(helpAndSupportPageHeader.isVisible(), "Help & Support page header should be visible");
  }



  public void validateHeaderProfileButtonMenuOpens() {
    Allure.step("Validating that Header Profile button menu opens");
    waitForVisibility(headerProfileButton, timeout, "Header Profile button");
    waitForVisibility(notificationSettingsButton, timeout, "Notification Settings button in Header Profile menu");
    softAssert.assertTrue(notificationSettingsButton.isVisible(), "Notification Settings button should be visible in Header Profile menu");
    softAssert.assertTrue(termsAndConditionsButton.isVisible(), "Terms and Conditions button should be visible in Header Profile menu");
    softAssert.assertTrue(privacyPolicyButton.isVisible(), "Privacy Policy button should be visible in Header Profile menu");
    softAssert.assertTrue(helpAndSupportButton.isVisible(), "Help and Support button should be visible in Header Profile menu");
    softAssert.assertTrue(logoutButton.isVisible(), "Logout button should be visible in Header Profile menu");
    softAssert.assertAll();
  }

  public void validateHeaderProfileButtonMenuCloses() {
    Allure.step("Validating that Header Profile button menu closes");
    waitForInvisibility(notificationSettingsButton, timeout, "Notification Settings button in Header Profile menu");
    softAssert.assertFalse(notificationSettingsButton.isVisible(), "Notification Settings button should not be visible in Header Profile menu");
    softAssert.assertFalse(termsAndConditionsButton.isVisible(), "Terms and Conditions button should not be visible in Header Profile menu");
    softAssert.assertFalse(privacyPolicyButton.isVisible(), "Privacy Policy button should not be visible in Header Profile menu");
    softAssert.assertFalse(helpAndSupportButton.isVisible(), "Help and Support button should not be visible in Header Profile menu");
    softAssert.assertFalse(logoutButton.isVisible(), "Logout button should not be visible in Header Profile menu");
    softAssert.assertAll();
  }

  public void clickOutsideHeaderProfileMenu() {
    Allure.step("Clicking outside Header Profile menu to close it");
    clickUsingCoordinates(10, 10);
  }

  private void clickUsingCoordinates(int pos1, int pos2) {
    getPage().mouse().click(pos1, pos2);
  }

  public void clickHeaderProfileButton() {
    Allure.step("Clicking on Header Profile button");
    waitForVisibility(headerProfileButton, timeout, "Header Profile button");
    click(headerProfileButton, "Header Profile button");
  }

  public void clickNotificationSettingsButton() {
    Allure.step("Clicking on Notification Settings button");
    waitForVisibility(notificationSettingsButton, timeout, "Notification Settings button");
    click(notificationSettingsButton, "Notification Settings button");
  }

  public void clickTermsAndConditionsButton() {
    Allure.step("Clicking on Terms and Conditions button");
    waitForVisibility(termsAndConditionsButton, timeout, "Terms and Conditions button");
    click(termsAndConditionsButton, "Terms and Conditions button");
  }

  public void clickPrivacyPolicyButton() {
    Allure.step("Clicking on Privacy Policy button");
    waitForVisibility(privacyPolicyButton, timeout, "Privacy Policy button");
    click(privacyPolicyButton, "Privacy Policy button");
  }

  public void clickHelpAndSupportButton() {
    Allure.step("Clicking on Help and Support button");
    waitForVisibility(helpAndSupportButton, timeout, "Help and Support button");
    click(helpAndSupportButton, "Help and Support button");
  }

  public void clickLogoutButton() {
    Allure.step("Clicking on Logout button");
    waitForVisibility(logoutButton, timeout, "Logout button");
    click(logoutButton, "Logout button");
  }



}
