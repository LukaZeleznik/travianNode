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
                            <div class='img' v-bind:style="'background-color: White'">
                                <p style="top:35%;opacity:1;color:black">Resources</p>
                            </div>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else-if="index == 19">
                        <router-link v-tooltip="{ content: villageBuildingTooltip(realIndexes[index]-1), delay: { show: 500, hide: 300 }}" class="hexLink" :to="{ path: '/villageBuilding/' + realIndexes[index] }">
                                <div v-if="villageBuildingLevels[realIndexes[index]-1] > 0" class='img' v-bind:style="'background-color:' + villageBuildingColors[realIndexes[index]-1]">
                                    <p style="top:35%;opacity:1;color:black">{{villageBuildingNames[realIndexes[index]-1]}} ({{ villageBuildingLevels[realIndexes[index]-1] }})</p>
                                </div>
                                <div v-else class='img' v-bind:style="'background-color: Gainsboro'">
                                    <p style="top:35%;opacity:1;color:black">Wall</p>
                                </div>
                        </router-link>
                    </div>
                    <div class="hexIn" v-else>
                        <router-link v-tooltip="{ content: villageBuildingTooltip(realIndexes[index]-1), delay: { show: 500, hide: 300 }}" class="hexLink" :to="{ path: '/villageBuilding/' + realIndexes[index] }">
                            <div class='img' v-bind:style="'background-color:' + villageBuildingColors[realIndexes[index]-1]">
                                <img v-if="villageBuildingTypes[realIndexes[index]-1]>0 && villageBuildingLevels[realIndexes[index]-1] > 0" style="width: 5rem; height: 6.5rem;" v-bind:src="'/images/buildings/' + villageBuildingTypes[realIndexes[index]-1] + '.gif'">
                                <img v-else-if="villageBuildingTypes[realIndexes[index]-1]>0 && villageBuildingLevels[realIndexes[index]-1] == 0" style="width: 5rem; height: 6.5rem;" v-bind:src="'/images/buildings/' + villageBuildingTypes[realIndexes[index]-1] + 'b.gif'">
                                <!-- <p style="top:35%;opacity:1;color:black" v-if="villageBuildingTypes[realIndexes[index]-1] > 0">{{ villageBuildingNames[realIndexes[index]-1] }} ({{ villageBuildingLevels[realIndexes[index]-1] }})</p> -->
                            </div>
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'

export default {
    data() {
        return {
            villageIncomingAttacksTimeLeft : [],
            villageIncomingReinforcementsTimeLeft : [],
            villageOutgoingAttacksTimeLeft : [],
            villageOutgoingReinforcementsTimeLeft : [],
            villageBuildingNames: [],
            realIndexes: [1,1,1,2,3,3,4,5,6,7,8,9,10,10,11,12,13,14,15,19,16,17,18],
        };
    },
    
    watch: {
        'villageBuildingTypes': function() {
            this.convertBuildingTypeToName();
        },
    },

    mixins: [fetchMixins],

    created() {
        this.fetchvillageBuildingFields();
    },

    methods: {
        convertBuildingTypeToName(){
            this.villageBuildingNames = this.villageBuildingTypes.map(type => {
                return this.buildingInfoLookup[type]['name'];
            });
        },
        villageBuildingTooltip(index){
            if (this.villageBuildingTypes[index]>0) {
                return this.villageBuildingNames[index] + ' level ' + this.villageBuildingLevels[index];
            } else {
                return this.villageBuildingNames[index];
            }
            
        }
    }
}
</script>
