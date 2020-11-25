<template>
  <div>
    <div class="h3 mt-3">Production:</div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/wood.gif" /> Wood:
      </h5>
      <h5>
       <strong>{{ villageProduction[0] }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/clay.gif" /> Clay:
      </h5>
      <h5>
        <strong>{{ villageProduction[1] }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/iron.gif" /> Iron:
      </h5>
      <h5>
        <strong>{{ villageProduction[2] }}</strong> per hour
      </h5>
    </div>
    <div class="d-flex justify-content-between">
      <h5>
        <img style="width: 1.5rem;height: 1rem;" src="/images/crop.gif" /> Crop:
      </h5>
      <h5>
        <strong>{{ villageProduction[3] }}</strong> per hour
      </h5>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            villageProduction: this.$store.getters.getVillageProduction,
        };
    },
    watch: {
        '$store.getters.getVillageProduction': function() {
            this.villageProduction = this.$store.getters.getVillageProduction;
        },
    }
}
</script>
