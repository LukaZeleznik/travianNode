<template>
    <div>
        <div class="h3 mt-3">Villages:</div>
        <div >
            <div class="h5">
                <div class="d-flex align-center" v-for="(village, index) in villages" :key="index">
                    <h5 @click="changeVillage(village._id)">
                        {{ village.name }} ({{ village.xCoordinate }}|{{ village.yCoordinate }})
                    </h5>
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
            villages: [],
        };
    },

    mixins: [fetchMixins,toolsMixins],

    watch: {
    },

    created() {
        this.getVillageList();
    },

    methods: {
        async getVillageList(){
            this.villages = await(await(await this.doApiRequest("villages/owner/" + this.getCookie('userId'),"GET","",false)).json()).data;
        },
        changeVillage(idVillage){
            if(idVillage){
                this.$store.commit('setActiveVillageId', idVillage);
                localStorage.setItem('activeVillageId', idVillage);
                this.reloadVillage();
            }
        },
        reloadVillage(){
            //TODO REALLY BAD, TO BE DONE - PROPERLY
            this.fetchVillageOwnTroops();
            this.fetchVillageResources();
            this.fetchVillageProduction();
            this.fetchVillageMaxResources();
            this.fetchvillageBuildingFields();
            this.fetchvillageResourceFields();
            this.fetchVillageTroopMovements();
            this.fetchVillageReinforcements();
            this.fetchVillageResFieldUpgrades();
            this.fetchVillageBuildingUpgrades();
            this.fetchBuildingData();
            this.fetchResourceFieldsData();
        }
    }
}
</script>