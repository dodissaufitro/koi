package com.tentengan.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            WebView webView = getBridge() != null ? getBridge().getWebView() : null;
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setSupportMultipleWindows(true);

                // Modifikasi user-agent agar Google OAuth tidak memblokir WebView (menghindari error 403 disallowed_useragent)
                String userAgent = settings.getUserAgentString();
                if (userAgent != null && userAgent.contains("; wv")) {
                    settings.setUserAgentString(userAgent.replace("; wv", ""));
                }

                webView.setLayerType(WebView.LAYER_TYPE_HARDWARE, null);
            }
        } catch (Exception ignored) {
        }
    }
}
