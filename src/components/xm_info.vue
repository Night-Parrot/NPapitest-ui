<template>
  <div>
    <!-- 用例信息的抽屉 -->
    <div>
      <a-drawer title="用例管理" :placement="placement" :closable="true" @close="onClose" :visible="visible_ylgl"
        :destroyOnClose="true" height="800">
        <div style="float: left; width: 100%">
          <div style="float: left;margin-left: 30px;">
            <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button :disabled="fileList.length === 1">
                <a-icon type="upload" />选择用例文件
              </a-button>
            </a-upload>
          </div>
          <div style="float: left;">
            <a-button type="primary" @click="handleUpload" :disabled="fileList.length === 0" :loading="uploading"
              style="margin-left: 20px">{{uploading ? '正在上传' : '上传' }}</a-button>
          </div>
          <div style="margin-top: 80px">
            <a-table :columns="columns_yl" :rowKey="record => record.ylbh" :dataSource="data_yl"
              :pagination="pagination_yl_list" :loading="loading_yl_list" size="middle" @change="handleTableChange_ylxx"
              style="margin-left: 30px;margin-right: 30px;">
              <H3 slot="title">用例列表</H3>
              <span slot="ylmc" slot-scope="text, record">
                <a-tag color="#f50" :visible="record.bjzt == '1'">用例编辑中···</a-tag>
                {{text}}
              </span>
              <span slot="action_yl" slot-scope="record">
                <!-- <a-button type="primary" :loading="loading_runcanse" @click="click_info(record.ylbh)">执行</a-button> -->
                <a-button type="primary" v-if="record.bjzt == '2'" @click="child_draw(record.ylbh)" :disabled="record.bjzt == '1'"><a-icon type="smile" theme="twoTone" twoToneColor="#ffe600" />执行</a-button>
                <a-divider type="vertical" v-if="record.bjzt == '2'" />
                <a-button type="primary" v-if="record.bjzt == '2'" :loading="loading_download" @click="click_dl_case(record.ylbh)" :disabled="record.bjzt == '1'"><a-icon type="cloud-download"/>下载</a-button>
                <a-divider type="vertical" v-if="record.bjzt == '2'" />
                <a-button type="primary" @click="edit_page(record.ylbh, record.ylmc)"><a-icon type="edit" theme="twoTone" twoToneColor="#ffe600" />编辑</a-button>
                <a-divider type="vertical" />
                <a-button type="primary" @click="view_page(record.ylbh, record.ylmc)"><a-icon type="edit" theme="twoTone" twoToneColor="#ffe600" />查看</a-button>
                <!-- <a-button type="primary">更新用例</a-button> -->
                <a-divider type="vertical" />
                <a-popconfirm title="确认删除么?" @confirm="() => del_yl(record.ylbh)" okText="确认" cancelText="取消" v-if="record.bjzt == '2'">
                  <a-button type="primary" :loading="loading" @click="claer_ylgx" :disabled="record.bjzt == '1'"><a-icon type="delete"/>删除</a-button>
                </a-popconfirm>
                <a-divider type="vertical" v-if="record.bjzt == '2'"/>
                <div style="float: right;width: 100px;margin-top: 1px;height: 30px;" v-if="record.bjzt == '2'">
                  <a-upload-dragger
                      name="file"
                      :multiple="false"
                      :showUploadList="false"
                      :fileList="fileList_upyl"
                      :beforeUpload="beforeUpload_ylgx"
                      :disabled="fileList_upyl.length !== 0 || record.bjzt == '1'"
                      @change="handleChange_ylgx(record.ylbh)"
                    >
                    <!-- :data="updatefile_fun(record.xh)" -->
                    <!-- <a-popconfirm title="确认更新么?" @cancel="claer_ylgx" @confirm="() => handleChange_ylgx(record.ylbh)" :visible="record.update == 1"  okText="确认" cancelText="取消"> -->
                      <p><a-icon type="cloud-upload"/>用例更新</p>
                    <!-- </a-popconfirm> -->
                  </a-upload-dragger>
                </div>
              </span>
            </a-table>
          </div>
        </div>
      </a-drawer>
      <a-drawer
        title="执行参数"
        width="700"
        :closable="true"
        @close="onClose_zxcs"
        :visible="visible_zxcs"
        :destroyOnClose="true"
      >
        <div>
          <a-button type="primary" style="margin-bottom: 10px;float: left;" @click="click_info" :loading="loading_runcanse">按照以下参数执行用例</a-button>
          <a-switch checkedChildren="给我算" unCheckedChildren="不稀罕" style="float: right;margin-top: 5px" @change="change_fgdjs" :checked="fgdjs"/>
          <a-tag v-if="fgdjs" color="#87d068" style="margin-top: 5px;margin-right: 20px;float: right;">本次执行将计算用例覆盖度（用例内执行接口数÷总接口数）</a-tag>
          <a-tag v-else color="#f50" style="margin-top: 5px;margin-right: 20px;float: right;">本次执行将不计算覆盖度，一般是要计算的哦╭(￣▽￣)╯╧═╧</a-tag>
        </div>
        <div class="components-input-demo-presuffix">
          <a-input placeholder="请输入swagger的api-docs地址，格式http://xxxxx，如果没有，可以直接输入总数量，例如12" v-model="api_docs" ref="userNameInput">
            <a-icon slot="prefix" type="api" />
            <a-tooltip slot="suffix" title="用来计算用例的覆盖程度，请务必填写最新的地址，如果不输入，就不会计算了">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <br/>
        <a-table :columns="columns_zxcs" :scroll="{y:700}" :pagination="placement_zxcs" :dataSource="data_zxcs" tableLayout="fixed" bordered>
          <!-- <template 
            v-for="col in ['zxcs_key', 'zxcs_value']"
            :slot="col"
            slot-scope="text, record"
          >
            <div :key="col">
              <a-input
                v-if="record.editable"
                style="margin: -5px 0;"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
              <template v-else>{{text}}</template>
            </div>
          </template> -->
          <template 
            v-for="col_key in ['zxcs_key']"
            :slot="col_key"
            slot-scope="text, record"
          >
            <div :key="col_key" style="width: 144px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;" :title="text">
              <a-input
                v-if="record.editable_key"
                style="margin: 0.5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col_key)"
              />
              <template v-else>{{text}}</template>
            </div>
          </template>
          <template 
            v-for="col_value in ['zxcs_value']"
            :slot="col_value"
            slot-scope="text, record"
          >
            <div :key="col_value" style="width: 296px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;" :title="text">
              <a-input
                v-if="record.editable_value"
                style="margin: 0.5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col_value)"
              />
              <template v-else>{{text}}</template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable_key">
                <a @click="() => save(record.key)" style="margin-right: 8px;">保存</a>
                <a @click="() => cancel(record.key)" style="margin-right: 1px;">取消</a>
              </span>
              <span v-else>
                <a @click="() => edit(record.key)">编辑</a>
              </span>
            </div>
          </template>
        </a-table>
      </a-drawer>
    </div>
    <!-- ============================================================================================================================== -->
    <!-- 统计分析的抽屉 -->

    <div>
      <a-drawer title="统计分析" :placement="placement" :closable="true" @close="onClose" :visible="visible_tjfx"
        :destroyOnClose="true" height="800">
        <div>
          <a-statistic title="累计执行次数" :value="1123" suffix="次" style="margin-right: 50px" />
          <a-statistic title="平均通过率" :precision="2" :value="85.54" suffix="%" />
          <a-statistic title="平均覆盖率" :precision="2" :value="72.58" suffix="%" />
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
          <h1>假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！假装有图！</h1>
        </div>
      </a-drawer>
    </div>
    <!-- CI持续集成的抽屉 -->
    <div>
      <a-drawer title="CI持续集成" :placement="placement" :closable="true" @close="onClose" :visible="visible_CI"
        :destroyOnClose="true" height="750">
        <div>
          <div>
          <h3 style="margin-left: 15px;">CI列表</h3>
          <a-table :columns="columns_ci" :rowKey="record => record.key" :dataSource="data_ci" @change="handld_ci" :loading="loading_ci" size="middle" style="height: 350px;width: 65%;margin-top: 10px;margin-left: 15px;float: left;" :pagination="pagination_ci" >
            <span slot="operation" slot-scope="text, record">
              <a-button type="primary" size="small" @click="ci_info(record)" :disabled="record.ck === 1">查看</a-button>
              <a-divider type="vertical" />
              <a-button type="primary" size="small" @click="edit_ci(record)" :disabled="record.bj === 1">编辑</a-button>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除么?" @confirm="() => del_ci(record)" okText="确认" cancelText="取消">
                <a-button type="primary" size="small" >删除</a-button>
              </a-popconfirm>
            </span>
          </a-table>
          </div>
          <div>
            <a-transfer
              :dataSource="mockData"
              showSearch
              style="float: left;margin-top: 10px;margin-left: 30px;"
              :locale="{itemUnit:'个用例', itemsUnit:'个用例',notFoundContent:'列表为空',searchPlaceholder:'请输入用例关键字'}"
              :listStyle="{
                width: '250px',
                height: '290px',  
              }"
              :operations="['添加', '删除']"
              :disabled="ci_disabled"
              :targetKeys="targetKeys"
              @change="handleChange_ci"
              :render="item => `${item.title}`"
            >
            <span slot="notFoundContent">
              没数据
            </span>
            </a-transfer>
            <a-button type="primary" size="small" style="float: right;right: 13.3%;margin-top: 5px;" ghost :disabled="ci_disabled" @click="add_ci">提交</a-button>
            <a-divider type="vertical" />
            <a-button type="primary" size="small" style="float: right;right: 15.75%;margin-top: 5px;" ghost @click="ci_clear">清空</a-button>
          </div>
        <div style="float: left;clear: left;padding-left: 15px;padding-right: 30px;width: 100%;">
          <h3>Linux部署命令</h3>
          <h6 style="float: left;clear: left">命令需要调整后才可以使用</h6>
          <a-input placeholder="点击查看或编辑时，就会有命令了(∩•̀ω•́)⊃-*⋆" size="large" disabled :value="linux_input" style="width: 95%;float: left;clear: left" /> 
          <a-button type="primary" :disabled="linux_input === ''" v-clipboard:copy="linux_input" v-clipboard:success="onCopy" v-clipboard:error="onError" style="margin-top: 21px; height: 40px" >复制命令</a-button>
          <br style="float: left;clear: left"/>
          <br style="float: left;clear: left" />
          <h3 style="float: left;clear: left">Docker部署命令</h3>
          <h6 style="float: left;clear: left">命令需要调整后才可以使用</h6>
          <a-input placeholder="点击查看或编辑时，就会有命令了(∩•̀ω•́)⊃-*⋆" size="large" disabled :value="docker_input" style="width: 95%;float: left;clear: left"/>
          <a-button type="primary" :disabled="docker_input === ''"  v-clipboard:copy="linux_input" v-clipboard:success="onCopy" v-clipboard:error="onError" style="margin-top: 54px; height: 40px">复制命令</a-button>
        </div>
        </div>
      </a-drawer>
    </div>
    <!-- ============================================================================================================================= -->
    <!-- 详情的抽屉 -->
    <div style="float: left;">
      <a-drawer title="执行情况" :placement="placement" :closable="true" @close="onClose" :visible="visible_zxinfo"
        :destroyOnClose="true" height="900">
        <!-- <a-spin :spinning="spinning" :delay="delayTime" tip="···用例仍在执行中，请保持冷静，页面会自动检查用例执行情况···"> -->
          <div style="float: left;width: 25%;">
            <div id="char_xysj" style="float: left;"></div>
            <div id="char_cgl" style="float: left;"></div>
            <div id="char_tgl" style="float: left;"></div>
          </div>
          <div style="float: right;width: 75%;">
            <a-radio-group :value="target_key" @change="handleSizeChange"
              style="margin-left:5px;margin-right:5px;margin-top: 5px;margin-bottom: 5px;" buttonStyle="solid">
              <a-badge :count="count[0]" :overflowCount="overflowCount" style="z-index: 2;">
                <a-radio-button value="1" style="z-index: 0;">全部</a-radio-button>
              </a-badge>
              <a-badge :count="count[1]" :overflowCount="overflowCount" style="z-index: 2;">
                <a-radio-button value="2" style="z-index: 0;">请求成功</a-radio-button>
              </a-badge>
              <a-badge :count="count[2]" :overflowCount="overflowCount" style="z-index: 2;">
                <a-radio-button value="3" style="z-index: 0;">请求失败</a-radio-button>
              </a-badge>
              <a-badge :count="count[3]" :overflowCount="overflowCount" style="z-index: 2;">
                <a-radio-button value="4" style="z-index: 0;">验证通过</a-radio-button>
              </a-badge>
              <a-badge :count="count[4]" :overflowCount="overflowCount" style="z-index: 2;">
                <a-radio-button value="5" style="z-index: 0;">验证失败</a-radio-button>
              </a-badge>
            </a-radio-group>
            <a-input-search placeholder="请输入用例名称关键字" style="float: right;width: 400px;margin-right: 5px;margin-top: 5px" v-model="gjz" @search="onSearch" enterButton />
            <!-- 进度条 -->
            <div style="width: 450px;float: right;margin-right: 55px;margin-top: 5px">
              <div style="width: 400px;float: left;">
                <a-tooltip placement="top" :title="run_status === '0' ? '执行中': (run_status === '1'? '已完成': '已中断')">
                  <a-progress :percent="percent" :status="run_status === '1'? 'success' : (run_status === '0' ? 'active' : 'normal')" style="margin-top: 3px;padding-right: 50px;"
                  :strokeWidth="strokeWidth" :strokeColor="run_status === '1' ? '#7fb80e' : (run_status === '0' ? '#009ad6' : '#f15a22')" />
                </a-tooltip>
              </div>
              <div style="width:20px;float: right;margin-top: 5px;width: 30px; height: 30px;margin-right: 20px">
                  <a-icon :type="run_status === '0' ? 'loading' : (run_status === '1' ? 'smile' : 'frown')" style="font-size: 22px" />
              </div>
            </div>
            <!-- 进度条 -->
            <a-table :columns="columns_zxinfo" :dataSource="data_zxinfo" class="components-table-demo-nested"
              :scroll="{y:670}" size="middle" style="margin-left:5px;margin-right:5px;" :pagination="placement_zxinfo"
              :loading="loading_zxinfo" @change="handleTableChange_zxinfo" :expandRowByClick="true" >
                <span slot="yzjg" slot-scope="text">
                  <a-tag :color="text==='通过' ? '#45b97c' : '#ed1941'" :key="text" style="font-size:small;font-weight:bold">{{text}}
                  </a-tag>
                </span>
              <a-table slot="expandedRowRender" slot-scope="record" :columns="innerColumns_zxinfo" :pagination="false"
                :dataSource="record.innerlist" :rowKey="record => record.key"  size="small" :expandRowByClick="false"
                style="margin-left: 15px;margin-right: 15px">
                <p v-if="record.ycxx === null" slot="expandedRowRender" slot-scope="record" style="margin: 0">{{record.matchinfo}}</p>
                <p v-else slot="expandedRowRender" slot-scope="record" style="margin: 0">{{record.ycxx}}</p>
              </a-table>
            </a-table>
          </div>
        <!-- </a-spin> -->
      </a-drawer>
    </div>

    <!-- ============================================================================================================================= -->
    <!-- 生成用例的抽屉 -->
    <div>
      <a-drawer title="用例生成模板" :placement="placement_ylsc" :closable="true" @close="onClose" :visible="visible_ylsc"
        :destroyOnClose="true" width="600">
        <div>
          <a-form :form="form" style="margin-top: 10px">
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input v-decorator="[
                  'url',
                  { rules: [{ required: true, message: '接口地址不能为空' }] },
                ]" placeholder="请输入swagger-api-doc地址" style="margin-top: 20px;text-align:center" />
            </a-form-item>
            <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-input placeholder="如有需要，请输入cookie" v-decorator="[
                  'cookie'
                ]" style="margin-top: 20px;text-align:center" />
            </a-form-item>
            <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
              <a-button type="primary" style="margin-top: 20px;margin-left: 6px" :loading="loading_makecase"
                @click="casemake"><a-icon type="file-excel" theme="twoTone" twoToneColor="#52c41a" />
                生成用例
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div>
          <h1>用例模板生成说明：</h1>
          <img preview='0' src='../assets/info.png' height='260' width='550' style="cursor:pointer" />
          <h2></h2>
          <h2>不要直接使用swagger地址</h2>
          <h2>在访问swagger页面的时候，查看所有请求</h2>
          <h2>返回全部接口数据的接口地址，才是可以使用的地址</h2>
          <h2>一般情况下包含api-docs的就是可以用来生成模板的地址</h2>
        </div>
      </a-drawer>
    </div>

    <!-- =============================================================================================================================== -->
    <div style="margin-left: 30px;">
      <a-button type="primary" :loading="loading" @click="showDrawer_ylgl" style="margin-top: 20px">用例管理</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" :loading="loading" style="margin-top: 20px" @click="showDrawer_tjfx">统计分析</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" :loading="loading" style="margin-top: 20px" @click="showDrawer_ylsc">用例模板生成</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" :loading="loading" style="margin-top: 20px" @click="dl_kbyl">下载空白模板</a-button>
      <a-divider type="vertical" />
      <a-button type="primary" :loading="loading" style="margin-top: 20px" @click="ci_open">CI持续集成</a-button>
    </div>
    <div>
      <a-table :columns="columns" :rowKey="record => record.zxbh" :dataSource="data.reslist"
        :pagination="pagination_zx_list" :loading="loading_list" @change="handleTableChange_zxxx"
        style="margin-left: 30px;margin-right: 30px;margin-top: 30px">
        <H3 slot="title">用例执行记录</H3>
        <span slot="ylmc" slot-scope="text, record">
          <a-tag color="#921AFF" :visible="record.zxfs == '0'">CI调度</a-tag>
          <a-tag color="#00BB00" :visible="record.zxfs == '2'">定时巡检</a-tag>
          {{text}}
        </span>
        <span slot="action" slot-scope="record">
          <a-button type="primary" @click="click_zxinfo(record.zxbh)"><a-icon type="pie-chart" />详情</a-button>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除么?" @confirm="() => click_del(record.zxbh)" okText="确认" cancelText="取消">
            <a-button type="primary" :loading="loading_del"><a-icon type="delete" />删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>



<script>
// import G2 from "@antv/g2";
import { Chart } from '@antv/g2';
import axios from "axios";
// ==============CI持续集成列表===============
const columns_ci = [
  {
    title: '地址',
    dataIndex: 'url',
    width: '40%',
    align: 'center',
  },
  {
    title: '执行次数',
    dataIndex: 'times',
    align: 'center',
  },
  {
    title: '用例数量',
    dataIndex: 'ylsl',
    align: 'center',
  },
  {
    title: '最新调用时间',
    dataIndex: 'zxdysj',
    width: '20%',
    align: 'center',
  },
  {
    title: '操作',
    width: '20%',
    dataIndex: 'operation',
    align: 'center',
    scopedSlots: { customRender: 'operation' },
  }
];

// ==============执行参数的列名===============
const columns_zxcs = [
    {
      title: '参数名称',
      dataIndex: 'zxcs_key',
      width: '28%',
      scopedSlots: { customRender: 'zxcs_key' },
      align: 'left',
    },
    {
      title: '参数值',
      dataIndex: 'zxcs_value',
      align: 'left',
      scopedSlots: { customRender: 'zxcs_value' },
    },
    {
      title: '操作',
      width: '20%',
      dataIndex: 'operation',
      align: 'center',
      scopedSlots: { customRender: 'operation' },
    }
  ];
const data_zxcs = []; // 下面的data前的数据调用，需要这个参数，不可以注销
// ==============执行参数的列名===============




  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 25 },
  };
  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 10 },
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "ylmc",
      key: "ylmc",
      width: 400,
      align: "center",
      scopedSlots: { customRender: "ylmc" }
    },
    {
      title: "执行时间",
      dataIndex: "zxsj",
      key: "zxsj",
      width: 400,
      align: "center"
    },
    {
      title: "覆盖率",
      key: "fgl",
      dataIndex: "fgl",
      width: 200,
      align: "center"
    },
    {
      title: "成功率",
      key: "cgl",
      dataIndex: "cgl",
      width: 200,
      align: "center"
    },
    {
      title: "通过率",
      key: "tgl",
      dataIndex: "tgl",
      width: 200,
      align: "center"
    },
    {
      title: "操作",
      key: "action",
      width: 300,
      scopedSlots: { customRender: "action" },
      align: "center"
    }
  ];
  const columns_yl = [
    {
      title: "名称",
      dataIndex: "ylmc",
      key: "ylmc",
      // width: "20%",
      scopedSlots: { customRender: "ylmc" },
      align: "center"
    },
    {
      title: "上传时间",
      dataIndex: "scsj",
      key: "scsj",
      width: "20%",
      align: "center"
    },
    {
      title: "执行次数",
      dataIndex: "zxcs",
      key: "zxcs",
      width: "20%",
      align: "center"
    },
    {
      title: "操作",
      key: "action_yl",
      width: "35%",
      scopedSlots: { customRender: "action_yl" },
      align: "center"
    }
  ];

  const columns_zxinfo = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 400
    },
    {
      title: "地址",
      dataIndex: "url",
      key: "url",
      align: "center",
      width: 300
    },
    {
      title: "响应时间",
      dataIndex: "xysj",
      key: "xysj",
      align: "center",
      width: 200
    },
    {
      title: "执行时间",
      dataIndex: "zxsj",
      key: "zxsj",
      align: "center",
      width: 100
    },
    {
      title: "接口状态",
      dataIndex: "jkzt",
      key: "jkzt",
      align: "center",
      width: 100
    },
    {
      title: "验证结果",
      dataIndex: "yzjg",
      key: "yzjg",
      scopedSlots: { customRender: "yzjg" },
      align: "center",
      width: 200
    }
  ];

  const innerColumns_zxinfo = [
    {
      title: "参数",
      dataIndex: "cs",
      key: "cs",
      align: "center",
      width: 400
    },
    {
      title: "预期返回值",
      dataIndex: "yqfhz",
      key: "yqfhz",
      align: "center",
      width: 400
    },
    {
      title: "实际返回值",
      dataIndex: "sjfhz",
      key: "sjfhz",
      align: "center",
      width: 400
    }
  ];

  // =================================
  export default {
    mounted() {
      this.xmid = this.$route.params.xmid;
      //获取首页传递过来的项目地址，并赋值给当前页面，之后页面相关查询以该参数为主
      //实际应该拿主键过来，但是因为主键生成的地址不好看 (=^ ^=)，所以使用了项目地址，项目地址在数据库中不可重复，否则会造成页面混乱或者报错
      this.fetch(1);
    },
    data() {
      this.cacheData = data_zxcs.map(item => ({ ...item }));
      return {
        strokeWidth: 20,
        overflowCount: 99999,
        ci_key: '',
        ci_disabled: false,
        loading_ci: false,
        docker_input: "",
        linux_input: "",
        pagination_ci: {
          defaultPageSize: 5,
          hideOnSinglePage: true,
          current: 1,
          total: null,
        },
        mockData: [],
        targetKeys: [],
        data_ci: [],
        columns_ci: columns_ci,
        visible_CI: false,
        api_docs: '',
        fgdjs: true,
        count: [0,0,0,0,0], //执行信息中的数量集合
        percent: 0, // 执行进度
        run_status: '0', // 0  执行中，1  已完成，2  已中断  字符串格式
        columns_zxcs: columns_zxcs,
        data_zxcs: [],
        data_zxcs_def: [],
        visible_zxcs: false,
        url: "",
        cookie: "",
        loading_runcanse: false,
        loading_makecase: false,
        loading_download: false, //下载用的
        target_key: "1",
        data_char_all: [],
        columns_zxinfo: columns_zxinfo,
        innerColumns_zxinfo: innerColumns_zxinfo,
        data_zxinfo: [],
        innerData_zxinfo: [],
        char_xysj: [],
        data: [],
        columns_yl: columns_yl,
        columns: columns,
        visible_zxinfo: false,
        data_yl: [],
        xmid: "",
        visible_ylgl: false,
        visible_tjfx: false,
        visible_ylsc: false,
        fileList: [],
        gjz: '', //测试用例搜索关键字
        fileList_upyl: [],
        uploading: false,
        placement: "top",
        placement_ylsc: "right",
        pagination_zx_list: {
          defaultPageSize: 10,
          total: null,
          showQuickJumper: true,
          position: "bottom",
          current: 1
        },
        pagination_yl_list: {
          defaultPageSize: 8,
          total: null,
          showQuickJumper: true,
          position: "bottom",
          current: 1
        },
        placement_zxinfo: {
          defaultPageSize: 10,
          total: null,
          showQuickJumper: true,
          position: "bottom",
          current: 1
        },
        placement_zxcs: {
          hideOnSinglePage: true,
          pageSize: null,
        },
        loading: false,
        loading_list: false,
        loading_yl_list: false,
        loading_zxinfo: false,
        spinning: false,
        delayTime: 50,
        zxid: "", // 记录当前打开的用例执行id
        formItemLayout, //生成用例的表单使用
        formTailLayout, //生成用例的表单使用
        form: this.$form.createForm(this, { name: 'dynamic_rule' }), //生成用例的表单使用
        loading_del: false,
      };
    },
    methods: {
      handleTableChange_zxxx(pageNumber) {
        this.fetch(pageNumber.current);
      },
      handleTableChange_ylxx(pageNumber) {
        this.fetch_ylxx(pageNumber.current);
      },
      handleTableChange_zxinfo(pageNumber) {
        //执行信息的详情获取
        this.loading_zxinfo = true;
        // this.spinning = true;
        axios
          .get("ylzx_info/" + this.zxid + "/" + pageNumber.current, {
            // params: { zt: this.target_key }
            params: { zt: this.target_key, gjz: this.gjz }
          })
          .then(response => {
            this.data_zxinfo = response.data.reslist;
            this.placement_zxinfo.total = response.data.maxsize;
            this.placement_zxinfo.current = pageNumber.current;
            this.count = response.data.counts;
            this.tjsj();
            if (response.data.zt === "0") {
              setTimeout(() => {
                this.fetch_ylzxinfo(pageNumber.current);
              }, 2000);
            } else {
              this.spinning = false;
            }
          });
        this.loading_zxinfo = false;
      },
      showDrawer_ylgl() {
        this.fetch_ylxx(1);
        this.visible_ylgl = true;
      },
      showDrawer_tjfx() {
        this.visible_tjfx = true;
      },
      showDrawer_ylsc() {
        this.visible_ylsc = true;
      },
      onClose() {
        this.visible_ylgl = false;
        this.visible_tjfx = false;
        this.visible_zxinfo = false;
        this.visible_ylsc = false;
        this.fileList = [];
        this.fileList_upyl = [];
        this.uploading = false;
        this.data_zxinfo = [];
        this.innerData_zxinfo = [];
        this.target_key = "1";
        this.placement_zxinfo.current = 1;
        this.zxid = "";
        this.loading_download = false;
        this.data_yl = [];
        this.gjz = '';
        this.percent = 0,
        this.run_status = '0',
        this.count = [0,0,0,0,0],
        this.api_docs = '',
        this.visible_CI = false,
        this.ci_key = '',
        this.ci_disabled = false,
        this.mockData = [],
        this.targetKeys = [],
        this.data_ci = [],
        this.docker_input = "",
        this.linux_input = ""
      },
      fetch(pagenum) {
        this.loading_list = true;
        axios.get(this.xmid + "/zx_list/" + pagenum).then(response => {
          this.data = response.data;
          this.pagination_zx_list.total = response.data.maxsize;
          this.pagination_zx_list.current = pagenum; //用例执行记录的页码
        });
        this.loading_list = false;
      },
      fetch_ylxx(pagenum) {
        this.loading_yl_list = true;
        axios.get(this.xmid + "/yl_list/" + pagenum).then(response => {
          this.data_yl = response.data.reslist;
          this.pagination_yl_list.total = response.data.maxsize;
          this.pagination_yl_list.current = response.data.nowpage;
        });
        this.loading_yl_list = false;
      },
      fetch_ylzxinfo(pagenum) {
        //执行信息的详情获取
        this.run_status = '0';
        this.loading_zxinfo = true;
        // this.spinning = true;
        axios
          .get("ylzx_info/" + this.zxid + "/" + pagenum, {
            // params: { zt: this.target_key }
            params: { zt: this.target_key, gjz: this.gjz }
          })
          .then(response => {
            this.data_zxinfo = response.data.reslist;
            this.placement_zxinfo.total = response.data.maxsize;
            this.placement_zxinfo.current = response.data.nowpage;
            this.count = response.data.counts;
            this.run_status = response.data.zt;
            if (response.data.jd === null) {
              this.percent = 0;
            } else {
              this.percent = Number(response.data.jd.toFixed(2));
            }
            document.getElementById('char_xysj').innerHTML = '';
            document.getElementById('char_cgl').innerHTML = '';
            document.getElementById('char_tgl').innerHTML = '';
            this.tjsj();
            if (response.data.zt === "0") {
              setTimeout(() => {
                // this.init_char_cgl();
                // this.init_char_tgl();
                // this.init_char_xysj();
                this.fetch_ylzxinfo(this.placement_zxinfo.current);
              }, 8000);
            } else {
              setTimeout(() => {
                this.init_char_cgl();
                this.init_char_tgl();
                this.init_char_xysj();
              }, 500);
              this.spinning = false;
            }
          });
        this.loading_zxinfo = false;
      },
      click_info() {
        // 执行用例时的方法
        this.loading_runcanse = true;
        // this.$http
        axios
          .post(
            "runcase",
            { ylbh: this.data_zxcs_def.ylbh, list: this.data_zxcs_def.reslist, sfjs: this.fgdjs, api_docs: this.api_docs},
            {
              headers: { "Content-Type": "application/json", Accept: "*/*" }
            }
          )
          .then(res => {
            if (res.data.result === "success") {
              this.loading_runcanse = false;
              // this.$message.success("执行成功");
              this.visible_ylgl = false;
              this.visible_zxcs = false;
              this.click_zxinfo(res.data.zxid);
            } else {
              this.loading_runcanse = false;
              this.$message.error(res.data.msg);
            }
          });
        // 刷新用例列表，更新用例执行记录列表
        setTimeout(() => {
          this.fetch_ylxx(this.pagination_yl_list.current);
          this.fetch(1);
        }, 3000);
      },
      click_zxinfo(key) {
        this.visible_zxinfo = true;
        this.spinning = true;
        this.zxid = key;
        this.fetch_ylzxinfo(this.placement_zxinfo.current);
        // setTimeout(() => {
        //   this.init_char_cgl(), this.init_char_tgl(), this.init_char_xysj();
        // }, 500);
      },
      click_del(key) {
        // alert("delkey:" + key);
        this.loading_del = true;
        axios
          .post("zx_list/del_zx", { zxbh: key})
          .then(res => {
            if (res.data.result === "success") {
              this.$message.success("删除成功");
              this.fetch(this.pagination_zx_list.current);
            } else {
              this.$message.error("删除失败");
            }
          });
        this.loading_del = false;
      },
      init_char_cgl() {
        var chart = new Chart({
          container: "char_cgl",
          // forceFit: true,
          height: 230,
          width: 445,
          // animate: true
        });
        chart.data(this.data_char_all[0]);
        chart.scale('percent', {
            formatter: (val) => {
              val = (val * 100).toFixed(2) + "%";
              return val;
            },
          });
        chart.coordinate("theta", {
          radius: 0.75,
          innerRadius: 0.6
        });
        chart.tooltip({
          showTitle: false,
          itemTpl: '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
            });
        chart.annotation().text({
            position: ['50%', '58%'],
            content: '成功率',
            style: {
              fontSize: 14,
              fill: '#8c8c8c',
              textAlign: 'center',
            },
            offsetY: -20,
          })
        chart
          .interval()
          .position("percent")
          .adjust('stack')
          .color("item")
          .label("percent", {
            formatter: function formatter(val, item) {
              return item.point.item + ": " + val;
            }
          })
          .tooltip("item*count", function (item, count) {
            // percent = percent * 100 + "%";
            count = count + "个"
            return {
              name: item,
              value: count
            };
          })
          .style({
            lineWidth: 1,
            stroke: "#fff"
          });
        chart.render();
        // interval.setSelected(this.data_char_all[0][0]);
      },
      init_char_tgl() {
        var chart = new Chart({
          container: "char_tgl",
          // forceFit: true,
          height: 230,
          width: 445,
          animate: true
          // padding: [50, 250, 50, 50],
        });
        chart.data(this.data_char_all[1]);
        chart.scale('percent', {
            formatter: (val) => {
              val = (val * 100).toFixed(2) + "%";
              return val;
            },
          });
        chart.coordinate("theta", {
          radius: 0.75,
          innerRadius: 0.6
        });
        chart.tooltip({
          showTitle: false,
          itemTpl:
            '<li class="g2-tooltip-list-item"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        // chart.guide().html({
        //   position: ["50%", "50%"],
        //   html:
        //     '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 4em;">通过率</div>',
        //   alignX: "middle",
        //   alignY: "middle"
        // });
        chart.annotation().text({
            position: ['50%', '58%'],
            content: '通过率',
            style: {
              fontSize: 14,
              fill: '#8c8c8c',
              textAlign: 'center',
            },
            offsetY: -20,
          })
        // var interval = chart
        chart
          .interval()
          .adjust('stack')
          .position("percent")
          .color("item")
          .label("percent", {
            formatter: function formatter(val, item) {
              return item.point.item + ": " + val;
            }
          })
          .tooltip("item*count", function (item, count) {
            // percent = percent * 100 + "%";
            count = count + "个";
            return {
              name: item,
              value: count
            };
          })
          .style({
            lineWidth: 1,
            stroke: "#fff"
          });
        chart.render();
        // interval.setSelected(this.data_char_all[1][0]);
      },
      init_char_xysj() {
        var chart = new Chart({
          container: "char_xysj",
          height: 300,
          width: 465,
          padding: [20, 60, 60, 60]
        });
        chart.data(this.char_xysj)
        // chart.source(this.char_xysj, {
        //   expected: {
        //     ticks: [0, 3000, 8000]
        //   },
        //   actual: {
        //     ticks: [0, 3000, 8000]
        //   }
        // });
        chart.scale({
            expected: {
              ticks: [0, 3000, 8000]
            },
            actual: {
              ticks: [0, 3000, 8000]
            },
          });
        chart.axis("date", false);
        chart.axis("actual", false);
        chart.axis("expected", {
          line: null,
          tickLine: null,
          position: "right",
          label: {
            formatter: function formatter(val) {
              if (val === '85000') {
                return '';
              }
              return val;
            }
          }
        });
        chart.legend(false);
        chart.interval().position('date*expected').color('#ffe600').shape('borderRadius').tooltip('expected').style({opacity: 0.6,});
        chart.interval().position('date*actual').color('#a7324a').tooltip('actual').shape('date*actual', function (date, val) {
          if (val === 0) {
            return;
          } else {
            return 'borderRadius';
          }
        });
        chart.annotation().text({
          position: ["min", "max"],
          content: "响应时间分布(单位: 毫秒)",
          style: {
            fill: "#ff2c55",
            fontSize: 20,
            fontWeight: "bold",
            textBaseline: "top"
          }
        });
        chart.render();
      },
      handleSizeChange(e) {
        this.target_key = e.target.value;
        axios
          .get("ylzx_info/" + this.zxid + "/" + 1, {
            // params: { zt: this.target_key }
            params: { zt: this.target_key, gjz: this.gjz }
          })
          .then(response => {
            this.data_zxinfo = response.data.reslist;
            this.placement_zxinfo.total = response.data.maxsize;
            this.placement_zxinfo.current = 1;
            this.count = response.data.counts;
            if (response.data.zt === "0") {
              setTimeout(() => {
                this.fetch_ylzxinfo(1);
              }, 2000);
            } else {
              this.spinning = false;
            }
          });
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file];
        return false;
      },
      handleUpload() {
        const { fileList } = this;
        const formData = new FormData();
        formData.append("xmdz", this.xmid);
        fileList.forEach(file => {
          formData.append("file", file);
        });
        this.uploading = true;
        axios
          .post("uploadfile", formData, {
            headers: { "Content-Type": "multipart/form-data", Accept: "*/*" }
          })
          .then(res => {
            if (res.data.result === "success") {
              this.fileList = [];
              this.uploading = false;
              this.$message.success("上传成功");
            } else {
              this.fileList = [];
              this.uploading = false;
              this.$message.error(res.data.msg);
            }
          });
        setTimeout(() => {
          this.fetch_ylxx(1);
          this.pagination_yl_list.current = 1;
        }, 2000);
      },
      casemake() {
        this.loading_makecase = true;
        this.form.validateFields((err, values) => {
          if (!err) {
            // console.log(values);
            axios({
              method: "get",
              url: "makecase",
              params: values,
              responseType: "blob"
            })
              .then((response) => {
                // console.log(response.headers["content-type"]);
                if (response.headers["content-type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                  this.$message.error("用例生成失败，请检查填写的内容或联系管理员")
                } 
                else {
                  let blob = new Blob([response.data], {
                    type: response.headers["content-type"]
                  });
                  let downloadElement = document.createElement("a");
                  let href = window.URL.createObjectURL(blob); // 创建下载的链接
                  downloadElement.href = href;
                  document.body.appendChild(downloadElement);
                  downloadElement.click(); // 点击下载
                  document.body.removeChild(downloadElement); // 下载完成移除元素
                  window.URL.revokeObjectURL(href); // 释放掉blob对象
                }
              });
          }
        });
        this.loading_makecase = false;
      },
      click_dl_case(ylbh) {
        this.loading_download = true;
        axios({
          method: "get",
          url: "/downloadfile/" + ylbh,
          responseType: "blob"
        }).then(response => {
          if (response.headers["content-type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.$message.error("用例下载失败，可能是文件损坏或丢失，请联系管理员")
          }
          else {

            let blob = new Blob([response.data], {
              type: response.headers["content-type"]
            });
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = response.headers["content-disposition"] + '.xlsx'
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
          }
        });
        this.loading_download = false;
      },
      tjsj() {
        axios.get('tjxx', { params: { 'zxid': this.zxid } }).then(response => {
          this.data_char_all = response.data;
        });
        axios.get('sjfb', { params: { 'zxid': this.zxid } }).then(response => {
          this.char_xysj = response.data;
        });
      },
      child_draw (ylbh) {
        this.visible_zxcs = true;
        axios.get('zxcs', { params: { 'ylbh': ylbh } }).then(response => {
          this.placement_zxcs.pageSize = response.data.maxsize;
          this.data_zxcs = response.data.reslist;
          this.data_zxcs_def = response.data;
          this.api_docs = response.data.api_docs
          if (this.api_docs !== '') {
            this.fgdjs = true
          } else {
            this.fgdjs = false
          }
        })
      },
      onClose_zxcs () {
        this.visible_zxcs = false;
        this.data_zxcs = [];
        this.data_zxcs_def = [];
      },
      handleChange(value, key, column) {
        const newData = [...this.data_zxcs];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.data_zxcs = newData;
        }
      },
      edit(key) {
        const newData = [...this.data_zxcs];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable_key = true;
          target.editable_value = true;
          this.data_zxcs = newData;
        }
      },
      save(key) {
        const newData = [...this.data_zxcs];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable_key;
          delete target.editable_value;
          this.data_zxcs = newData;
          this.cacheData = newData.map(item => ({ ...item }));
        }
      },
      cancel(key) {
        const newData = [...this.data_zxcs];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable_key;
          delete target.editable_value;
          this.data_zxcs = newData;
        }
      },
      handleChange_ylgx(ylbh) {
        const { fileList_upyl } = this;
        const formData = new FormData();
        formData.append("ylbh", ylbh);
        fileList_upyl.forEach(file => {
          formData.append("file", file);
        });
        axios
          .post("updatefile", formData, {
            headers: { "Content-Type": "multipart/form-data", Accept: "*/*" }
          })
          .then(res => {
            if (res.data.result === "success") {
              this.fileList_upyl = [];
              this.$message.success("更新成功");
            } else {
              this.fileList_upyl = [];
              this.$message.error(res.data.msg);
            }
          });
      },
      beforeUpload_ylgx(file) {
        this.fileList_upyl = [...this.fileList_upyl, file];
        return false;
      },
      // updatefile_fun(xh) {
      //   console.log(xh);
      //   this.data_yl[xh].update = 1;
      // },
      del_yl(ylbh) {
        axios.delete('del_yl/' + ylbh).then(res => {
          if (res.data.result === 'success') {
            this.fetch_ylxx(this.pagination_yl_list.current)
          } else {
            this.$message.error('删除用例失败，请重试😔')
          }
        })
      },
      claer_ylgx() {
        this.fileList_upyl = []
      },
      onSearch() {
        //执行信息的详情获取
        this.loading_zxinfo = true;
        // this.spinning = true;
        axios
          .get("ylzx_info/" + this.zxid + "/" + 1, {
            params: { zt: this.target_key, gjz: this.gjz }
          })
          .then(response => {
            this.data_zxinfo = response.data.reslist;
            this.placement_zxinfo.total = response.data.maxsize;
            this.placement_zxinfo.current = 1;
            this.count = response.data.counts;
            this.tjsj();
            if (response.data.zt === "0") {
                this.fetch_ylzxinfo(1);
            } else {
              this.spinning = false;
            }
          });
        this.loading_zxinfo = false;
      },
      edit_page(ylbh, ylmc) {
        // window.open('http://172.18.48.41:8585/' + 'edit_page/' + ylbh + '/' + ylmc);
        // this.$router.push({name: '文档编辑', params: {'ylbh': ylbh, 'ylmc': ylmc}})
        let edit_url = this.$router.resolve({name: '文档编辑', query: {'ylbh': ylbh, 'ylmc': ylmc}})
        // params参数在跳转页中获取不到，所以改成了qurey方式，会导致url不太好看
        window.open(edit_url.href, '_blank')
        setTimeout(() => {
          this.fetch_ylxx(this.pagination_yl_list.current);
        }, 2000)
      },
      view_page(ylbh, ylmc) {
        // window.open('http://172.18.48.41:8585/' + 'edit_page/' + ylbh + '/' + ylmc);
        // this.$router.push({name: '文档编辑', params: {'ylbh': ylbh, 'ylmc': ylmc}})
        let view_url = this.$router.resolve({name: '文档查看', query: {'ylbh': ylbh, 'ylmc': ylmc}})
        // params参数在跳转页中获取不到，所以改成了qurey方式，会导致url不太好看
        window.open(view_url.href, '_blank')
      },
      change_fgdjs() {
        this.fgdjs = !this.fgdjs;
      },
      dl_kbyl() {
                axios({
          method: "get",
          url: "/downloadkbyl",
          responseType: "blob"
        }).then(response => {
          if (response.headers["content-type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.$message.error("用例下载失败，可能是文件损坏或丢失，请联系管理员")
          }
          else {

            let blob = new Blob([response.data], {
              type: response.headers["content-type"]
            });
            let downloadElement = document.createElement("a");
            let href = window.URL.createObjectURL(blob); // 创建下载的链接
            downloadElement.href = href;
            downloadElement.download = '说明用例.xlsx'
            document.body.appendChild(downloadElement);
            downloadElement.click(); // 点击下载
            document.body.removeChild(downloadElement); // 下载完成移除元素
            window.URL.revokeObjectURL(href); // 释放掉blob对象
          }
        });
      },
      ci_open() {
        this.ci_yl_list();
        this.ci_list(1);
        this.visible_CI = true;
      },
      handleChange_ci(targetKeys, direction, moveKeys) {
        this.targetKeys = targetKeys;
      },
      ci_yl_list() {
        axios.get(this.xmid + "/ci_yl_list").then(response => {
          if (response.status === 200){
            this.mockData = response.data
          }
        })
      },
      ci_list(pagenum) {
        axios.get(this.xmid + "/ci_list/" + pagenum).then(response => {
          if (response.status === 200){
            this.data_ci = response.data.reslist
            this.pagination_ci.current = pagenum
            this.pagination_ci.total = response.data.maxsize
          }
        })
      },
      handld_ci(pagenum) {
        this.loading_ci = true;
        this.ci_list(pagenum.current);
        this.ci_clear();
        this.loading_ci = false;
      },
      ci_info(arr_record) {
        this.ci_disabled = true;
        for (var j_up = 0,len_up=this.data_ci.length; j_up < len_up; j_up++) {
          this.data_ci[j_up]['ck'] = 0;
          this.data_ci[j_up]['bj'] = 0;
        }
        arr_record.ck = 1;
        axios.get("ci_info/" + arr_record.key).then(response => {
          if (response.data.result === 'success'){
            this.ci_yl_list();
            var target_list = []
            for (var j = 0,len=response.data.res_list.length; j < len; j++) {
                this.mockData.shift(response.data.res_list[j])
                target_list.push(response.data.res_list[j]['key'])
              }
            this.targetKeys = target_list;
            this.linux_input = response.data.api_linux;
            this.docker_input = response.data.api_docker;
          }
        })
      },
      ci_clear() {
        this.ci_key = '';
        this.ci_disabled = false;
        this.linux_input = '';
        this.docker_input = '';
        this.targetKeys = [];
        for (var j_up = 0,len_up=this.data_ci.length; j_up < len_up; j_up++) {
          this.data_ci[j_up]['ck'] = 0;
          this.data_ci[j_up]['bj'] = 0;
        }
        this.ci_yl_list();
      },
      add_ci() {
        if (this.targetKeys.length === 0){
          this.$message.error('用例不可为空（╬￣皿￣）')
        } else if (this.ci_key === '') {
        this.ci_disabled = true;
        axios.post('add_ci', {xmurl: this.xmid, ylinfo: this.targetKeys}).then(response => {
          if (response.data.result === 'success'){
            this.ci_list(1);
            this.ci_clear();
            this.$message.success('创建成功乁( ˙ ω˙乁)')
          }
        })} else {
          axios.patch('update_ci', { ci_key: this.ci_key, ylinfo: this.targetKeys}).then( response => {
            if (response.data.result === 'success'){
              this.ci_list(1);
              this.ci_clear();
              this.$message.success('更新成功乁( ˙ ω˙乁)')
            }
          })
        }
      },
      edit_ci(arr_record) {
        this.ci_disabled = false;
        for (var j_up = 0,len_up=this.data_ci.length; j_up < len_up; j_up++) {
          this.data_ci[j_up]['ck'] = 0;
          this.data_ci[j_up]['bj'] = 0;
        }
        arr_record.bj = 1;
        this.ci_key = arr_record.key;
        axios.get("ci_info/" + arr_record.key).then(response => {
          if (response.status === 200){
            this.ci_yl_list();
            var target_list = []
            for (var j = 0,len=response.data.res_list.length; j < len; j++) {
                this.mockData.shift(response.data.res_list[j])
                target_list.push(response.data.res_list[j]['key'])
              }
            this.targetKeys = target_list;
            this.linux_input = response.data.api_linux;
            this.docker_input = response.data.api_docker;
          }
        })
      },
      del_ci(arr_record) {
        axios.delete('del_ci/' + arr_record.key).then( response => {
          if (response.data.result === 'success') {
            this.ci_list(this.pagination_ci.current);
            this.ci_clear();
            this.$message.success('删除成功ヽ(●´ω｀●)ﾉ');
          }
        })
      },
      onCopy() {
        this.$message.success('复制成功！٩(*Ӧ)و')
      },
      onError() {
        this.$message.error('复制成功！(,,#ﾟДﾟ)')
      },
    }
  };
</script>