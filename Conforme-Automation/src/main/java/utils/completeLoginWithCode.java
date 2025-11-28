package utils;

import base.commonFunctions;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.WaitForSelectorState;
import reporting.extent;

public class completeLoginWithCode extends commonFunctions {
	 private final Page page;
	 private final mailosaurAPI emailCode;

	    public completeLoginWithCode(Page page) {
	        this.page = page;
	        this.emailCode = new mailosaurAPI();
	    }

	    /**Full SSO Login Flow with OTP */
	    public void process() throws Exception {
	        String verificationCode = emailCode.getCode();
	        OutlookInputVerificationCode(verificationCode);
	        OutlookVerifyCodeButtonClick();
	        OutlookContinueButtonClick();
//	        waitForDashboardLinkToBeDisplayed();
	    }

	    /**Switch to Tab by Index */
	    public void switchToTabByIndex(int tabIndex) {
	        Page currentPage = page.context().pages().get(tabIndex);
	        currentPage.bringToFront();
	        extent.getTest().info("Switched to tab index: " + tabIndex);
	    }

	    /**Enter OTP in Verification Code Field */
	    public void OutlookInputVerificationCode(String verificationCode) {
	        Locator codeField = page.locator("//input[@placeholder='Verification code']");
	        codeField.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
	        codeField.fill(verificationCode);
	        extent.getTest().info("Entered verification code: " + verificationCode);
	    }

	    /**Click the Verify Code Button */
	    public void OutlookVerifyCodeButtonClick() {
	        page.waitForSelector("#overlay", new Page.WaitForSelectorOptions().setState(WaitForSelectorState.HIDDEN));
	        Locator verifyCodeButton = page.locator("//button[normalize-space()='Verify code']");
	        verifyCodeButton.click();
	        extent.getTest().info("Clicked the Verify Code button.");
	    }

	    /**Click the Continue Button */
	    public void OutlookContinueButtonClick() {
	        page.waitForSelector("#overlay-content", new Page.WaitForSelectorOptions().setState(WaitForSelectorState.HIDDEN));
	        Locator continueButton = page.locator("//button[normalize-space()='Continue']");
	        continueButton.click();
	        extent.getTest().info("Clicked the Continue button.");
	    }

	    /**Wait for Dashboard to Appear */
	    public void waitForDashboardLinkToBeDisplayed() {
	        Locator dashboardLabel = page.locator("//label[text()='Dashboard']");
	        dashboardLabel.waitFor(new Locator.WaitForOptions().setState(WaitForSelectorState.VISIBLE));
	        extent.getTest().info("Dashboard is now displayed.");
	    }
}