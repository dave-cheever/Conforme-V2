package pageObject;
import base.commonFunctions;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import io.qameta.allure.Allure;
import org.testng.Assert;
import org.testng.asserts.SoftAssert;
import utils.Constants;
import utils.QRCodeScanner;

import java.util.Arrays;
import java.util.List;

public class Filter extends base.commonFunctions{
  SoftAssert softAssert = new SoftAssert();
  int timeout = 60;

  private final Locator filterButton = getPage().locator("//div[@data-id='000267']");
  private final Locator categoryFilterDropdown = getPage().locator("//p[text()='Category']/ancestor::div[3]");
  String strCategoryOptionXPath = "//p[text()='Category']/ancestor::div[3]/div[2]/label/span[2]/p[text()='%s']";
  private final Locator applyFiltersButton = getPage().locator("//button[text()='Apply filters']");

  public void clickApplyFiltersButton() {
    Allure.step("Clicking on 'Apply filters' button");
    waitForVisibility(applyFiltersButton, 30, "Apply filters button");
    click(applyFiltersButton, "Apply filters button");
  }

  public void clickFilterButton() {
    Allure.step("Clicking on 'Filter' button");
    waitForVisibility(filterButton, 30, "Filter button");
    click(filterButton, "Filter button");
  }

  public void selectCategoryFilterOptions(String... categories) {
    Allure.step("Selecting category filter options: " + Arrays.toString(categories));
    waitForVisibility(categoryFilterDropdown, 30, "Category filter dropdown");
    click(categoryFilterDropdown, "Category filter dropdown");

    for (String category : categories) {
      String optionXPath = String.format(strCategoryOptionXPath, category);
      Locator categoryOption = getPage().locator(optionXPath);
      waitForVisibility(categoryOption, 10, "Category option: " + category);
      click(categoryOption, "Category option: " + category);
    }
  }

  public void assertCategoryFiltersMatchResultsByCount(String... categories) {
    if (categories == null || categories.length == 0) {
      throw new IllegalArgumentException("At least one category filter must be provided.");
    }
    if (categories.length > 3) {
      throw new IllegalArgumentException("At most three category filters are supported by this helper.");
    }

    // 2. Count ALL visible items/cards after applying the filters
    Locator allItems = getPage().locator("//div[@data-id='panel-view-items']/div");
    int totalItems = allItems.count();
    System.out.println("Total items displayed: " + totalItems);

    // Optional: if you expect at least one result overall
    Assert.assertTrue(
      totalItems > 0,
      "No items displayed after applying category filters."
    );

    // 3. XPath template for counting items by category text
    String xpathTemplate = "//div[contains(@data-id, 'panel-header')]/div[2]/div/p[text()='%s']";

    int sumPerFilter = 0;

    // 4. For each filter value, build the locator, count matches, and accumulate
    for (String category : categories) {
      String xpathForValue = String.format(xpathTemplate, category);
      Locator itemsForValue = getPage().locator(xpathForValue);
      int countForValue = itemsForValue.count();

      System.out.println("Items for '" + category + "': " + countForValue);

      // Optional: if you expect at least one for each filter, check that too
      Assert.assertTrue(
        countForValue > 0,
        "Expected at least one item for filter '" + category + "', but found 0."
      );

      sumPerFilter += countForValue;
    }

    // 5. Final assertion: total items == sum of GLWI + Fire (or whatever filters you used)
    Assert.assertEquals(
      totalItems,
      sumPerFilter,
      "Total items (" + totalItems + ") does not match the sum of filtered counts (" + sumPerFilter + ")."
    );
  }

}
