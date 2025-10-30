import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

interface GeocodingResult {
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	admin1?: string;
}

interface WeatherData {
	name: string;
	temperatures: number[];
	rainfall: number[];
}

// Fallback city coordinates for common Chinese cities
const CITY_COORDINATES: Record<string, GeocodingResult> = {
	Beijing: { name: 'Beijing', latitude: 39.9042, longitude: 116.4074, country: 'China' },
	Shanghai: { name: 'Shanghai', latitude: 31.2304, longitude: 121.4737, country: 'China' },
	Xian: { name: "Xi'an", latitude: 34.2658, longitude: 108.9541, country: 'China' },
	"Xi'an": { name: "Xi'an", latitude: 34.2658, longitude: 108.9541, country: 'China' },
	Guilin: { name: 'Guilin', latitude: 25.2736, longitude: 110.2906, country: 'China' },
	Chengdu: { name: 'Chengdu', latitude: 30.5728, longitude: 104.0668, country: 'China' },
	'Hong Kong': { name: 'Hong Kong', latitude: 22.3193, longitude: 114.1694, country: 'Hong Kong' },
	Hangzhou: { name: 'Hangzhou', latitude: 30.2741, longitude: 120.1551, country: 'China' },
	Suzhou: { name: 'Suzhou', latitude: 31.2989, longitude: 120.5853, country: 'China' },
	Nanjing: { name: 'Nanjing', latitude: 32.0603, longitude: 118.7969, country: 'China' },
	Chongqing: { name: 'Chongqing', latitude: 29.4316, longitude: 106.9123, country: 'China' },
	Lijiang: { name: 'Lijiang', latitude: 26.8721, longitude: 100.2287, country: 'China' },
	Lhasa: { name: 'Lhasa', latitude: 29.6525, longitude: 91.1721, country: 'China' }
};

// Geocode city name to get coordinates
async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
	// First check if we have hardcoded coordinates
	const normalizedCity = Object.keys(CITY_COORDINATES).find(
		(key) => key.toLowerCase() === cityName.toLowerCase()
	);

	if (normalizedCity) {
		console.log(`Using hardcoded coordinates for: ${cityName}`);
		return CITY_COORDINATES[normalizedCity];
	}

	try {
		const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
		console.log(`Geocoding city: ${cityName}`);

		const response = await fetch(geocodeUrl);
		if (!response.ok) {
			console.error(`Geocoding failed with status: ${response.status}`);
			return null;
		}

		const data = await response.json();
		if (!data.results || data.results.length === 0) {
			console.error(`No geocoding results found for: ${cityName}`);
			return null;
		}

		const result = data.results[0];
		console.log(`Geocoded ${cityName} to:`, result);
		return {
			name: result.name,
			latitude: result.latitude,
			longitude: result.longitude,
			country: result.country,
			admin1: result.admin1
		};
	} catch (error) {
		console.error('Geocoding error:', error);
		// If online geocoding fails, return null to trigger fallback
		return null;
	}
}

// Fallback climate data for common cities (when API is unavailable)
const FALLBACK_CLIMATE_DATA: Record<string, WeatherData> = {
	Beijing: {
		name: 'Beijing',
		temperatures: [-4, -1, 5, 12, 18, 23, 26, 25, 20, 14, 7, 0],
		rainfall: [3, 4, 8, 22, 30, 55, 120, 90, 40, 25, 7, 3]
	},
	Shanghai: {
		name: 'Shanghai',
		temperatures: [4, 6, 10, 16, 21, 25, 28, 28, 24, 19, 13, 7],
		rainfall: [60, 70, 90, 100, 110, 160, 150, 140, 120, 60, 50, 40]
	},
	"Xi'an": {
		name: "Xi'an",
		temperatures: [-1, 3, 9, 16, 21, 25, 27, 26, 21, 15, 8, 2],
		rainfall: [10, 12, 18, 30, 45, 60, 110, 95, 65, 40, 18, 7]
	},
	Guilin: {
		name: 'Guilin',
		temperatures: [8, 9, 13, 18, 22, 26, 28, 28, 25, 21, 16, 11],
		rainfall: [60, 90, 130, 200, 280, 320, 240, 180, 90, 70, 60, 40]
	},
	Chengdu: {
		name: 'Chengdu',
		temperatures: [6, 8, 12, 17, 21, 24, 26, 26, 22, 17, 12, 7],
		rainfall: [10, 15, 25, 60, 90, 120, 220, 200, 120, 40, 20, 10]
	},
	'Hong Kong': {
		name: 'Hong Kong',
		temperatures: [16, 17, 19, 23, 26, 28, 29, 29, 28, 25, 22, 18],
		rainfall: [30, 50, 80, 170, 290, 390, 380, 430, 290, 120, 40, 30]
	},
	Hangzhou: {
		name: 'Hangzhou',
		temperatures: [5, 6, 10, 16, 21, 25, 29, 28, 24, 19, 13, 7],
		rainfall: [70, 90, 120, 130, 140, 190, 170, 140, 140, 80, 70, 50]
	},
	Suzhou: {
		name: 'Suzhou',
		temperatures: [4, 5, 9, 15, 20, 24, 28, 28, 24, 18, 12, 6],
		rainfall: [60, 70, 90, 100, 110, 170, 150, 140, 120, 60, 50, 40]
	}
};

// Fetch historical weather data and calculate monthly averages
async function getClimateData(
	latitude: number,
	longitude: number,
	cityName: string
): Promise<WeatherData | null> {
	try {
		// Get 5 years of historical data to calculate climate averages
		const endYear = new Date().getFullYear() - 1; // Last complete year
		const startYear = endYear - 4; // 5 years of data

		console.log(
			`Fetching climate data for ${cityName} (${latitude}, ${longitude}) from ${startYear} to ${endYear}`
		);

		const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startYear}-01-01&end_date=${endYear}-12-31&daily=temperature_2m_mean,precipitation_sum&timezone=auto`;

		const response = await fetch(weatherUrl);
		if (!response.ok) {
			console.error(`Weather API failed with status: ${response.status}`);
			throw new Error('Weather API request failed');
		}

		const data = await response.json();
		if (!data.daily || !data.daily.time) {
			console.error('Invalid weather data structure');
			throw new Error('Invalid weather data structure');
		}

		// Calculate monthly averages
		const monthlyTemps: number[][] = Array.from({ length: 12 }, () => []);
		const monthlyRainfall: number[][] = Array.from({ length: 12 }, () => []);

		for (let i = 0; i < data.daily.time.length; i++) {
			const date = new Date(data.daily.time[i]);
			const month = date.getMonth(); // 0-11

			const temp = data.daily.temperature_2m_mean[i];
			const precip = data.daily.precipitation_sum[i];

			if (temp !== null && temp !== undefined) {
				monthlyTemps[month].push(temp);
			}
			if (precip !== null && precip !== undefined) {
				monthlyRainfall[month].push(precip);
			}
		}

		// Calculate averages for each month
		const temperatures = monthlyTemps.map((temps) => {
			if (temps.length === 0) return 0;
			const sum = temps.reduce((a, b) => a + b, 0);
			return Math.round(sum / temps.length);
		});

		const rainfall = monthlyRainfall.map((precips) => {
			if (precips.length === 0) return 0;
			// Sum daily precipitation to get monthly total, then average across years
			const monthlyTotals: { [key: string]: number } = {};

			precips.forEach((precip, index) => {
				const yearMonth = `${Math.floor(index / 30)}`; // Rough grouping by month
				monthlyTotals[yearMonth] = (monthlyTotals[yearMonth] || 0) + precip;
			});

			const totals = Object.values(monthlyTotals);
			const sum = totals.reduce((a, b) => a + b, 0);
			return Math.round(sum / totals.length);
		});

		console.log(`Climate data calculated for ${cityName}:`, { temperatures, rainfall });

		return {
			name: cityName,
			temperatures,
			rainfall
		};
	} catch (error) {
		console.error('Weather data fetch error:', error);

		// Check if we have fallback data for this city
		const fallbackCity = Object.keys(FALLBACK_CLIMATE_DATA).find(
			(key) => key.toLowerCase() === cityName.toLowerCase()
		);

		if (fallbackCity) {
			console.log(`Using fallback climate data for: ${cityName}`);
			return FALLBACK_CLIMATE_DATA[fallbackCity];
		}

		return null;
	}
}

// Extract primary city from destination string
function extractPrimaryCity(destination: string): string {
	// Remove extra whitespace and normalize
	const normalized = destination.trim();

	// Try to match against known cities first (handles multi-word cities)
	const knownCities = Object.keys(CITY_COORDINATES);
	for (const city of knownCities) {
		if (normalized.toLowerCase().includes(city.toLowerCase())) {
			return city;
		}
	}

	// If no known city found, extract the first segment
	// This handles cases like "Beijing Xi'an Leshan" -> "Beijing"
	const firstSegment = normalized.split(/\s+/)[0];
	return firstSegment;
}

export const GET = async ({ url }: RequestEvent) => {
	console.log('API: GET /api/weather - Fetching weather data');

	try {
		const destination = url.searchParams.get('city');

		if (!destination) {
			return json({ error: 'City parameter is required' }, { status: 400 });
		}

		console.log(`API: GET /api/weather - Destination: ${destination}`);

		// Extract the primary city from the destination string
		const city = extractPrimaryCity(destination);
		console.log(`API: GET /api/weather - Extracted primary city: ${city}`);

		// Step 1: Geocode the city
		const location = await geocodeCity(city);
		if (!location) {
			return json(
				{
					error: 'City not found',
					message: `Could not find location data for: ${city} (from destination: ${destination})`
				},
				{ status: 404 }
			);
		}

		// Step 2: Get climate data
		const weatherData = await getClimateData(location.latitude, location.longitude, location.name);
		if (!weatherData) {
			return json(
				{
					error: 'Weather data unavailable',
					message: `Could not fetch weather data for: ${city}`
				},
				{ status: 500 }
			);
		}

		return json(weatherData);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		const errorStack = error instanceof Error ? error.stack : '';

		console.error('API: GET /api/weather - Error fetching weather data:', errorMessage);
		console.error('Error stack:', errorStack);

		return json({ error: 'Failed to fetch weather data', details: errorMessage }, { status: 500 });
	}
};
