package utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import utils.Constants;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.Result;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeReader;

import org.apache.commons.codec.binary.Base32;
import org.apache.commons.codec.binary.Hex;

import de.taimos.totp.TOTP;

public class QRCodeScanner {

    public static void main(String[] args) {
        String imagePath = "src/main/resources/QrCode/ColeTrickleQrCode.png";
        Constants.secretKey = extractSecretKeyFromQRCode(imagePath);
        //System.out.println("Extracted Secret Key: " + Constant.secretKey);

        if (Constants.secretKey != null) {
            String code = generateAuthenticationCode(Constants.secretKey);
             System.out.println("Generated Code: " + code);
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
            //System.out.println("Extracted BarCode Key: " + text);

            // Parse the extracted text to obtain the secret key
            String secretKey = parseSecretKeyFromText(text);

            return secretKey;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static String parseSecretKeyFromText(String text) {
        // Implement your logic to parse the secret key from the extracted text
        // The format of the text may vary, so you'll need to determine how to extract the key
        // This can involve string manipulation or applying regular expressions

        // Example: Assume the secret key is a substring between "secret=" and "&issuer"
        int startIndex = text.indexOf("secret=") + 7;
        int endIndex = text.indexOf("&issuer");
        if (startIndex >= 0 && endIndex >= 0 && endIndex > startIndex) {
            return text.substring(startIndex, endIndex);
        } else {
            // Return null if the secret key cannot be parsed
            return null;
        }
    }

    public static String generateAuthenticationCode(String secretKey) {
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
            //System.out.println("Generated OTP: " + otp);
            return otp;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}

// Steps to setup Google authenticator as the MFA Code for the test account
// 1. Set up the test account for an authentication method, using a different app
// 2. Click Next until you get to the QR Code prompt
// 3. Save the QR Code as an image
// 4. Save the QR Code image in the test automation suite in this location: src/test/resources/ObjectRepository/
// 5. Run this script
// 6. Google authenticator app should be installed in your mobile app
// 7. Scan the QR code on the prompt you had opened when you save it as an image
// 8. Check that the Code generated from this script and and the mobile app are the same
// 9. Continue completing the authentication step by entering the code generated here
