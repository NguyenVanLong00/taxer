<template>
  <div class="container">
    <el-button
      type="primary"
      class="new-btn"
      @click="isOpenForm = true"
      icon="el-icon-plus"
      circle
    ></el-button>

    <el-card class="searchbar">
      <el-row :gutter="16">
        <el-col :span="21">
          <el-input
            placeholder="tìm theo mã tính thuế"
            v-model="searchKey"
            class="searchInput"
            clearable
          >
          </el-input
        ></el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-search">
            tìm kiếm</el-button
          ></el-col
        >
      </el-row>
    </el-card>

    <el-row :gutter="16">
      <el-col :span="8" v-for="(tax, index) in searchedTaxData" :key="index">
        <router-link
          class="tax-wrapper"
          :to="{ name: 'TaxDetail', params: { id: tax.id } }"
        >
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
        <el-form-item label="Thu nhập từng tháng"> </el-form-item>

        <el-form-item v-for="(income, index) in incomes" :key="index">
          <el-row :gutter="16">
            <el-col :span="10">
              <el-input
                type="number"
                placeholder="0"
                v-model="income.income"
              ></el-input>
            </el-col>
            <el-col :span="10">
              <el-select-v2
                v-model="income.months"
                :options="months"
                placeholder="Please select"
                style="width: 100%"
                multiple
              />
            </el-col>
            <el-col :span="4">
              <el-button
                icon="el-icon-close"
                @click="removeIcome(index)"
                circle
              ></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" @click="addIcome" circle></el-button>
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
        incomeWithoutTax: 0,
        dependPerson: 0,
        charity: 0,
        BHYT: false,
        BHXH: false,
        BHTN: false,
        stayed: true,
        workLongTime: true,
      },
      incomes: [{ income: null, months: [] }],
      months: [],
      taxData: [],
      searchKey: "",
    };
  },
  mounted() {
    this.getTaxLaw(2021);
    this.getTaxData();
    this.months = Array.from({ length: 12 }).map((_, idx) => ({
      value: idx,
      label: `Tháng ${idx + 1}`,
    }));

    console.log(this.months);
  },
  computed: {
    isNoData() {
      return this.taxData.length == 0;
    },
    searchedTaxData() {
      return this.taxData.filter((item) =>
        item.tax_id.includes(this.searchKey)
      );
    },
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
      const request = new Request("http://localhost:3000/test", {
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

    addIcome() {
      this.incomes.push({ income: null, months: [] });
    },
    removeIcome(index) {
      this.incomes.splice(index, 1);
    },
    getIncones() {
      let monthIncome = Array(12).fill(0);
      this.incomes.forEach((item) => {
        item.months.forEach((month) => {
          monthIncome[month] += parseInt(item.income);
        });
      });
      return monthIncome;
    },
    sendTaxData() {
      this.isOpenForm = false;
      const taxMonth = this.getIncones();
      const data = {
        thang1: taxMonth[0],
        thang2: taxMonth[1],
        thang3: taxMonth[2],
        thang4: taxMonth[3],
        thang5: taxMonth[4],
        thang6: taxMonth[5],
        thang7: taxMonth[6],
        thang8: taxMonth[7],
        thang9: taxMonth[8],
        thang10: taxMonth[9],
        thang11: taxMonth[10],
        thang12: taxMonth[11],
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
.tax-wrapper .el-card {
  margin-bottom: 16px;
}
</style>