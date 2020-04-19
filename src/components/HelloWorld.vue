<template>
  <div style="padding-top: 50px">
    <!-- <a-button type="primary" style="float: right;margin-top: 10px; margin-right: 20px" :loading="loading_yhsc" @click="dl_yhsc">下载使用说明</a-button>
    <a-button type="primary" style="float: right;margin-top: 10px; margin-right: 20px" @click="gototoolbox">工具箱</a-button>
    <a-button type="primary" style="float: right;margin-top: 10px; margin-right: 20px" @click="updatepwd">修改密码</a-button>
    <a-modal title="修改密码" v-model="visible_uppwd" @ok="handleOk" @cancel="handleCancel">
      <a-input-password placeholder="请输入新密码 ԅ(¯﹃¯ԅ)" maxLength="20" v-model="new_pwd" />
      <br />
      <br />
      <a-input-password placeholder="请再输入一遍新密码 （¯﹃¯）" maxLength="20" v-model="new_pwd_se" />
    </a-modal>
    <a-button type="primary" style="float: right;margin-top: 10px; margin-right: 20px" @click="logout">退出</a-button>
    <a-button type="primary" style="float: right;margin-top: 10px; margin-right: 20px" @click="test_page">不要点</a-button> -->
    <div style="float: left;margin-left: 15px;width: 15%;margin-top: 15px;">
      <a-table
        :dataSource="data"
        :columns="columns"
        :loading="loading"
        :pagination="pagination_xmlist"
        :scroll="{y: 840}"
        :rowKey="record => record.xmbh"
      >
        <!-- slot-scope 用来绑定record -->
        <router-link
          :to="{ path: '/xm_info/' + record.xmdz }"
          slot="name"
          slot-scope="text, record"
        >{{text}}</router-link>
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          class="custom-filter-dropdown"
        >
          <a-input
            v-ant-ref="c => searchInput = c"
            :placeholder="`请输入${column.title}`"
            :value="selectedKeys[0]"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm)"
            style="width: 188px; margin-bottom: 8px; display: block;"
          />
          <a-button
            type="primary"
            @click="() => handleSearch(selectedKeys, confirm)"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
          >查询</a-button>
          <a-button
            @click="() => handleReset(clearFilters)"
            size="small"
            icon="reload"
            style="width: 90px"
          >清空</a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="customRender" slot-scope="text">
          <span v-if="searchText">
            <template
              v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
              >{{fragment}}</mark>
              <template v-else>{{fragment}}</template>
            </template>
          </span>
          <template v-else>{{text}}</template>
        </template>
      </a-table>
    </div>
    <div style="float: left;width: 84%">
      <a-select defaultValue="用例统计" @change="handleChange" style="right: 90%;margin-top: 10px;" >
        <a-select-option value="1">用例统计</a-select-option>
        <a-select-option value="2">项目统计</a-select-option>
        <a-select-option value="3">开发团队</a-select-option>
        <a-select-option value="4">测试团队</a-select-option>
      </a-select>
      <div style="float: left;margin-top: 50px;margin-left:20px;width: 45%;" id="app_c"></div>
      <div style="float: left;margin-top: 50px;margin-left:20px;width: 45%;" id="app_d"></div>
      <div>
        <div
          style="float: left;margin-top: 50px;margin-left:50px;margin-right:20px;width: 45%"
          id="app_e"
        >
          <h4>最近更新项目</h4>
          <a-table
            :columns="columns_xm"
            :dataSource="data_xm"
            size="small"
            style="margin-left: 15px;width: 100%;margin-top: 15px;"
            :pagination="pagination"
          />
        </div>
        <div style="float: left;margin-top: 50px;margin-left:15px;width: 45%">
          <h4>最近执行项目</h4>
          <a-table
            :columns="columns_zx"
            :dataSource="data_zx"
            size="small"
            style="margin-left: 15px;width: 100%;margin-top: 15px;"
            :pagination="pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import G2 from "@antv/g2";
import { Chart } from '@antv/g2';
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  mounted() {
    this.index_rate(1);
    this.xm_list();
    this.update_time_order();
    this.run_time_order();
  },
  data() {
    return {
      data: [],
      loading: false,
      // visible_uppwd: false,
      // new_pwd: '',
      // new_pwd_se: '',
      searchText: "",
      searchInput: null,
      // loading_yhsc: false,
      columns: [
        {
          title: "项目名称",
          dataIndex: "xmmc",
          key: "xmmc",
          align: "center",
          width: "200",
          scopedSlots: {
            filterDropdown: "filterDropdown",
            filterIcon: "filterIcon",
            customRender: "name"
          },
          onFilter: (value, record) =>
            record.xmmc.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          }
        }
      ],
      columns_xm: [
        {
          title: "项目名称",
          dataIndex: "name"
        },
        {
          title: "用例名称",
          dataIndex: "ylmc"
        },
        {
          title: "更新时间",
          dataIndex: "time"
        }
      ],
      data_xm: [],
      columns_zx: [
        {
          title: "项目名称",
          dataIndex: "name"
        },
        {
          title: "用例名称",
          dataIndex: "ylmc"
        },
        {
          title: "覆盖率",
          dataIndex: "fgl"
        },
        {
          title: "通过率",
          dataIndex: "tgl"
        },
        {
          title: "执行时间",
          dataIndex: "time"
        }
      ],
      data_zx: [],
      pagination_xmlist: {
        hideOnSinglePage: true,
        defaultPageSize: 500
      },
      pagination: {
        hideOnSinglePage: true,
        defaultPageSize: 5
      },
      chart_data_c: [],
      chart_data_d: []

    };
  },
  methods: {
    xm_list() {
      this.loading = true;
      axios({ method: "get", url: "project_list" }).then(response => {
        this.data = response.data.reslist;
        this.pagination_xmlist.defaultPageSize = response.data.maxsize;
      });
      this.loading = false;
    },
    handleSearch(selectedKeys, confirm) {
      confirm();
      this.searchText = selectedKeys[0];
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = "";
    },

    init_fgl() {
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const chart = new Chart({
        container: "app_c",
        width: 750,
        height: 400 ,
        padding: [10, 120, 40, 200]
      });
      chart.data(this.chart_data_c)
      chart.scale({
        value: {
          max: 100,
          min: 0,
            alias: '用例平均覆盖率',
        },
      });
      chart.axis('type', {
        title: null,
        tickLine: null,
        line: null,
      });
      chart.axis('value', {
        label: null,
        title: {
          offset: 30,
          style: {
            fontSize: 12,
            fontWeight: 300,
          },
        },
      });
      chart.legend(false);
      chart.coordinate().transpose();
      chart
        .interval()
        .position("type*value")
        .size(20)
        .label("sold", {
          textStyle: {
            fill: "#8d8d8d"
          },
          offset: 10
        });
      // this.chart = chart;
      chart.interaction('element-active');
      // this.chart.render();
      chart.render();
    },
    init_tgl() {
      // 此函数为个人习惯,喜欢创建一个初始化的函数
      const chart = new Chart({
        container: "app_d",
        width: 750,
        height: 400,
        padding: [10, 120, 40, 200]
      });
      chart.data(this.chart_data_d)
      chart.scale({
            value: {
              alias: '用例平均通过率',
            },
        });
      chart.axis("value", {
        // 这部分尚未生效，有待排查
        label: null,
        title: {
          offset: 30,
          textStyle: {
            fontSize: 10,
            fontWeight: 600
          }
        }
      });
      chart.coordinate().transpose();
      chart
        .interval()
        .position("type*value")
        .size(20)
        .label("sold", {
          textStyle: {
            fill: "#8d8d8d"
          },
          offset: 10
        });
      this.chart = chart;
      this.chart.render();
    },
    zx_info(key) {
      // alert("这是点击事件")
      alert("key:" + key);
    },
    // dl_yhsc() {
    //   this.loading_yhsc = true;
    //   axios.get('downloadyhsc', {responseType: 'blob'}).then(response=>{
    //     let blob = new Blob([response.data], {
    //       type: response.headers["content-type"]
    //     });
    //     let downloadElement = document.createElement("a");
    //     let href = window.URL.createObjectURL(blob); // 创建下载的链接
    //     downloadElement.href = href;
    //     downloadElement.download = '使用手册.docx'
    //     document.body.appendChild(downloadElement);
    //     downloadElement.click(); // 点击下载
    //     document.body.removeChild(downloadElement); // 下载完成移除元素
    //     window.URL.revokeObjectURL(href); // 释放掉blob对象
    //   });
    //   this.loading_yhsc =false;
    // },
    // logout() {
    //   axios.get('logout').then(res =>{
    //     if (res.data.result === "success") {
    //       this.$cookies.set('status', "logout")
    //       this.$router.replace({path: '/login'})
    //     }
    //   })
    // },
    // gototoolbox() {
    //   window.open('/#/toolbox')
    // },
    // updatepwd() {
    //   this.visible_uppwd = true;
    // },
    // handleOk() {
    //   if (this.new_pwd === this.new_pwd_se) {
    //     axios.post("updatepwd", {'new_password': this.new_pwd_se}).then(response => {
    //       if (response.data.result === 'success') {
    //         this.visible_uppwd = false;
    //         this.new_pwd = '';
    //         this.new_pwd_se = '';
    //         this.$message.success('密码修改成功！✿✿ヽ(°▽°)ノ✿')
    //       } else(
    //         this.$message.error(response.data.msg)
    //       )
    //     })
    //   } else(
    //     this.$message.error('两次密码必须一致！！！o(╯□╰)o')
    //   )
    // },
    handleCancel() {
      this.new_pwd = '';
      this.new_pwd_se = '';
    },
    update_time_order() {
      axios.get('update_time_order').then(response => {
        if (response.status === 200) {
          this.data_xm = response.data;
        } else (
          this.$message.error(response.data.msg)
        )
      })
    },
    run_time_order() {
      axios.get('run_time_order').then(response => {
        if (response.status === 200) {
          this.data_zx = response.data;
        } else (
          this.$message.error(response.data.msg)
        )
      })
    },
    index_rate(tjfs, limit) {
      if(!limit){limit=10;}
      tjfs = parseInt(tjfs)
      axios.post('index_rate', {tjfs: tjfs, limit: limit}).then(response => {
        if (response.status === 200) {
          // this.chart_data = response.data;
          this.chart_data_c = response.data[0]
          this.chart_data_d = response.data[1]
          document.getElementById('app_c').innerHTML = '';
          document.getElementById('app_d').innerHTML = '';
          this.init_fgl();
          this.init_tgl();
        } else (
          this.$message.error(response.data.msg)
        )
      }
      )
    },
    handleChange(value) {
      this.index_rate(value)
    },
    // test_page() {
    //   window.open('/#/testpage')
    // }
  }
};
</script>
<style scoped>
.custom-filter-dropdown {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>