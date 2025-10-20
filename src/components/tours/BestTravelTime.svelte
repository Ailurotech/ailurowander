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
      // 检查tour.destination是否在预定义城市列表中
      const destination = tour.destination;
      
      // 预定义城市映射
      const cityMap: Record<string, string> = {
        'Beijing': '北京',
        'Shanghai': '上海',
        'Xi\'an': '西安',
        'Xian': '西安',
        '北京': '北京',
        '上海': '上海',
        '西安': '西安'
      };
      
      // 获取目标城市
      const targetCity = cityMap[destination] || destination;
      
      // 模拟API调用 - 在实际应用中这里会调用真实的天气API
      // 示例数据 - 实际项目中应该从API获取
      const citiesData: Record<string, WeatherData> = {
        '北京': {
          name: 'beijing',
          temperatures: [-4, -1, 5, 12, 18, 23, 26, 25, 20, 14, 7, 0],
          rainfall: [3, 4, 8, 22, 30, 55, 120, 90, 40, 25, 7, 3]
        },
        '上海': {
          name: 'shanghai',
          temperatures: [4, 6, 10, 16, 21, 25, 28, 28, 24, 19, 13, 7],
          rainfall: [60, 70, 90, 100, 110, 160, 150, 140, 120, 60, 50, 40]
        },
        '西安': {
          name: 'xian',
          temperatures: [-1, 3, 9, 16, 21, 25, 27, 26, 21, 15, 8, 2],
          rainfall: [10, 12, 18, 30, 45, 60, 110, 95, 65, 40, 18, 7]
        }
      };
      
      // 如果目标城市在预定义数据中，则使用该数据
      if (citiesData[targetCity]) {
        weatherData = [citiesData[targetCity]];
      } else {
        // 如果不在预定义数据中，则使用默认城市数据
        weatherData = [citiesData['北京'], citiesData['上海'], citiesData['西安']];
      }
    } catch (err) {
      console.error('Failed to fetch weather data:', err);
      error = get(t)('tours.best_travel_time.error');
      // 在出错时显示默认数据
      weatherData = [
        {
          name: 'beijing',
          temperatures: [-4, -1, 5, 12, 18, 23, 26, 25, 20, 14, 7, 0],
          rainfall: [3, 4, 8, 22, 30, 55, 120, 90, 40, 25, 7, 3]
        },
        {
          name: 'shanghai',
          temperatures: [4, 6, 10, 16, 21, 25, 28, 28, 24, 19, 13, 7],
          rainfall: [60, 70, 90, 100, 110, 160, 150, 140, 120, 60, 50, 40]
        },
        {
          name: 'xian',
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
            <td rowspan="2" class="py-2 px-4 border-b border-r font-medium">{$t(`tours.best_travel_time.cities.${city.name}`)}</td>
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