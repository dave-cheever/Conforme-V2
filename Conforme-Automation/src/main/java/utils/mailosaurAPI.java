package utils;

import com.mailosaur.MailosaurClient;
import com.mailosaur.MailosaurException;
import com.mailosaur.models.Message;
import com.mailosaur.models.MessageSearchParams;
import com.mailosaur.models.SearchCriteria;

import java.io.IOException;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.testng.Assert.assertNotNull;

public class mailosaurAPI {
    public String getCode() throws IOException, MailosaurException, InterruptedException {
        // Available in the API tab of a server
        //String apiKey = "zmYEISBaC56EhScDqdaYVIslhqQwIdIv";
        //String serverId = "vnzvpuup";
        String apiKey = "PGUK41af0wkYHnnawmcWbFBJtTVe01mL";
        String serverId = "wvvjzph8";
        int maxAttempts = 10; // Maximum number of attempts
        int attempts = 0; // Counter for attempts
        int pollIntervalMillis = 2000; // Interval between attempts (2 seconds)
        Message message = null;

        long currentTimeMillis = System.currentTimeMillis();
        // Create a Date object using the milliseconds
        Date testStart = new Date(currentTimeMillis);

        MailosaurClient mailosaur = new MailosaurClient(apiKey);
        MessageSearchParams params = new MessageSearchParams();

        while (attempts < maxAttempts) {
            try {
                // Increment the attempt counter
                attempts++;

                // Retrieve the message
                params.withServer(serverId).withReceivedAfter(testStart);
                SearchCriteria criteria = new SearchCriteria();
                criteria.withSubject("BRE Group UAT account email verification code");
                message = mailosaur.messages().get(params, criteria);

                // Check if the message is not null
                if (message != null) {
                    assertNotNull(message); // Message found
                    System.out.println("Email received on attempt " + attempts);
                    break;
                }
            } catch (Exception e) {
                // Handle exceptions gracefully (e.g., no email found yet)
                System.out.println("Attempt " + attempts + ": No email received yet.");
            }

            // Wait before the next attempt
            try {
                Thread.sleep(pollIntervalMillis);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt(); // Restore interrupted status
                throw new RuntimeException("Thread interrupted during sleep", ie);
            }
        }

        // Check if the message was found or the attempts limit was reached
        if (message == null) {
            throw new AssertionError("Failed to retrieve email after " + maxAttempts + " attempts.");
        }

        String regex = "Your code is: (\\d+)";

        // Compile the pattern
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(message.html().body());

        // Find and extract the code
        if (matcher.find()) {
            String code = matcher.group(1); // The first capture group
            System.out.println("Extracted Code: " + code);
            return code;
        } else {
            System.out.println("No code found in the email content.");
        }
        return null;
    }
}
