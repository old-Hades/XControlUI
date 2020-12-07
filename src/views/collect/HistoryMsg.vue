<template>
    <div id="box1">

        <div class="history">

            <a-range-picker
                    v-model="timeQueryRange"
                    :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                    show-time
                    format="YYYY/MM/DD HH:mm:ss"
            />
            <a-button type="primary" html-type="submit" class="btn" @click="queryMsg">查询</a-button>

            <a-table :columns="columns" :data-source="data" :pagination="false">
                <a slot="name" slot-scope="text">{{ text }}</a>
                <span slot="clientToServer" slot-scope="clientToServer" >
                     <a-icon type="arrow-right"   v-if="clientToServer === true"/>
                     <a-icon type="arrow-left"   v-else/>
                </span>

            </a-table>

            <a-pagination
                    v-model="current"
                    show-size-changer
                    :page-size.sync="pageSize"
                    :total="showTotal"/>
        </div>
    </div>
</template>

<script>
    // import Aside from "./Aside";
    import moment from 'moment';
    const columns = [
        {
            title: '时间',
            dataIndex: 'actingTime',
            key: 'actingTime',
        },
        {
            title: '类型',
            dataIndex: 'clientToServer',
            key: 'clientToServer',
            scopedSlots: { customRender: 'clientToServer' },
        },
        {
            title: '报文',
            dataIndex: 'msg',
            key: 'msg',
        },
        {
            title: '协议',
            dataIndex: 'protocol',
            key: 'protocol',
        },
        {
            title: '行为',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: '风机地址',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: '组地址',
            dataIndex: 'group',
            key: 'group',
        },
        {
            title: '数值',
            dataIndex: 'value',
            key: 'value',
        },

    ];

    import {getHisDeviceMsg} from "../../services/collect"

    export default {
        props: {
            msgId: {
                type: String,
            }
        },
        components: {
            // Aside,
        },
        data() {
            return {
                pageSize: 10,
                current: 1,
                moment,
                showTotal: 0,
                dateFormat: 'YYYY/MM/DD',
                monthFormat: 'YYYY/MM',
                data: [],
                timeQueryRange: [],
                columns,
                //msgId: [],
                form: this.$form.createForm(this, {name: "coordinated"}),
            };
        },
        mounted() {

        },
        watch: {
            pageSize(val) {
                this.queryMsg();
            },
            current(val) {
                this.queryMsg();
            },
        },
        methods: {
            onShowSizeChange(current, pageSize) {
                console.log(current, pageSize);
            },
            queryMsg() {
                if (!this.msgId.startsWith('group') ) {
                    this.$message.error("请选择风机组节点!");
                    return;
                }
                let groupId = this.msgId.substring(this.msgId.lastIndexOf("-") + 1, this.msgId.length);
                const param = {
                    condition: groupId,
                    startDate: moment(this.timeQueryRange[0]._d).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: moment(this.timeQueryRange[1]._d).format('YYYY-MM-DD HH:mm:ss'),
                    start: this.current,
                    limit: this.pageSize
                };
                getHisDeviceMsg(param).then((res) => {
                    if (res !== undefined && res.msgCode === 0) {
                        this.data = res.data;
                        this.showTotal =res.total;
                    }else {
                        this.data = [];
                        this.showTotal = 0;
                    }

                })

            },
            filter(inputValue, path) {
                return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
            },
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log("Received values of form: ", values);
                    }
                });
            },

        },
    };
</script>

<style scoped>
    #box1 {
        display: flex;
    }

    .aside {
        height: 800px;
    }

    .history {
        width: 100%;
    }

    .history h1 {
        text-align: center;
    }

    .quill-editor {
        width: 80%;
        margin: 0 auto;
        height: 300px;
    }

    .time {
        width: 75%;
        /* margin: 0 auto; */
        display: inline-block;
        text-align: center;
        font-size: 14px;
        color: #000;
        margin-bottom: 10px;
    }

    .ant-row.ant-form-item {
        display: block;
        margin: 0;
    }

    .ant-calendar-picker-input.ant-input {
        width: 240px;
    }

</style>
