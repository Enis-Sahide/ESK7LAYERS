package com.enissahide.esk7layers

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.uimanager.ViewManager

class CosmicWidgetModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "CosmicWidgetModule"

    @ReactMethod
    fun saveBirthProfile(
        birthDate: String,
        birthTime: String,
        zodiacSign: String,
        element: String,
        rulingPlanet: String,
        lifePath: Int,
        chartMode: String,
        soulZodiacSign: String,
        soulElement: String,
        soulRulingPlanet: String,
        promise: Promise
    ) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences(
                CosmicWidgetHelper.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            prefs.edit()
                .putString("birthDate", birthDate.trim())
                .putString("birthTime", birthTime.trim())
                .putString("zodiacSign", zodiacSign.trim())
                .putString("element", element.trim())
                .putString("rulingPlanet", rulingPlanet.trim())
                .putInt("lifePath", lifePath)
                .putString("chartMode", chartMode.trim().ifEmpty { "soul" })
                .putString("soulZodiacSign", soulZodiacSign.trim())
                .putString("soulElement", soulElement.trim())
                .putString("soulRulingPlanet", soulRulingPlanet.trim())
                .apply()

            CosmicWidgetHelper.refreshAllWidgets(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_SAVE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun clearBirthProfile(promise: Promise) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences(
                CosmicWidgetHelper.PREFS_NAME,
                Context.MODE_PRIVATE
            )
            prefs.edit().clear().apply()
            CosmicWidgetHelper.refreshAllWidgets(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("WIDGET_CLEAR_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun pinWidgetToHomeScreen(widgetType: String, promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
                promise.resolve(false)
                return
            }
            val appWidgetManager = AppWidgetManager.getInstance(reactApplicationContext)
            if (!appWidgetManager.isRequestPinAppWidgetSupported) {
                promise.resolve(false)
                return
            }
            val providerClass = when (widgetType.lowercase()) {
                "mini" -> MiniCosmicWidgetProvider::class.java
                "schumann" -> SchumannWidgetProvider::class.java
                "planetary" -> PlanetaryHoursWidgetProvider::class.java
                "chakra" -> ChakraMoonWidgetProvider::class.java
                else -> CosmicWidgetProvider::class.java
            }
            val provider = ComponentName(reactApplicationContext, providerClass)
            val requested = appWidgetManager.requestPinAppWidget(provider, null, null)
            CosmicWidgetHelper.refreshAllWidgets(reactApplicationContext)
            promise.resolve(requested)
        } catch (e: Exception) {
            promise.reject("WIDGET_PIN_ERROR", e.message, e)
        }
    }
}

class CosmicWidgetPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(CosmicWidgetModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
