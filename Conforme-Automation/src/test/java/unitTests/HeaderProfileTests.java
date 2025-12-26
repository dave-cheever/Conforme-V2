package unitTests;

import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.*;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

import java.io.IOException;

public class HeaderProfileTests extends testListener {
  testListener testListen;
  Login loginPage;
  HeaderProfile headerProfile;
  Logout logoutPage;

  public HeaderProfileTests() throws IOException {
    super();
  }

  @BeforeMethod(alwaysRun = true)
  public void setUpTest() {
    testListen = new testListener();
    commonFunctions cf = new commonFunctions();
    loginPage = new Login();
    headerProfile = new HeaderProfile();
    logoutPage = new Logout();
  }


  //header opens
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks header profile button and menu opens")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldOpenHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
  }

  //header opens and when clicked outside it closes
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks outside header profile menu and it closes")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldCloseHeaderProfileMenuWhenClickingOutside() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickOutsideHeaderProfileMenu();
    headerProfile.validateHeaderProfileButtonMenuCloses();
  }

  //header opens user clicks notifications settings and page opens

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks notification settings in header profile menu and page opens")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldOpenNotificationSettingsFromHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickOutsideHeaderProfileMenu();
    headerProfile.validateHeaderProfileButtonMenuCloses();
  }

  //header opens user click terms and conditions and page opens
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks terms and conditions in header profile menu and page opens")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldOpenTermsAndConditionsFromHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickTermsAndConditionsButton();
    headerProfile.validateTermsAndConditionsPageIsDisplayed();
  }

  //header opens user clicks privacy policy and page opens
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks privacy policy in header profile menu and page opens")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldOpenPrivacyPolicyFromHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickPrivacyPolicyButton();
    headerProfile.validatePrivacyPolicyPageIsDisplayed();
  }
  //header opens user clicks help and support and page opens
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks help and support in header profile menu and page opens")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldOpenHelpAndSupportFromHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickHelpAndSupportButton();
    headerProfile.validateHelpAndSupportPageIsDisplayed();
  }

  //header opens user clicks logout and is logged out
  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("User clicks logout in header profile menu and is logged out")
  @Owner("Dave Cheever")
  @Tag("Header Profile")
  @Story("Display User Profile and Account Menu in Header")
  public void shouldLogoutWhenClickedInHeaderProfileMenu() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    headerProfile.clickHeaderProfileButton();
    headerProfile.validateHeaderProfileButtonMenuOpens();
    headerProfile.clickLogoutButton();
    logoutPage.validateUserIsLoggedOut();
  }



}
