import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useBreaksStore = defineStore('breaks', () => {
  const meta = ref({
    fields: [],
  });
  const data = ref({
    region: [],
    break_id: [],
  });
  const uniqueRegions = computed(() => [...new Set(data.value.region)]);

  return {
    meta,
    data,
    uniqueRegions,
  };
});
