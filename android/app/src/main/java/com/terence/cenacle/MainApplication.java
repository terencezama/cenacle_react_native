package com.terence.cenacle;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Application;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;

import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.guichaguri.trackplayer.TrackPlayer;

import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.realm.react.RealmReactPackage;

import com.rnfs.RNFSPackage;

import io.invertase.firebase.RNFirebasePackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.terence.cenacle.BuildConfig;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @SuppressLint("MissingPermission")
    @Override
    protected List<ReactPackage> getPackages() {

      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new TrackPlayer(),
              new RealmReactPackage(),
              new RNFSPackage(),
              new RNFirebasePackage(),
              new RNFirebaseAnalyticsPackage(),
              new RNFirebaseAuthPackage(),
              new RNFirebaseFirestorePackage(),
              new RNFirebaseStoragePackage(),
              new RNFirebaseNotificationsPackage(),
              new VectorIconsPackage(),
              new RNLanguagesPackage(),
              new RNGestureHandlerPackage(),
              new ReactVideoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
