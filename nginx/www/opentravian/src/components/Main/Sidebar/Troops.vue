<template>
    <div>
        <div class="h3 mt-3">Troops:</div>
            <div class="h5" v-if="villageOwnTroops.length > 0">
                <div class="d-flex justify-content-center" v-for="(villageOwnTroop, index) in villageOwnTroops" :key="index">
                    <h5 v-if="villageOwnTroop"><img src="/images/maceman.gif">  {{villageOwnTroop}} clubswinger </h5>
                    <!-- TODO needs troopInfoLookup -->
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
        };
    },
    watch: {
        '$store.getters.getVillageOwnTroops': function() {
            this.villageOwnTroops = this.$store.getters.getVillageOwnTroops;
        },
    }
}
</script>