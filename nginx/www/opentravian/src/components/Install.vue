<template>
    <div>
        <button class="btn btn-lg btn-primary btn-block" v-on:click="install()">Install</button>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { apiRequestMixins } from '@/mixins/apiRequestMixins'

export default {

    data() {
        return {
        };
    },

    mixins: [fetchMixins,apiRequestMixins],

    created() {
        this.infoLookup();
    },

    methods: {
        async install(){
            if (confirm('Are you sure you want to start Installation process?')) {
                await this.doInstall();
            } else {
                console.log('Aborted.');
            }
        },
        async doInstall(){
            // First we generate all the 'villages' for map tiles
            let villageData = [];
            let tiles = [];
            let width = 11;
            let height = 9;
            let xCoords = [];
            let yCoords = [];
            let fieldVariation = [0,3,0,2,1,1,2,3,3,2,2,3,3,0,3,1,0,1];
    
            for(let y = 0; y < height; y++){
                tiles[y] = [];
                for(let x = 0; x < width; x++){
                    if (y % 2 && x == width-1) break;
                    xCoords.push((x - Math.floor(width/2)));
                    yCoords.push(-(y - Math.floor(height/2)));
                }
            }

            for(let i = 0; i < 95; i++){
                let variation = Math.floor(Math.random() * 5);
                villageData.push({
                    "mapTileId": i+1,
                    "xCoordinate": xCoords[i],
                    "yCoordinate": yCoords[i],
                    "fieldVariation": variation,
                    "owner": "",
                    "name": "",
                })
            }

            await fetch('http://localhost:8080/api/generateMapVillages/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageData),
            });
    
            // Generate 2 Default users
            /*
            2. Default User
                2.1 village done
                2.2 villageBuildingFields done
                2.3 villageResourceFields
                2.4 villageMaxResources
                2.5 villageOwnTroops
                2.7 villageProductions
                2.8 villageResources
                2.9 user
            */

            let randomTileUser1 = Math.floor(Math.random(1) * 50);
            console.log("randomTileUser1",randomTileUser1);
            let oneVillageData = await(await(await this.doApiRequest("villages/" + randomTileUser1,"GET","",false)).json()).data;

            let dataUser1 = {
                "email": "user1@test.com",
                "password": "password",
                "nickname": "User1",
                "tribe": "teuton",
                "population": 200,
                "capital": oneVillageData['_id'],
            }

            let dataUser1Response = await(await(await fetch('http://localhost:8080/api/users/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataUser1),
            })).json()).data;
            
            // VILLAGE BUILDING FIELDS
            let villageBuildingFieldsData = {};
            for(let l = 1; l < 19; l++){
                villageBuildingFieldsData['field'+l+'Type'] = 0;
                villageBuildingFieldsData['field'+l+'Level'] = 0;
            }

            villageBuildingFieldsData['idVillage'] = oneVillageData['_id'];
            //wall type > teutons = 5, romans = 6, gauls = 7
            villageBuildingFieldsData['field19Type'] = 5;
            villageBuildingFieldsData['field19Level'] = 0;

            console.log(villageBuildingFieldsData,dataUser1Response);

            await fetch('http://localhost:8080/api/villageBuildingFields/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageBuildingFieldsData),
            });
            
            
           // VILLAGE
            
            oneVillageData['owner'] = dataUser1Response['_id'];
            oneVillageData['name'] = dataUser1Response['nickname'] + "'s Village";

            await fetch('http://localhost:8080/api/villages/' + randomTileUser1, { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(oneVillageData),
            });


            //RES FIELDS

            let villageResFieldsData = {};
            for(let l = 1; l < 19; l++){
                villageResFieldsData['field'+l+'Type'] = fieldVariation[l-1];
                villageResFieldsData['field'+l+'Level'] = 0;
            }
            villageResFieldsData['idVillage'] = oneVillageData['_id'];

            await fetch('http://localhost:8080/api/villageResourceFields/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageResFieldsData),
            });

            //villageMaxResources


            let villageMaxResourcesData = {
                "idVillage": oneVillageData['_id'],
                "maxWood": 800,
                "maxClay": 800,
                "maxIron": 800,
                "maxCrop": 800
            }
            await fetch('http://localhost:8080/api/villageMaxResources/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageMaxResourcesData),
            });


            //villageOwnTroops
            let villageOwnTroopsData = {
                "idVillage": oneVillageData['_id'],
                "tribe": dataUser1Response['tribe'],
                "troop1": 0,
                "troop2": 0,
                "troop3": 0,
                "troop4": 0,
                "troop5": 0,
                "troop6": 0,
                "troop7": 0,
                "troop8": 0,
                "troop9": 0,
                "troop10": 0
            }
            await fetch('http://localhost:8080/api/villageOwnTroops/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageOwnTroopsData),
            });

            //villageProductions
            let villageProductionsData = {
                "idVillage": oneVillageData['_id'],
                "productionWood": 0,
                "productionClay": 0,
                "productionIron": 0,
                "productionCrop": 0
            }
            await fetch('http://localhost:8080/api/villageProductions/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageProductionsData),
            });

            let currentUnixTime = Math.round(new Date().getTime()/1000);
            //villageResources
            let villageResourcesData = {
                "idVillage": oneVillageData['_id'],
                "currentWood": 800,
                "currentClay": 800,
                "currentIron": 800,
                "currentCrop": 800,
                "lastUpdate": currentUnixTime
            }
            await fetch('http://localhost:8080/api/villageResources/', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(villageResourcesData),
            });


        },
        
    }
}
</script>
