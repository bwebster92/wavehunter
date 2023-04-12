import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useForecastStore } from './forecast';

export const useScrapeStore = defineStore('scrape', () => {
  const scrape_id = ref('');
  const scrape_params = ref({});
  const spider_name = ref('');
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
          forecast.getForecastData();
        }
      })
      .catch((err) => console.log(err.stack));
  }

  return {
    scrape_id,
    scrape_params,
    spider_name,
    completed,
    start_time,
    end_time,
    monitorScrape,
  };
});
