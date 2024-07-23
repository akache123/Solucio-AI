package com.example.food

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.app.ActivityCompat
import com.example.food.ui.theme.FoodTheme
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.tasks.OnCompleteListener
import okhttp3.*
import org.json.JSONObject
import java.io.IOException
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody

class MainActivity : ComponentActivity() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private val categories = listOf(
        "Pizza", "Burger", "Sushi", "Pasta", "Salad", "Steak", "Seafood", "Tacos",
        "Sandwich", "Soup", "Dessert", "BBQ", "Vegetarian", "Vegan", "Chinese"
    )
    private var currentCategoryIndex by mutableStateOf(0)
    private var userPreferences = mutableListOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_COARSE_LOCATION
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                1
            )
            return
        }

        setContent {
            FoodTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Column(
                        modifier = Modifier
                            .padding(innerPadding)
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally,  // Center alignment
                        verticalArrangement = Arrangement.Center // Center vertical alignment
                    ) {
                        FoodSelection(
                            categories = categories,
                            currentCategoryIndex = currentCategoryIndex,
                            onThumbsUp = { recordPreference(true) },
                            onThumbsDown = { recordPreference(false) }
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = {
                            // Uncomment below code if you want to integrate location-based recommendations
                            /*
                            getCurrentLocation { location ->
                                fetchRecommendations(location.latitude, location.longitude)
                            }
                            */
                        }) {
                            Text("Get Restaurant Recommendations")
                        }
                    }
                }
            }
        }
    }

    private fun recordPreference(liked: Boolean) {
        if (liked) {
            userPreferences.add(categories[currentCategoryIndex])
        }
        currentCategoryIndex = (currentCategoryIndex + 1) % categories.size
    }

    private fun getCurrentLocation(onLocationReceived: (Location) -> Unit) {
        if (ActivityCompat.checkSelfPermission(
                this,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        ) {
            fusedLocationClient.lastLocation.addOnCompleteListener(OnCompleteListener { task ->
                if (task.isSuccessful && task.result != null) {
                    onLocationReceived(task.result)
                } else {
                    Log.w("Location", "Failed to get location.")
                }
            })
        }
    }

    // Comment out all API related functions
    /*
    private fun fetchNearbyRestaurants(latitude: Double, longitude: Double, onRestaurantsReceived: (List<Restaurant>) -> Unit) {
        val apiKey = BuildConfig.GOOGLE_API_KEY
        val url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=$latitude,$longitude&radius=1500&type=restaurant&key=$apiKey"

        val client = OkHttpClient()
        val request = Request.Builder()
            .url(url)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                e.printStackTrace()
                Log.e("Google Places API Error", e.message ?: "Unknown error")
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val myResponse = response.body?.string()
                    Log.d("Google Places API Response", myResponse ?: "No response")
                    val restaurants = parseRestaurants(myResponse)
                    onRestaurantsReceived(restaurants)
                } else {
                    Log.e("Google Places API Response Error", response.message)
                }
            }
        })
    }

    private fun parseRestaurants(response: String?): List<Restaurant> {
        val restaurants = mutableListOf<Restaurant>()
        // 解析Google Places API响应并返回餐厅列表
        // 实现解析逻辑
        return restaurants
    }

    private fun fetchRecommendations(latitude: Double, longitude: Double) {
        fetchNearbyRestaurants(latitude, longitude) { restaurants ->
            val prompt = "Recommend restaurants from the following list for a user who likes ${userPreferences.joinToString(", ")}: ${restaurants.joinToString(", ") { it.name }}"

            Log.d("OpenAI Request", "Prompt: $prompt")

            val requestBody = JSONObject().put("prompt", prompt).put("max_tokens", 50).toString()
                .toRequestBody("application/json".toMediaTypeOrNull())

            val client = OkHttpClient()
            val apiKey = BuildConfig.OPEN_AI_KEY
            val request = Request.Builder()
                .url("https://api.openai.com/v1/engines/davinci-codex/completions")
                .addHeader("Authorization", "Bearer $apiKey")
                .post(requestBody)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    e.printStackTrace()
                    Log.e("OpenAI Error", e.message ?: "Unknown error")
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        val myResponse = response.body?.string()
                        Log.d("OpenAI Response", myResponse ?: "No response")
                        // 处理推荐结果
                    } else {
                        Log.e("OpenAI Response Error", response.message)
                    }
                }
            })
        }
    }
    */

}

data class Restaurant(val name: String)

@Composable
fun FoodSelection(
    categories: List<String>,
    currentCategoryIndex: Int,
    onThumbsUp: () -> Unit,
    onThumbsDown: () -> Unit
) {
    Column(horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
        val category = categories[currentCategoryIndex]
        val imageResId = when (category) {
            "Pizza" -> R.drawable.pizza
            "Burger" -> R.drawable.burger
            "Sushi" -> R.drawable.sushi
            "Pasta" -> R.drawable.pasta
            "Salad" -> R.drawable.salad
            "Steak" -> R.drawable.steak
            "Seafood" -> R.drawable.seafood
            "Tacos" -> R.drawable.tacos
            "Sandwich" -> R.drawable.sandwich
            "Soup" -> R.drawable.soup
            "Dessert" -> R.drawable.dessert
            "BBQ" -> R.drawable.bbq
            "Vegetarian" -> R.drawable.vegetarian
            "Vegan" -> R.drawable.vegan
            "Chinese" -> R.drawable.chinese
            else -> R.drawable.placeholder // 使用默认图片资源
        }
        Image(painter = painterResource(id = imageResId), contentDescription = category, modifier = Modifier.size(256.dp))  // Increase image size
        Text(
            text = "Do you like $category?",
            style = MaterialTheme.typography.headlineSmall
        )
        Spacer(modifier = Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.SpaceEvenly) {
            Button(onClick = onThumbsUp) {
                Text(text = "👍")
            }
            Button(onClick = onThumbsDown) {
                Text(text = "👎")
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    FoodTheme {
        FoodSelection(
            categories = listOf("Pizza", "Burger", "Sushi"),
            currentCategoryIndex = 0,
            onThumbsUp = {},
            onThumbsDown = {}
        )
    }
}
