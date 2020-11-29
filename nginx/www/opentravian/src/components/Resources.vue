<template>
  <div>

  <!-- Main Body -->
  <div class="container mt-4">
    <div class="row">
        <!-- Resource Fields -->
        <div class="col-md-8 col-sm-12 col-12">
          <div class="h2 text-center mb-4"><strong>VillageName</strong></div>
            <!-- Fields -->
            <resourcesFields></resourcesFields>
            <!-- Footer Queue -->
            <footerBuildingQueue></footerBuildingQueue>
        </div>
        <!-- Sidebar -->
        <div class="col-md-4 text-center mb-3 rightSide">
            <!-- Troop Movements -->
            <sidebarTroopMovements></sidebarTroopMovements>
            <!-- Production -->
            <sidebarProduction></sidebarProduction>
            <!-- Troops -->
            <sidebarTroops></sidebarTroops>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import * as infoLookup from '../assets/js/infoLookupTools.js';

export default {
  data() {
    return {
      villageResFieldLevels : [],
      villageResFieldTypes : [],
      villageResFieldColors : [],
      buildingInfoLookup: infoLookup.buildingInfoLookup,
    };
  },

  created() {
    this.fetchVillageResFieldTypes();
    this.fetchVillageResFieldLevels();
  },

  methods: {
    fetchVillageResFieldLevels(){
      this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;

      this.$store.dispatch('fetchVillageResFieldLevels')
      .then( () => {
        this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;
      });
    },
    fetchVillageResFieldTypes(){
      this.villageResFieldTypes = this.$store.getters.getVillageResFieldTypes;
      this.villageResFieldColors = this.$store.getters.getVillageResFieldColors;

      this.$store.dispatch('fetchVillageResFieldTypes')
      .then( () => {
        this.villageResFieldTypes = this.$store.getters.getVillageResFieldTypes;
        this.villageResFieldColors = this.$store.getters.getVillageResFieldColors;
      });
    },
  }
}
</script>

<style>
@media (max-width: 600px) {
  #villageResources{
    margin-right: -15px;
    margin-left: -15px;
  }

  #villageResources .flex-row {
    flex-wrap: wrap;
  }

  #villageResources .flex-row .list-group-item{
    width: 50%;
    text-align: center;
  }

  .navbar-brand{
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .rightSide{
    margin-top: 5%;
  }
  
  .upgrageResFieldsText{
    text-align: center;
    padding-left: 0 !important;
    margin-left: 0 !important;
  }

  .upgrageResFieldData{
    padding-left: 0 !important;
    margin-left: 0 !important;
  }
}
</style>