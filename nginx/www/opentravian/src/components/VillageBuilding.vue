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
import * as infoLookup from '../assets/js/infoLookupTools.js';

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

    created() {
        this.fetchVillageResources();
        this.getBuildingData();
    },

    methods: {
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            });
        },
        getBuildingData(){
            fetch('http://localhost:8080/api/villageBuildingsData/1')
            .then(res => res.json())
            .then(res => {
                let vbid = this.$route.params.vbid;
                let keyType = "field"+vbid+"Type";
                let keyLevel = "field"+vbid+"Level";

                this.villageBuildingType = res.data[keyType];
                this.villageBuildingLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
}
</script>