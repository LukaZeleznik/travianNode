<template>
    <div v-if="checkIfLoggedIn(false)">
        <!-- Main Body -->
        <div class="container mt-4">
            <div class="row">
                <!-- Village Fields -->
                <div class="col-md-8 col-sm-12 col-12">
                    <div class="h2 text-center mb-5"><strong>{{ villageName }}</strong></div>
                    <!-- Fields --> 
                    <villageFields></villageFields>
                    <!-- Footer Queue -->
                    <footerBuildingQueue></footerBuildingQueue>
                </div>
                <!-- Sidebar -->
                <div class="col-md-4 text-center mb-3 rightSide">
                    <!-- Troop Movements -->
                    <sidebarTroopMovements></sidebarTroopMovements>
                    <!-- Production -->
                    <sidebarProduction></sidebarProduction>
                    <!-- Troops -->
                    <sidebarTroops></sidebarTroops>
                    <!-- Villages -->
                    <sidebarVillages v-if="sidebarVillageList.length > 1"></sidebarVillages>
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
        this.loadMethods();
    },

    methods: {
        loadMethods(){
            if(this.checkIfLoggedIn(true)){ //Should redirect
                this.fetchVillageResources();
                this.fetchSidebarVillageList();
                this.getVillageName();
            }
        },
    }
}
</script>
