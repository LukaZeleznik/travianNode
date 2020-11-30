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
    }
}
</script>