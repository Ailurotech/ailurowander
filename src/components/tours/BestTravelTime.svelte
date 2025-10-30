<script lang="ts">
  import type { Tour } from '$lib/types/tour';
  import { onMount } from 'svelte';
  import { t, locale } from '$lib/i18n';
  import { get } from 'svelte/store';

  export let tour: Tour;

  // 定义城市天气数据类型
  type WeatherData = {
    name: string;
    temperatures: number[];
    rainfall: number[];
  };

  // 天气数据状态
  let weatherData: WeatherData[] = [];
  let loading = false;
  let error: string | null = null;

  // 在组件挂载时获取天气数据
  onMount(async () => {
    await fetchWeatherData();
  });

  // 获取天气数据
  async function fetchWeatherData() {
    loading = true;
    error = null;

    try {
      // 从tour.destination获取城市名称
      const destination = tour.destination;

      if (!destination) {
        throw new Error('No destination specified');
      }

      console.log('Fetching weather data for destination:', destination);

      // 调用天气API
      const response = await fetch(`/api/weather?city=${encodeURIComponent(destination)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();

      // 设置天气数据
      weatherData = [data];
      console.log('Weather data fetched successfully:', data);

    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      error = get(t)('tours.best_travel_time.error');

      // 在出错时显示默认数据作为后备
      weatherData = [
        {
          name: 'Beijing',
          temperatures: [-4, -1, 5, 12, 18, 23, 26, 25, 20, 14, 7, 0],
          rainfall: [3, 4, 8, 22, 30, 55, 120, 90, 40, 25, 7, 3]
        },
        {
          name: 'Shanghai',
          temperatures: [4, 6, 10, 16, 21, 25, 28, 28, 24, 19, 13, 7],
          rainfall: [60, 70, 90, 100, 110, 160, 150, 140, 120, 60, 50, 40]
        },
        {
          name: 'Xian',
          temperatures: [-1, 3, 9, 16, 21, 25, 27, 26, 21, 15, 8, 2],
          rainfall: [10, 12, 18, 30, 45, 60, 110, 95, 65, 40, 18, 7]
        }
      ];
    } finally {
      loading = false;
    }
  }
</script>

<div class="mb-12">
  <h2 class="text-2xl font-bold mb-4">{$t('tours.best_travel_time.title')}</h2>
  
  <p class="mb-6 text-gray-700">
    {$t('tours.best_travel_time.description')}
  </p>
  
  {#if loading}
    <div class="text-center py-8">
      <p>{$t('tours.best_travel_time.loading')}</p>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
      <p class="text-red-700">{error}</p>
    </div>
  {/if}
  
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 border-b border-r text-left">{$t('tours.best_travel_time.city')}</th>
          {#each Array(12) as _, i}
            <th class="py-2 px-4 border-b border-r text-center">{i + 1}{$t('tours.best_travel_time.month')}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each weatherData as city, cityIndex}
          <tr class="{cityIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <td rowspan="2" class="py-2 px-4 border-b border-r font-medium">{city.name}</td>
            <!-- 温度数据行 -->
            {#each city.temperatures as temp, i}
              <td class="py-2 px-4 border-b border-r text-center">{temp}°C</td>
            {/each}
          </tr>
          <tr class="{cityIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
            <!-- 降雨量数据行 -->
            {#each city.rainfall as rain, i}
              <td class="py-2 px-4 border-b border-r text-center">{rain}mm</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>