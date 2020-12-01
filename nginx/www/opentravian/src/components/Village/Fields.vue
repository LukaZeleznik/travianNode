<template>
    <div style="position: grid; grid-template: 1fr / 1fr; place-items: center;">
    <!--
        <div class="wallGrid">
            <div style="position: relative">
                <ul id="wallHexGrid">
                    <li class="hex">
                        <div class="hexIn hexInWall">
                            <div class="hexLink">
                                <div class='img' v-bind:style="'background-color: SaddleBrown'">
                                </div>
                            </div>
                        </div>
                    </li>
                    <li class="hex" style="width: 95%">
                        <div class="hexIn hexInWall" style="margin-top: -11%; margin-left: 6%">
                            <div class="hexLink">
                                <div class='img' v-bind:style="'background-color: White'">
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        -->
        <div class="fieldsGrid">
            <ul id="fieldsHexGrid">
                <li class="hex" v-for="index in 22" :key="index">
                    <div class="hexIn" v-if="index == 1 || index == 5"></div>
                    <div class="hexIn" v-else-if="index == 12">
                        <router-link class="hexLink" :to="{ name: 'resources' }">
                            <div class='img' v-bind:style="'background-color: green'">
                                <p style="top:35%;opacity:1;color:black">Resources</p>
                            </div>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else-if="index == 19">
                        <router-link class="hexLink" :to="{ path: '/villageBuilding/' + realIndexes[index] }">
                                <div v-if="villageBuildingLevels[realIndexes[index]-1] > 0" class='img' v-bind:style="'background-color:' + villageBuildingColors[realIndexes[index]-1]">
                                    <p style="top:35%;opacity:1;color:white">{{villageBuildingNames[realIndexes[index]-1]}} ({{ villageBuildingLevels[realIndexes[index]-1] }})</p>
                                </div>
                                <div v-else class='img' v-bind:style="'background-color: slategray'">
                                    <p style="top:35%;opacity:1;color:white">Wall</p>
                                </div>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else>
                        <router-link class="hexLink" :to="{ path: '/villageBuilding/' + realIndexes[index] }">
                            <div class='img' v-bind:style="'background-color:' + villageBuildingColors[realIndexes[index]-1]">
                                <p style="top:35%;opacity:1;color:black" v-if="villageBuildingLevels[realIndexes[index]-1] > 0">{{villageBuildingNames[realIndexes[index]-1]}} ({{ villageBuildingLevels[realIndexes[index]-1] }})</p>
                            </div>
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
            villageIncomingAttacks : [],
            villageIncomingReinforcements : [],
            villageOutgoingAttacks : [],
            villageOutgoingReinforcements : [],
            villageIncomingAttacksTimeLeft : [],
            villageIncomingReinforcementsTimeLeft : [],
            villageOutgoingAttacksTimeLeft : [],
            villageOutgoingReinforcementsTimeLeft : [],
            villageBuildingLevels: this.$store.getters.getVillageBuildingLevels,
            villageBuildingTypes: this.$store.getters.getVillageBuildingTypes,
            villageBuildingColors: this.$store.getters.getVillageBuildingColors,
            villageBuildingNames: [],
            realIndexes: [1,1,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,19,16,17,18],
        };
    },
    created() {
        this.fetchvillageBuildingFields();
        this.fetchVillageResources();
        this.fetchVillageTroopMovements();
        this.startTroopMovementsInterval();
    },
    watch: {
        '$store.getters.getVillageBuildingLevels': function() {
            this.villageBuildingLevels = this.$store.getters.getVillageBuildingLevels;
        },
        '$store.getters.getVillageBuildingTypes': function() {
            this.villageBuildingTypes = this.$store.getters.getVillageBuildingTypes;
        },
         '$store.getters.getVillageBuildingColors': function() {
             this.villageBuildingColors = this.$store.getters.getVillageBuildingColors;
        },
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
        fetchVillageTroopMovements(){
            this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
            this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
            this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
            this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

            this.$store.dispatch('fetchVillageTroopMovements')
            .then( () => {
                this.villageOutgoingAttacks = this.$store.getters.getVillageOutgoingAttacks;
                this.villageOutgoingReinforcements = this.$store.getters.getVillageOutgoingReinforcements;
                this.villageIncomingAttacks = this.$store.getters.getVillageIncomingAttacks;
                this.villageIncomingReinforcements = this.$store.getters.getVillageIncomingReinforcements;

                if(this.villageIncomingAttacks.length > 0){this.villageIncomingAttacksTimeLeft[0] = (this.villageIncomingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
                if(this.villageIncomingReinforcements.length > 0){this.villageIncomingReinforcementsTimeLeft[0] = (this.villageIncomingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
                if(this.villageOutgoingAttacks.length > 0){this.villageOutgoingAttacksTimeLeft[0] = (this.villageOutgoingAttacks[0].timeArrived - Math.floor(new Date().getTime()/1000));}
                if(this.villageOutgoingReinforcements.length > 0){this.villageOutgoingReinforcementsTimeLeft[0] = (this.villageOutgoingReinforcements[0].timeArrived - Math.floor(new Date().getTime()/1000));}
            });
        },
        startTroopMovementsInterval(){
            setInterval( ()=> {
                if(this.villageIncomingAttacksTimeLeft[0] > 0){
                    this.$set(this.villageIncomingAttacksTimeLeft, 0, this.villageIncomingAttacksTimeLeft[0]-1);
                }
                if(this.villageIncomingReinforcementsTimeLeft[0] > 0){
                    this.$set(this.villageIncomingReinforcementsTimeLeft, 0, this.villageIncomingReinforcementsTimeLeft[0]-1);
                }
                if(this.villageOutgoingAttacksTimeLeft[0] > 0){
                    this.$set(this.villageOutgoingAttacksTimeLeft, 0, this.villageOutgoingAttacksTimeLeft[0]-1);
                }
                if(this.villageOutgoingReinforcementsTimeLeft[0] > 0){
                    this.$set(this.villageOutgoingReinforcementsTimeLeft, 0, this.villageOutgoingReinforcementsTimeLeft[0]-1);
                }
                
                if(this.villageIncomingAttacksTimeLeft[0] == 0 || this.villageIncomingReinforcementsTimeLeft[0] == 0 || this.villageOutgoingAttacksTimeLeft[0] == 0 || this.villageOutgoingReinforcementsTimeLeft[0] == 0){
                    this.fetchVillageOwnTroops();
                    this.fetchVillageTroopMovements();
                }
            }, 1000);
        }
    }
}
</script>
