export const fetchMixins = {
    methods: {
        fetchVillageOwnTroops(){ this.$store.dispatch('fetchVillageOwnTroops') },
        fetchVillageResources(){ this.$store.dispatch('fetchVillageResources') },
        fetchBuildingData(vbid){
            fetch('http://localhost:8080/api/villageBuildingFields/1')
            .then(res => res.json())
            .then(res => {
                let keyType = "field"+vbid+"Type";
                let keyLevel = "field"+vbid+"Level";
                let userTribe = "Teuton";

                if(vbid == 19){
                    switch (userTribe) {
                        case "Teuton":  this.villageBuildingType = 5; break;
                        case "Roman":   this.villageBuildingType = 6; break;
                        case "Gaul":    this.villageBuildingType = 7; break;
                    }
                }
                else {
                    this.villageBuildingType = res.data[keyType];
                }
                this.villageBuildingLevel = res.data[keyLevel];
            })
            .catch(err => console.log(err));
        },
    }
  }