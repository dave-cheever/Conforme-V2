package pageObject;

import com.microsoft.playwright.Locator;

public class ActionCategories extends base.commonFunctions {

  private final Locator addNewCategoryButton = getPage().locator("//button[@data-id='000282']");
}
