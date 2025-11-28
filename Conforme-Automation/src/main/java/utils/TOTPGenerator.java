package util;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorException;

public class TOTPGenerator {

    private GoogleAuthenticator gAuth;

    public TOTPGenerator() {
        // Initialize Google Authenticator with default configuration
        this.gAuth = new GoogleAuthenticator();
    }

    // Generate TOTP code for the provided secret key
    public String generateTOTP(String secretKey) {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("Secret key is null or empty.");
            return null;
        }

        try {
            // Generate the OTP for the given secret key
            int otp = gAuth.getTotpPassword(secretKey);
            return String.valueOf(otp);
        } catch (GoogleAuthenticatorException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args) {
        TOTPGenerator totpGenerator = new TOTPGenerator();
        String secretKey = "y27mtkgbtscd7z2n";  // Replace with your extracted secret key

        // Generate OTP
        String otp = totpGenerator.generateTOTP(secretKey);
        if (otp != null) {
            System.out.println("Generated OTP: " + otp);
        } else {
            System.out.println("Failed to generate OTP.");
        }
    }
}
