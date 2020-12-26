import { toolsMixins } from './toolsMixins'
import { fetchMixins } from './fetchMixins'

export const upgradeMixins = {

    mixins: [toolsMixins,fetchMixins],

    methods: {
        async upgradeBuilding(vbid){
            document.getElementById("upgradeBuildingButton").disabled=true;

            let buildingData = {
                "idVillage": this.activeVillageId,
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
                "idVillage": this.activeVillageId,
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