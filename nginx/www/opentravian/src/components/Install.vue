<template>
    <div>
        <button class="btn btn-lg btn-primary btn-block" v-on:click="install()">Install</button>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'

export default {

    data() {
        return {
            width: 11,
            height: 9,
        };
    },

    mixins: [fetchMixins],

    created() {
        this.infoLookup();
    },

    methods: {
        async install(){
            if (confirm('Are you sure you want to start Installation process?')) {
                await this.doInstall(this.width,this.height);
            } else {
                console.log('Aborted.');
            }
        },
        getRandomVariation(){
            var gen = Math.floor(Math.random() * 90) + 1;
            let counter = 0;
            for(let l of this.resFieldVariationsInfoLookup){
                counter += l.chance
                if(counter >= gen) return l.id;
            }
        },
        async generateMap(width,height){
            let villageData = [];
            let xCoords = [];
            let yCoords = [];
            for(let y = 0; y < height; y++){
                for(let x = 0; x < width; x++){
                    if (y % 2 && x == width-1) break;
                    xCoords.push((x - Math.floor(width/2)));
                    yCoords.push(-(y - Math.floor(height/2)));
                }
            }

            for(let i = 0; i < height*width-(Math.floor(height/2)); i++){
                const variation = this.getRandomVariation();
                villageData.push({
                    "mapTileId": i+1,
                    "xCoordinate": xCoords[i],
                    "yCoordinate": yCoords[i],
                    "fieldVariation": variation,
                    "owner": "",
                    "name": "",
                })
            }
            await this.doApiRequest("generateMapVillages","POST",villageData,true);
        },
        async createNewUser(email,password,nickname,tribe,village){
            const currentUnixTime = Math.round(new Date().getTime()/1000);
            let villageBuildingFieldsData = {};
            let villageResFieldsData = {};
            let villageOwnTroopsData = {};
            let wallType = 0;

            let adminData = {
                "email": email,
                "password": password,
                "nickname": nickname,
                "tribe": tribe,
                "population": 200,
                "group": 2,
                "capital": village['_id'],
            }
            let adminDataResponse = await(await(await this.doApiRequest("users","POST",adminData,true)).json()).data

            /* Update Village with userId */
            village['owner'] = adminDataResponse['_id'];
            village['name']  = adminDataResponse['nickname'] + "'s Village";
            village['fieldVariation'] = 0;
            await this.doApiRequest("villages/" + village['mapTileId'],"PATCH",village,true);
            

            /* CREATE: villageBuildingFields */
            for(let l = 1; l < 20; l++){
                villageBuildingFieldsData['field'+l+'Type'] = 0;
                villageBuildingFieldsData['field'+l+'Level'] = 0;
            }
            switch (tribe) {
                case "teuton":  wallType = 5; break;
                case "roman":   wallType = 6; break;
                case "gaul":    wallType = 7; break;
            }
            villageBuildingFieldsData['field19Type'] = wallType;
            villageBuildingFieldsData['idVillage'] = village['_id'];
            await this.doApiRequest("villageBuildingFields","POST",villageBuildingFieldsData,true);


            /* CREATE: villageResourceFields */
            for(let l = 1; l < 19; l++){
                villageResFieldsData['field'+l+'Type'] = this.resFieldVariationsInfoLookup[village['fieldVariation']]['variation'][l-1];
                villageResFieldsData['field'+l+'Level'] = 0;
            }
            villageResFieldsData['idVillage'] = village['_id'];
            await this.doApiRequest("villageResourceFields","POST",villageResFieldsData,true);


            /* CREATE: villageMaxResources */
            let villageMaxResourcesData = {
                "idVillage": village['_id'],
                "maxWood": 800,
                "maxClay": 800,
                "maxIron": 800,
                "maxCrop": 800
            }
            await this.doApiRequest("villageMaxResources","POST",villageMaxResourcesData,true);


            /* CREATE: villageOwnTroops */
            for(let l = 0; l < this.troopInfoLookup[tribe].length; l++){
                villageOwnTroopsData['troop' + (l+1)] = 0;
            }
            villageOwnTroopsData['idVillage'] = village['_id'];
            villageOwnTroopsData['tribe'] = tribe;
            await this.doApiRequest("villageOwnTroops","POST",villageOwnTroopsData,true);

            
            /* CREATE: villageProductions */
            let villageProductionsData = {
                "idVillage": village['_id'],
                "productionWood": 0,
                "productionClay": 0,
                "productionIron": 0,
                "productionCrop": 0
            }
            await this.doApiRequest("villageProductions","POST",villageProductionsData,true);


            /* CREATE: villageResources */
            let villageResourcesData = {
                "idVillage": village['_id'],
                "currentWood": 800,
                "currentClay": 800,
                "currentIron": 800,
                "currentCrop": 800,
                "lastUpdate": currentUnixTime
            }
            await this.doApiRequest("villageResources","POST",villageResourcesData,true);
        },
        async doInstall(width,height){
            /* GENERATE MAP */
            await this.generateMap(width,height);

            /* CREATE NEW USER */
            const adminTile = Math.ceil((height*width-(Math.floor(height/2)))/2);
            const villageData = await(await(await this.doApiRequest("villages/" + adminTile,"GET","",false)).json()).data;
            await this.createNewUser("admin@test.com","password","Admin","teuton",villageData);
        },
        
    }
}
</script>
