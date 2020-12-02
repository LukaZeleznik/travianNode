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
            } else {
                return false;
            }
        },
    }
  }