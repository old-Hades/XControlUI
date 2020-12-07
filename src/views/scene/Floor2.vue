<template>
  <div id="box">
    <v-stage :config="configKonva">
      <v-layer>
        <template v-for="(line, index) in this.Line">
          <v-line :config="line" :key="'floor2' + index"></v-line>
        </template>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import axios from 'axios'
import chunk from 'lodash-es/chunk'
import { serverUrl } from '../../utils/config'
export default {
  data() {
    return {
      configKonva: {},
      Line: [],
      data: [],
      points: [],
      arr: [],
      FTwoUrl: serverUrl.XcontrolUrl,
    }
  },
  mounted() {
    this.getLine()
    // this.draw();
  },
  methods: {
    async getLine() {
      await axios.get(`${this.FTwoUrl}xcontrol/lines`).then((res) => {
        this.data = res.data.data
        this.draw()
      })
    },

    draw() {
      this.configKonva = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      for (var i = 0; i < this.data.length; i++) {
        this.points[i] = this.data[i]
        this.arr.push(
          this.points[i].xFrom * window.innerWidth,
          Math.abs(this.points[i].yFrom * window.innerHeight),
          this.points[i].xTo * window.innerWidth,
          Math.abs(this.points[i].yTo * window.innerHeight)
        )
      }

      let arr2 = chunk(this.arr, 4)
      console.log(arr2)
      for (let j = 0; j < arr2.length; j++) {
        this.Line.push({
          points: arr2[j],
          stroke: 'green',
          strokeWidth: 1,
        })
      }
    },
  },
}
</script>

<style></style>
