<template>
    <div>
        <a-button-group>
            <a-button type="primary" @click="queryMsg" icon="caret-right">开启</a-button>
            <a-button icon="delete" @click="items = []">清空</a-button>
            <a-button icon="pause" @click="stopMsgPush">停止</a-button>
        </a-button-group>
        <a-empty v-if="stateItems.length === 0 && items.length === 0"/>
        <a-timeline>
            <p v-for="item in stateItems" :key="item.actingTime">
                <a-icon type="sound"/>
                {{ new Date(item.actingTime).toTimeString() }} -- {{ item.description }}
            </p>
            <p v-for="item in items" :key="item.id">
                <a-timeline-item>
                    {{ new Date(item.actingTime).toTimeString() }}
                    报文： <a style="color:green;"> {{ item.msg }}</a> 行为： <a style="color:blue;"> {{ item.action
                    }}</a> 地址： <a style="color:purple;"> {{ item.address }}</a> 组址：
                    <a style="color:purple;"> {{ item.group }}</a> 数值： <a style="color:#ff0000;"> {{ item.value
                    }}</a>
                </a-timeline-item>
            </p>
        </a-timeline>
    </div>
</template>

<script>
    import moment from 'moment'
    import Stomp from 'webstomp-client'
    import {serverUrl} from '../../utils/config'

    export default {
        props: {
            msgId: {
                type: String,
            }
        },
        data() {
            return {
                con1: null,
                moment,
                data: [],
                animate: false,
                items: [
                    //消息列表对应的数组
                ],
                stateItems: [], //连接状态对应的数组
                stompClient: null,
                subscription: null,
                currentGroupId: null,
                currentGroupName: null,
                wsUrl: serverUrl.wsUrl,
            }
        },

        mounted() {
            // window.myVue = this;
            this.initWebSocket()
            // this.timer1= setInterval(this.scroll,3000)
        },
        watch: {},
        methods: {
            initWebSocket() {
                var that = this
                const socket = new WebSocket(this.wsUrl)
                this.stompClient = Stomp.over(socket)
            },

            stopMsgPush() {
                if (this.subscription == null) {
                    return
                }
                this.subscription.unsubscribe()
                let param = {
                    actingTime: new Date().getTime(),
                    description: '结束订阅！',
                }
                if (this.stateItems.length < 1) this.stateItems.push(param)
                else {
                    this.stateItems.shift()
                    this.stateItems.push(param)
                }
            },

            queryMsg() {
                if (!this.msgId.startsWith('group')) {
                    this.$message.error("请选择风机组节点!");
                    return;
                }
                let groupId = this.msgId.substring(this.msgId.lastIndexOf("-") + 1, this.msgId.length);
                const param = {
                    actingTime: new Date().getTime(),
                    description: '开启订阅！',
                }
                if (this.stompClient != null && this.subscription != null) {
                    this.subscription.unsubscribe()
                } else {
                    //建立连接
                    this.stompClient.connect();

                }
                if (this.stateItems.length < 1) this.stateItems.push(param)
                else {
                    this.stateItems.shift()
                    this.stateItems.push(param)
                }
                try {
                    this.subscription = this.stompClient.subscribe('real-time-msg-' + groupId, (res) => {
                        this.currentGroupId = groupId
                        res.body = JSON.parse(res.body)
                        if (this.items.length < 10) this.items.push(res.body)
                        else {
                            this.items.shift()
                            this.items.push(res.body)
                        }
                    })
                } catch (e) {
                    console.log(e)
                }
            },
            filter(inputValue, path) {
                return path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
            },
        },
    }
</script>
