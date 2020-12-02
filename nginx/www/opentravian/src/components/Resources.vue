<template>
  <div>

  <!-- Main Body -->
  <div class="container mt-4">
    <div class="row">
        <!-- Resource Fields -->
        <div class="col-md-8 col-sm-12 col-12">
          <div class="h2 text-center mb-5"><strong>VillageName</strong></div>
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
      buildingInfoLookup: infoLookup.buildingInfoLookup,
      resourceInfoLookup: infoLookup.resourceInfoLookup,
    };
  },

  created() {
    this.test();
    this.test2();
  },

  methods: {
    test(){
      this.$store.watch(
          function (state) {
              return state.my_state;
          },
          function () {
              //console.log("change");
          },
          {
              deep: true //add this if u need to watch object properties change etc.
          }
      );
    },
    test2(){
        this.$store.subscribe((mutation, state) => {
          if(mutation.type == "setVillageResources"){
            //console.log(mutation);
            //console.log(state);
          }
      });
    },
    fetchVillageResources(){
        this.villageResources = this.$store.getters.getVillageResources;

        this.$store.dispatch('fetchVillageResources')
        .then( () => {
            this.villageResources = this.$store.getters.getVillageResources;
        })
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