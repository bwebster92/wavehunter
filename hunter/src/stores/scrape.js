import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useForecastStore } from './forecast';

export const useScrapeStore = defineStore('scrape', () => {
  const scrape_id = ref('');
  const scrape_params = ref({});
  const completed = ref(false);
  const start_time = ref('');
  const end_time = ref('');

  function monitorScrape() {
    const forecast = useForecastStore();
    axios
      .post('/api/scrape', { scrape_id: scrape_id.value })
      .then((res) => {
        this.$patch(res.data);
        if (completed.value) {
          forecast.retrieveBreaks();
        }
      })
      .catch((err) => console.log(err.stack));
  }

  return {
    scrape_id,
    scrape_params,
    completed,
    start_time,
    end_time,
    monitorScrape,
  };
});
