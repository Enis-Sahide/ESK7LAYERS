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
    const val PREFS_NAME = "CosmicWidgetPrefs"

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
        val headerBadge: String,
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

    val ZODIAC_SIGNS = arrayOf(
        "Koç", "Boğa", "İkizler", "Yengeç", "Aslan", "Başak",
        "Terazi", "Akrep", "Yay", "Oğlak", "Kova", "Balık"
    )

    val ZODIAC_SYMBOLS = arrayOf(
        "♈", "♉", "♊", "♋", "♌", "♍",
        "♎", "♏", "♐", "♑", "♒", "♓"
    )

    data class TransitAspectTheme(
        val aspectName: String,
        val shortTag: String,
        val bodyDo: String,
        val bodyAvoid: String,
        val soulDo: String,
        val soulAvoid: String
    )

    fun getTransitMoonSignIndex(nowMillis: Long): Int {
        val jd = nowMillis.toDouble() / 86400000.0 + 2440587.5
        val t = (jd - 2451545.0) / 36525.0
        val degToRad = Math.PI / 180.0

        val lPrime = 218.3164477 + 481267.88123421 * t
        val d = (297.8501921 + 445267.1114034 * t) * degToRad
        val m = (357.5291092 + 35999.0502909 * t) * degToRad
        val mPrime = (134.9633964 + 477198.8675055 * t) * degToRad
        val f = (93.2720950 + 483202.0175233 * t) * degToRad

        val lon = lPrime +
            6.288774 * kotlin.math.sin(mPrime) +
            1.274027 * kotlin.math.sin(2.0 * d - mPrime) +
            0.658314 * kotlin.math.sin(2.0 * d) +
            0.213618 * kotlin.math.sin(2.0 * mPrime) -
            0.185116 * kotlin.math.sin(m) -
            0.114332 * kotlin.math.sin(2.0 * f)

        val normLon = ((lon % 360.0) + 360.0) % 360.0
        return (normLon / 30.0).toInt().coerceIn(0, 11)
    }

    private fun getSignIndexByName(signName: String): Int {
        val clean = signName.trim()
        val idx = ZODIAC_SIGNS.indexOfFirst { it.equals(clean, ignoreCase = true) }
        return if (idx >= 0) idx else 0
    }

    private fun getAspectThemeForSignDiff(diff: Int): TransitAspectTheme {
        return when (((diff % 12) + 12) % 12) {
            0 -> TransitAspectTheme(
                "Kavuşum",
                "ÖZ HİZALANMA",
                "Kişisel inisiyatif alma, duygusal yenilenme ve özgüvenle adım atma",
                "Aşırı hassasiyet, benmerkezcilik ve sabırsız kararlar",
                "Doğrudan öz-merkezinize akan yüksek sezgi, güçlü niyet koyma ve ruhsal uyanış",
                "Duygusal taşkınlık, subjektif tepkisellik ve bedenin ani dürtülerine kapılma"
            )
            4, 8 -> TransitAspectTheme(
                "Üçgen Açı",
                "ÜÇGEN AKIŞ",
                "Yaratıcı üretim, uyumlu iletişim, şifa çalışmaları ve akışta ilerleme",
                "Tembellik, rehavet ve enerjinin kendiliğinden akacağına fazla güvenme",
                "Element uyumuyla zahmetsiz ilham akışı, kalp-zihin dengesi ve yüksek tezahür",
                "Konfor alanında rehavete kapılma ve gelen ruhsal fırsatları erteleme"
            )
            2, 10 -> TransitAspectTheme(
                "Sekstil Açı",
                "UYUMLU KAPI",
                "Yeni bağlantılar kurma, öğrenme, araştırma ve somut işbirliği adımları",
                "Aynı anda çok işe bölünme, kararsızlık ve odak kaybı",
                "Boğaz ve üçüncü göz çakrasından berrak idrak, eşzamanlılıkları okuma ve paylaşım",
                "Zihinsel dağınıklık, yüzeysel konuşmalar ve dikkati dış gürültüye dağıtma"
            )
            3, 9 -> TransitAspectTheme(
                "Kare Açı",
                "SİMYASAL SINAV",
                "Sabırlı hareket etme, yarım kalan zorlu işleri disiplinle çözme ve köklenme",
                "Aceleci tartışmalar, duygusal gerilim ve dürtüsel güç savaşları",
                "İçsel sürtünmeyi farkındalığa dönüştürme, nefesle merkezlenme ve nefs terbiyesi",
                "Beden otomatizminin öfke, alınganlık, inatlaşma ve savunmacı ego tepkisi"
            )
            6 -> TransitAspectTheme(
                "Karşıt Açı",
                "AYNA DENGE",
                "Empati, diplomasi, uzlaşma ve karşıt bakış açılarını dengede buluşturma",
                "İkili ilişkilerde gerilim, alınganlık ve uçlarda gezinme",
                "İlişkilerde ayna yasasını okuma, dualiteyi kalp merkezinde birleştirme",
                "Gölgeyi karşı tarafa yansıtma (projeksiyon), onay bekleme veya kutuplaşma"
            )
            else -> TransitAspectTheme(
                "İnce Ayar",
                "İÇSEL ARINMA",
                "Detayları düzenleme, bedensel dinlenme, detoks ve zihinsel sadeleşme",
                "Gereksiz evham, mükemmeliyetçi stres ve enerjiyi tüketen kuruntular",
                "İçe dönüş, tefekkür, enerji alanını sadeleştirme ve sessiz sezgisel hazırlık",
                "Belirsizlikten huzursuz olma, aşırı zihinsel kurgu ve zorlama kontrol çabası"
            )
        }
    }

    fun getDayCosmicInfo(context: Context, cal: Calendar): DayCosmicInfo {
        val dayOfWeek = cal.get(Calendar.DAY_OF_WEEK)
        val base = when (dayOfWeek) {
            Calendar.SUNDAY -> DayCosmicInfo(
                "☉",
                "7LAYERS • KOZMİK PUSULA",
                "Pazar • Güneş Günü • Solar Pleksus (528 Hz)",
                "GÜNÜN ÇAKRASI • 528 HZ",
                "3. Katman: Solar Pleksus (Manipura)",
                "\"İçimdeki ilahi güneş parlıyor; irademi bilgelik, özgüven ve sevgiyle kullanıyorum.\"",
                "✓ Önerilen: Öz-değer, liderlik, niyet çalışmaları ve yaşam enerjisini yükseltmek",
                "✗ Kaçının: Kibir, ego çatışmaları ve enerjinizi tüketen gereksiz güç savaşları"
            )
            Calendar.MONDAY -> DayCosmicInfo(
                "☽",
                "7LAYERS • KOZMİK PUSULA",
                "Pazartesi • Ay Günü • Kalp Çakrası (639 Hz)",
                "GÜNÜN ÇAKRASI • 639 HZ",
                "4. Katman: Kalp Çakrası (Anahata)",
                "\"Sevgi en yüksek frekanstır; kalbimi evrenin şefkatine ve içsel rehberliğe açıyorum.\"",
                "✓ Önerilen: Sezgisel çalışmalar, rüya analizi, şefkat ve duygusal dengeleme",
                "✗ Kaçının: Duygusal alınganlık, geçmişe takılı kalma ve kararsızlık dalgaları"
            )
            Calendar.TUESDAY -> DayCosmicInfo(
                "♂",
                "7LAYERS • KOZMİK PUSULA",
                "Salı • Mars Günü • Kök Çakra (396 Hz)",
                "GÜNÜN ÇAKRASI • 396 HZ",
                "1. Katman: Kök Çakra (Muladhara)",
                "\"Yaşamın sarsılmaz kökleriyle güvendeyim; toprağın gücü ve cesareti her hücremde akıyor.\"",
                "✓ Önerilen: Cesaret, fiziksel dayanıklılık, sınır koyma ve ertelediğiniz adımlar",
                "✗ Kaçının: Ani öfke, aceleci tartışma ve dürtüsel çatışmalar"
            )
            Calendar.WEDNESDAY -> DayCosmicInfo(
                "☿",
                "7LAYERS • KOZMİK PUSULA",
                "Çarşamba • Merkür Günü • Boğaz Çakrası (741 Hz)",
                "GÜNÜN ÇAKRASI • 741 HZ",
                "5. Katman: Boğaz Çakrası (Vishuddha)",
                "\"Hakikatimi berraklıkla, bilgelikle ve yüksek farkındalıkla ifade ediyorum.\"",
                "✓ Önerilen: Ezoterik okuma, araştırma, iletişim, yazı ve nefes çalışmaları",
                "✗ Kaçının: Dedikodu, zihinsel dağınıklık ve yüzeysel tartışmalar"
            )
            Calendar.THURSDAY -> DayCosmicInfo(
                "♃",
                "7LAYERS • KOZMİK PUSULA",
                "Perşembe • Jüpiter Günü • Üçüncü Göz (852 Hz)",
                "GÜNÜN ÇAKRASI • 852 HZ",
                "6. Katman: Üçüncü Göz (Ajna)",
                "\"Görünenin ötesindeki kadim bilgeliği ve evrensel düzeni berraklıkla görüyorum.\"",
                "✓ Önerilen: Yüksek öğretiler, vizyon çalışmaları, şükür ve bolluk bilinci",
                "✗ Kaçının: Aşırılık, abartı ve detayları gözden kaçıran savrukluk"
            )
            Calendar.FRIDAY -> DayCosmicInfo(
                "♀",
                "7LAYERS • KOZMİK PUSULA",
                "Cuma • Venüs Günü • Sakral Çakra (417 Hz)",
                "GÜNÜN ÇAKRASI • 417 HZ",
                "2. Katman: Sakral Çakra (Svadhisthana)",
                "\"Yaratıcı yaşam enerjisiyle uyum içindeyim; güzelliği ve uyumu hayatıma çekiyorum.\"",
                "✓ Önerilen: Sanat, uyum, sevgi frekansı, estetik ve yaratıcı üretim",
                "✗ Kaçının: Tembellik, bağımlılıklar ve duygusal manipülasyonlar"
            )
            else -> DayCosmicInfo(
                "♄",
                "7LAYERS • KOZMİK PUSULA",
                "Cumartesi • Satürn Günü • Taç Çakra (963 Hz)",
                "GÜNÜN ÇAKRASI • 963 HZ",
                "7. Katman: Taç Çakra (Sahasrara)",
                "\"Zamanın ve mekanın ötesindeki Tek'likle bir ve bütünüm; ilahi düzene güveniyorum.\"",
                "✓ Önerilen: Derin meditasyon, tefekkür, sadeleşme ve karmik arınma",
                "✗ Kaçının: Karamsarlık, katı yargılar ve korku odaklı direnç"
            )
        }

        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val birthDate = prefs.getString("birthDate", "")?.trim() ?: ""
        val zodiacSign = prefs.getString("zodiacSign", "")?.trim() ?: ""
        val element = prefs.getString("element", "")?.trim() ?: ""
        val rulingPlanet = prefs.getString("rulingPlanet", "")?.trim() ?: ""
        val chartMode = prefs.getString("chartMode", "soul")?.trim()?.ifEmpty { "soul" } ?: "soul"
        val soulZodiacSign = prefs.getString("soulZodiacSign", "")?.trim()?.ifEmpty { zodiacSign } ?: zodiacSign
        val soulElement = prefs.getString("soulElement", "")?.trim()?.ifEmpty { element } ?: element
        val soulRulingPlanet = prefs.getString("soulRulingPlanet", "")?.trim()?.ifEmpty { rulingPlanet } ?: rulingPlanet

        if (birthDate.isEmpty() || zodiacSign.isEmpty()) {
            return base
        }

        val moonSignIdx = getTransitMoonSignIndex(cal.timeInMillis)
        val transitMoonSign = ZODIAC_SIGNS[moonSignIdx]
        val transitMoonSymbol = ZODIAC_SYMBOLS[moonSignIdx]

        val bodySignIdx = getSignIndexByName(zodiacSign)
        val soulSignIdx = getSignIndexByName(soulZodiacSign)
        val activeTargetIdx = if (chartMode == "body") bodySignIdx else soulSignIdx
        val aspect = getAspectThemeForSignDiff(moonSignIdx - activeTargetIdx)
        val elementLabel = if (element.isNotEmpty()) "$element Elementi" else zodiacSign

        val customDo: String
        val customAvoid: String
        val customBadge: String
        val chakraSignBadge: String

        when (chartMode) {
            "soul" -> {
                customBadge = "✨ RUH: ${soulZodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "${base.chakraBadge} • RUH: ${soulZodiacSign.uppercase()}"
                customDo = "✓ Ruh Haritası ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.soulDo} ($soulRulingPlanet üst oktavı)"
                customAvoid = "✗ Beden Gölgesi ($zodiacSign / $element Otomatiği): ${aspect.soulAvoid}"
            }
            "synthesis" -> {
                customBadge = "☯️ ${zodiacSign.uppercase()} → ${soulZodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "${base.chakraBadge} • ${zodiacSign.uppercase()}→${soulZodiacSign.uppercase()}"
                customDo = "✓ Sentez ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.soulDo}"
                customAvoid = "✗ Gölge Uyarısı ($element → $soulElement): ${aspect.bodyAvoid}"
            }
            else -> {
                customBadge = "🌍 BEDEN: ${zodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "${base.chakraBadge} • BEDEN: ${zodiacSign.uppercase()}"
                customDo = "✓ Beden Haritası ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.bodyDo} ($rulingPlanet uyumu)"
                customAvoid = "✗ Kaçının ($elementLabel): ${aspect.bodyAvoid}"
            }
        }

        return base.copy(
            headerBadge = customBadge,
            chakraBadge = chakraSignBadge,
            doText = customDo,
            avoidText = customAvoid
        )
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

    fun refreshAllWidgets(context: Context) {
        val mgr = AppWidgetManager.getInstance(context)
        val miniIds = mgr.getAppWidgetIds(ComponentName(context, MiniCosmicWidgetProvider::class.java))
        if (miniIds.isNotEmpty()) {
            MiniCosmicWidgetProvider().onUpdate(context, mgr, miniIds)
        }
        val cosmicIds = mgr.getAppWidgetIds(ComponentName(context, CosmicWidgetProvider::class.java))
        for (id in cosmicIds) {
            CosmicWidgetProvider.updateCosmicWidget(context, mgr, id)
        }
        val phIds = mgr.getAppWidgetIds(ComponentName(context, PlanetaryHoursWidgetProvider::class.java))
        if (phIds.isNotEmpty()) {
            PlanetaryHoursWidgetProvider().onUpdate(context, mgr, phIds)
        }
        val cmIds = mgr.getAppWidgetIds(ComponentName(context, ChakraMoonWidgetProvider::class.java))
        if (cmIds.isNotEmpty()) {
            ChakraMoonWidgetProvider().onUpdate(context, mgr, cmIds)
        }
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
            val dayInfo = CosmicWidgetHelper.getDayCosmicInfo(context, cal)
            val moonInfo = CosmicWidgetHelper.getMoonInfo(cal.timeInMillis)
            val currentIdx = CosmicWidgetHelper.getChaldeanHourIndex(cal)
            val nextIdx = (currentIdx + 1) % 7
            val minsLeft = (60 - cal.get(Calendar.MINUTE)).coerceIn(1, 60)

            val views = RemoteViews(context.packageName, R.layout.cosmic_widget)
            views.setTextViewText(R.id.widget_symbol, dayInfo.symbol)
            views.setTextViewText(R.id.widget_badge, dayInfo.headerBadge)
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

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_REFRESH_WIDGETS) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, PlanetaryHoursWidgetProvider::class.java))
            onUpdate(context, mgr, ids)
        }
    }

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

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_REFRESH_WIDGETS) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, ChakraMoonWidgetProvider::class.java))
            onUpdate(context, mgr, ids)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val cal = Calendar.getInstance()
        val dayInfo = CosmicWidgetHelper.getDayCosmicInfo(context, cal)
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

class MiniCosmicWidgetProvider : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_REFRESH_WIDGETS) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, MiniCosmicWidgetProvider::class.java))
            onUpdate(context, mgr, ids)
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        val cal = Calendar.getInstance()
        val moonInfo = CosmicWidgetHelper.getMoonInfo(cal.timeInMillis)
        val currentIdx = CosmicWidgetHelper.getChaldeanHourIndex(cal)
        val prevIdx = (currentIdx + 6) % 7
        val nextIdx = (currentIdx + 1) % 7
        val minsLeft = (60 - cal.get(Calendar.MINUTE)).coerceIn(1, 60)
        val currentPlanetName = CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx].substringBefore(" ")

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.mini_cosmic_widget)
            views.setTextViewText(R.id.mini_planet_symbol, CosmicWidgetHelper.PLANET_SYMBOLS[currentIdx])
            views.setTextViewText(R.id.mini_hour_title, "${currentPlanetName} • ${minsLeft}dk")
            views.setTextViewText(R.id.mini_moon_badge, "${moonInfo.icon} %${moonInfo.illumination}")
            views.setTextViewText(R.id.mini_prev_hour, "◀ ${CosmicWidgetHelper.CHALDEAN_ORDER[prevIdx]}")
            views.setTextViewText(R.id.mini_next_hour, "${CosmicWidgetHelper.CHALDEAN_ORDER[nextIdx]} ▶")

            views.setOnClickPendingIntent(
                R.id.mini_widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
