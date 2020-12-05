import { apiRequestMixins } from './apiRequestMixins'

export const upgradeMixins = {

    mixins: [apiRequestMixins],

    methods: {
        async upgradeBuilding(vbid){
            let buildingData = {
                "idVillage": this.getCookie('activeVillageId'),
                "vbid": vbid,
            }

            let buildingUpgradeResponse = await this.doApiRequest("villageBuildingUpgrades", "POST", buildingData,true);
            let buildingUpgradeResponseJson = await buildingUpgradeResponse.json();

            if(buildingUpgradeResponseJson.message == "villageBuildingUpgrade success"){
                this.fetchVillageResources();
                this.$router.push({ name: 'village' });
            }
            else{
                document.getElementById("errorMessage").innerText = buildingUpgradeResponseJson.message;
            }
        },
        async upgradeResField(rfid){
            let resourceFieldData = {
                "idVillage": this.getCookie('activeVillageId'),
                "rfid": rfid,
            }

            let villageResFieldUpgradeResponse = await this.doApiRequest("villageResFieldUpgrades", "POST", resourceFieldData,true)
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