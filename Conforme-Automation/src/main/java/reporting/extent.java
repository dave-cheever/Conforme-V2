package reporting;

import com.aventstack.extentreports.ExtentTest;

public class extent {

	public static ExtentTest testReport;
	
	public static ExtentTest getTest() {
		return testReport;
	}
	
	public static void setTest(ExtentTest test) {
		extent.testReport = test;
	}

}
