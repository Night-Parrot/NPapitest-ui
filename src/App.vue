<template>
  <div style="height: 100%">
    <div v-if="show">
      <a-affix :offsetTop="25" style="height: 0px">
        <a-tag :color="color" style="margin-left: 46%" @click="openNotification">我要吐槽（╯‵□′）╯︵┴─┴</a-tag>
      
      <a-modal title="吐槽区" v-model="visible_tc" :destroyOnClose="true" :keyboard="false" :maskClosable="false">
        <a-textarea placeholder="I Know Who You Are" :rows="4" :maxLength="500" v-model="tc_info" />
        <template slot="footer">
          <a-button key="back" @click="tc_list">看看别人说了啥</a-button>
          <a-button key="submit" type="primary" :loading="loading_tc" @click="handleOk_tc">提交</a-button>
      </template>
      </a-modal>
      <a-button type="primary" style="float: right; margin-right: 20px" :loading="loading_yhsc" @click="dl_yhsc">下载使用说明</a-button>
      <a-button type="primary" style="float: right; margin-right: 20px" @click="gototoolbox">工具箱</a-button>
      <a-button type="primary" style="float: right; margin-right: 20px" @click="updatepwd">修改密码</a-button>
      <a-modal title="修改密码" v-model="visible_uppwd" @ok="handleOk" @cancel="handleCancel">
        <a-input-password placeholder="请输入新密码 ԅ(¯﹃¯ԅ)" :maxLength="maxLength" v-model="new_pwd" />
        <br />
        <br />
        <a-input-password placeholder="请再输入一遍新密码 （¯﹃¯）" :maxLength="maxLength" v-model="new_pwd_se" />
      </a-modal>
      <a-button type="primary" style="float: right;margin-right: 20px" @click="logout">退出</a-button>
      <!-- <a-button type="primary" style="float: right;margin-top: 20px; margin-right: 20px" @click="test_page">不要点</a-button> -->
      </a-affix>
    </div>
    <router-view/>
  </div>
</template>
<script>
import axios from "axios";
export default {
  beforeCreate() {
  },
  beforeMounted() {
    this.color16();
  },
  mounted() {
    this.path = this.$route.path;
    this.color16();
    this.path_ctl();
  },
  watch: {
    $route(to) {
      this.path = to.path;
      this.path_ctl();
    }
  },
  data() {
    return {
      color: 'orange',
      show: true,
      path: '',
      visible_uppwd: false,
      new_pwd: '',
      new_pwd_se: '',
      loading_yhsc: false,
      maxLength: 20,
      spell_list: ['Alchemy','Animagi','Apparating','Avada','Cruciatus','Imperious','Dark','Dark','Disapparate','Divination','Fidelius','Four','Impediment','Leprechaun','Occlumency','Parseltongue','Patronus','Polyjuice','Reductor','Shield','Side','Splinched','Transfiguration','Unbreakable','Morsmordre','Unforgivable','Aguamenti','Alohomora','Aparecium','Avada','Avis','Cave','Colloportus','Comfundo','Crucio','Deletrius','Densaugeo','Diffindo','Disillusionment','Dissendium','Enervate','Engorgio','Evanesco','Expecto','Expelliarmus','Ferula','Finite','Finite','Flagrate','Furnunculus','Homenum','Impedimenta','Imperio','Impervius','Incarcerous','Incendio','Liberacorpus','Legilimens','Levicorpus','Locomotor','Locomotor','Lumos','Metelojinx','Mobiliarbus','Mobilicorpus','Morsmordre','Nox','Obliviate','Orchideus','Pack','Peskipiksi','Petrificus','Point','Portus','Prior','Protego','Protego','Quietus','Reducio','Reducto','Relashio','Reparo','Repello','Rictusempra','Riddikulus','Salvio','Scourgify','Sectumsempra','Serpensortia','Silencio','Sonorus','Stupefy','Tarantallegra','Unplottable','Waddiwasi','Wingardium','Glisseo','Duro'],
      spell: '',
      visible_tc: false,
      tc_info: '',
      loading_tc: false,
    };
  },
  methods: {
    tc_list() {
      // window.open('/#/tc_list')
      this.$message.warn('You think too much~~~ฅ( ̳• ◡ • ̳)ฅ')
    },
    handleOk_tc() {
      this.loading_tc = true;
      axios.post("add_tc", { tc_text : this.tc_info }).then(response => {
        if (response.data.result === 'success'){
          this.handleCancel_tc();
          this.$message.success('吐槽成功！(๑¯◡¯๑)')
        } else if (response.data.result === 'guest') {
          this.handleCancel_tc();
          this.$message.warn(response.data.msg)
        }
        else {
          this.$message.error(response.data.msg)
        }
      })
      this.loading_tc = false;
    },
    handleCancel_tc() {
      this.visible_tc = false;
      this.tc_info = '';
    },
		color16() {//十六进制颜色随机
			var r = Math.floor(Math.random()*256);
			var g = Math.floor(Math.random()*256);
			var b = Math.floor(Math.random()*256);
			var color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
      this.color = color;
    },
    openNotification() {
      let roll_num = Math.floor(Math.random() * (100 - 0 + 1)) + 0;
      if (roll_num >= 35) {
        let x = Math.floor(Math.random() * (97 - 0 + 1)) + 0;
        this.spell = this.spell_list[x]
        this.$notification.open({
          message: '听说你要吐槽？！',
          description:
            this.spell
        })
      } else {
        this.visible_tc = true;
      }
    },
    path_ctl() {
      switch(this.path) {
        case '/login': this.show = false; break;
        case '/view_tool': this.show = false; break;
        case '/edit_tool': this.show = false; break;
        case '/page_403': this.show = false; break;
        default : this.show = true;
      }
    },
    dl_yhsc() {
      this.loading_yhsc = true;
      axios.get('downloadyhsc', {responseType: 'blob'}).then(response=>{
        let blob = new Blob([response.data], {
          type: response.headers["content-type"]
        });
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '使用手册.docx'
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      });
      this.loading_yhsc =false;
    },
    gototoolbox() {
      window.open('/#/toolbox')
    },
    updatepwd() {
      this.visible_uppwd = true;
    },
    handleCancel() {
      this.new_pwd = '';
      this.new_pwd_se = '';
    },
    handleOk() {
      if (this.new_pwd === this.new_pwd_se) {
        axios.post("updatepwd", {'new_password': this.new_pwd_se}).then(response => {
          if (response.data.result === 'success') {
            this.visible_uppwd = false;
            this.new_pwd = '';
            this.new_pwd_se = '';
            this.$message.success('密码修改成功！✿✿ヽ(°▽°)ノ✿')
          } else(
            this.$message.error(response.data.msg)
          )
        })
      } else(
        this.$message.error('两次密码必须一致！！！o(╯□╰)o')
      )
    },
    logout() {
      axios.get('logout').then(res =>{
        if (res.data.result === "success") {
          this.$cookies.set('status', "logout")
          this.$router.replace({path: '/login'})
        }
      })
    },
    test_page() {
      window.open('/#/testpage')
    }
  }
};
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
