<template>
    <div class="container">
        <navbarMenu></navbarMenu>
        <navbarResources v-if="this.$route.name != 'login'"></navbarResources>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {}
</script>