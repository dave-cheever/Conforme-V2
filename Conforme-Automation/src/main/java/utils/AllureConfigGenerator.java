package utils;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class AllureConfigGenerator {

    public static void generate() {
        String resultsDir = System.getProperty("allure.results.directory", "allure-results");
        File dir = new File(resultsDir);
        if (!dir.exists() && !dir.mkdirs()) {
            System.err.println("Could not create directory: " + resultsDir);
        }
        writeEnvironmentProperties(resultsDir);
        writeCategoriesJson(resultsDir);
    }

    private static void writeEnvironmentProperties(String resultsDir) {
        Properties props = new Properties();
        props.setProperty("environment", System.getProperty("env", "SIT"));
        props.setProperty("baseUrl", System.getProperty("baseUrl", "https://cielocosta.conforme-sit.app/"));
        props.setProperty("browser", System.getProperty("browser", "chrome"));
        props.setProperty("build", System.getProperty("build", "0.0.1"));

        try (FileWriter writer = new FileWriter(resultsDir + "/environment.properties")) {
            props.store(writer, "Allure Environment Variables");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void writeCategoriesJson(String resultsDir) {
        String json = "[\n" +
                "  {\"name\": \"Assertion Failed\", \"matchedStatuses\": [\"failed\"], \"matchedMessages\": [\"expected .* but found .*\"]},\n" +
                "  {\"name\": \"Timeout Error\", \"matchedStatuses\": [\"broken\"], \"matchedMessages\": [\".*Timeout.*\"]},\n" +
                "  {\"name\": \"UI Element Not Found\", \"matchedStatuses\": [\"failed\"], \"matchedMessages\": [\".*NoSuchElementException.*\"]},\n" +
                "  {\"name\": \"Other Error\", \"matchedStatuses\": [\"failed\", \"broken\"]}\n" +
                "]";
        try (FileWriter writer = new FileWriter(resultsDir + "/categories.json")) {
            writer.write(json);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
