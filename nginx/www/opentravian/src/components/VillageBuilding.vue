<template>
    <div>
        <div class="container" v-if="villageBuildingType > -1">
            <div class="justify-content-center text-center">
                <h1 class="my-4">{{ buildingInfoLookup[villageBuildingType]["name"] }} <span v-if="villageBuildingLevel > 0">Level {{ villageBuildingLevel }}</span></h1>
                <h6 class="my-4">{{ buildingInfoLookup[villageBuildingType]["desc"] }}</h6>
                <component :is="'villageBuilding' + villageBuildingType"></component>
            </div>
        </div>
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'

export default {
    data() {
        return {
            villageBuildingType: undefined,
            villageBuilding: undefined
        };
    },

    mixins: [fetchMixins],

    created() {
        this.fetchBuildingData(this.$route.params.vbid);
    },

    methods: {}
}
</script>