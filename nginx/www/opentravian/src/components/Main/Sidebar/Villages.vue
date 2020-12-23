<template>
    <div>
        <div class="h3 mt-3">Villages:</div>
        <div >
            <div class="h5">
                <div class="d-flex align-center" v-for="(village, index) in sidebarVillageList" :key="index">
                    <a style="cursor: pointer;"><h5 @click="changeVillage(village._id)">
                        {{ village.name }} ({{ village.xCoordinate }}|{{ village.yCoordinate }})
                    </h5></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
        };
    },

    mixins: [fetchMixins,toolsMixins],

    watch: {
    },

    created() {
    },

    methods: {
        changeVillage(idVillage){
            if(idVillage){
                this.$store.commit('setActiveVillageId', idVillage);
                localStorage.setItem('activeVillageId', idVillage);
                this.reloadVillage();
            }
        },
        reloadVillage(){
            switch (this.$route.name) {
                case 'resources':
                    this.reloadStore();
                    this.fetchResourceFieldsData();
                    this.fetchvillageResourceFields();
                    break;
                case 'village':
                    this.reloadStore();
                    this.fetchBuildingData();
                    this.fetchvillageBuildingFields();
                    break;
            }
        },
        reloadStore(){
            this.getActiveVillageName();
            this.fetchVillageOwnTroops();
            this.fetchVillageResources();
            this.fetchVillageProduction();
            this.fetchVillageMaxResources();
            this.fetchVillageTroopMovements();
            this.fetchVillageReinforcements();
            this.fetchVillageResFieldUpgrades();
            this.fetchVillageBuildingUpgrades();    
        }
    }
}
</script>