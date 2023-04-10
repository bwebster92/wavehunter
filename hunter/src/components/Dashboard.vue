<script setup>
import Controls from './Controls.vue'
import ForecastTable from './ForecastTable.vue'
import { useForecastStore } from '../stores/forecast';

const forecast = useForecastStore()
</script>

<template>
  <div class="dash">
    <Controls />
    <!-- May be losing reactivity below -->
    <ForecastTable
      v-for="key in Object.keys(forecast.breakList)"
      :key="key"
      :breakData="forecast.breakList[key]"
    />
  </div>
</template>