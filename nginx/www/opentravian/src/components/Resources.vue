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

export default {
  data() {
    return {
      villageResources : [],
      villageResFieldLevels : [],
      villageResFieldTypes : [],
      villageResFieldColors : [],
      villageProduction : [],
      villageResFieldUpgrades : [],
      villageResFieldUpgradesTimeLeft : [],
      villageBuildingUpgrades : [],
      villageBuildingUpgradesTimeLeft : [],
      villageOwnTroops : [],
      villageReinforcements : [],
      villageIncomingAttacks : [],
      villageIncomingReinforcements : [],
      villageOutgoingAttacks : [],
      villageOutgoingReinforcements : [],
      villageIncomingAttacksTimeLeft : [],
      villageIncomingReinforcementsTimeLeft : [],
      villageOutgoingAttacksTimeLeft : [],
      villageOutgoingReinforcementsTimeLeft : [],
    };
  },

  created() {
    this.fetchVillageResources();
    this.fetchVillageResFieldTypes();
    this.fetchVillageResFieldLevels();
    this.fetchVillageTroopMovements();
    this.fetchVillageProduction();
    this.fetchVillageOwnTroops();
    this.fetchVillageReinforcements();
    this.startUpgradeInterval();
    this.startTroopMovementsInterval();
  },

  methods: {
    fetchVillageResources(){
      this.villageResources = this.$store.getters.getVillageResources;

      this.$store.dispatch('fetchVillageResources')
      .then( () => {
        this.villageResources = this.$store.getters.getVillageResources;
      });
    },
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
    fetchVillageProduction(){
      this.villageProduction = this.$store.getters.getVillageProduction;

      this.$store.dispatch('fetchVillageProduction')
      .then( () => {
        this.villageProduction = this.$store.getters.getVillageProduction;
      })

    },
    fetchVillageOwnTroops(){
      this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;

      this.$store.dispatch('fetchVillageOwnTroops')
      .then( () => {
        this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
      });
    },
    fetchVillageReinforcements(){
      this.villageReinforcements = this.$store.getters.getVillageReinforcements;

      this.$store.dispatch('fetchVillageReinforcements')
      .then( () => {
        this.villageReinforcements = this.$store.getters.getVillageReinforcements;
      });
    },
    fetchVillageTroopMovements(){
      this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
      this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
      this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
      this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

      this.$store.dispatch('fetchVillageTroopMovements')
      .then( () => {
        this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
        this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
        this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
        this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

        if(this.villageIncomingAttacks.length > 0){this.villageIncomingAttacksTimeLeft[0] = (this.villageIncomingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageIncomingReinforcements.length > 0){this.villageIncomingReinforcementsTimeLeft[0] = (this.villageIncomingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageOutgoingAttacks.length > 0){this.villageOutgoingAttacksTimeLeft[0] = (this.villageOutgoingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
        if(this.villageOutgoingReinforcements.length > 0){this.villageOutgoingReinforcementsTimeLeft[0] = (this.villageOutgoingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
      });
    },
    startUpgradeInterval(){
      var upgradeCD1Interval = setInterval( ()=> {
        //if(!this.villageResFieldUpgradesTimeLeft) return;
        if(this.villageResFieldUpgradesTimeLeft[0] > 0){
          this.$set(this.villageResFieldUpgradesTimeLeft, 0, this.villageResFieldUpgradesTimeLeft[0]-1);
        }
        else if(this.villageResFieldUpgradesTimeLeft[0] == 0 ){
          this.fetchVillageResFieldLevels();
          this.fetchVillageResources();
          this.fetchVillageProduction();
          clearInterval(upgradeCD1Interval);
        }
      }, 1000);
    },
    startTroopMovementsInterval(){
      setInterval( ()=> {
        let change = false;

        if(this.villageIncomingAttacksTimeLeft[0] > 0){
          this.$set(this.villageIncomingAttacksTimeLeft, 0, this.villageIncomingAttacksTimeLeft[0]-1);
          change = true;
        }
        if(this.villageIncomingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageIncomingReinforcementsTimeLeft, 0, this.villageIncomingReinforcementsTimeLeft[0]-1);
          change = true;
        }
        if(this.villageOutgoingAttacksTimeLeft[0] > 0){
          this.$set(this.villageOutgoingAttacksTimeLeft, 0, this.villageOutgoingAttacksTimeLeft[0]-1);
          change = true;
        }
        if(this.villageOutgoingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageOutgoingReinforcementsTimeLeft, 0, this.villageOutgoingReinforcementsTimeLeft[0]-1);
          change = true;
        }
        
        if(change && (this.villageIncomingAttacksTimeLeft[0] == 0 || this.villageIncomingReinforcementsTimeLeft[0] == 0 || this.villageOutgoingAttacksTimeLeft[0] == 0 || this.villageOutgoingReinforcementsTimeLeft[0] == 0)){
          this.fetchVillageOwnTroops();
          this.fetchVillageTroopMovements();
        }
      }, 1000);
    }
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