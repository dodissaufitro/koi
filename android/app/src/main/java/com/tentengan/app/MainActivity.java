package com.tentengan.app;

import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.activity.OnBackPressedCallback;
import androidx.webkit.WebSettingsCompat;
import androidx.webkit.WebViewFeature;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import java.util.Collections;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    private static final int RC_SIGN_IN = 9001;
    private GoogleSignInClient googleSignInClient;
    private boolean usingTokenRequest = true;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            // Mencegah aplikasi langsung keluar saat tombol Back Android ditekan
            getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
                @Override
                public void handleOnBackPressed() {
                    WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                    if (webView != null) {
                        webView.evaluateJavascript("if (window.__handleAndroidBack) { window.__handleAndroidBack(); } else { window.history.back(); }", null);
                    } else {
                        setEnabled(false);
                        getOnBackPressedDispatcher().onBackPressed();
                        setEnabled(true);
                    }
                }
            });
        } catch (Exception ignored) {
        }

        try {
            WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setSupportMultipleWindows(true);

                // 1. Set clean Chrome Mobile User-Agent
                settings.setUserAgentString("Mozilla/5.0 (Linux; Android 14; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36");

                // 2. Disable X-Requested-With header to prevent Google from detecting WebView
                if (WebViewFeature.isFeatureSupported(WebViewFeature.REQUESTED_WITH_HEADER_ALLOW_LIST)) {
                    WebSettingsCompat.setRequestedWithHeaderOriginAllowList(settings, Collections.emptySet());
                }

                webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);

                // 3. Register Native Google Sign-In Javascript Bridge
                webView.addJavascriptInterface(new AndroidGoogleBridge(), "AndroidGoogleBridge");
            }
        } catch (Exception ignored) {
        }
    }

    private GoogleSignInClient buildGoogleSignInClient(boolean includeToken) {
        GoogleSignInOptions.Builder gsoBuilder = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestProfile();

        if (includeToken) {
            try {
                String serverClientId = getString(R.string.server_client_id);
                if (serverClientId != null && !serverClientId.trim().isEmpty()) {
                    gsoBuilder.requestIdToken(serverClientId);
                }
            } catch (Exception ignored) {
            }
        }

        return GoogleSignIn.getClient(this, gsoBuilder.build());
    }

    public void startNativeGoogleSignIn(boolean requestToken) {
        this.usingTokenRequest = requestToken;
        try {
            this.googleSignInClient = buildGoogleSignInClient(requestToken);
            // Sign out prior session to ensure the Android account picker dialog always pops up
            this.googleSignInClient.signOut().addOnCompleteListener(this, task -> {
                Intent signInIntent = googleSignInClient.getSignInIntent();
                startActivityForResult(signInIntent, RC_SIGN_IN);
            });
        } catch (Exception e) {
            sendErrorToWebView("Gagal membuka Google Sign In: " + e.getMessage());
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == RC_SIGN_IN) {
            Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
            try {
                GoogleSignInAccount account = task.getResult(ApiException.class);
                if (account != null) {
                    JSONObject userJson = new JSONObject();
                    userJson.put("id", account.getId() != null ? account.getId() : "");
                    userJson.put("email", account.getEmail() != null ? account.getEmail() : "");
                    userJson.put("name", account.getDisplayName() != null ? account.getDisplayName() : "");
                    userJson.put("avatar", account.getPhotoUrl() != null ? account.getPhotoUrl().toString() : "");
                    userJson.put("idToken", account.getIdToken() != null ? account.getIdToken() : "");

                    sendSuccessToWebView(userJson.toString());
                } else {
                    sendErrorToWebView("Akun Google tidak dapat dibaca.");
                }
            } catch (ApiException e) {
                int statusCode = e.getStatusCode();
                // 12501: User cancelled the dialog
                if (statusCode == 12501) {
                    sendCancelToWebView();
                    return;
                }

                // If developer error (status 10) occurs due to requestIdToken misconfiguration, retry without requestIdToken
                if (statusCode == 10 && this.usingTokenRequest) {
                    runOnUiThread(() -> startNativeGoogleSignIn(false));
                    return;
                }

                sendErrorToWebView("Login Google gagal (kode: " + statusCode + ")", statusCode);
            } catch (Exception e) {
                sendErrorToWebView("Terjadi kesalahan sistem: " + e.getMessage(), -1);
            }
        }
    }

    private void sendSuccessToWebView(String jsonString) {
        runOnUiThread(() -> {
            try {
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView != null) {
                    String js = "if (window.__onNativeGoogleSignInSuccess) { window.__onNativeGoogleSignInSuccess(" + jsonString + "); }";
                    webView.evaluateJavascript(js, null);
                }
            } catch (Exception ignored) {
            }
        });
    }

    private void sendErrorToWebView(String message) {
        sendErrorToWebView(message, -1);
    }

    private void sendErrorToWebView(String message, int code) {
        runOnUiThread(() -> {
            try {
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView != null) {
                    JSONObject err = new JSONObject();
                    err.put("message", message);
                    err.put("code", code);
                    String js = "if (window.__onNativeGoogleSignInError) { window.__onNativeGoogleSignInError(" + err.toString() + "); }";
                    webView.evaluateJavascript(js, null);
                }
            } catch (Exception ignored) {
            }
        });
    }

    private void sendCancelToWebView() {
        runOnUiThread(() -> {
            try {
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView != null) {
                    String js = "if (window.__onNativeGoogleSignInCancel) { window.__onNativeGoogleSignInCancel(); }";
                    webView.evaluateJavascript(js, null);
                }
            } catch (Exception ignored) {
            }
        });
    }

    @Override
    public void onBackPressed() {
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.evaluateJavascript("if (window.__handleAndroidBack) { window.__handleAndroidBack(); } else { window.history.back(); }", null);
        } else {
            super.onBackPressed();
        }
    }

    public class AndroidGoogleBridge {
        @JavascriptInterface
        public void signIn() {
            runOnUiThread(() -> startNativeGoogleSignIn(true));
        }

        @JavascriptInterface
        public void signOut() {
            runOnUiThread(() -> {
                try {
                    if (googleSignInClient != null) {
                        googleSignInClient.signOut();
                    }
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(() -> finish());
        }

        @JavascriptInterface
        public boolean isAvailable() {
            return true;
        }
    }
}
