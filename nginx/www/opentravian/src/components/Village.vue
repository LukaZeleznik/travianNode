<template>
    <div>
        <!-- Main Body -->
        <div class="container mt-4">
            <div class="row">
                <!-- Village Fields -->
                <div class="col-md-8 col-sm-12 col-12">
                    <div class="h2 text-center mb-4"><strong>VillageName</strong></div>
                        <!-- Fields --> 
                        <villageFields></villageFields>
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
                    <!-- nevem kje je ta closing div tag ampak ne dela ce ga dodam :) ... -->
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
            villageBuildingLevels : [],
            villageBuildingTypes : [],
            villageBuildingColors : ["","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","Green","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SlateGray"],
            villageResFieldUpgrades : [],
            villageResFieldUpgradesTimeLeft : [],
            villageIncomingAttacks : [],
            villageIncomingReinforcements : [],
            villageOutgoingAttacks : [],
            villageOutgoingReinforcements : [],
            villageIncomingAttacksTimeLeft : [],
            villageIncomingReinforcementsTimeLeft : [],
            villageOutgoingAttacksTimeLeft : [],
            villageOutgoingReinforcementsTimeLeft : [],
            buildingInfoLookup: infoLookup.buildingInfoLookup,
        };
    },

  created() {
    this.fetchVillageTroopMovements();
    this.fetchVillageOwnTroops();
    this.fetchVillageReinforcements();
    this.fetchVillageResFieldUpgrades();
    this.startTroopMovementsInterval();
    this.villageBuildingTypes[11] = "Resources";
    this.villageBuildingTypes[7] = "Barracks";
  },

  methods: {
    fetchVillageResFieldLevels(){
      this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;

      this.$store.dispatch('fetchVillageResFieldLevels')
      .then( () => {
        this.villageResFieldLevels = this.$store.getters.getVillageResFieldLevels;
      });
    },
    fetchVillageResFieldUpgrades(){
      console.log("fetching village resfieldupgrades");
      this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;

      this.$store.dispatch('fetchVillageResFieldUpgrades')
      .then( () => {
        this.villageResFieldUpgrades = this.$store.getters.getVillageResFieldUpgrades;
        if(this.villageResFieldUpgrades.length < 1) return;
        this.villageResFieldUpgradesTimeLeft[0] = (this.villageResFieldUpgrades[0].timeCompleted - Math.floor(new Date().getTime()/1000));
      });
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
    startTroopMovementsInterval(){
      setInterval( ()=> {
        //if(!this.villageResFieldUpgradesTimeLeft) return;
        if(this.villageIncomingAttacksTimeLeft[0] > 0){
          this.$set(this.villageIncomingAttacksTimeLeft, 0, this.villageIncomingAttacksTimeLeft[0]-1);
        }
        if(this.villageIncomingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageIncomingReinforcementsTimeLeft, 0, this.villageIncomingReinforcementsTimeLeft[0]-1);
        }
        if(this.villageOutgoingAttacksTimeLeft[0] > 0){
          this.$set(this.villageOutgoingAttacksTimeLeft, 0, this.villageOutgoingAttacksTimeLeft[0]-1);
        }
        if(this.villageOutgoingReinforcementsTimeLeft[0] > 0){
          this.$set(this.villageOutgoingReinforcementsTimeLeft, 0, this.villageOutgoingReinforcementsTimeLeft[0]-1);
        }
        
        if(this.villageIncomingAttacksTimeLeft[0] == 0 || this.villageIncomingReinforcementsTimeLeft[0] == 0 || this.villageOutgoingAttacksTimeLeft[0] == 0 || this.villageOutgoingReinforcementsTimeLeft[0] == 0){
          this.fetchVillageOwnTroops();
          this.fetchVillageTroopMovements();
        }
      }, 1000);
    }
  }
}
</script>
