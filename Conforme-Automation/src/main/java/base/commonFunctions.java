package base;

import com.aventstack.extentreports.Status;
import com.microsoft.playwright.*;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.SelectOption;
import com.microsoft.playwright.options.WaitForSelectorState;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.annotations.BeforeSuite;
import utils.Constants;

import java.io.ByteArrayInputStream;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Collections;
import java.util.Random;

import static reporting.extent.testReport;


public class commonFunctions {
    private static Playwright playwright;
    private static Browser browser;
    private static BrowserContext context;
    private static Page page;

    public commonFunctions() {

        if (playwright == null) {
            playwright = Playwright.create();
        }
        if (browser == null) {
            browser = playwright.chromium().launch(
                    new BrowserType.LaunchOptions()
                            .setHeadless(Constants.isHeadless) //set to true for headless mode, false for headed mode
//                            .setArgs(Arrays.asList("--start-maximized"))
            );
        }
            if (context == null) {
            context = browser.newContext(new Browser.NewContextOptions().setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36")
                    .setViewportSize(1920, 1080));

        }
        if (page == null) {
            page = context.newPage();
        }
    }

    public static Page getPage() {
        return page;
    }

    /** Clicks the given locator */
    public void click(Locator locator, String description) {
        Allure.step("Clicking on: " + description);
        testReport.log(Status.INFO, "Clicking on: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        locator.click();
    }

    /** Enters text into the given locator */
    public void enterText(Locator locator, String text, String description) {
        Allure.step("Entering text into: " + description+" - Text: " + text);
        testReport.log(Status.INFO, "Entering text into: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        locator.fill(text);
    }

    public void enterTextWithDelay(Locator locator, String text, int delayMs, String description) {
        Allure.step("Entering text with delay into: " + description+ " - Text: " + text);
        testReport.log(Status.INFO, "Entering text with delay into: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        for (char c : text.toCharArray()) {
            locator.press(String.valueOf(c));
            try {
                Thread.sleep(delayMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    /** Selects an option by value in a native <select> dropdown */
    public void selectFromDropdown(Locator dropdown, String value) {
        dropdown.selectOption(value);
    }

    /** Selects a dropdown option by visible label */
    public void selectFromDropdownByLabel(Locator dropdown, String label) {
        dropdown.selectOption(new SelectOption().setLabel(label));
    }

    /** Waits for the locator to become visible within the timeout (seconds) */
    public void waitForVisibility(Locator locator, int timeoutSec, String description) {
        Allure.step("Waiting for visibility of: " + description);
        testReport.log(Status.INFO, "Waiting for visibility of: " + description);
       getPage().waitForLoadState(LoadState.LOAD);
        locator.waitFor(
                new Locator.WaitForOptions()
                        .setState(WaitForSelectorState.VISIBLE)
                        .setTimeout(timeoutSec * 1000)
        );
    }


    /** Opens a new tab and navigates to the given URL */
    public Page openNewTabAndNavigate(String url) {
        Allure.step("Opening new tab and navigating to: " + url);
        testReport.log(Status.INFO, "Opening new tab and navigating to: " + url);
        Page newPage = context.newPage();
        newPage.navigate(url);
         this.page = newPage; // Switch to the new tab
        return newPage;
    }

    /** Waits for the locator to become hidden or detached within the timeout (seconds) */
    public void waitForInvisibility(Locator locator, int timeoutSec, String description) {
        Allure.step("Waiting for invisibility of: " + description);
        testReport.log(Status.INFO, "Waiting for invisibility of: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        locator.waitFor(
                new Locator.WaitForOptions()
                        .setState(WaitForSelectorState.HIDDEN)
                        .setTimeout(timeoutSec * 1000)
        );
    }

    /** Scrolls the given locator into view */
    public void scrollToElement(Locator locator, String description) {
        Allure.step("Scrolling to element: " + description);
        testReport.log(Status.INFO, "Scrolling to element: " + description);
        locator.scrollIntoViewIfNeeded();
    }

    /** Returns the text content of the given locator */
    public String getText(Locator locator) {
        Allure.step("Getting text content of locator");
        return locator.textContent();
    }

    /** Navigate to URL and wait for network idle */
    public void navigateTo(String url) {
        Allure.step("Navigating to URL: "+ url);
        page.navigate(url);
    }

    public static void allureTakeScreenshot(String fileName) {
        try {
            String filePath = "./screenshots/" + fileName + ".png";
            getPage().screenshot(new Page.ScreenshotOptions().setPath(Paths.get(filePath)).setFullPage(true));
            byte[] screenshotBytes = getPage().screenshot();
            Allure.addAttachment(fileName, "image/png", new ByteArrayInputStream(screenshotBytes), ".png");
        } catch (Exception e) {
            testReport.log(Status.FAIL, "Error taking screenshot: " + e.getMessage());
        }
    }



    /** Assert visible */
    public void assertElementVisible(Locator locator, String description) {
        Allure.step("Assert visibility of element: " + description);
        testReport.log(Status.INFO, "Asserting visibility of: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        Assert.assertTrue(locator.isVisible(), "Element not visible: " + locator);
    }

    /** Assert exact text */
    public void assertElementText(Locator locator, String expectedText, String description) {
        Allure.step("Assert text of element: " + description);
        testReport.log(Status.INFO, "Asserting text of: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        String actual = locator.textContent();
        Assert.assertEquals(actual, expectedText, "Text mismatch: " + locator);
    }


    /**Take a screenshot */
    public void takeScreenshot(String filePath) {
        page.screenshot(new Page.ScreenshotOptions().setPath(Paths.get(filePath)).setFullPage(true));
    }

    // In commonFunctions (static browser/process cleanup)
    public static void closeBrowserProcess() {
        if (browser != null) {
            browser.close();
            browser = null;
        }
        if (playwright != null) {
            playwright.close();
            playwright = null;
        }
    }

    // In commonFunctions (instance‐level cleanup)
    public void closeContext() {
        if (page != null) {
            page.close();
            page = null;
        }
        if (context != null) {
            context.close();
            context = null;
        }
    }


    /**Assert if an element is displayed */
    public void assertElementVisible(String selector, String description) {
        testReport.log(Status.INFO, "Asserting visibility of element: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        boolean isVisible = page.locator(selector).isVisible();
        Assert.assertTrue(isVisible, "Element not visible: " + selector);
    }

    /**Assert if an element contains specific text */
    public void assertElementText(String selector, String expectedText, String description) {
        testReport.log(Status.INFO, "Asserting text of element: " + description);
        getPage().waitForLoadState(LoadState.LOAD);
        String actualText = page.locator(selector).textContent();
        Assert.assertEquals(actualText, expectedText, "Text mismatch for element: " + selector);
    }

    /**Generate a random integer */
    public static int generateRandomInt(int min, int max) {
        Random random = new Random();
        return random.nextInt(max - min + 1) + min;
    }

    //Add a wait for page to load method here
    public void waitForPageLoad() {
        Allure.step("Waiting for page to load");
        getPage().waitForLoadState(LoadState.LOAD);
        System.out.println("Page loaded successfully, now clicking on Admin Settings label.");
    }
}