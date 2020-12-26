<template>
    <div>
        <div id="app">
            <div class="container">
                <ul class="nav nav-tabs nav-justified">
                    <li class="nav-item" v-for="(menuOption, key) in menuOptions" :key="key">
                        <a class="nav-link" @click.prevent="setActive(key)" :class="{ active: isActive(key), disabled: key!='sendResources'}" :href="'#'+key">{{ menuOption }}</a>
                    </li>
                </ul>
                <div class="tab-content py-3" id="myTabContent">
                    <div v-for="(menuOption, key) in menuOptions" :key="key">
                        <div class="tab-pane fade" v-if="isActive(key)" :class="{ 'active show': isActive(key) }" :id="key"><component :is="'villageBuilding15-' + key"></component></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="$parent.villageBuildingLevel < (buildingInfoLookup[$parent.villageBuildingType]['wood'].length-1)">
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
                <button v-else-if="hasRequiredBuildingResources()" type="button" class="btn btn-success" id="upgradeBuildingButton" @click="upgradeBuilding($route.params.vbid)">Upgrade to Level {{ $parent.villageBuildingLevel+1 }}</button> 
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
            menuOptions: {
                'sendResources': 'Send Resources',
                'buy': 'Buy',
                'sell': 'Sell',
                'npc': 'NPC Merchant'
            },
            activeItem: 'sendResources',
            villageBuildingType: this.$parent.villageBuildingType,
            villageBuildingLevel: this.$parent.villageBuildingLevel,
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
        isActive (menuItem) {
            return this.activeItem === menuItem
        },
        setActive (menuItem) {
            this.activeItem = menuItem
        }
    }
}
</script>

<style scoped>
a {
    color: #28a745;
    font-weight: bold;
}
</style>