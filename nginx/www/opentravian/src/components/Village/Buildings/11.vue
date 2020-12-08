<template>
    <div>
        <h5 class="mt-5"> <p>Current bonus production: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel]*100).toFixed(0) }} percent</p></h5>
        <div v-if="$parent.villageBuildingLevel < (buildingInfoLookup[$parent.villageBuildingType]['wood'].length-1)">
            <h5><p>Bonus production at level {{ $parent.villageBuildingLevel+1 }}: {{ (buildingInfoLookup[$parent.villageBuildingType]['buildingModifier'][$parent.villageBuildingLevel+1]*100).toFixed(0) }} percent</p></h5>
            <h4> <p>Cost for upgrading to Level {{ $parent.villageBuildingLevel+1 }}:</p></h4>
            <h5> <p>
                <img src="/images/resources/wood.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['wood'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/clay.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['clay'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/iron.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['iron'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/resources/crop.gif">      {{ buildingInfoLookup[$parent.villageBuildingType]['crop'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/consum.gif">              {{ buildingInfoLookup[$parent.villageBuildingType]['consumption'][$parent.villageBuildingLevel+1] }} |
                <img src="/images/clock.gif">               {{ secondsToTimeRemaining(buildingInfoLookup[$parent.villageBuildingType]['constructionTime'][$parent.villageBuildingLevel+1] / config.SERVER_SPEED * 1000) }}</p>
            </h5>
            <h5 class="mt-4"> 
                <span v-if="villageBuildingUpgrades.length > 0">Another building is already being upgraded</span>
                <button v-else-if="hasRequiredBuildingResources()" type="button" class="btn btn-success" @click="upgradeBuilding($route.params.vbid)">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
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
import { fetchMixins } from '@/mixins/fetchMixins'
import { hasMixins } from '@/mixins/hasMixins'

import { upgradeMixins } from '@/mixins/upgradeMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        
        upgradeMixins,
        toolsMixins
        ],

    watch: {
    },
    
    created() {
    },

    methods: {
    }
}
</script>