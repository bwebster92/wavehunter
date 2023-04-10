import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const id = ref('benny');
  const break_pref = ref('Park-Beach-1');

  return {
    id,
    break_pref,
  };
});
