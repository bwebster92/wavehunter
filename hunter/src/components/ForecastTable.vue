<script setup>

const props = defineProps(['breakData'])
</script>

<template>
  <v-container fluid>
    <h1 class="table-meta">{{ breakData.meta.break_id.replace('-', ' ').replace('-1', '') }}</h1>
    <v-table>
      <thead class="forecast-time">
        <tr>
          <th scope="col" class="measure-name">Forecast Time</th>
          <th scope="col" class="measurement" v-for="item in breakData.data.forecast_time">{{ item }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="swell-height">
          <th scope="row" class="measure-name">Swell Height</th>
          <td class="measurement" v-for="item of breakData.data.swell_info">{{ item[0].height }}</td>
        </tr>
        <tr class="swell-period">
          <th scope="row" class="measure-name">Swell Period</th>
          <td class="measurement" v-for="item of breakData.data.swell_info">{{ item[0].period }}</td>
        </tr>
        <tr class="swell-direction">
          <th scope="row" class="measure-name">Swell Direction</th>
          <td class="measurement" v-for="item of breakData.data.swell_info">{{ item[0].letters }}</td>
        </tr>
        <tr class="wind-speed">
          <th scope="row" class="measure-name">Wind Speed</th>
          <td class="measurement" v-for="item in breakData.data.wind_speed">{{ item }}</td>
        </tr>
        <tr class="wind-direction">
          <th scope="row" class="measure-name">Wind Direction</th>
          <td class="measurement" v-for="item in breakData.data.wind_direction">{{ item }}</td>
        </tr>
        <tr class="wind-state">
          <th scope="row" class="measure-name">Wind State</th>
          <td class="measurement" v-for="item in breakData.data.wind_state">{{ item }}</td>
        </tr>
      </tbody>
    </v-table>
    <p class="table-meta" v-if="breakData.meta.last_updated">Last updated {{ breakData.meta.last_updated }}</p>
  </v-container>
</template>

<style scoped>
.table-meta {
  user-select: none;
}
h1 {
  text-align: center;
}
p {
  text-align: right;
}
table {
  white-space: nowrap;
  margin: 0;
  border: none;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  border: 1px solid black;
}
table td {
  text-align: center;
}
table td,
table th {
  border: 1px solid black;
  padding: 4px 5px;
}
table thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
}
table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
}

[role="region"][aria-labelledby][tabindex] {
  width: 100%;
  max-height: 98vh;
  overflow: auto;
}
[role="region"][aria-labelledby][tabindex]:focus {
  box-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
  outline: 0;
}
.measurement {
  background-color: white;
}

.measure-name {
  background-color: lightgray;
}
</style>



