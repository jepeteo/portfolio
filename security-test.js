// Security Features Test Suite
// Run this in browser console to test security implementations

console.log("🛡️ Portfolio Security Test Suite");

// Test 1: CSRF Token Generation
console.log("\n1. Testing CSRF Token Generation...");
try {
    const { CSRFProtection } = await import('./src/utils/enhancedCSRF.ts');
    const token1 = CSRFProtection.getCurrentToken();
    const token2 = CSRFProtection.getCurrentToken();

    console.log("✅ CSRF Token 1:", token1.substring(0, 8) + "...");
    console.log("✅ CSRF Token 2:", token2.substring(0, 8) + "...");
    console.log("✅ Tokens are different:", token1 !== token2 ? "YES" : "NO");
} catch (error) {
    console.error("❌ CSRF Test Error:", error);
}

// Test 2: Rate Limiting
console.log("\n2. Testing Rate Limiting...");
try {
    const { checkContactFormLimit, recordContactFormAttempt } = await import('./src/utils/enhancedRateLimit.ts');

    // Test initial state
    const initialCheck = checkContactFormLimit('test-ip');
    console.log("✅ Initial rate limit check:", initialCheck);

    // Record multiple attempts
    for (let i = 0; i < 4; i++) {
        recordContactFormAttempt('test-ip');
        const check = checkContactFormLimit('test-ip');
        console.log(`✅ After attempt ${i + 1}:`, check);
    }
} catch (error) {
    console.error("❌ Rate Limiting Test Error:", error);
}

// Test 3: Input Sanitization
console.log("\n3. Testing Input Sanitization...");
try {
    const { sanitizeTextInput, sanitizeEmail } = await import('./src/utils/contactValidation.ts');

    const maliciousInput = "<script>alert('xss')</script>Hello World";
    const sanitized = sanitizeTextInput(maliciousInput);
    console.log("✅ Original:", maliciousInput);
    console.log("✅ Sanitized:", sanitized);

    const maliciousEmail = "test@example.com<script>alert('xss')</script>";
    const sanitizedEmail = sanitizeEmail(maliciousEmail);
    console.log("✅ Original Email:", maliciousEmail);
    console.log("✅ Sanitized Email:", sanitizedEmail);
} catch (error) {
    console.error("❌ Sanitization Test Error:", error);
}

// Test 4: Bot Detection
console.log("\n4. Testing Bot Detection...");
try {
    const { detectBot } = await import('./src/utils/secureContactValidation.ts');

    // Test normal submission
    const normalSubmission = {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test",
        message: "Hello",
        csrfToken: "valid-token",
        timestamp: Date.now(),
        honeypot: "", // Empty honeypot = good
    };

    const normalResult = detectBot(normalSubmission);
    console.log("✅ Normal submission bot check:", normalResult);

    // Test bot submission (filled honeypot)
    const botSubmission = {
        ...normalSubmission,
        honeypot: "spam-content", // Filled honeypot = bot
    };

    const botResult = detectBot(botSubmission);
    console.log("✅ Bot submission check:", botResult);

} catch (error) {
    console.error("❌ Bot Detection Test Error:", error);
}

// Test 5: Security Headers Check
console.log("\n5. Testing Security Headers...");
try {
    const { getAllSecurityHeaders } = await import('./src/utils/security.ts');
    const headers = getAllSecurityHeaders();
    console.log("✅ Security Headers:", Object.keys(headers));
    console.log("✅ CSP Header:", headers['Content-Security-Policy']?.substring(0, 50) + "...");
} catch (error) {
    console.error("❌ Security Headers Test Error:", error);
}

console.log("\n🎉 Security Test Suite Complete!");
console.log("Check the results above to verify all security features are working.");
