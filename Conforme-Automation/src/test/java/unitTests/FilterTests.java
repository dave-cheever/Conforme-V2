package unitTests;
import base.commonFunctions;
import io.qameta.allure.*;
import io.qameta.allure.testng.Tag;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import pageObject.Filter;
import pageObject.Login;
import pageObject.Navigation;
import reporting.testListener;
import utils.Constants;
import utils.userCredentials;

import java.io.IOException;
public class FilterTests extends testListener{

  testListener testListen;
  Login loginPage;
  Filter filterPage;
  Navigation navigation;

  public FilterTests() throws IOException {
    super();
  }

  @BeforeMethod(alwaysRun = true)
  public void setUpTest() {
    testListen = new testListener();
    commonFunctions cf = new commonFunctions();
    loginPage = new Login();
    filterPage = new Filter();
    navigation = new Navigation();
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that applying one category filters displays only matching records")
  @Owner("Dave Cheever")
  @Tag("Filter")
  @Story("Apply Sorting and Filtering in Panel View")
  public void shouldDisplayOnlyMatchingRecordsWhenOneCategoryFiltersAreApplied() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.clickFilterButton();
    filterPage.selectCategoryFilterOptions("GLWI");
    filterPage.clickApplyFiltersButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.assertCategoryFiltersMatchResultsByCount("GLWI");
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that applying two category filters displays only matching records")
  @Owner("Dave Cheever")
  @Tag("Filter")
  @Story("Apply Sorting and Filtering in Panel View")
  public void shouldDisplayOnlyMatchingRecordsWhenTwoCategoryFiltersAreApplied() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.clickFilterButton();
    filterPage.selectCategoryFilterOptions("GLWI", "Fire");
    filterPage.clickApplyFiltersButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.assertCategoryFiltersMatchResultsByCount("GLWI", "Fire");
  }

  @Test
  @Severity(SeverityLevel.NORMAL)
  @Description("Verify that applying three category filters displays only matching records")
  @Owner("Dave Cheever")
  @Tag("Filter")
  @Story("Apply Sorting and Filtering in Panel View")
  public void shouldDisplayOnlyMatchingRecordsWhenThreeCategoryFiltersAreApplied() throws Exception {
    loginPage.loginSuccessful(Constants.clientUrl, userCredentials.conformeAccountEmail, userCredentials.conformePassword);
    navigation.clickTrackerItemsButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.clickFilterButton();
    filterPage.selectCategoryFilterOptions("GLWI", "Fire", "Electrical");
    filterPage.clickApplyFiltersButton();
    navigation.waitForSpinnerToDisappear();
    filterPage.assertCategoryFiltersMatchResultsByCount("GLWI", "Fire", "Electrical");
  }
}
