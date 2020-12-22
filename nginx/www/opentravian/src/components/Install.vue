<template>
    <div>
        <button class="btn btn-lg btn-primary btn-block" v-on:click="install()">Install</button>
    </div>
</template>

<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {

    data() {
        return {
        };
    },

    mixins: [fetchMixins,toolsMixins],

    created() {
        this.infoLookup();
    },

    methods: {
        async install(){
            if (confirm('Are you sure you want to start Installation process?')) {
                const installParameters = {
                    width: 11,
                    height: 9
                }
                const installResponse = await(await this.doApiRequest("install", "POST", installParameters, true)).json();
                if (installResponse.status == 'success') this.$router.push({ name: 'login' });
            } else {
                console.log('Aborted.');
            }
        },
    }
}
</script>
