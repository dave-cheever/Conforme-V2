package reporting;

import com.microsoft.playwright.Page;
import base.commonFunctions;
import io.qameta.allure.Allure;
import io.qameta.allure.Attachment;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * TestNG listener for Allure reporting with Playwright.
 * Captures test lifecycle steps, failures, and screenshots.
 */
public class AllureTestListener implements ITestListener {
    private commonFunctions cf = new commonFunctions();
    private Page page;

    @Override
    public void onStart(ITestContext context) {
        Allure.step("=== TEST SUITE START: " + context.getName() + " ===");
    }

    @Override
    public void onTestStart(ITestResult result) {
        Allure.step("-- STARTING TEST: " + result.getMethod().getMethodName());
        page = cf.getPage();
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        Allure.step("✔ TEST PASSED: " + result.getMethod().getMethodName());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        Allure.step("✖ TEST FAILED: " + result.getMethod().getMethodName());
        // Attach exception details
        Allure.addAttachment(
                "Failure Reason",
                "text/plain",
                result.getThrowable().toString(),
                ".txt"
        );
        // Capture and attach screenshot
        try {
            commonFunctions.allureTakeScreenshot("TestFailureScreenshot");
//            saveScreenshot(screenshot);
        } catch (Exception e) {
            Allure.step("Could not capture screenshot: " + e.getMessage());
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        Allure.step("→ TEST SKIPPED: " + result.getMethod().getMethodName());
    }

    @Override
    public void onFinish(ITestContext context) {
        Allure.step("=== TEST SUITE FINISH: " + context.getName() + " ===");
        // Clean up Playwright
        cf.closeContext();
        cf.closeBrowserProcess();
    }

    /**
     * Attaches a PNG screenshot to Allure report.
     * @param screenShot raw bytes
     * @return same bytes for Allure
     */
    @Attachment(value = "Page screenshot", type = "image/png")
    public byte[] saveScreenshot(byte[] screenShot) {
        return screenShot;
    }
}
