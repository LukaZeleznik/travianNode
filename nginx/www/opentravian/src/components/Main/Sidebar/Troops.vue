<template>
    <div>
        <div class="h3 mt-3">Troops:</div>
            <div class="h5" v-if="villageOwnTroops.length > 0">
                <div class="d-flex align-center" v-for="(villageOwnTroop, index) in villageOwnTroops" :key="index">
                    <h5 v-if="villageOwnTroop"><img :src="'/images/troops/' + userTribe + '/' + (index+1) + '.gif'">  {{ (villageOwnTroop).toFixed(0) }} {{ troopInfoLookup[userTribe][index]['name'] }} </h5>
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
import { fetchMixins } from '../../../mixins/fetchMixins'

export default {
    data() {
        return {
            userTribe: "Teuton",
        };
    },

    mixins: [fetchMixins],

    watch: {
    },

    created() {
        this.fetchVillageOwnTroops();
        this.fetchVillageReinforcements();
    },

    methods: {
    }
}
</script>