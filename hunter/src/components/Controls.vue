<script setup>
import { useBreaksStore } from '../stores/breaks';
import { useControlsStore } from '../stores/controls';
import { useForecastStore } from '../stores/forecast';

const breaks = useBreaksStore();
const controls = useControlsStore();
const forecast = useForecastStore();
</script>

<template>
  <v-expansion-panels accordion>
    <v-expansion-panel id="break-selector">
      <v-expansion-panel-title v-slot:default="{ expanded }">
        <v-row no-gutters>

          <v-col col="4">
            Breaks
          </v-col>

          <v-col cols="8">
            <v-fade-transition leave-absolute>
              <span
                v-if="expanded"
                key="0"
                >
                Pick your breaks
              </span>
              <span
                v-else
                key="1"
                >
                {{ controls.break_id }}
              </span>
            </v-fade-transition>
          </v-col>

        </v-row>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row no-gutters align-center>

          <v-col cols="4">
            <v-select
              label="Region:"
              v-model="controls.region"
              :items="breaks.uniqueRegions"
              flat
              >
            </v-select>
          </v-col>

          <v-col cols="4">
            <v-select
              label="Break:"
              v-model="controls.break_id"
              :items="controls.breaksByRegion"
              multiple
              chips
              flat
              >
            </v-select>
          </v-col>

          <v-col cols="4">
            <v-btn id="break-submit" @click="forecast.retrieveBreaks">
              Submit
            </v-btn>
          </v-col>

        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel id="swell-options">
      <v-expansion-panel-title v-slot:default="{ expanded }">
        <v-row no-gutters>

          <v-col col="4">
            Swell
          </v-col>

          <v-col cols="8">
            <v-fade-transition leave-absolute>
              <span
                v-if="expanded"
                key="0"
                >
                Set your preferred swell conditions
              </span>
              <span
                v-else
                key="1"
                >
                {{ controls.swellHeight }}
              </span>
            </v-fade-transition>
          </v-col>

        </v-row>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-row no-gutters>

          <v-col cols="4">
            <v-range-slider
              label="Swell Height:"
              >
            </v-range-slider>
          </v-col>

          <v-col cols="4">
            <v-range-slider
              label="Swell Period:"
              >
            </v-range-slider>
          </v-col>

          <v-col cols="4">
            <v-select
              label="Swell Direction:"
              :items="['SSW']"
              v-model="controls.swellDirection"
              multiple
              chips
              flat
              >
            </v-select>
          </v-col>

        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel id="wind-options">
      <v-expansion-panel-title v-slot:default="{ expanded }">
        <v-row no-gutters>
          <v-col col="4">
            Wind
          </v-col>
          <v-col cols="8" text-grey>
            <v-fade-transition leave-absolute>
              <span
                v-if="expanded"
                key="0"
                >
                Set your preferred wind conditions
              </span>
              <span
                v-else
                key="1"
                >
                {{ controls.windState }}
              </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row no-gutters>
          <v-col cols="4">
            <v-range-slider
              label="Wind Speed:"
              >
            </v-range-slider>
          </v-col>

          <v-col cols="4">
            <v-select
              label="Wind State:"
              v-model="controls.windState"
              :items="['Off', 'Glass', 'On']"
              multiple
              chips
              flat
              >
            </v-select>
          </v-col>

          <v-col cols="4">
            <v-select
              label="Wind Direction"
              v-model="controls.windDirection"
              :items="['NNE', 'N', 'NW']"
              >

            </v-select>
          </v-col>
        </v-row>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
</style>
