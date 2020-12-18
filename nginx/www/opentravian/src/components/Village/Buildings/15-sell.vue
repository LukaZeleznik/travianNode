<template>
    <div>
       test sell
    </div>
</template>


<script>
import { fetchMixins } from '@/mixins/fetchMixins'
import { hasMixins } from '@/mixins/hasMixins'
import { upgradeMixins } from '@/mixins/upgradeMixins'
import { toolsMixins } from '@/mixins/toolsMixins'

export default {
    data() {
        return {
        };
    },

    mixins: [
        fetchMixins,
        hasMixins,
        upgradeMixins,
        toolsMixins
        ],
    
    watch: {
    },

    created() {
    },

    methods: {
    }
}
</script>