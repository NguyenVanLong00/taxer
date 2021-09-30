<template>
  <div class="container">
    <el-button
      type="primary"
      class="new-btn"
      @click="isOpenForm = true"
      icon="el-icon-plus"
      circle
    ></el-button>

    <el-card class="searchbar" >
      <el-row :gutter="16">
        <el-col :span="21">
          <el-input
            placeholder="tìm theo mã tính thuế"
            v-model="searchKey"
            class="searchInput"
            clearable
          >
          </el-input
        ></el-col >
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-search">
            tìm kiếm</el-button
          ></el-col
        >
      </el-row>
    </el-card>

    <el-row :gutter="16">
      <el-col :span="8" v-for="(tax, index) in searchedTaxData" :key="index">
        <router-link class="tax-wrapper" :to="{ name: 'TaxDetail', params: { id: tax.id } }">
          <el-card shadow="hover">
            <h3>ID tính thuế {{ tax.tax_id }}</h3>
            <p>
              Tổng thu nhập: {{ formatNumber(tax.tax_sumary.total_income) }}
            </p>
            <p>Thuế đã thu: {{ formatNumber(tax.tax_sumary.paid) }}</p>
            <p>Thuế thực tế: {{ formatNumber(tax.tax_sumary.total_tax) }}</p>
            <p>
              Tiền nhận lại:
              {{ formatNumber(tax.tax_sumary.paid - tax.tax_sumary.total_tax) }}
            </p>
          </el-card>
        </router-link>
      </el-col>
    </el-row>
  </div>

  <el-drawer
    title="Thuế từng tháng"
    v-model="isOpenForm"
    direction="ltr"
    size="50rem"
  >
    <div class="tax-form">
      <el-form :model="taxInfo" label-position="left" label-width="10rem">
        <el-form-item label="Năm tính thuế">
          <el-input-number
            v-model="taxInfo.year"
            :min="1975"
            :max="2021"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Thu nhận miễn thuế">
          <el-input
            type="number"
            placeholder="0"
            v-model="taxInfo.incomeWithoutTax"
          ></el-input>
        </el-form-item>

        <el-form-item label="Khoản từ thiện">
          <el-input
            type="number"
            placeholder="0"
            v-model="taxInfo.charity"
          ></el-input>
        </el-form-item>

        <el-form-item label="Số người phụ thuộc">
          <el-input-number
            v-model="taxInfo.dependPerson"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="Bảo hiểm">
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm y tế"
            v-model="taxInfo.BHYT"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm xã hội"
            v-model="taxInfo.BHXH"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm tai nan"
            v-model="taxInfo.BHTN"
          ></el-switch>
        </el-form-item>

        <el-form-item v-show="false" label="Tình trạng cư chú">
          <el-switch
            inactive-text="Định cư"
            active-text="Không định cư"
            v-model="taxInfo.stayed"
          ></el-switch>
        </el-form-item>

        <el-form-item v-show="false">
          <el-switch
            inactive-text="Hợp đồng trên 3 tháng"
            active-text="Hợp đồng dưới 3 tháng/ không ký hợp đồng"
            v-model="taxInfo.workLongTime"
          ></el-switch>
        </el-form-item>

        <el-form-item
          v-for="month in taxInfo.incomes"
          :key="month"
          :label="month.month"
        >
          <el-input
            type="number"
            placeholder="0"
            v-model="month.income"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="sendTaxData">Tính thuế</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      isOpenForm: false,
      taxLaw: null,
      taxInfo: {
        year: 2021,
        incomes: [
          {
            month: "Tháng 1",
            income: null,
          },
          {
            month: "Tháng 2",
            income: null,
          },
          {
            month: "Tháng 3",
            income: null,
          },
          {
            month: "Tháng 4",
            income: null,
          },
          {
            month: "Tháng 5",
            income: null,
          },
          {
            month: "Tháng 6",
            income: null,
          },
          {
            month: "Tháng 7",
            income: null,
          },
          {
            month: "Tháng 8",
            income: null,
          },
          {
            month: "Tháng 9",
            income: null,
          },
          {
            month: "Tháng 10",
            income: null,
          },
          {
            month: "Tháng 11",
            income: null,
          },
          {
            month: "Tháng 12",
            income: null,
          },
        ],
        incomeWithoutTax: 0,
        dependPerson: 0,
        charity: 0,
        BHYT: false,
        BHXH: false,
        BHTN: false,
        stayed: true,
        workLongTime: true,
      },
      taxData: [],
      searchKey: "",
    };
  },
  mounted() {
    this.getTaxLaw(2021);
    this.getTaxData();
  },
  computed: {
    isNoData() {
      return this.taxData.length == 0;
    },
    searchedTaxData(){
      return this.taxData.filter(item=> item.tax_id.includes(this.searchKey));
    }
  },
  methods: {
    async getTaxLaw(year) {
      const response = await fetch(
        "http://localhost:3000/tax-law?year=" + year
      );
      let data = await response.json();
      this.taxLaw = data[0];
    },

    async saveTaxData(data) {
      console.log(data);
      const request = new Request("http://localhost:3000/taxs", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await fetch(request);
      console.log(response);
    },

    async getTaxData() {
      const response = await fetch("http://localhost:3000/taxs");
      this.taxData = await response.json();
      console.log(this.taxData);
    },

    sendTaxData() {
      this.isOpenForm = false;
      const taxMonth = this.taxInfo.incomes;
      const data = {
        thang1: taxMonth[0].income,
        thang2: taxMonth[1].income,
        thang3: taxMonth[2].income,
        thang4: taxMonth[3].income,
        thang5: taxMonth[4].income,
        thang6: taxMonth[5].income,
        thang7: taxMonth[6].income,
        thang8: taxMonth[7].income,
        thang9: taxMonth[8].income,
        thang10: taxMonth[9].income,
        thang11: taxMonth[10].income,
        thang12: taxMonth[11].income,
        thu_nhap_mien_thue: this.taxInfo.incomeWithoutTax,
        nguoi_phu_thuoc: this.taxInfo.dependPerson,
        tu_thien: this.taxInfo.charity,
        BHYT: this.taxInfo.BHYT,
        BHXH: this.taxInfo.BHXH,
        BHTN: this.taxInfo.BHTN,
      };

      this.saveTaxData(data);
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
.el-switch__label.is-active {
  color: rgba(0, 0, 0, 0.3);
}
.switch {
  margin-right: 2rem;
}

.el-drawer__body {
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}

.el-drawer__body::-webkit-scrollbar-track {
  border: none;
  background-color: #f5f5f5;
}
.el-drawer__body::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}
.el-drawer__body::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.container {
  width: 1040px;
  margin: 0 auto;
}

a {
  text-decoration: none;
}
.top-btn {
  margin-bottom: 2rem;
}

.new-btn {
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  padding: 20px !important;
  font-size: 1.5rem;
}

.searchbar {
  margin-bottom: 2rem;
}
.searchInput input {
  border: none !important;
}
.tax-wrapper .el-card{
  margin-bottom:16px;
}
</style>