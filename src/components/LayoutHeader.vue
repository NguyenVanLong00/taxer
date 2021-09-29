<template>
  <div v-if="isShowed" class="page-header">
    <img :src="headerImage" />
    <div class="container logo">
      <h1>tính thuế</h1>
      <p>ứng dụng tính thuế hàng đầu chỉ sau vô vàn ứng dụng tính thuế khác</p>
    </div>
  </div>
  <div v-else style="margin-bottom:2rem;"></div>
</template>

<script>
import headerImage from "../assets/header.jpg";

export default {
  data() {
    return {
      headerImage,
    };
  },
  computed: {
    isShowed() {
      return this.$route.name != "TaxDetail";
    },
  },
};
</script>


<style scoped>
.page-header {
  height: 20rem;
  padding-bottom: 2rem;
}
.page-header img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.logo {
  background: rgba(0, 0, 0, 0.4);
  font-size: 1.5rem;
  text-transform: capitalize;
  position: absolute;
  top: 3rem;
  left: 0;
  right: 0;
  color: #fff;
  text-align: center;
  font-weight: bold;
}
</style>