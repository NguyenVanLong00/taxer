<template>
  <layout-header></layout-header>
  <router-view/>
</template>


<script>
import LayoutHeader from "./components/LayoutHeader.vue";
export default {
  components:{
    LayoutHeader
  }
  
}
</script>
<style>

body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body{
    font-family: 'Roboto', sans-serif;
}

</style>
