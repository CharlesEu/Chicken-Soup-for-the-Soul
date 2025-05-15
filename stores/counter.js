import {ref} from "vue"
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
	const count = ref(0);
	const username = ref("咸虾米");
	function increment() {
		count.value++;
	}

	return { count, increment,username };
});
