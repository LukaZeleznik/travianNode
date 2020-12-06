<template>
    <div class="container">
        <div v-if="this.$route.name != 'install'">
            <navbarMenu></navbarMenu>
            <navbarResources v-if="this.$route.name != 'login' && this.$route.name != 'register'"></navbarResources>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {}
</script>