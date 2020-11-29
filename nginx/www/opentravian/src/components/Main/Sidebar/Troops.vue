<template>
    <div>
        <div class="h3 mt-3">Troops:</div>
            <div class="h5" v-if="villageOwnTroops.length > 0">
                <div class="d-flex align-center" v-for="(villageOwnTroop, index) in villageOwnTroops" :key="index">
                    <h5 v-if="villageOwnTroop"><img :src="'/images/troops/' + userTribe + '/' + (index+1) + '.gif'">  {{ villageOwnTroop }} {{ troopInfoLookup[userTribe][index]['name'] }} </h5>
                </div>
            </div>
            <div class="h5" v-else>
                <div class="text-center">
                <h5>None</h5>
            </div>
        </div>
    </div>
</template>

<script>
import * as infoLookup from '../../../assets/js/infoLookupTools.js';

export default {
    data() {
        return {
            villageBuildingLevels : [],
            villageBuildingTypes : [],
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
            villageOwnTroops: this.$store.getters.getVillageOwnTroops,
            userTribe: "Teuton",
            troopInfoLookup: infoLookup.troopInfoLookup,
        };
    },

    watch: {
        '$store.getters.getVillageOwnTroops': function() {
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
        },
    },

    created() {
        this.fetchVillageOwnTroops();
        this.fetchVillageReinforcements();
        this.fetchVillageTroopMovements();
        this.startTroopMovementsInterval();
    },

    methods: {
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