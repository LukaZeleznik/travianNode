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
        async upgradeResField(rfid){
            let resourceFieldData = {
                "idVillage": 1,
                "rfid": rfid,
            }

            let villageResFieldUpgradeResponse = await this.doApiRequest("villageResFieldUpgrades", "POST", resourceFieldData)
            let villageResFieldUpgradeResponseJson = await villageResFieldUpgradeResponse.json();

            if(villageResFieldUpgradeResponseJson.message == "villageResFieldUpgrade success"){
                this.fetchVillageResources();
                this.$router.push({ name: 'resources' });
            }
            else{
                document.getElementById("errorMessage").innerText = villageResFieldUpgradeResponseJson.message;
            }
        },
    }
  }