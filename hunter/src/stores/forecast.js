import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useScrapeStore } from './scrape';
import { useControlsStore } from './controls';

export const useForecastStore = defineStore('forecast', () => {
  const controls = useControlsStore();
  const breakData = ref({});
  const breakList = ref([]);

  function retrieveBreaks() {
    const scrape = useScrapeStore();
    axios
      .post('/api/forecast', { break_id: controls.break_id })
      .then((res) => {
        this.$patch(res.data.forecast);
        scrape.$patch(res.data.scrape);

        let missingBreaks = controls.break_id.filter(
          (id) => !res.data.breakList.includes(id)
        );

        if (missingBreaks.length) {
          scrape.monitorScrape();
        }
      })
      .catch((err) => console.log(err));
  }

  return {
    breakData,
    breakList,
    retrieveBreaks,
  };
});
