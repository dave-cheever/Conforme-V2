package reporting;

import org.testng.annotations.BeforeSuite;
import org.testng.annotations.BeforeTest;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;

public class extentManager {
	
public static ExtentReports report;
	
	@BeforeSuite
	public static ExtentReports initializeReport() {
		if(report == null) {
			ExtentSparkReporter spark = new ExtentSparkReporter("./test-output/SparkReport/SparkAutoTest.html");
			report = new ExtentReports();
			spark.config().setTheme(Theme.DARK);
			spark.config().setEncoding("utf-8");
			spark.config().setDocumentTitle("BREEAM-Automation-Test-Report");
			
			report.attachReporter(spark);
		}
		return report;
	}	
}
