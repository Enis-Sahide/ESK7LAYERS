package com.enissahide.esk7layers

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import java.util.Calendar
import kotlin.math.cos
import kotlin.math.roundToInt

object CosmicWidgetHelper {
    const val ACTION_REFRESH_WIDGETS = "com.enissahide.esk7layers.ACTION_REFRESH_WIDGETS"

    val CHALDEAN_ORDER = arrayOf(
        "Satürn ♄",
        "Jüpiter ♃",
        "Mars ♂",
        "Güneş ☉",
        "Venüs ♀",
        "Merkür ☿",
        "Ay ☽"
    )

    val PLANET_SYMBOLS = arrayOf("♄", "♃", "♂", "☉", "♀", "☿", "☽")

    val PLANET_HOUR_MEANINGS = arrayOf(
        "Derin tefekkür, sabır, disiplin, karmik arınma ve uzun vadeli yapılandırma saati.",
        "Bolluk, bereket, finansal adımlar, eğitim, bilgelik ve manevi genişleme saati.",
        "Cesaret, fiziksel güç, irade, kararlılık ve ertelenen işleri hızla başlatma saati.",
        "Liderlik, yaşam enerjisi, görünürlük, başarı, otorite ve öz-değer aktivasyonu saati.",
        "Sevgi, uyum, sanat, estetik, barışma ve sosyal ilişkileri güçlendirme saati.",
        "İletişim, anlaşmalar, yazı, araştırma, sembolizm ve zihinsel odaklanma saati.",
        "Sezgi, rüya çalışmaları, duygusal şifa, içe dönüş ve ruhsal farkındalık saati."
    )

    val DAY_RULER_START_INDEX = mapOf(
        Calendar.SUNDAY to 3,    // Güneş
        Calendar.MONDAY to 6,    // Ay
        Calendar.TUESDAY to 2,   // Mars
        Calendar.WEDNESDAY to 5, // Merkür
        Calendar.THURSDAY to 1,  // Jüpiter
        Calendar.FRIDAY to 4,    // Venüs
        Calendar.SATURDAY to 0   // Satürn
    )

    data class DayCosmicInfo(
        val symbol: String,
        val headerTitle: String,
        val chakraBadge: String,
        val chakraTitle: String,
        val affirmation: String,
        val doText: String,
        val avoidText: String
    )

    data class MoonInfo(
        val icon: String,
        val name: String,
        val illumination: Int,
        val sub: String
    )

    fun getDayCosmicInfo(dayOfWeek: Int): DayCosmicInfo {
        return when (dayOfWeek) {
            Calendar.SUNDAY -> DayCosmicInfo(
                "☉",
                "Pazar • Güneş Günü • Solar Pleksus (528 Hz)",
                "GÜNÜN ÇAKRASI • 528 HZ",
                "3. Katman: Solar Pleksus (Manipura)",
                "\"İçimdeki ilahi güneş parlıyor; irademi bilgelik, özgüven ve sevgiyle kullanıyorum.\"",
                "✓ Önerilen: Öz-değer, liderlik, niyet çalışmaları ve yaşam enerjisini yükseltmek",
                "✗ Kaçının: Kibir, ego çatışmaları ve enerjinizi tüketen gereksiz güç savaşları"
            )
            Calendar.MONDAY -> DayCosmicInfo(
                "☽",
                "Pazartesi • Ay Günü • Kalp Çakrası (639 Hz)",
                "GÜNÜN ÇAKRASI • 639 HZ",
                "4. Katman: Kalp Çakrası (Anahata)",
                "\"Sevgi en yüksek frekanstır; kalbimi evrenin şefkatine ve içsel rehberliğe açıyorum.\"",
                "✓ Önerilen: Sezgisel çalışmalar, rüya analizi, şefkat ve duygusal dengeleme",
                "✗ Kaçının: Duygusal alınganlık, geçmişe takılı kalma ve kararsızlık dalgaları"
            )
            Calendar.TUESDAY -> DayCosmicInfo(
                "♂",
                "Salı • Mars Günü • Kök Çakra (396 Hz)",
                "GÜNÜN ÇAKRASI • 396 HZ",
                "1. Katman: Kök Çakra (Muladhara)",
                "\"Yaşamın sarsılmaz kökleriyle güvendeyim; toprağın gücü ve cesareti her hücremde akıyor.\"",
                "✓ Önerilen: Cesaret, fiziksel dayanıklılık, sınır koyma ve ertelediğiniz adımlar",
                "✗ Kaçının: Ani öfke, aceleci tartışma ve dürtüsel çatışmalar"
            )
            Calendar.WEDNESDAY -> DayCosmicInfo(
                "☿",
                "Çarşamba • Merkür Günü • Boğaz Çakrası (741 Hz)",
                "GÜNÜN ÇAKRASI • 741 HZ",
                "5. Katman: Boğaz Çakrası (Vishuddha)",
                "\"Hakikatimi berraklıkla, bilgelikle ve yüksek farkındalıkla ifade ediyorum.\"",
                "✓ Önerilen: Ezoterik okuma, araştırma, iletişim, yazı ve nefes çalışmaları",
                "✗ Kaçının: Dedikodu, zihinsel dağınıklık ve yüzeysel tartışmalar"
            )
            Calendar.THURSDAY -> DayCosmicInfo(
                "♃",
                "Perşembe • Jüpiter Günü • Üçüncü Göz (852 Hz)",
                "GÜNÜN ÇAKRASI • 852 HZ",
                "6. Katman: Üçüncü Göz (Ajna)",
                "\"Görünenin ötesindeki kadim bilgeliği ve evrensel düzeni berraklıkla görüyorum.\"",
                "✓ Önerilen: Yüksek öğretiler, vizyon çalışmaları, şükür ve bolluk bilinci",
                "✗ Kaçının: Aşırılık, abartı ve detayları gözden kaçıran savrukluk"
            )
            Calendar.FRIDAY -> DayCosmicInfo(
                "♀",
                "Cuma • Venüs Günü • Sakral Çakra (417 Hz)",
                "GÜNÜN ÇAKRASI • 417 HZ",
                "2. Katman: Sakral Çakra (Svadhisthana)",
                "\"Yaratıcı yaşam enerjisiyle uyum içindeyim; güzelliği ve uyumu hayatıma çekiyorum.\"",
                "✓ Önerilen: Sanat, uyum, sevgi frekansı, estetik ve yaratıcı üretim",
                "✗ Kaçının: Tembellik, bağımlılıklar ve duygusal manipülasyonlar"
            )
            else -> DayCosmicInfo(
                "♄",
                "Cumartesi • Satürn Günü • Taç Çakra (963 Hz)",
                "GÜNÜN ÇAKRASI • 963 HZ",
                "7. Katman: Taç Çakra (Sahasrara)",
                "\"Zamanın ve mekanın ötesindeki Tek'likle bir ve bütünüm; ilahi düzene güveniyorum.\"",
                "✓ Önerilen: Derin meditasyon, tefekkür, sadeleşme ve karmik arınma",
                "✗ Kaçının: Karamsarlık, katı yargılar ve korku odaklı direnç"
            )
        }
    }

    fun getMoonInfo(nowMillis: Long): MoonInfo {
        val synodicMonth = 29.53058867
        val knownNewMoonMillis = 947182440000L // 2000-01-06 18:14 UTC
        val diffDays = (nowMillis - knownNewMoonMillis).toDouble() / (1000.0 * 60.0 * 60.0 * 24.0)
        val phaseRatio = (((diffDays % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth
        val illumination = ((1.0 - cos(phaseRatio * 2.0 * Math.PI)) * 50.0).roundToInt()

        return when {
            phaseRatio < 0.04 || phaseRatio > 0.96 -> MoonInfo("🌑", "Yeni Ay", illumination, "Yeni niyet ve tohum evresi")
            phaseRatio < 0.22 -> MoonInfo("🌒", "Büyüyen Hilal", illumination, "Adım atma ve ivme enerjisi")
            phaseRatio < 0.28 -> MoonInfo("🌓", "İlk Dördün", illumination, "İrade ve kararlılık fazı")
            phaseRatio < 0.46 -> MoonInfo("🌔", "Büyüyen Şişkin", illumination, "Olgunlaştırma ve hazırlık")
            phaseRatio < 0.54 -> MoonInfo("🌕", "Dolunay Fazı", illumination, "Tamamlanma ve aydınlanma")
            phaseRatio < 0.72 -> MoonInfo("🌖", "Küçülen Şişkin", illumination, "İçgörü, paylaşım ve şükür")
            phaseRatio < 0.78 -> MoonInfo("🌗", "Son Dördün", illumination, "Arınma ve sadeleşme fazı")
            else -> MoonInfo("🌘", "Balsamik Ay", illumination, "Tefekkür ve ruhsal dinlenme")
        }
    }

    fun getChaldeanHourIndex(cal: Calendar): Int {
        val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
        val hourOfDay = cal.get(Calendar.HOUR_OF_DAY)
        val effectiveDay = if (hourOfDay < 6) {
            if (dayOfWeek == Calendar.SUNDAY) Calendar.SATURDAY else dayOfWeek - 1
        } else {
            dayOfWeek
        }
        val hoursSinceSunrise = if (hourOfDay >= 6) hourOfDay - 6 else (hourOfDay + 18)
        val startIdx = DAY_RULER_START_INDEX[effectiveDay] ?: 3
        return (startIdx + hoursSinceSunrise) % 7
    }

    fun getLaunchPendingIntent(context: Context): PendingIntent {
        val launchIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        return PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    fun getRefreshPendingIntent(context: Context, providerClass: Class<*>): PendingIntent {
        val refreshIntent = Intent(context, providerClass).apply {
            action = ACTION_REFRESH_WIDGETS
        }
        return PendingIntent.getBroadcast(
            context,
            providerClass.name.hashCode(),
            refreshIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }
}

class CosmicWidgetProvider : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_REFRESH_WIDGETS) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, CosmicWidgetProvider::class.java))
            onUpdate(context, mgr, ids)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateCosmicWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        fun updateCosmicWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val cal = Calendar.getInstance()
            val dayInfo = CosmicWidgetHelper.getDayCosmicInfo(cal.get(Calendar.DAY_OF_WEEK))
            val moonInfo = CosmicWidgetHelper.getMoonInfo(cal.timeInMillis)
            val currentIdx = CosmicWidgetHelper.getChaldeanHourIndex(cal)
            val nextIdx = (currentIdx + 1) % 7
            val minsLeft = (60 - cal.get(Calendar.MINUTE)).coerceIn(1, 60)

            val views = RemoteViews(context.packageName, R.layout.cosmic_widget)
            views.setTextViewText(R.id.widget_symbol, dayInfo.symbol)
            views.setTextViewText(R.id.widget_title, dayInfo.headerTitle)
            views.setTextViewText(
                R.id.widget_hour_pill,
                "${CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx]} ($minsLeft dk)"
            )
            views.setTextViewText(
                R.id.widget_next_hour,
                "Sıradaki: ${CosmicWidgetHelper.CHALDEAN_ORDER[nextIdx]}"
            )
            views.setTextViewText(
                R.id.widget_moon_title,
                "${moonInfo.icon} ${moonInfo.name} (%${moonInfo.illumination})"
            )
            views.setTextViewText(R.id.widget_moon_sub, moonInfo.sub)
            views.setTextViewText(R.id.widget_guidance, dayInfo.doText)
            views.setTextViewText(R.id.widget_avoid, dayInfo.avoidText)

            views.setOnClickPendingIntent(
                R.id.widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            views.setOnClickPendingIntent(
                R.id.widget_refresh_btn,
                CosmicWidgetHelper.getRefreshPendingIntent(context, CosmicWidgetProvider::class.java)
            )

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

class PlanetaryHoursWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val cal = Calendar.getInstance()
        val currentIdx = CosmicWidgetHelper.getChaldeanHourIndex(cal)
        val minsLeft = (60 - cal.get(Calendar.MINUTE)).coerceIn(1, 60)
        val currentHour = cal.get(Calendar.HOUR_OF_DAY)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.planetary_hours_widget)
            views.setTextViewText(R.id.ph_symbol, CosmicWidgetHelper.PLANET_SYMBOLS[currentIdx])
            views.setTextViewText(
                R.id.ph_current_name,
                "${CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx]} Saati Aktif"
            )
            views.setTextViewText(R.id.ph_mins_left, "$minsLeft dk kaldı")
            views.setTextViewText(R.id.ph_meaning, CosmicWidgetHelper.PLANET_HOUR_MEANINGS[currentIdx])

            val h1 = (currentHour + 1) % 24
            val h2 = (currentHour + 2) % 24
            val h3 = (currentHour + 3) % 24
            views.setTextViewText(R.id.ph_next1_time, String.format("%02d:00", h1))
            views.setTextViewText(R.id.ph_next1_name, CosmicWidgetHelper.CHALDEAN_ORDER[(currentIdx + 1) % 7])
            views.setTextViewText(R.id.ph_next2_time, String.format("%02d:00", h2))
            views.setTextViewText(R.id.ph_next2_name, CosmicWidgetHelper.CHALDEAN_ORDER[(currentIdx + 2) % 7])
            views.setTextViewText(R.id.ph_next3_time, String.format("%02d:00", h3))
            views.setTextViewText(R.id.ph_next3_name, CosmicWidgetHelper.CHALDEAN_ORDER[(currentIdx + 3) % 7])

            views.setOnClickPendingIntent(
                R.id.ph_widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}

class ChakraMoonWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val cal = Calendar.getInstance()
        val dayInfo = CosmicWidgetHelper.getDayCosmicInfo(cal.get(Calendar.DAY_OF_WEEK))
        val moonInfo = CosmicWidgetHelper.getMoonInfo(cal.timeInMillis)

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.chakra_moon_widget)
            views.setTextViewText(R.id.cm_moon_icon, moonInfo.icon)
            views.setTextViewText(R.id.cm_chakra_badge, dayInfo.chakraBadge)
            views.setTextViewText(R.id.cm_chakra_title, dayInfo.chakraTitle)
            views.setTextViewText(R.id.cm_moon_pill, "%${moonInfo.illumination} Aydınlık")
            views.setTextViewText(R.id.cm_affirmation, dayInfo.affirmation)
            views.setTextViewText(
                R.id.cm_moon_desc,
                "${moonInfo.icon} ${moonInfo.name}: ${moonInfo.sub}"
            )

            views.setOnClickPendingIntent(
                R.id.cm_widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
