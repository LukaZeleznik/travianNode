<template>
    <div>
        <table class="table table-bordered w-75 m-auto">
            <tbody>
                <tr v-for="(availableBuilding, index) in availableBuildings" v-bind:key="index">
                    <th scope="row" class="align-middle text-left" style="min-width:650px"> {{ buildingInfoLookup[availableBuilding]['name'] }}
                        <span class="troopRequirements float-right">
                            <img src="/images/resources/wood.gif">  {{ buildingInfoLookup[availableBuilding]['wood'][1] }} |
                            <img src="/images/resources/clay.gif">  {{ buildingInfoLookup[availableBuilding]['clay'][1] }} |
                            <img src="/images/resources/iron.gif">  {{ buildingInfoLookup[availableBuilding]['iron'][1] }} |
                            <img src="/images/resources/crop.gif">  {{ buildingInfoLookup[availableBuilding]['crop'][1] }} |
                            <img src="/images/consum.gif">          {{ buildingInfoLookup[availableBuilding]['consumption'][1] }} |
                            <img src="/images/clock.gif">           {{ $root.secondsToTimeRemaining(buildingInfoLookup[availableBuilding]['constructionTime'][1] * 1000) }}
                        </span>
                    </th>
                    <td class="align-middle">
                        <div class="input-group input-group-sm mb-3 align-middle"> 
                            <h5 class="mt-4"> 
                                <button type="button" class="btn btn-success" @click="build(availableBuilding)">Build</button> 
                            </h5>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <h5 class="mt-4 text-danger" id="errorMessage"></h5>
    </div>
</template>


<script>

export default {
    data() {
        return {
            buildingInfoLookup: this.$parent.buildingInfoLookup,
            villageBuildingLevels: [],
            villageBuildingTypes: [],
            villageBuildingNames: [],
            availableBuildings: [],
        };
    },

    created() {
        this.fetchvillageBuildingFields();
        this.getAvailableBuildings();
    },

    methods: {
        getAvailableBuildings(){
            console.log("this.villageBuildingTypes",this.villageBuildingTypes);
            for(let i = 1; i < this.buildingInfoLookup.length; i++){
                if(this.villageBuildingTypes<=0 || this.villageBuildingLevels<=0) break;
                if(this.villageBuildingTypes.includes(this.buildingInfoLookup[i]['id'])){
                    for(let l = 0; l < this.villageBuildingTypes.length; l++){
                        if(this.villageBuildingTypes[l] == this.buildingInfoLookup[i]['id']) {
                            if(this.buildingInfoLookup[i]['allowMultiple'] && this.villageBuildingLevels[l] == 20) {
                                this.availableBuildings.push(this.buildingInfoLookup[i]['id']);
                                break;
                            }
                        }
                    }
                } else {
                    this.availableBuildings.push(this.buildingInfoLookup[i]['id']);
                }
            }
        },
        fetchvillageBuildingFields(){
            this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
            this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
            this.villageBuildingColors  = this.$store.getters.getVillageBuildingColors;

            this.$store.dispatch('fetchVillageBuildingFields')
            .then( () => {
                this.villageBuildingLevels  = this.$store.getters.getVillageBuildingLevels;
                this.villageBuildingTypes   = this.$store.getters.getVillageBuildingTypes;
                this.convertBuildingTypeToName();
            });
        },
        convertBuildingTypeToName(){
            this.villageBuildingNames = this.villageBuildingTypes.map(type => {
                return this.$parent.buildingInfoLookup[type]['name'];
            });
        },
        async build(buildingId){
            let buildingData = {
                "idVillage": 1,
                "vbid": this.$route.params.vbid,
                "type": buildingId
            }

            let buildingUpgradeResponse = await this.$root.doApiRequest("villageBuildingUpgrades", "POST", buildingData);
            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            if(buildingUpgradeResponseJson.message == "villageBuildingUpgrade success"){
                this.$router.push({ name: 'village' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
    }
}
</script>