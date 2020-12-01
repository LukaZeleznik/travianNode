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

export default {
    data() {
        return {
            villageBuildingType: undefined,
            villageBuildingLevel: undefined,
            buildingInfoLookup: infoLookup.buildingInfoLookup,
            troopInfoLookup: infoLookup.troopInfoLookup,
            villageResources: this.$store.getters.getVillageResources,
            userTribe: "Teuton",
        };
    },

    created() {
        this.fetchVillageResources();
        this.fetchBuildingData();
    },

    methods: {
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            });
        },
        fetchBuildingData(){
            fetch('http://localhost:8080/api/villageBuildingFields/1')
            .then(res => res.json())
            .then(res => {
                let vbid = this.$route.params.vbid;
                let keyType = "field"+vbid+"Type";
                let keyLevel = "field"+vbid+"Level";

                if(vbid == 19){
                    switch (this.userTribe) {
                        case "Teuton":  this.villageBuildingType = 5; break;
                        case "Roman":   this.villageBuildingType = 6; break;
                        case "Gaul":    this.villageBuildingType = 7; break;
                    }
                }
                else {
                    this.villageBuildingType = res.data[keyType];
                }
                this.villageBuildingLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
}
</script>