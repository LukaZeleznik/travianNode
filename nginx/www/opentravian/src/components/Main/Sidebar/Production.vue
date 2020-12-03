<template>
  <div>
    <div class="h3 mt-3">Production:</div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/wood.gif" /> Wood:
      </h5>
      <h5>
       <strong>{{ (villageProduction[0]).toFixed(0) }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/clay.gif" /> Clay:
      </h5>
      <h5>
        <strong>{{ (villageProduction[1]).toFixed(0) }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/iron.gif" /> Iron:
      </h5>
      <h5>
        <strong>{{ (villageProduction[2]).toFixed(0) }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/resources/crop.gif" /> Crop:
      </h5>
      <h5>
        <strong>{{ (villageProduction[3]).toFixed(0) }}</strong> per hour
      </h5>
    </div>
  </div>
</template>

<script>
import { fetchMixins } from '../../../mixins/fetchMixins'

export default {
    data() {
        return {
        };
    },

    mixins: [fetchMixins],

    watch: {
    }
}
</script>
