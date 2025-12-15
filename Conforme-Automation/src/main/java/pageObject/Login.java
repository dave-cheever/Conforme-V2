package pageObject;
import base.commonFunctions;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;
import utils.Constants;
import utils.QRCodeScanner;

import static utils.Constants.imagePath;

public class Login extends base.commonFunctions{
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator signInWithMicrosoftButton = getPage().locator("//button[@data-id='000221']");
  private final Locator inputEmail = getPage().locator("//input[@name='loginfmt']");
  private final Locator buttonNext = getPage().locator("//input[@id='idSIButton9']");
  private final Locator inputPassword = getPage().locator("//input[@name='passwd']");

  private final Locator inputOtp = getPage().locator("(//input[contains(@placeholder,'Code')])[1]");

  private final Locator buttonVerify = getPage().locator("//input[@id='idSubmit_SAOTCC_Continue']");

  private final Locator MenuUserName = getPage().locator("(//p[text()='Conforme Automation'])[1]");

  private final Locator loginErrorMessage = getPage().locator("//div[@id='passwordError']");

  private final Locator overviewLandingPage = getPage().locator("//p[@data-id='overview-title']");

  private final Locator loginLockedAccountErrorMessage = getPage().locator("//div[@id='passwordError' and contains(text(),'Your account has been locked')]");


  public void navigateToConformeUrl(String url) {
    Allure.step("Starting navigation to Conforme URL: " + url);
    navigateTo(url);
    waitForPageLoad();
  }

  public void clickSignInWithMicrosoftButton() {
    Allure.step("Clicking on 'Sign in with Microsoft' button");
    waitForVisibility(signInWithMicrosoftButton, timeout, "Sign in with Microsoft button");
    click(signInWithMicrosoftButton, "Sign in with Microsoft button");
  }

  public void enterEmail(String email) {
    Allure.step("Entering email: " + email);
    waitForVisibility(inputEmail, timeout, "Email input field");
    enterText(inputEmail, email, "Email input field");
    // Read back the value from the field
    String actualValue = inputEmail.getAttribute("value");
    // Soft assertion
    softAssert.assertEquals(
      actualValue,
      email,
      "Email input field value should match the entered email"
    );
  }

  public void loginSuccessful(String url, String email, String password) throws InterruptedException {
    navigateToConformeUrl(url);
    clickSignInWithMicrosoftButton();
    enterEmail(email);
    clickNextButton();
    enterPassword(password);
    submitLogin();
    waitForPageLoad();
    inputOtpCode();
    clickVerifyButton();
    clickNextButton();
    assertUserLoggedIn();
  }

  public void clickNextButton() {
    Allure.step("Clicking on 'Next' button");
    waitForVisibility(buttonNext, timeout, "Next button");
    click(buttonNext, "Next button");
  }

  public void enterPassword(String password) {
    Allure.step("Entering password");
    waitForVisibility(inputPassword, timeout, "Password input field");
    enterText(inputPassword, password, "Password input field");
    //Read back the value from the field
    String actualValue = inputPassword.getAttribute("value");
    // Soft assertion
    softAssert.assertEquals(
      actualValue,
      password,
      "Password input field value should match the entered password"
    );
  }

  public void submitLogin() throws InterruptedException {
    Allure.step("Submitting login credentials");
    waitForVisibility(buttonNext, timeout, "Sign in button");
    //wait for 30 sec so that OTP will not generate too early
    Thread.sleep(8000);
    click(buttonNext, "Sign in button");
  }

  public void setInputOtp(String otp) {
    Allure.step("Setting OTP Code: " + otp);
    waitForVisibility(inputOtp, timeout, "Input OTP");
    enterText(inputOtp, otp, "Input OTP");
    //Read back the value from the field
    String actualValue = inputOtp.getAttribute("value");
    // Soft assertion
    softAssert.assertEquals(
      actualValue,
      otp,
      "OTP input field value should match the entered OTP"
    );
  }

  public void clickVerifyButton() {
    Allure.step("Clicking on 'Verify' button");
    waitForVisibility(buttonVerify, timeout, "Verify Button");
    click(buttonVerify, "Verify Button");
  }

  public void inputOtpCode() {
    Constants.secretKey = QRCodeScanner.extractSecretKeyFromQRCode(imagePath);
    String code = QRCodeScanner.generateAuthenticationCode(Constants.secretKey);
    Allure.step("Set OTP Code from QR Code");
    setInputOtp(code);
    Allure.step("Click Verify Button to complete login");
  }

  public void assertUserLoggedIn() {
    Allure.step("Asserting user is logged in by checking username visibility");
    waitForVisibility(MenuUserName, timeout, "Conforme Automation");
    if (!MenuUserName.isVisible()) {
      throw new AssertionError("User is not logged in, username element is not visible.");
    }
  }

  public void assertOverviewLandingPagePresent() {
    Allure.step("Asserting user is logged in by checking overview landing page visibility");
    waitForVisibility(overviewLandingPage, timeout, "Conforme Automation");
    if (!overviewLandingPage.isVisible()) {
      throw new AssertionError("User is not logged in, overview landing page element is not visible.");
    }
  }

  public void assertUserLoginErrorMessage() {
    Allure.step("Asserting login error message");
    waitForVisibility(loginErrorMessage, timeout, "Login Error Message");
    Assert.assertTrue(loginErrorMessage.isVisible(), "Login error message is not visible.");
  }

  public void assertUserLoginLockedErrorMessage() {
    Allure.step("Asserting login error message");
    waitForVisibility(loginLockedAccountErrorMessage, timeout, "Login Error Message");
    Assert.assertTrue(loginLockedAccountErrorMessage.isVisible(), "Login locked account error message is not visible.");
  }




}
