<template>
    <div>
        <div class="grid">
            <ul id="hexGrid" style="padding-left: 0px;">
                <li class="hex" v-for="index in 22" :key="index">
                    <div class="hexIn" v-if="index == 1 || index == 5 || index == 19"></div>
                    <div class="hexIn" v-else-if="index == 12">
                        <router-link class="hexLink" :to="{ name: 'resources' }">
                            <div class='img' v-bind:style="'background-color: green'">
                                <p style="top:35%;opacity:1;color:black">Resources</p>
                            </div>
                            <h1 id="demo1"></h1>
                            <p id="demo2"></p>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else>
                        <router-link class="hexLink" :to="{ path: '/villageBuilding/' + realIndexes[index] }">
                            <div class='img' v-bind:style="'background-color:' + villageBuildingColors[realIndexes[index]-1]">
                                <p style="top:35%;opacity:1;color:black" v-if="villageBuildingLevels[realIndexes[index]-1] > 0">{{villageBuildingNames[realIndexes[index]-1]}} ({{ villageBuildingLevels[realIndexes[index]-1] }})</p>
                            </div>
                            <h1 id="demo1"></h1>
                            <p id="demo2"></p>
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            villageBuildingLevels: [],
            villageBuildingTypes: [],
            villageBuildingColors: [],
            villageBuildingNames: [],
            realIndexes: [1,1,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,16,16,17,18],
        };
    },
    created() {
        this.fetchvillageBuildingFields();
        this.fetchVillageResources();
    },
    watch: {
        
    },
    methods: {
        fetchvillageBuildingFields(){
            this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
            this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
            this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;

            this.$store.dispatch('fetchVillageBuildingFields')
            .then( () => {
                this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
                this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
                this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;
                this.convertBuildingTypeToName();
            });
        },
        convertBuildingTypeToName(){
            this.villageBuildingNames = this.villageBuildingTypes.map(type => {
                return this.$parent.buildingInfoLookup[type]['name'];
            });

        },
        fetchVillageResources(){
            this.villageResources = this.$store.getters.getVillageResources;

            this.$store.dispatch('fetchVillageResources')
            .then( () => {
                this.villageResources = this.$store.getters.getVillageResources;
            });
        },
    }
}
</script>
