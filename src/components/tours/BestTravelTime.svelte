<script lang="ts">
  import type { Tour } from '$lib/types/tour';

  // 定义城市天气数据
  type WeatherData = {
    name: string;
    temperatures: number[];
    rainfall: number[];
  };

  // 示例数据 - 实际项目中可能需要从API获取
  const citiesData: WeatherData[] = [
    {
      name: "北京",
      temperatures: [-4, -1, 5, 12, 18, 23, 26, 25, 20, 14, 7, 0],
      rainfall: [3, 4, 8, 22, 30, 55, 120, 90, 40, 25, 7, 3]
    },
    {
      name: "上海",
      temperatures: [4, 6, 10, 16, 21, 25, 28, 28, 24, 19, 13, 7],
      rainfall: [60, 70, 90, 100, 110, 160, 150, 140, 120, 60, 50, 40]
    },
    {
      name: "西安",
      temperatures: [-1, 3, 9, 16, 21, 25, 27, 26, 21, 15, 8, 2],
      rainfall: [10, 12, 18, 30, 45, 60, 110, 95, 65, 40, 18, 7]
    }
  ];
</script>

<div class="mb-12">
  <h2 class="text-2xl font-bold mb-4">When to go</h2>
  
  <p class="mb-6 text-gray-700">
    The best times to visit China are in spring, April to May and autumn, 
    September to October, when the days are warm and rainfall and humidity low.
  </p>
  
  <div class="overflow-x-auto">
    <table class="min-w-full bg-white border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 border-b border-r text-left">城市</th>
          {#each Array(12) as _, i}
            <th class="py-2 px-4 border-b border-r text-center">{i + 1}月</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each citiesData as city, cityIndex}
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