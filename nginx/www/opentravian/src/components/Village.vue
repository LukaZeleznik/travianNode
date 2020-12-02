<template>
    <div>
        <!-- Main Body -->
        <div class="container mt-4">
            <div class="row">
                <!-- Village Fields -->
                <div class="col-md-8 col-sm-12 col-12">
                    <div class="h2 text-center mb-5"><strong>VillageName</strong></div>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as infoLookup from '../assets/js/infoLookupTools.js';

export default {

    data() {
        return {
            buildingInfoLookup: infoLookup.buildingInfoLookup,
            resourceInfoLookup: infoLookup.resourceInfoLookup,
        };
    },

  created() {},

  methods: {}
}
</script>
