<template>
    <div>
        <h5 class="mt-5"> <p>Current bonus defense: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel]*100).toFixed(2) }} percent</p></h5>
        <div v-if="$parent.villageBuildingLevel < 20">
            <h5><p>Bonus defense at level {{ $parent.villageBuildingLevel+1 }}: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel+1]*100).toFixed(2) }} percent</p></h5>
            <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
            <h5> <p>
                <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/clock.gif">               {{ $root.secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel+1] * 1000) }}</p>
            </h5>
            <h5 class="mt-4"> 
                <button v-if="hasRequiredResources()" type="button" class="btn btn-success" @click="upgradeBuilding($route.params.vbid)">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
                <span v-else>Not enough resources</span>
            </h5>
        </div>
        <div v-else>
            <h5 class="mt-4">Already at maximum level</h5>
        </div>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>
     </div>
</template>


<script>
import { upgradeMixins } from '../../../mixins/upgradeMixins'
import { hasMixins } from '../../../mixins/hasMixins'

export default {
    data() {
        return {
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            villageResources: this.$store.getters.getVillageResources,
        };
    },

    mixins: [upgradeMixins,hasMixins],

    watch: {
        '$store.getters.getVillageResources': function() {
            this.villageResources = this.$store.getters.getVillageResources;
        },
    },
    
    created() {
        this.$parent.fetchVillageResources();
    },

    methods: {
        hasRequiredResources(){
            let woodRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['wood'][this.$parent.villageBuildingLevel+1];
            let clayRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['clay'][this.$parent.villageBuildingLevel+1];
            let ironRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['iron'][this.$parent.villageBuildingLevel+1];
            let cropRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['crop'][this.$parent.villageBuildingLevel+1];

            if (this.villageResources[0] >= woodRequired && this.villageResources[1] >= clayRequired && 
                this.villageResources[2] >= ironRequired && this.villageResources[3] >= cropRequired){
                return true;
            } else {
                return false;
            }
        },
    }
}
</script>