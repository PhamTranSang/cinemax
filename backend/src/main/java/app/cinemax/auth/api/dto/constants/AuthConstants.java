package app.cinemax.auth.api.dto.constants;

import lombok.experimental.UtilityClass;

@UtilityClass
public class AuthConstants {

    // CSP RULES
    private static final String DEFAULT_SRC = "default-src 'self';"; // Restrict unspecified resources to same origin
    private static final String SCRIPT_SRC = "script-src 'self';"; // Prevent loading untrusted external scripts
    private static final String STYLE_SRC = "style-src 'self' 'unsafe-inline';"; // Allow inline styles for UI compatibility
    private static final String IMG_SRC = "img-src 'self' data:;"; // Allow local and Base64-encoded images
    private static final String FONT_SRC = "font-src 'self' data:;"; // Restrict font sources
    private static final String CONNECT_SRC = "connect-src 'self';"; // Restrict API / WebSocket requests
    private static final String OBJECT_SRC = "object-src 'none';"; // Disable embedded plugin-based content
    private static final String FRAME_ANCESTORS = "frame-ancestors 'none';"; // Prevent iframe embedding (anti-clickjacking)
    public static final String CSP_RULE = String.join(" ",
        DEFAULT_SRC,
        SCRIPT_SRC,
        STYLE_SRC,
        IMG_SRC,
        FONT_SRC,
        CONNECT_SRC,
        OBJECT_SRC,
        FRAME_ANCESTORS
    );
}
