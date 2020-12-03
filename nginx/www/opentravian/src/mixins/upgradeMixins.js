import { apiRequestMixins } from './apiRequestMixins'

export const upgradeMixins = {

    mixins: [apiRequestMixins],

    methods: {
        async upgradeBuilding(vbid){
            let buildingData = {
                "idVillage": 1,
                "vbid": vbid,
            }

            let buildingUpgradeResponse = await this.doApiRequest("villageBuildingUpgrades", "POST", buildingData);
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