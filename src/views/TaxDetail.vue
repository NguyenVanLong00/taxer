<template>
  <div class="container">
    <router-link to="/">
      <el-button type="primary" class="top-btn" icon="el-icon-arrow-left"
        >Quay lại</el-button
      >
    </router-link>
    <div v-if="isLoading">loading data ...</div>
    <div v-else>
      <el-card class="header-detail">
        <h3>ID tính thuế {{ taxData.id }}</h3>
        <p>
          Tổng thu nhập: {{ formatNumber(taxData.tax_sumary.total_income) }}
        </p>
        <p>Thuế đã thu: {{ formatNumber(taxData.tax_sumary.paid) }}</p>
        <p>Thuế thực tế: {{ formatNumber(taxData.tax_sumary.total_tax) }}</p>
        <p>
          Tiền nhận lại:
          {{
            formatNumber(taxData.tax_sumary.paid - taxData.tax_sumary.total_tax)
          }}
        </p>
      </el-card>
      <el-card>
        <el-table :data="formatedTax" style="width: 100%">
          <el-table-column prop="month" label="Tháng" width="180" />
          <el-table-column prop="income" label="Thu nhập" width="180" />
          <el-table-column prop="tax" label="Thuế" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      taxData: null,
      taxId: null,
    };
  },
  async mounted() {
    this.taxId = this.$route.params.id;
    console.log(this.taxId);
    this.getTaxData();
  },
  computed: {
    isLoading() {
      return this.taxData === null;
    },
    formatedTax() {
      return this.taxData.user_tax.map((item) => {
        return {
          month: item.month,
          income: this.formatNumber(item.income),
          tax: this.formatNumber(item.tax),
        };
      });
    },
  },
  methods: {
    async getTaxData() {
      const response = await fetch("http://localhost:3000/taxs/" + this.taxId);
      this.taxData = await response.json();
      console.log(this.taxData);
    },
    formatNumber(number) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(number);
    },
  },
};
</script>

<style>
.header-detail {
  margin-bottom: 1rem;
}
</style>