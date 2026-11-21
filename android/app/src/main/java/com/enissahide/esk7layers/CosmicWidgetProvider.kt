package com.enissahide.esk7layers

import android.app.AlarmManager
import android.app.PendingIntent
import android.os.PowerManager
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.net.Uri
import android.widget.RemoteViews
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executors
import java.util.Calendar
import java.util.TimeZone
import android.database.sqlite.SQLiteDatabase
import org.json.JSONObject
import kotlin.math.acos
import kotlin.math.asin
import kotlin.math.atan
import kotlin.math.floor
import kotlin.math.sin
import kotlin.math.tan
import kotlin.math.cos
import kotlin.math.roundToInt

object CosmicWidgetAudioPlayer {
    @Volatile
    private var isPlaying = false
    @Volatile
    private var activeHz = 0
    private var audioThread: Thread? = null
    private var audioTrack: AudioTrack? = null

    fun isCurrentlyPlaying(): Boolean = isPlaying
    fun getActiveHz(): Int = activeHz

    @Synchronized
    fun toggle(hz: Int): Boolean {
        return if (isPlaying) {
            stop()
            false
        } else {
            start(hz)
            true
        }
    }

    @Synchronized
    fun stop() {
        isPlaying = false
        activeHz = 0
        try {
            audioTrack?.pause()
            audioTrack?.flush()
            audioTrack?.release()
        } catch (_: Exception) {
        }
        audioTrack = null
        audioThread = null
    }

    @Synchronized
    fun start(hz: Int) {
        stop()
        val sampleRate = 22050
        val minBuf = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        ).coerceAtLeast(sampleRate / 2)

        val track = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setBufferSizeInBytes(minBuf)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .build()

        audioTrack = track
        isPlaying = true
        activeHz = hz
        track.play()

        audioThread = Thread {
            val chunkSamples = sampleRate / 10
            val buffer = ShortArray(chunkSamples)
            var sampleIndex = 0L
            val twoPi = 2.0 * Math.PI
            val freqStep = twoPi * hz.toDouble() / sampleRate.toDouble()
            val lfoStep = twoPi * 0.5 / sampleRate.toDouble() // 0.5 Hz Tibetan bowl LFO

            try {
                while (isPlaying) {
                    for (i in 0 until chunkSamples) {
                        val s = sampleIndex + i
                        val carrier = sin(s * freqStep)
                        val lfo = 0.45 + 0.18 * sin(s * lfoStep)
                        buffer[i] = (carrier * lfo * Short.MAX_VALUE).toInt().coerceIn(-32767, 32767).toShort()
                    }
                    sampleIndex += chunkSamples
                    track.write(buffer, 0, chunkSamples)
                }
            } catch (_: Exception) {
            } finally {
                try {
                    track.stop()
                    track.release()
                } catch (_: Exception) {
                }
            }
        }.apply {
            isDaemon = true
            start()
        }
    }
}

object CosmicWidgetHelper {
    const val ACTION_REFRESH_WIDGETS = "com.enissahide.esk7layers.ACTION_REFRESH_WIDGETS"
    const val ACTION_MINUTE_TICK = "com.enissahide.esk7layers.ACTION_MINUTE_TICK"
    const val ACTION_TOGGLE_WIDGET_FREQ = "com.enissahide.esk7layers.ACTION_TOGGLE_WIDGET_FREQ"
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
        val avoidText: String,
        val recommendedHz: Int = 639
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
                "✗ Kaçının: Kibir, ego çatışmaları ve enerjinizi tüketen gereksiz güç savaşları",
                528
            )
            Calendar.MONDAY -> DayCosmicInfo(
                "☽",
                "7LAYERS • KOZMİK PUSULA",
                "Pazartesi • Ay Günü • Kalp Çakrası (639 Hz)",
                "GÜNÜN ÇAKRASI • 639 HZ",
                "4. Katman: Kalp Çakrası (Anahata)",
                "\"Sevgi en yüksek frekanstır; kalbimi evrenin şefkatine ve içsel rehberliğe açıyorum.\"",
                "✓ Önerilen: Sezgisel çalışmalar, rüya analizi, şefkat ve duygusal dengeleme",
                "✗ Kaçının: Duygusal alınganlık, geçmişe takılı kalma ve kararsızlık dalgaları",
                639
            )
            Calendar.TUESDAY -> DayCosmicInfo(
                "♂",
                "7LAYERS • KOZMİK PUSULA",
                "Salı • Mars Günü • Kök Çakra (396 Hz)",
                "GÜNÜN ÇAKRASI • 396 HZ",
                "1. Katman: Kök Çakra (Muladhara)",
                "\"Yaşamın sarsılmaz kökleriyle güvendeyim; toprağın gücü ve cesareti her hücremde akıyor.\"",
                "✓ Önerilen: Cesaret, fiziksel dayanıklılık, sınır koyma ve ertelediğiniz adımlar",
                "✗ Kaçının: Ani öfke, aceleci tartışma ve dürtüsel çatışmalar",
                396
            )
            Calendar.WEDNESDAY -> DayCosmicInfo(
                "☿",
                "7LAYERS • KOZMİK PUSULA",
                "Çarşamba • Merkür Günü • Boğaz Çakrası (741 Hz)",
                "GÜNÜN ÇAKRASI • 741 HZ",
                "5. Katman: Boğaz Çakrası (Vishuddha)",
                "\"Hakikatimi berraklıkla, bilgelikle ve yüksek farkındalıkla ifade ediyorum.\"",
                "✓ Önerilen: Ezoterik okuma, araştırma, iletişim, yazı ve nefes çalışmaları",
                "✗ Kaçının: Dedikodu, zihinsel dağınıklık ve yüzeysel tartışmalar",
                741
            )
            Calendar.THURSDAY -> DayCosmicInfo(
                "♃",
                "7LAYERS • KOZMİK PUSULA",
                "Perşembe • Jüpiter Günü • Üçüncü Göz (852 Hz)",
                "GÜNÜN ÇAKRASI • 852 HZ",
                "6. Katman: Üçüncü Göz (Ajna)",
                "\"Görünenin ötesindeki kadim bilgeliği ve evrensel düzeni berraklıkla görüyorum.\"",
                "✓ Önerilen: Yüksek öğretiler, vizyon çalışmaları, şükür ve bolluk bilinci",
                "✗ Kaçının: Aşırılık, abartı ve detayları gözden kaçıran savrukluk",
                852
            )
            Calendar.FRIDAY -> DayCosmicInfo(
                "♀",
                "7LAYERS • KOZMİK PUSULA",
                "Cuma • Venüs Günü • Sakral Çakra (417 Hz)",
                "GÜNÜN ÇAKRASI • 417 HZ",
                "2. Katman: Sakral Çakra (Svadhisthana)",
                "\"Yaratıcı yaşam enerjisiyle uyum içindeyim; güzelliği ve uyumu hayatıma çekiyorum.\"",
                "✓ Önerilen: Sanat, uyum, sevgi frekansı, estetik ve yaratıcı üretim",
                "✗ Kaçının: Tembellik, bağımlılıklar ve duygusal manipülasyonlar",
                417
            )
            else -> DayCosmicInfo(
                "♄",
                "7LAYERS • KOZMİK PUSULA",
                "Cumartesi • Satürn Günü • Taç Çakra (963 Hz)",
                "GÜNÜN ÇAKRASI • 963 HZ",
                "7. Katman: Taç Çakra (Sahasrara)",
                "\"Zamanın ve mekanın ötesindeki Tek'likle bir ve bütünüm; ilahi düzene güveniyorum.\"",
                "✓ Önerilen: Derin meditasyon, tefekkür, sadeleşme ve karmik arınma",
                "✗ Kaçının: Karamsarlık, katı yargılar ve korku odaklı direnç",
                963
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
        val signDiff = ((moonSignIdx - activeTargetIdx) % 12 + 12) % 12
        val aspect = getAspectThemeForSignDiff(signDiff)
        val elementLabel = if (element.isNotEmpty()) "$element Elementi" else zodiacSign

        // 1. Katman: Pisagor Doğum Matrisi Eksik Çakra (Alan Koruma Kodu 1-7)
        fun reduceNum(num: Int): Int {
            var n = kotlin.math.abs(num)
            while (n > 9) {
                var s = 0
                while (n > 0) {
                    s += n % 10
                    n /= 10
                }
                n = s
            }
            return if (n == 0) 1 else n
        }
        val bParts = birthDate.split(".", "/", "-")
        val bDay = bParts.getOrNull(0)?.toIntOrNull() ?: 1
        val bMonth = bParts.getOrNull(1)?.toIntOrNull() ?: 1
        val bYear = bParts.getOrNull(2)?.toIntOrNull() ?: 1990
        val lifePath = reduceNum(reduceNum(bDay) + reduceNum(bMonth) + reduceNum(bYear))

        val presentChakras = HashSet<Int>()
        for (ch in birthDate) {
            if (ch in '1'..'7') presentChakras.add(ch - '0')
        }
        val dRed = reduceNum(bDay)
        val mRed = reduceNum(bMonth)
        val yRed = reduceNum(bYear)
        if (dRed in 1..7) presentChakras.add(dRed)
        if (mRed in 1..7) presentChakras.add(mRed)
        if (yRed in 1..7) presentChakras.add(yRed)
        if (lifePath in 1..7) presentChakras.add(lifePath)

        var birthMatrixChakraId = ((lifePath - 1) % 7) + 1
        for (c in 1..7) {
            if (!presentChakras.contains(c)) {
                birthMatrixChakraId = c
                break
            }
        }

        // 2. Katman: Astronomik Transit Ay Açısı + Doğum Matrisi Eksik Çakra Odağı
        val personalHz: Int
        val personalChakraTitle: String
        val personalAffirmation: String
        when {
            signDiff == 3 || signDiff == 9 -> {
                personalHz = 396
                personalChakraTitle = "1. Katman: Kök Çakra (Muladhara)"
                personalAffirmation = "\"☽ Ay $transitMoonSign (Kare Açı): İçsel sürtünmeyi farkındalığa dönüştürüyor, sarsılmaz köklerle merkezleniyorum.\""
            }
            signDiff == 6 -> {
                personalHz = 639
                personalChakraTitle = "4. Katman: Kalp Çakrası (Anahata)"
                personalAffirmation = "\"☽ Ay $transitMoonSign (Karşıt Açı): İlişkilerde ayna yasasını okuyor, dualiteyi kalp merkezinde şefkatle birleştiriyorum.\""
            }
            signDiff == 0 -> {
                personalHz = 528
                personalChakraTitle = "3. Katman: Solar Pleksus (Manipura)"
                personalAffirmation = "\"☽ Ay $transitMoonSign (Kavuşum): Öz-merkezime akan yaşam enerjisini, irademi ve içsel güneşimi aktive ediyorum.\""
            }
            signDiff == 2 || signDiff == 10 -> {
                personalHz = 741
                personalChakraTitle = "5. Katman: Boğaz Çakrası (Vishuddha)"
                personalAffirmation = "\"☽ Ay $transitMoonSign (Sekstil Açı): Boğaz çakrasından berrak idrakle hakikatimi ifade ediyor, eşzamanlılıkları okuyorum.\""
            }
            signDiff == 4 || signDiff == 8 -> {
                personalHz = 852
                personalChakraTitle = "6. Katman: Üçüncü Göz (Ajna)"
                personalAffirmation = "\"☽ Ay $transitMoonSign (Üçgen Açı): Element uyumuyla zahmetsiz sezgi akışına, durugörüye ve yüksek idrake açılıyorum.\""
            }
            else -> {
                when (birthMatrixChakraId) {
                    1 -> {
                        personalHz = 396
                        personalChakraTitle = "1. Katman: Kök Çakra (Muladhara)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #1): Doğum matrisimdeki kök güven alanını 396 Hz ile dengeliyorum.\""
                    }
                    2 -> {
                        personalHz = 417
                        personalChakraTitle = "2. Katman: Sakral Çakra (Svadhisthana)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #2): Doğum matrisimdeki yaratıcı su akışını 417 Hz ile dengeliyorum.\""
                    }
                    3 -> {
                        personalHz = 528
                        personalChakraTitle = "3. Katman: Solar Pleksus (Manipura)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #3): Doğum matrisimdeki irade ve öz-değer merkezini 528 Hz ile dengeliyorum.\""
                    }
                    4 -> {
                        personalHz = 639
                        personalChakraTitle = "4. Katman: Kalp Çakrası (Anahata)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #4): Doğum matrisimdeki kalp ve şefkat alanını 639 Hz ile dengeliyorum.\""
                    }
                    5 -> {
                        personalHz = 741
                        personalChakraTitle = "5. Katman: Boğaz Çakrası (Vishuddha)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #5): Doğum matrisimdeki ifade ve hakikat merkezini 741 Hz ile dengeliyorum.\""
                    }
                    6 -> {
                        personalHz = 852
                        personalChakraTitle = "6. Katman: Üçüncü Göz (Ajna)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #6): Doğum matrisimdeki sezgi ve idrak merkezini 852 Hz ile dengeliyorum.\""
                    }
                    else -> {
                        personalHz = 963
                        personalChakraTitle = "7. Katman: Taç Çakra (Sahasrara)"
                        personalAffirmation = "\"☽ Ay $transitMoonSign (İnce Ayar • Matris #7): Doğum matrisimdeki üst bilinç bağlantısını 963 Hz ile dengeliyorum.\""
                    }
                }
            }
        }

        val customDo: String
        val customAvoid: String
        val customBadge: String
        val chakraSignBadge: String

        when (chartMode) {
            "soul" -> {
                customBadge = "✨ RUH: ${soulZodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "🎯 KİŞİSEL ODAK • $personalHz HZ • RUH: ${soulZodiacSign.uppercase()}"
                customDo = "✓ Ruh Haritası ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.soulDo} ($soulRulingPlanet üst oktavı)"
                customAvoid = "✗ Beden Gölgesi ($zodiacSign / $element Otomatiği): ${aspect.soulAvoid}"
            }
            "synthesis" -> {
                customBadge = "☯️ ${zodiacSign.uppercase()} → ${soulZodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "🎯 KİŞİSEL ODAK • $personalHz HZ • ${zodiacSign.uppercase()}→${soulZodiacSign.uppercase()}"
                customDo = "✓ Sentez ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.soulDo}"
                customAvoid = "✗ Gölge Uyarısı ($element → $soulElement): ${aspect.bodyAvoid}"
            }
            else -> {
                customBadge = "🌍 BEDEN: ${zodiacSign.uppercase()} • ☽ AY: ${transitMoonSign.uppercase()} (${aspect.shortTag})"
                chakraSignBadge = "🎯 KİŞİSEL ODAK • $personalHz HZ • BEDEN: ${zodiacSign.uppercase()}"
                customDo = "✓ Beden Haritası ($transitMoonSymbol Ay $transitMoonSign • ${aspect.aspectName}): ${aspect.bodyDo} ($rulingPlanet uyumu)"
                customAvoid = "✗ Kaçının ($elementLabel): ${aspect.bodyAvoid}"
            }
        }

        return base.copy(
            headerBadge = customBadge,
            chakraBadge = chakraSignBadge,
            chakraTitle = personalChakraTitle,
            affirmation = personalAffirmation,
            doText = customDo,
            avoidText = customAvoid,
            recommendedHz = personalHz
        )
    }

    fun getMoonInfo(nowMillis: Long): MoonInfo {
        val synodicMonth = 29.53058867
        val knownNewMoonMillis = 947182440000L // 2000-01-06 18:14 UTC
        val diffDays = (nowMillis - knownNewMoonMillis).toDouble() / (1000.0 * 60.0 * 60.0 * 24.0)
        val phaseRatio = (((diffDays % synodicMonth) + synodicMonth) % synodicMonth) / synodicMonth
        val illumination = ((1.0 - cos(phaseRatio * 2.0 * Math.PI)) * 50.0).roundToInt()

        return when {
            phaseRatio < 0.03 || phaseRatio > 0.97 -> MoonInfo("🌑", "Yeni Ay", illumination, "Yeni niyet ve tohum evresi")
            phaseRatio < 0.24 -> MoonInfo("🌒", "Büyüyen Hilal", illumination, "Adım atma ve ivme enerjisi")
            phaseRatio <= 0.26 -> MoonInfo("🌓", "İlk Dördün", illumination, "İrade ve kararlılık fazı")
            phaseRatio < 0.47 -> MoonInfo("🌔", "Büyüyen Şişkin", illumination, "Olgunlaştırma ve hazırlık")
            phaseRatio <= 0.53 -> MoonInfo("🌕", "Dolunay Fazı", illumination, "Tamamlanma ve aydınlanma")
            phaseRatio < 0.74 -> MoonInfo("🌖", "Küçülen Şişkin", illumination, "İçgörü, paylaşım ve şükür")
            phaseRatio <= 0.76 -> MoonInfo("🌗", "Son Dördün", illumination, "Arınma ve sadeleşme fazı")
            else -> MoonInfo("🌘", "Balsamik Ay", illumination, "Tefekkür ve ruhsal dinlenme")
        }
    }

        data class PlanetaryHourSlot(
        val planetIdx: Int,
        val startMillis: Long,
        val endMillis: Long
    )

    data class AstronomicalPlanetaryState(
        val currentIdx: Int,
        val prevIdx: Int,
        val next1Idx: Int,
        val next2Idx: Int,
        val next3Idx: Int,
        val minsLeft: Int,
        val next1TimeStr: String,
        val next2TimeStr: String,
        val next3TimeStr: String,
        val cityName: String
    )

    private fun resolveUserCoordinates(context: Context): Triple<Double, Double, String> {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val savedLat = prefs.getString("widgetLat", null)?.toDoubleOrNull()
        val savedLon = prefs.getString("widgetLon", null)?.toDoubleOrNull()
        val savedCity = prefs.getString("widgetCity", null)
        if (savedLat != null && savedLon != null) {
            return Triple(savedLat, savedLon, savedCity ?: "Konum")
        }

        // Fallback: Read directly from AsyncStorage SQLite (RKStorage) if available
        try {
            val dbFile = context.getDatabasePath("RKStorage")
            if (dbFile != null && dbFile.exists()) {
                val db = SQLiteDatabase.openDatabase(dbFile.absolutePath, null, SQLiteDatabase.OPEN_READONLY)
                db.use { sqlite ->
                    sqlite.rawQuery(
                        "SELECT value FROM catalystLocalStorage WHERE key = ?",
                        arrayOf("last_planet_hours_location")
                    ).use { cursor ->
                        if (cursor.moveToFirst()) {
                            val jsonStr = cursor.getString(0)
                            if (!jsonStr.isNullOrEmpty()) {
                                val obj = JSONObject(jsonStr)
                                if (obj.has("lat") && obj.has("lon")) {
                                    val lat = obj.getDouble("lat")
                                    val lon = obj.getDouble("lon")
                                    val name = obj.optString("name", "Antalya").substringBefore(",").trim()
                                    prefs.edit()
                                        .putString("widgetLat", lat.toString())
                                        .putString("widgetLon", lon.toString())
                                        .putString("widgetCity", name)
                                        .apply()
                                    return Triple(lat, lon, name)
                                }
                            }
                        }
                    }
                }
            }
        } catch (_: Exception) {
        }

        // Default to Antalya / Turkey coordinates
        return Triple(36.8969, 30.7133, "Antalya")
    }

    private fun calcSunriseSunsetUtcMillis(
        year: Int,
        month: Int,
        day: Int,
        lat: Double,
        lon: Double,
        isSunrise: Boolean
    ): Long {
        val rad = Math.PI / 180.0
        val deg = 180.0 / Math.PI

        val n1 = (275 * month) / 9
        val n2 = (month + 9) / 12
        val n3 = 1 + (year - 4 * (year / 4) + 2) / 3
        val dayOfYear = n1 - (n2 * n3) + day - 30

        val lngHour = lon / 15.0
        val t = if (isSunrise) {
            dayOfYear + ((6.0 - lngHour) / 24.0)
        } else {
            dayOfYear + ((18.0 - lngHour) / 24.0)
        }

        val meanAnomaly = (0.9856 * t) - 3.289
        var trueLon = meanAnomaly +
            (1.916 * sin(meanAnomaly * rad)) +
            (0.020 * sin(2.0 * meanAnomaly * rad)) +
            282.634
        trueLon = ((trueLon % 360.0) + 360.0) % 360.0

        var ra = deg * atan(0.91764 * tan(trueLon * rad))
        ra = ((ra % 360.0) + 360.0) % 360.0

        val lQuadrant = floor(trueLon / 90.0) * 90.0
        val raQuadrant = floor(ra / 90.0) * 90.0
        ra = (ra + (lQuadrant - raQuadrant)) / 15.0

        val sinDec = 0.39782 * sin(trueLon * rad)
        val cosDec = cos(asin(sinDec))

        val cosH = (cos(90.8333 * rad) - (sinDec * sin(lat * rad))) / (cosDec * cos(lat * rad))
        val utcCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month - 1)
            set(Calendar.DAY_OF_MONTH, day)
            set(Calendar.HOUR_OF_DAY, 0)
            set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
        }
        val baseUtcMillis = utcCal.timeInMillis

        if (cosH > 1.0 || cosH < -1.0) {
            return baseUtcMillis + (if (isSunrise) 4L else 16L) * 3600_000L
        }

        var h = if (isSunrise) {
            360.0 - deg * acos(cosH)
        } else {
            deg * acos(cosH)
        }
        h /= 15.0

        val localMeanTime = h + ra - (0.06571 * t) - 6.622
        val utHours = (((localMeanTime - lngHour) % 24.0) + 24.0) % 24.0
        return baseUtcMillis + (utHours * 3600_000.0).toLong()
    }

    private fun build24PlanetarySlotsForUtcDay(
        year: Int,
        month: Int,
        day: Int,
        lat: Double,
        lon: Double
    ): Pair<Long, List<PlanetaryHourSlot>> {
        val sunriseMs = calcSunriseSunsetUtcMillis(year, month, day, lat, lon, true)
        val sunsetMs = calcSunriseSunsetUtcMillis(year, month, day, lat, lon, false)

        val nextCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            set(Calendar.YEAR, year)
            set(Calendar.MONTH, month - 1)
            set(Calendar.DAY_OF_MONTH, day)
            add(Calendar.DAY_OF_MONTH, 1)
        }
        val nextSunriseMs = calcSunriseSunsetUtcMillis(
            nextCal.get(Calendar.YEAR),
            nextCal.get(Calendar.MONTH) + 1,
            nextCal.get(Calendar.DAY_OF_MONTH),
            lat,
            lon,
            true
        )

        val localSunriseMs = sunriseMs + ((lon / 15.0) * 3600_000.0).toLong()
        val localCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            timeInMillis = localSunriseMs
        }
        val dayOfWeek = localCal.get(Calendar.DAY_OF_WEEK) // Calendar.SUNDAY..Calendar.SATURDAY
        var planetIdx = DAY_RULER_START_INDEX[dayOfWeek] ?: 3

        val dayHourMs = (sunsetMs - sunriseMs).toDouble() / 12.0
        val nightHourMs = (nextSunriseMs - sunsetMs).toDouble() / 12.0
        val slots = ArrayList<PlanetaryHourSlot>(24)

        for (i in 0 until 12) {
            val s = sunriseMs + (i * dayHourMs).toLong()
            val e = sunriseMs + ((i + 1) * dayHourMs).toLong()
            slots.add(PlanetaryHourSlot(planetIdx, s, e))
            planetIdx = (planetIdx + 1) % 7
        }
        for (i in 0 until 12) {
            val s = sunsetMs + (i * nightHourMs).toLong()
            val e = sunsetMs + ((i + 1) * nightHourMs).toLong()
            slots.add(PlanetaryHourSlot(planetIdx, s, e))
            planetIdx = (planetIdx + 1) % 7
        }
        return Pair(sunriseMs, slots)
    }

    fun getAstronomicalPlanetaryState(context: Context, nowMillis: Long): AstronomicalPlanetaryState {
        val (lat, lon, cityName) = resolveUserCoordinates(context)
        val utcCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            timeInMillis = nowMillis
        }
        val year = utcCal.get(Calendar.YEAR)
        val month = utcCal.get(Calendar.MONTH) + 1
        val day = utcCal.get(Calendar.DAY_OF_MONTH)

        var (sunriseMs, slots) = build24PlanetarySlotsForUtcDay(year, month, day, lat, lon)
        if (nowMillis < sunriseMs) {
            val prevCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
                timeInMillis = nowMillis
                add(Calendar.DAY_OF_MONTH, -1)
            }
            val prevPair = build24PlanetarySlotsForUtcDay(
                prevCal.get(Calendar.YEAR),
                prevCal.get(Calendar.MONTH) + 1,
                prevCal.get(Calendar.DAY_OF_MONTH),
                lat,
                lon
            )
            sunriseMs = prevPair.first
            slots = prevPair.second
        }

        val lastEnd = slots.last().endMillis
        val nextDayCal = Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
            timeInMillis = lastEnd + 3600_000L
        }
        val nextDaySlots = build24PlanetarySlotsForUtcDay(
            nextDayCal.get(Calendar.YEAR),
            nextDayCal.get(Calendar.MONTH) + 1,
            nextDayCal.get(Calendar.DAY_OF_MONTH),
            lat,
            lon
        ).second

        val allSlots = ArrayList<PlanetaryHourSlot>(28).apply {
            addAll(slots)
            addAll(nextDaySlots.take(4))
        }

        var activeSlotIdx = allSlots.indexOfFirst { nowMillis >= it.startMillis && nowMillis < it.endMillis }
        if (activeSlotIdx < 0) activeSlotIdx = 0

        val curSlot = allSlots[activeSlotIdx]
        val next1Slot = allSlots[activeSlotIdx + 1]
        val next2Slot = allSlots[activeSlotIdx + 2]
        val next3Slot = allSlots[activeSlotIdx + 3]

        val curIdx = curSlot.planetIdx
        val prevIdx = (curIdx + 6) % 7
        // Use floor((endMillis - nowMillis) / 60000) to match JS Math.floor((endTime - now) / 60000) in index.tsx
        val minsLeft = ((curSlot.endMillis - nowMillis) / 60_000L).toInt().coerceAtLeast(1)

        val fmt = SimpleDateFormat("HH:mm", Locale.getDefault())
        return AstronomicalPlanetaryState(
            currentIdx = curIdx,
            prevIdx = prevIdx,
            next1Idx = next1Slot.planetIdx,
            next2Idx = next2Slot.planetIdx,
            next3Idx = next3Slot.planetIdx,
            minsLeft = minsLeft,
            next1TimeStr = fmt.format(Date(next1Slot.startMillis)),
            next2TimeStr = fmt.format(Date(next2Slot.startMillis)),
            next3TimeStr = fmt.format(Date(next3Slot.startMillis)),
            cityName = cityName
        )
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

    fun shouldTriggerImmediateRefresh(action: String?): Boolean {
        return action == ACTION_REFRESH_WIDGETS ||
            action == Intent.ACTION_BOOT_COMPLETED ||
            action == Intent.ACTION_MY_PACKAGE_REPLACED ||
            action == Intent.ACTION_TIME_CHANGED ||
            action == Intent.ACTION_TIMEZONE_CHANGED ||
            action == Intent.ACTION_DATE_CHANGED
    }

    fun scheduleNextMinuteTick(context: Context) {
        try {
            val appCtx = context.applicationContext
            val mgr = AppWidgetManager.getInstance(appCtx)
            val hasTimeWidgets =
                mgr.getAppWidgetIds(ComponentName(appCtx, MiniCosmicWidgetProvider::class.java)).isNotEmpty() ||
                mgr.getAppWidgetIds(ComponentName(appCtx, CosmicWidgetProvider::class.java)).isNotEmpty() ||
                mgr.getAppWidgetIds(ComponentName(appCtx, PlanetaryHoursWidgetProvider::class.java)).isNotEmpty()

            val tickIntent = Intent(appCtx, CosmicWidgetProvider::class.java).apply {
                action = ACTION_MINUTE_TICK
            }
            val pendingIntent = PendingIntent.getBroadcast(
                appCtx,
                7771,
                tickIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val alarmManager = appCtx.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return

            if (!hasTimeWidgets) {
                alarmManager.cancel(pendingIntent)
                return
            }

            val now = System.currentTimeMillis()
            val nextMinuteMillis = (now / 60_000L + 1L) * 60_000L + 500L
            // AlarmManager.RTC does NOT wake the device when screen is off (0 battery drain while sleeping)
            alarmManager.setWindow(
                AlarmManager.RTC,
                nextMinuteMillis,
                5_000L,
                pendingIntent
            )
        } catch (_: Exception) {
        }
    }

    fun refreshTimeWidgetsOnly(context: Context) {
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
        scheduleNextMinuteTick(context)
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
        val schIds = mgr.getAppWidgetIds(ComponentName(context, SchumannWidgetProvider::class.java))
        if (schIds.isNotEmpty()) {
            SchumannWidgetProvider.refreshSchumannWidgets(context.applicationContext, mgr, schIds, null, false)
        }
        scheduleNextMinuteTick(context)
    }
}

class CosmicWidgetProvider : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_MINUTE_TICK) {
            val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
            if (pm == null || pm.isInteractive) {
                CosmicWidgetHelper.refreshTimeWidgetsOnly(context)
            } else {
                CosmicWidgetHelper.scheduleNextMinuteTick(context)
            }
            return
        }
        if (CosmicWidgetHelper.shouldTriggerImmediateRefresh(intent.action)) {
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
        CosmicWidgetHelper.scheduleNextMinuteTick(context)
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
            val pState = CosmicWidgetHelper.getAstronomicalPlanetaryState(context, cal.timeInMillis)
            val currentIdx = pState.currentIdx
            val nextIdx = pState.next1Idx
            val minsLeft = pState.minsLeft

            val views = RemoteViews(context.packageName, R.layout.cosmic_widget)
            views.setTextViewText(R.id.widget_symbol, dayInfo.symbol)
            views.setTextViewText(R.id.widget_badge, dayInfo.headerBadge)
            views.setTextViewText(R.id.widget_title, dayInfo.headerTitle)
            views.setTextViewText(
                R.id.widget_hour_pill,
                "🪐 ${CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx]} ($minsLeft dk)"
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
        if (CosmicWidgetHelper.shouldTriggerImmediateRefresh(intent.action)) {
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
        val pState = CosmicWidgetHelper.getAstronomicalPlanetaryState(context, cal.timeInMillis)
        val currentIdx = pState.currentIdx
        val minsLeft = pState.minsLeft

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.planetary_hours_widget)
            views.setTextViewText(R.id.ph_symbol, CosmicWidgetHelper.PLANET_SYMBOLS[currentIdx])
            views.setTextViewText(
                R.id.ph_current_name,
                "${CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx]} Saati Aktif"
            )
            views.setTextViewText(R.id.ph_mins_left, "$minsLeft dk kaldı")
            views.setTextViewText(R.id.ph_meaning, CosmicWidgetHelper.PLANET_HOUR_MEANINGS[currentIdx])

            views.setTextViewText(R.id.ph_next1_time, pState.next1TimeStr)
            views.setTextViewText(R.id.ph_next1_name, CosmicWidgetHelper.CHALDEAN_ORDER[pState.next1Idx])
            views.setTextViewText(R.id.ph_next2_time, pState.next2TimeStr)
            views.setTextViewText(R.id.ph_next2_name, CosmicWidgetHelper.CHALDEAN_ORDER[pState.next2Idx])
            views.setTextViewText(R.id.ph_next3_time, pState.next3TimeStr)
            views.setTextViewText(R.id.ph_next3_name, CosmicWidgetHelper.CHALDEAN_ORDER[pState.next3Idx])

            views.setOnClickPendingIntent(
                R.id.ph_widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
        CosmicWidgetHelper.scheduleNextMinuteTick(context)
    }
}

class ChakraMoonWidgetProvider : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == CosmicWidgetHelper.ACTION_TOGGLE_WIDGET_FREQ) {
            val cal = Calendar.getInstance()
            val dayInfo = CosmicWidgetHelper.getDayCosmicInfo(context, cal)
            val targetHz = intent.getIntExtra("hz", dayInfo.recommendedHz)
            CosmicWidgetAudioPlayer.toggle(targetHz)
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, ChakraMoonWidgetProvider::class.java))
            onUpdate(context, mgr, ids)
            return
        }
        if (CosmicWidgetHelper.shouldTriggerImmediateRefresh(intent.action)) {
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
        val isPlaying = CosmicWidgetAudioPlayer.isCurrentlyPlaying()
        val hz = dayInfo.recommendedHz

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.chakra_moon_widget)
            views.setTextViewText(R.id.cm_moon_icon, moonInfo.icon)
            views.setTextViewText(R.id.cm_chakra_badge, dayInfo.chakraBadge)
            views.setTextViewText(R.id.cm_chakra_title, dayInfo.chakraTitle)
            views.setTextViewText(R.id.cm_moon_pill, "%${moonInfo.illumination} Ay")
            views.setTextViewText(R.id.cm_affirmation, dayInfo.affirmation)
            views.setTextViewText(
                R.id.cm_moon_desc,
                "${moonInfo.icon} ${moonInfo.name}: ${moonInfo.sub}"
            )
            views.setTextViewText(
                R.id.cm_play_freq_btn,
                if (isPlaying) "⏹ Durdur (${CosmicWidgetAudioPlayer.getActiveHz()} Hz)" else "▶ $hz Hz Aç"
            )

            val toggleIntent = Intent(context, ChakraMoonWidgetProvider::class.java).apply {
                action = CosmicWidgetHelper.ACTION_TOGGLE_WIDGET_FREQ
                putExtra("hz", hz)
            }
            val togglePending = PendingIntent.getBroadcast(
                context,
                9103,
                toggleIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.cm_play_freq_btn, togglePending)

            val freqIntent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("proje1://(dashboard)/meditation?hz=$hz&autoPlay=1"),
                context,
                MainActivity::class.java
            ).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val freqPending = PendingIntent.getActivity(context, 9102, freqIntent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            views.setOnClickPendingIntent(R.id.cm_open_freq_btn, freqPending)
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
        if (CosmicWidgetHelper.shouldTriggerImmediateRefresh(intent.action)) {
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
        val pState = CosmicWidgetHelper.getAstronomicalPlanetaryState(context, cal.timeInMillis)
        val currentIdx = pState.currentIdx
        val prevIdx = pState.prevIdx
        val nextIdx = pState.next1Idx
        val minsLeft = pState.minsLeft
        val currentPlanetName = CosmicWidgetHelper.CHALDEAN_ORDER[currentIdx].substringBefore(" ")

        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.mini_cosmic_widget)
            views.setTextViewText(R.id.mini_planet_symbol, CosmicWidgetHelper.PLANET_SYMBOLS[currentIdx])
            views.setTextViewText(R.id.mini_hour_title, currentPlanetName)
            views.setTextViewText(R.id.mini_moon_badge, "${minsLeft} dk")
            views.setTextViewText(R.id.mini_prev_hour, "◀ ${CosmicWidgetHelper.CHALDEAN_ORDER[prevIdx]}")
            views.setTextViewText(R.id.mini_next_hour, "${CosmicWidgetHelper.CHALDEAN_ORDER[nextIdx]} ▶")

            views.setOnClickPendingIntent(
                R.id.mini_widget_root,
                CosmicWidgetHelper.getLaunchPendingIntent(context)
            )
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
        CosmicWidgetHelper.scheduleNextMinuteTick(context)
    }
}

class SchumannWidgetProvider : AppWidgetProvider() {

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (CosmicWidgetHelper.shouldTriggerImmediateRefresh(intent.action)) {
            val mgr = AppWidgetManager.getInstance(context)
            val ids = mgr.getAppWidgetIds(ComponentName(context, SchumannWidgetProvider::class.java))
            if (ids.isNotEmpty()) {
                val pendingResult = goAsync()
                refreshSchumannWidgets(context.applicationContext, mgr, ids, pendingResult, intent.action == CosmicWidgetHelper.ACTION_REFRESH_WIDGETS)
            }
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        if (appWidgetIds.isNotEmpty()) {
            val pendingResult = goAsync()
            refreshSchumannWidgets(context.applicationContext, appWidgetManager, appWidgetIds, pendingResult, false)
        }
    }

    companion object {
        private val executor = Executors.newSingleThreadExecutor()
        private const val CACHE_FILENAME = "schumann_widget_spectrogram.jpg"

        private fun getSchumannDeepLinkIntent(context: Context): PendingIntent {
            val deepLinkIntent = Intent(
                Intent.ACTION_VIEW,
                Uri.parse("proje1://(dashboard)/kisisel-analizler/schumann"),
                context,
                MainActivity::class.java
            ).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            return PendingIntent.getActivity(
                context,
                9101,
                deepLinkIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
        }

        private fun fetchBytesFromUrl(urlStr: String, referer: String? = null): ByteArray? {
            var conn: HttpURLConnection? = null
            return try {
                val url = URL(urlStr)
                conn = (url.openConnection() as HttpURLConnection).apply {
                    connectTimeout = 5000
                    readTimeout = 5000
                    requestMethod = "GET"
                    setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0.0.0")
                    if (referer != null) {
                        setRequestProperty("Referer", referer)
                    }
                }
                if (conn.responseCode == HttpURLConnection.HTTP_OK) {
                    val bytes = conn.inputStream.use { it.readBytes() }
                    if (bytes.size > 4000 && bytes[0] == 0xFF.toByte() && bytes[1] == 0xD8.toByte()) {
                        bytes
                    } else {
                        null
                    }
                } else {
                    null
                }
            } catch (_: Exception) {
                null
            } finally {
                try { conn?.disconnect() } catch (_: Exception) {}
            }
        }

        private fun loadCachedBitmap(context: Context): Bitmap? {
            return try {
                val f = File(context.filesDir, CACHE_FILENAME)
                if (f.exists() && f.length() > 1000) {
                    BitmapFactory.decodeFile(f.absolutePath)
                } else null
            } catch (_: Exception) {
                null
            }
        }

        private fun pushViews(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetIds: IntArray,
            bitmap: Bitmap?,
            subtitle: String
        ) {
            for (appWidgetId in appWidgetIds) {
                val views = RemoteViews(context.packageName, R.layout.schumann_widget)
                views.setTextViewText(R.id.schumann_widget_sub, subtitle)
                if (bitmap != null) {
                    views.setImageViewBitmap(R.id.schumann_widget_img, bitmap)
                }
                views.setOnClickPendingIntent(
                    R.id.schumann_widget_root,
                    getSchumannDeepLinkIntent(context)
                )
                views.setOnClickPendingIntent(
                    R.id.schumann_widget_refresh_btn,
                    CosmicWidgetHelper.getRefreshPendingIntent(context, SchumannWidgetProvider::class.java)
                )
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }

        fun refreshSchumannWidgets(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetIds: IntArray,
            pendingResult: BroadcastReceiver.PendingResult? = null,
            forceNetwork: Boolean = false
        ) {
            val cacheFile = File(context.filesDir, CACHE_FILENAME)
            val cachedBmp = loadCachedBitmap(context)
            if (!forceNetwork && cachedBmp != null && cacheFile.exists()) {
                val ageMs = System.currentTimeMillis() - cacheFile.lastModified()
                if (ageMs in 0..180_000L) {
                    val cachedTimeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(cacheFile.lastModified()))
                    pushViews(
                        context,
                        appWidgetManager,
                        appWidgetIds,
                        cachedBmp,
                        "Canlı Tomsk Spektrogramı (0-40 Hz) • Son: " + cachedTimeStr
                    )
                    try { pendingResult?.finish() } catch (_: Exception) {}
                    return
                }
            }
            if (cachedBmp != null) {
                pushViews(
                    context,
                    appWidgetManager,
                    appWidgetIds,
                    cachedBmp,
                    "Canlı Spektrogram güncelleniyor..."
                )
            }

            executor.execute {
                try {
                    val rawBytes =
                        fetchBytesFromUrl("https://sos70.ru/provider.php?file=shm.jpg", "https://sos70.ru/")
                            ?: fetchBytesFromUrl("https://www.7layers.tr/api/schumann/image")

                    val timeStr = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())

                    if (rawBytes != null) {
                        val decoded = BitmapFactory.decodeByteArray(rawBytes, 0, rawBytes.size)
                        if (decoded != null) {
                            val scaled = Bitmap.createScaledBitmap(decoded, 760, 220, true)
                            try {
                                val outFile = File(context.filesDir, CACHE_FILENAME)
                                FileOutputStream(outFile).use { fos ->
                                    scaled.compress(Bitmap.CompressFormat.JPEG, 88, fos)
                                }
                            } catch (_: Exception) {}

                            pushViews(
                                context,
                                appWidgetManager,
                                appWidgetIds,
                                scaled,
                                "Canlı Tomsk Spektrogramı (0-40 Hz) • Son: $timeStr"
                            )
                            return@execute
                        }
                    }

                    val fallbackBmp = loadCachedBitmap(context)
                    pushViews(
                        context,
                        appWidgetManager,
                        appWidgetIds,
                        fallbackBmp,
                        if (fallbackBmp != null) "Arşiv Spektrogram Görseli • Yenilemek için ↻" else "Bağlantı bekleniyor • Yenilemek için ↻"
                    )
                } catch (_: Exception) {
                } finally {
                    try { pendingResult?.finish() } catch (_: Exception) {}
                }
            }
        }
    }
}
