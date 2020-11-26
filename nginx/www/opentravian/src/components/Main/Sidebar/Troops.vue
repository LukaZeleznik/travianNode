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
export default {
    data() {
        return {
            villageOwnTroops: this.$store.getters.getVillageOwnTroops,
            userTribe: "Teuton",
            troopInfoLookup: undefined,
        };
    },

    watch: {
        '$store.getters.getVillageOwnTroops': function() {
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
        },
    },

    created() {
        this.importRequiredLookups();
    },

    methods: {
        importRequiredLookups(){
            this.troopInfoLookup = require('../../../../public/infoTables/troopInfoLookup.json');
        },
    }
}
</script>