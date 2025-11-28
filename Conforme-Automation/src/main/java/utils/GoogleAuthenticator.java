package utils;

import de.taimos.totp.TOTP;

public class GoogleAuthenticator {
    private static final String SECRET_KEY = "5Q6NJEIKS7SVJJMVXOGSBGAUAH6TWC2I";

    public static void main(String[] args) {
        String code = generateAuthenticationCode(SECRET_KEY);
        System.out.println("Generated Code Key: " + code);
    }

    public static String generateAuthenticationCode(String secretKey) {
        return TOTP.getOTP(secretKey);
    }
}
