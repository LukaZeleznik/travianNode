<template>
    <div>
        <div class="container" v-if="villageBuildingType > -1">
            <div class="justify-content-center text-center">
                <h1 class="my-4">{{ buildingInfoLookup[villageBuildingType]["name"] }} <span>Level {{ villageBuildingLevel }}</span></h1>
                <h6 class="my-4">{{ buildingInfoLookup[villageBuildingType]["desc"] }}</h6>
                <component :is="'villageBuilding' + villageBuildingType"></component>
            </div>
        </div>
    </div>
</template>


<script>
import * as infoLookup from '../assets/js/infoLookupTools.js';
import { fetchMixins } from '../../src/mixins/fetchMixins'

export default {
    data() {
        return {
            villageBuildingType: undefined,
            villageBuildingLevel: undefined,
            buildingInfoLookup: infoLookup.buildingInfoLookup,
            troopInfoLookup: infoLookup.troopInfoLookup,
            villageResources: this.$store.getters.getVillageResources,
        };
    },

    mixins: [fetchMixins],

    created() {
        this.fetchVillageResources();
        this.fetchBuildingData(this.$route.params.vbid);
    },

    methods: {}
}
</script>