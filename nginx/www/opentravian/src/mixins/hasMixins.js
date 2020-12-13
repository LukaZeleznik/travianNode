export const hasMixins = {
    methods: {
        hasRequiredBuildingResources(){
            let woodRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['wood'][this.$parent.villageBuildingLevel+1];
            let clayRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['clay'][this.$parent.villageBuildingLevel+1];
            let ironRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['iron'][this.$parent.villageBuildingLevel+1];
            let cropRequired = this.buildingInfoLookup[this.$parent.villageBuildingType]['crop'][this.$parent.villageBuildingLevel+1];

            if (this.villageResources[0] >= woodRequired && this.villageResources[1] >= clayRequired && 
                this.villageResources[2] >= ironRequired && this.villageResources[3] >= cropRequired){
                return true;
            }
            
            return false;
        },
        hasRequiredResFieldResources(){
            let woodRequired = this.resourceInfoLookup[this.villageResourceType]['wood'][this.villageResourceLevel+1];
            let clayRequired = this.resourceInfoLookup[this.villageResourceType]['clay'][this.villageResourceLevel+1];
            let ironRequired = this.resourceInfoLookup[this.villageResourceType]['iron'][this.villageResourceLevel+1];
            let cropRequired = this.resourceInfoLookup[this.villageResourceType]['crop'][this.villageResourceLevel+1];

            if (this.villageResources[0] >= woodRequired && this.villageResources[1] >= clayRequired && 
                this.villageResources[2] >= ironRequired && this.villageResources[3] >= cropRequired){
                return true;
            }

            return false;
        },
        hasRequiredResearchResources(troopId){
            let troopInfo = {};
            for (let troop of this.researchesInfoLookup[this.userTribe]){
                if (troop['id'] == troopId) {
                    troopInfo = troop;
                }
            }
            if (this.villageResources[0] >= troopInfo['wood'] && this.villageResources[1] >= troopInfo['clay'] && 
                this.villageResources[2] >= troopInfo['iron'] && this.villageResources[3] >= troopInfo['crop']){
                return true;
            }

            return false;
        },
    }
  }