<template>
  <el-row justify="center" class="header">
    <el-button
      @click="isOpenYearForm = true"
      type="primary"
      style="margin-left: 16px"
    >
      Tính thuế cả năm
    </el-button>

    <el-button
      @click="isOpenMonthForm = true"
      type="primary"
      style="margin-left: 16px"
    >
      Tính thuế theo tháng
    </el-button>
  </el-row>

  <el-row justify="center">
    <div v-if="isNoData">không có dữ liệu về thuế</div>

    <el-table v-else :data="taxData" class="table-content">
      <el-table-column prop="month" label="Tháng" width="180">
      </el-table-column>
      <el-table-column prop="income" label="Thu nhập" width="180">
      </el-table-column>
      <el-table-column prop="tax" label="Thuế"> </el-table-column>
    </el-table>
  </el-row>

  <el-drawer
    title="Thuế cả năm"
    v-model="isOpenYearForm"
    direction="ltr"
    size="50rem"
  >
    <div class="tax-form">
      <el-form :model="yearTaxInfo" label-position="left" label-width="10rem">
        <el-form-item label="Năm tính thuế">
          <el-input-number
            v-model="yearTaxInfo.year"
            :min="1975"
            :max="2021"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Tổng thu nhập">
          <el-input
            type="number"
            placeholder="0"
            v-model="yearTaxInfo.income"
          ></el-input>
        </el-form-item>
        <el-form-item label="Thu nhận miễn thuế">
          <el-input
            type="number"
            placeholder="0"
            v-model="yearTaxInfo.incomeWithoutTax"
          ></el-input>
        </el-form-item>

        <el-form-item label="Khoản từ thiện">
          <el-input
            type="number"
            placeholder="0"
            v-model="yearTaxInfo.charity"
          ></el-input>
        </el-form-item>

        <el-form-item label="Số người phụ thuộc">
          <el-input-number
            v-model="yearTaxInfo.dependPerson"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="Bảo hiểm">
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm y tế"
            v-model="yearTaxInfo.BHYT"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm xã hội"
            v-model="yearTaxInfo.BHXH"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm tai nan"
            v-model="yearTaxInfo.BHTN"
          ></el-switch>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getYearTax">Tính thuế</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>

  <el-drawer
    title="Thuế từng tháng"
    v-model="isOpenMonthForm"
    direction="ltr"
    size="50rem"
  >
    <div class="tax-form">
      <el-form :model="monthTaxInfo" label-position="left" label-width="10rem">
        <el-form-item label="Năm tính thuế">
          <el-input-number
            v-model="monthTaxInfo.year"
            :min="1975"
            :max="2021"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Thu nhận miễn thuế">
          <el-input
            type="number"
            placeholder="0"
            v-model="monthTaxInfo.incomeWithoutTax"
          ></el-input>
        </el-form-item>

        <el-form-item label="Khoản từ thiện">
          <el-input
            type="number"
            placeholder="0"
            v-model="monthTaxInfo.charity"
          ></el-input>
        </el-form-item>

        <el-form-item label="Số người phụ thuộc">
          <el-input-number
            v-model="monthTaxInfo.dependPerson"
            :min="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="Bảo hiểm">
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm y tế"
            v-model="monthTaxInfo.BHYT"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm xã hội"
            v-model="monthTaxInfo.BHXH"
          ></el-switch>
          <el-switch
            class="switch"
            inactive-text="Bảo hiểm tai nan"
            v-model="monthTaxInfo.BHTN"
          ></el-switch>
        </el-form-item>

        <el-form-item
          v-for="month in monthTaxInfo.incomes"
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
          <el-button type="primary" @click="getMonthTax">Tính thuế</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      isOpenYearForm: false,
      isOpenMonthForm: false,
      taxResult: 0,
      taxLaw: null,
      yearTaxInfo: {
        year: 2021,
        income: null,
        incomeWithoutTax: null,
        dependPerson: 0,
        charity: 0,
        BHYT: false,
        BHXH: false,
        BHTN: false,
      },
      monthTaxInfo: {
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
      },
      taxData: [],
    };
  },
  mounted() {
    this.getTaxLaw(2021);
    this.getTaxData(1);
  },
  computed: {
    isNoData() {
      return this.taxData.length == 0;
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

    async getTaxData(id) {
      const response = await fetch("http://localhost:3000/taxs/" + id);
      let data = await response.json();
      this.taxData = data.user_tax;
    },

    getYearTax() {
      let tax = this.yearTaxInfo;

      // giam tru ban than va nguoi phu thuoc
      let totalDecrease =
        this.taxLaw.selfDecrease * 12 +
        this.taxLaw.dependDecrease * tax.dependPerson;

      // giam tru bao hiem
      if (tax.BHYT) {
        totalDecrease += tax.income * this.taxLaw.BHYT;
      }
      if (tax.BHXH) {
        totalDecrease += tax.income * this.taxLaw.BHXH;
      }
      if (tax.BHTN) {
        totalDecrease += tax.income * this.taxLaw.BHTB;
      }

      let icomeAfterDescrease = tax.income - totalDecrease;

      for (let key in this.taxLaw.tax_year) {
        if (icomeAfterDescrease > this.taxLaw.tax_year[key].icome) {
          console.log(icomeAfterDescrease * this.taxLaw.tax_year[key].percent);
          break;
        }
      }
    },

    async getMonthTax() {
      let tax = this.monthTaxInfo;

      // giam tru ban than va nguoi phu thuoc
      let totalDecrease =
        this.taxLaw.selfDecrease +
        this.taxLaw.dependDecrease * tax.dependPerson;

      let result = [];

      let monthTax, icomeAfterDescrease;
      for (let i = 0; i < 12; i++) {
        let mrs = {
          month: tax.incomes[i].month,
          income: tax.incomes[i].income == null ? 0 : tax.incomes[i].income,
          tax: 0,
        };

        icomeAfterDescrease = tax.incomes[i].income - totalDecrease;

        // giam tru bao hiem
        if (tax.BHYT) {
          icomeAfterDescrease -= tax.incomes[i].income * this.taxLaw.BHYT;
        }
        if (tax.BHXH) {
          icomeAfterDescrease -= tax.incomes[i].income * this.taxLaw.BHXH;
        }
        if (tax.BHTN) {
          icomeAfterDescrease -= tax.incomes[i].income * this.taxLaw.BHTB;
        }

        for (let key in this.taxLaw.tax_month) {
          if (icomeAfterDescrease > this.taxLaw.tax_month[key].icome) {
            monthTax =
              icomeAfterDescrease * this.taxLaw.tax_month[key].percent -
              this.taxLaw.tax_month[key].extra;
            mrs.tax = monthTax;
            break;
          }
        }
        result.push(mrs);
      }
      let payload = {
        user_tax: result,
      };

      // var data = new FormData();
      // data.append("json", JSON.stringify(payload));

      // await fetch("http://localhost:3000/taxs", {
      //   method: "POST",
      //   body: data,
      //   header: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      // });

      const object = { name: "James Gordon" };
      const response = await fetch("http://localhost:3000/taxs", {
        method: "POST",
        body: JSON.stringify(object),
      });
      const responseText = await response.text();
      console.log(responseText); // logs 'OK'
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

.header {
  margin-top: 5rem;
}
.table-content {
  margin-top: 3rem;
  padding: 1rem;
  border-radius: 5px;
  width: 45rem;

  border: 1px solid rgba(0, 0, 0, 0.3);
}
</style>