package utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;

import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Hex;

import de.taimos.totp.TOTP;
import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Hex;
import java.time.Instant;
//import java.time.temporal.ChronoUnit;
import org.jboss.aerogear.security.otp.Totp;


public class QRCodeScanner2 {



    public static String generateOTP(String secretKey) {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("Secret key is null or empty.");
            return null;
        }

        try {
            Base32 base32 = new Base32();
            byte[] decodedKey = base32.decode(secretKey);

            if (decodedKey == null || decodedKey.length == 0) {
                System.err.println("Decoded key is null or empty.");
                return null;
            }

            String hexKey = Hex.encodeHexString(decodedKey);
            String otp = TOTP.getOTP(hexKey);
            System.out.println("Generated OTP: " + otp); // Log generated OTP for debugging
            return otp;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String generateOTP_orig(String imagePath) {
        String secretKey = extractSecretKeyFromQRCode(imagePath);

        if (secretKey != null) {
            return generateAuthenticationCode(secretKey);
        } else {
            System.err.println("Failed to extract secret key from QR code.");
            return null;
        }
    }

    public static String extractSecretKeyFromQRCode(String imagePath) {
        try {
            BufferedImage image = ImageIO.read(new File(imagePath));
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(new BufferedImageLuminanceSource(image)));

            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);

            QRCodeReader reader = new QRCodeReader();
            Result result = reader.decode(bitmap, hints);
            String text = result.getText();

            // Log the extracted text to verify it's correct
            System.out.println("Extracted QR Code Text: " + text);

            // Parse the extracted text to obtain the secret key
            String secretKey = parseSecretKeyFromText(text);

            if (secretKey != null) {
                System.out.println("Extracted Secret Key: " + secretKey);
            } else {
                System.err.println("Failed to extract the secret key.");
            }

            return secretKey;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    private static String parseSecretKeyFromText(String text) {
        // Implement your logic to parse the secret key from the extracted text
        // This example assumes the key is formatted as "otpauth://totp/{issuer}:{account}?secret={secret}&issuer={issuer}"
        String secretKey = null;

        if (text.contains("secret=")) {
            int startIndex = text.indexOf("secret=") + 7;
            int endIndex = text.indexOf("&", startIndex);
            if (endIndex == -1) {
                endIndex = text.length(); // If there's no "&", take till the end
            }
            secretKey = text.substring(startIndex, endIndex);
        }

        return secretKey != null ? secretKey : null;
    }

    private static String parseSecretKeyFromText_orig(String text) {
        int startIndex = text.indexOf("secret=") + 7;
        int endIndex = text.indexOf("&issuer");
        if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
            return text.substring(startIndex, endIndex);
        } else {
            return null;
        }
    }


    public static String generateAuthenticationCode_3(String secretKey) {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("Secret key is null or empty.");
            return null;
        }

        try {
            Base32 base32 = new Base32();
            byte[] decodedKey = base32.decode(secretKey);

            if (decodedKey == null || decodedKey.length == 0) {
                System.err.println("Decoded key is null or empty.");
                return null;
            }

            // Generate the OTP
            String otp = TOTP.getOTP(Hex.encodeHexString(decodedKey));
            System.out.println("Generated OTP: " + otp); // Log the generated OTP for debugging
            System.out.println("Current Time: " + System.currentTimeMillis());

            return otp;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String generateAuthenticationCode_orig1(String secretKey) {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("Secret key is null or empty.");
            return null;
        }

        try {
            Base32 base32 = new Base32();
            byte[] decodedKey = base32.decode(secretKey);

            if (decodedKey == null || decodedKey.length == 0) {
                System.err.println("Decoded key is null or empty.");
                return null;
            }

            String hexKey = Hex.encodeHexString(decodedKey);
            return TOTP.getOTP(hexKey);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }



    public static String generateAuthenticationCode(String secretKey) {
        if (secretKey == null || secretKey.isEmpty()) {
            System.err.println("Secret key is null or empty.");
            return null;
        }

        try {
            Totp totp = new Totp(secretKey); // Initialize Totp with the secret key
            String otp = totp.now(); // Generate the current OTP based on the system time
            System.out.println("Generated OTP: " + otp); // Log the generated OTP for debugging
            return otp;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
