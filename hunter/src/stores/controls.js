import axios from 'axios';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useBreaksStore } from './breaks';
import { useForecastStore } from './forecast';

export const useControlsStore = defineStore('controls', () => {
  const breaks = useBreaksStore();

  const region = ref('Tasmania-East-Coast');
  const break_id = ref([]);
  const swellHeight = ref(null);
  const swellPeriod = ref(null);
  const swellDirection = ref([]);
  const windSpeed = ref(null);
  const windState = ref([]);
  const windDirection = ref([]);

  const breaksByRegion = computed(() => {
    let filterByRegion = breaks.data.break_id.filter((item, index) => {
      return breaks.data.region[index] === region.value;
    });
    return filterByRegion;
  });

  return {
    region,
    break_id,
    swellHeight,
    swellPeriod,
    swellDirection,
    windSpeed,
    windState,
    windDirection,
    breaksByRegion,
    retrieveBreaks,
  };
});
