<template>
    <div>
        <div class="grid">
            <ul id="hexGrid" style="padding-left: 0px;">
                <li class="hex" v-for="(villageBuildingColor, index) in villageBuildingColors" :key="index">
                    <div class="hexIn" v-if="index == 0 || index == 4 || index == 18"></div>
                    <div class="hexIn" v-else-if="index == 11">
                        <router-link class="hexLink" :to="{ name: 'resources' }">
                            <div class='img' v-bind:style="'background-color:' + villageBuildingColor">
                                <p style="top:35%;opacity:1;color:black">Resources</p>
                            </div>
                            <h1 id="demo1"></h1>
                            <p id="demo2"></p>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else>
                        <router-link class="hexLink" :to="{ path: '/villageBuilding/' + index }">
                            <div class='img' v-bind:style="'background-color:' + villageBuildingColor">
                                <p style="top:35%;opacity:1;color:black">{{villageBuildingNames[index]}}</p>
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
            //villageBuildingColors: ["","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","Green","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","SlateGray","","SlateGray","SlateGray","SlateGray"],
            villageBuildingLevels: [],
            villageBuildingTypes: [],
            villageBuildingColors: [],
            villageBuildingNames: [],
        };
    },
    created() {
        //this.villageBuildingTypes[11] = "Resources";
        //this.villageBuildingTypes[7] = "Barracks";
        this.fetchvillageBuildingData();
    },
    watch: {
        
    },
    methods: {
        fetchvillageBuildingData(){
            this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
            this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
            this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;

            console.log("TYPES: " + this.villageBuildingTypes);

            this.$store.dispatch('fetchVillageBuildingsData')
            .then( () => {
                this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
                this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
                this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;
                this.convertBuildingTypeToName();
            });
        },
        convertBuildingTypeToName(){
            const buildingInfoLookup = require('../../../public/infoTables/buildingInfoLookup.json');
            
            this.villageBuildingNames = this.villageBuildingTypes.map(type => {
                return buildingInfoLookup[type]['name'];
            });
            console.log(this.villageBuildingNames);
        }
    }
}
</script>
