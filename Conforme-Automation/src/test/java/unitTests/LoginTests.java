package unitTests;

import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.Login;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

import java.io.IOException;


public class LoginTests extends testListener {

    testListener testListen;
    Login loginPage;
    //test

    public LoginTests() throws IOException {
        super();
    }

    @BeforeMethod(alwaysRun = true)
    public void setUpTest() {
        testListen = new testListener();
        commonFunctions cf = new commonFunctions();
        loginPage = new Login();
    }


    @Test
    @Severity(SeverityLevel.NORMAL)
    @Description("Successful Login with Valid Microsoft Account")
    @Owner("Dave Cheever")
    @Tag("Login")
    @Story("Log In with Company Credentials")
    public void shouldLoginSuccessfully() throws Exception {
        loginPage.navigateToConformeUrl(Constants.clientUrl);
        loginPage.clickSignInWithMicrosoftButton();
        loginPage.enterEmail(userCredentials.conformeAccountEmail);
        loginPage.clickNextButton();
        loginPage.enterPassword(userCredentials.conformePassword);
        loginPage.submitLogin();
        loginPage.waitForPageLoad();
        loginPage.inputOtpCode();
        loginPage.clickVerifyButton();
        loginPage.clickNextButton();
        loginPage.assertUserLoggedIn();
    }

    @Test
    @Severity(SeverityLevel.NORMAL)
    @Description("Unsuccessful Login with Invalid Microsoft Account")
    @Owner("Dave Cheever")
    @Tag("Login")
    @Story("Log In with Company Credentials")
    public void shouldNotLoginWithInvalidCredentials() throws Exception {
        loginPage.navigateToConformeUrl(Constants.clientUrl);
        loginPage.clickSignInWithMicrosoftButton();
        loginPage.enterEmail(userCredentials.conformeAccountEmail);
        loginPage.clickNextButton();
        loginPage.enterPassword(userCredentials.conformeInvalidPassword);
        loginPage.submitLogin();
        loginPage.waitForPageLoad();
        loginPage.assertUserLoginErrorMessage();
    }

    @Test
    @Severity(SeverityLevel.NORMAL)
    @Description("Validate Overview is the default landing page after successful login")
    @Owner("Dave Cheever")
    @Tag("Login")
    @Story("Log In with Company Credentials")
    public void shouldDisplayOverviewAsDefaultLandingPageAfterLogin() throws Exception {
        loginPage.navigateToConformeUrl(Constants.clientUrl);
        loginPage.clickSignInWithMicrosoftButton();
        loginPage.enterEmail(userCredentials.conformeAccountEmail);
        loginPage.clickNextButton();
        loginPage.enterPassword(userCredentials.conformePassword);
        loginPage.submitLogin();
        loginPage.waitForPageLoad();
        loginPage.inputOtpCode();
        loginPage.clickVerifyButton();
        loginPage.clickNextButton();
        loginPage.assertOverviewLandingPagePresent();
    }

    @Test
    @Severity(SeverityLevel.NORMAL)
    @Description("Unsuccessful Login with Locked Microsoft Account")
    @Owner("Dave Cheever")
    @Tag("Login")
    @Story("Log In with Company Credentials")
    public void shouldNotLoginWithLockedAccount() throws Exception {
        loginPage.navigateToConformeUrl(Constants.clientUrl);
        loginPage.clickSignInWithMicrosoftButton();
        loginPage.enterEmail(userCredentials.lockedAccountEmail);
        loginPage.clickNextButton();
        loginPage.enterPassword(userCredentials.lockedAccountPassword);
        loginPage.submitLogin();
        loginPage.assertUserLoginLockedErrorMessage();
    }
}
