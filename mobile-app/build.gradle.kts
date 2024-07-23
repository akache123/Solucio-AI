import java.util.Properties

plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.jetbrains.kotlin.android) apply false
}

// 读取local.properties文件中的密钥
val localProperties = Properties()
val localPropertiesFile = rootProject.file("local.properties")
if (localPropertiesFile.exists()) {
    localPropertiesFile.inputStream().use { localProperties.load(it) }
}

//ext["GOOGLE_API_KEY"] = localProperties.getProperty("GOOGLE_API_KEY")
//ext["OPEN_AI_KEY"] = localProperties.getProperty("OPEN_AI_KEY")
