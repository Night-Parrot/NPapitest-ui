<template>
    <div style="height: 90%">
      <a-select defaultValue="项目统计" @change="handleChange" style="right: 86%;margin-top: 20px;" > 
        <a-select-option value="2">项目统计</a-select-option>
        <a-select-option value="1">用例统计</a-select-option>
        <a-select-option value="3">开发团队</a-select-option>
        <a-select-option value="4">测试团队</a-select-option>
      </a-select>
      <div style="float: left;margin-top: 80px;margin-left:20px;width: 90%;height: 95%;margin-left: 70px;" id="app_ggg" />
    </div>     
</template>

<script>
import axios from "axios";
// import G2 from "@antv/g2";
import { Chart } from '@antv/g2';
export default {
  beforeCreate() {
  },
  mounted() {
    this.run_times(2);
  },
  data() {
    return {
      data_por: [],
    };
  },
  methods: {
    run_times(tjfs) {
      axios.get('run_times/' + tjfs).then(res =>{
        if (res.status === 200) {
          this.data_por = res.data
          document.getElementById('app_ggg').innerHTML = '';
          this.test_fun()
        }
      })
    },
    test_fun() {
        const chart = new Chart({
        container: 'app_ggg',
        autoFit: true,
        height: 500,
        padding: [20, 20, 50, 80],
        });
        chart.data(this.data_por);
        chart.scale({
        x: {
            alias: '平均覆盖率', // 定义别名
            tickInterval: 10, // 自定义刻度间距
            max: 100, // 自定义最大值
            min: -1 // 自定义最小是
        },
        y: {
            alias: '平均通过率',
            tickInterval: 10,
            max: 100,
            min: -1
        },
        z: {
            alias: '累计执行次数'
        }
        });
        // 开始配置坐标轴
        chart.axis('x', {
        label: {
            formatter: val => {
            return val + '%'; // 格式化坐标轴显示文本
            }
        },
        grid: {
            line: {
            style: {
                stroke: '#d9d9d9',
                lineWidth: 1,
                lineDash: [2, 2]
            }
            }
        }
        });
        chart.axis('y', {
        title: {
            offset: 64
        },
        label: {
            formatter: val => {
            if (+val > 0) {
                return val + '%';
            }
          }
        }
        });
        chart.legend(false);
        chart.tooltip({
        title: 'name',
        showMarkers: false
        });
        chart
        .point()
        .position('x*y')
        .color('#1890ff')
        .size('z', [10, 40])
        .label('name', {
            offset: 0, // 文本距离图形的距离
            style: {
            fill: '#11264f', //圆圈内文本颜色
            stroke: '#fff',
            lineWidth: 1,
            }
        })
        .shape('circle')
        .tooltip('x*y*z')
        .style({
            lineWidth: 1,
            stroke: '#1890ff',
            fillOpacity: 0.3,
        });
        chart.annotation().line({
        top: true,
        start: [80, 'min'],
        end: [80, 'max'],
        text: {
            content: '优秀区间',
            position: 'end',
            autoRotate: false,
            style: {
            textAlign: 'start'
            }
        }
        });
        chart.annotation().line({
        top: true,
        start: ['min', 80],
        end: ['max', 80],
        text: {
            content: '优秀区间',
            position: 'end',
            style: {
            textAlign: 'end'
            }
          }
        });
        chart.annotation().region({
        start: ['0%', '0%'],
        end: ['100%', '100%'],
        style: {
            lineWidth: 1,
            fillOpacity: 0,
            strokeOpacity: 1,
            stroke: '#545454',
        }
        });
        chart.interaction('element-active');
        chart.render();
    },
    handleChange(value) {
      this.run_times(value)
    },
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