<template>
    <div>
        <a-tabs default-active-key="2">
            <a-tab-pane key="1" tab="采集配置">
                <a-select style="width: 20%" placeholder="请选择" class="sel" @change="checkOut">
                    <template v-for="(item, i) in this.protocolValue">
                        <a-select-option :key="i" :value="i" :title="i">{{ i }}</a-select-option>
                    </template>
                    <!-- <a-select-node key="1" value="1" title="1"> </a-select-node> -->
                </a-select>

                <a-table :columns="collectColumns" :dataSource="data" :pagination="false" :rowKey="(row) => row.key">
                    <a slot="name" slot-scope="text">{{ text }}</a>
                    <span slot="customTitle">ID</span>
                    <span slot="status" slot-scope="status">
                       <a-switch type="checkbox" :checked="status"></a-switch>
                     </span>
                    <span slot="action" slot-scope="action">
                      <a class="update" @click="update(action)">编辑</a>
                    </span>
                </a-table>
                <a-pagination v-model="start" show-size-changer :page-size.sync="limit" :total="total"/>

                <a-modal title="编辑" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk"
                         @cancel="handleCancel">
                    <a-form-model :model="ModalText">
                        <a-form-model-item label="状态">
                            <a-radio-group v-model="ModalText.status">
                                <a-radio :value="true">开</a-radio>
                                <a-radio :value="false">关</a-radio>
                            </a-radio-group>
                        </a-form-model-item>
                        <a-form-model-item label="间隔时间">
                            <a-input-number v-model="ModalText.interval"/>
                        </a-form-model-item>
                    </a-form-model>
                </a-modal>
            </a-tab-pane>

            <a-tab-pane key="2" tab="风机颜色配置">
                <a-button icon="plus" @click="handleAdd" v-if="this.cacheData.length === this.colorData.length">
                    新增
                </a-button>
                <a-table :columns="colorColumns" :data-source="colorData">
                    <template
                            v-for="col in ['color', 'configName', 'configType']"
                            :slot="col"
                            slot-scope="text, record"
                    >
                        <div :key="col">

                            <a-input
                                    v-if="record.editable &&  col !== 'configType'"
                                    :value="text"
                                    @change="e => handleChange(e.target.value, record.key, col)"
                            >
                                <a-icon slot="addonAfter" type="setting" v-if="col === 'color'"
                                        @click="configColor(record)"/>
                            </a-input>

                            <a v-else-if="record.editable && col === 'configType'">
                                <a-select :default-value="record.configType" style="width: 120px"
                                          :disabled="!record.editable "
                                          @change="val => handleChange(val, record.key, col)">
                                    <a-select-option :value="0">
                                        正常
                                    </a-select-option>
                                    <a-select-option :value="1">
                                        异常
                                    </a-select-option>
                                    <a-select-option :value="2">
                                        停止
                                    </a-select-option>
                                    <a-select-option :value="3">
                                        离线
                                    </a-select-option>
                                    <a-select-option :value="4">
                                        风速范围
                                    </a-select-option>
                                </a-select>
                            </a>
                            <template v-else>
                                <a v-if="col === 'color'">
                                    <a-tag :color="text"> {{ text }}</a-tag>
                                </a>
                                <a v-else-if="col === 'configType'">
                                    {{ text === 0 ? '正常' : ' ' }}
                                    {{ text === 1 ? '异常' : ' ' }}
                                    {{ text === 2 ? '停止' : ' ' }}
                                    {{ text === 3 ? '离线' : ' ' }}
                                    {{ text === 4 ? '风速范围' : ' ' }}
                                </a>
                                <a v-else>
                                    {{text}}
                                </a>
                            </template>

                        </div>

                    </template>


                    <template slot="operation" slot-scope="text, record">
                        <div class="editable-row-operations">
                            <span v-if="record.editable">
                              <a @click="() => save(record)">保存</a>
                              <a @click="cancel(record)">取消</a>
                            </span>
                            <span v-else>
                              <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                            </span>
                            <a-popconfirm
                                    v-if="colorData.length"
                                    title="确认删除?"
                                    @confirm="() => onDeleteColorStrategy(record.id)"
                            >
                                <a href="javascript:;">删除</a>
                            </a-popconfirm>
                        </div>
                    </template>
                </a-table>

                <a-modal title="颜色选取" :visible="sketchPickerDisplay" @cancel="sketchPickerDisplay = false"
                         :footer="null" width="270px">
                    <sketch-picker v-model="defaultColor" @input="val => handleChange(val.hex, currentKey, 'color')"/>
                </a-modal>

            </a-tab-pane>


            <a-tab-pane key="3" tab="其他配置">
                <a-form :form="form" :label-col="{ span: 3 }" :wrapper-col="{ span: 6 }" @submit="handleSubmit">
                    <a-form-item label="操作日志保存月数">
                        <a-select
                                placeholder="选择时长"
                                @change="handleSelectChange"
                        >
                            <a-select-option value="3">
                                3
                            </a-select-option>
                            <a-select-option value="6">
                                6
                            </a-select-option>
                            <a-select-option value="9">
                                9
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="历史报文保存月数">
                        <a-select
                                placeholder="选择时长"
                                @change="handleSelectChange"
                        >
                            <a-select-option value="3">
                                3
                            </a-select-option>
                            <a-select-option value="6">
                                6
                            </a-select-option>
                            <a-select-option value="9">
                                9
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="采集曲线保存年数">
                        <a-select
                                placeholder="选择时长"
                                @change="handleSelectChange"
                        >
                            <a-select-option value="1">
                                1
                            </a-select-option>
                            <a-select-option value="2">
                                2
                            </a-select-option>
                            <a-select-option value="3">
                                3
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="磁盘空间告警阈值">
                    <a-input placeholder="Please input"/>
                </a-form-item>
                    <a-form-item label="内存告警阈值">
                        <a-input placeholder="Please input"/>
                    </a-form-item>
                    <a-form-item label="CPU告警阈值">
                        <a-input placeholder="Please input"/>
                    </a-form-item>

                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                        <a-button type="primary" html-type="submit">
                            提交
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>


    </div>
</template>

<script>
    import {
        getProtocol,
        getStrategy,
        update,
        addColorStrategy,
        getColorStrategy,
        updateColorStrategy,
        delColorStrategy
    } from '../../services/system'
    import {Sketch} from 'vue-color'

    let defaultColor = {
        hex: '#194d33',
        hsl: {h: 150, s: 0.5, l: 0.2, a: 1},
        hsv: {h: 150, s: 0.66, v: 0.30, a: 1},
        rgba: {r: 25, g: 77, b: 51, a: 1},
        a: 1
    };

    const collectColumns = [
        {
            dataIndex: 'strategyId',
            key: 'strategyId',
            slots: {title: 'customTitle'},
            scopedSlots: {customRender: 'strategyId'},
        },
        {
            title: '参数名称',
            dataIndex: 'parameterName',
            key: 'parameterName',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: {customRender: 'status'},
        },
        {
            title: '间隔时间/s',
            dataIndex: 'interval',
            key: 'interval',
        },
        {
            title: '操作',
            key: 'action',
            scopedSlots: {customRender: 'action'},
        },

    ];
    const colorColumns = [
        {
            title: '颜色',
            dataIndex: 'color',
            key: 'color',
            scopedSlots: {customRender: 'color'},
        },
        {
            title: '配置名称',
            dataIndex: 'configName',
            key: 'configName',
            scopedSlots: {customRender: 'configName'},
        },
        {
            title: '配置类型',
            dataIndex: 'configType',
            key: 'configType',
            scopedSlots: {customRender: 'configType'},
        },
        {
            title: '操作',
            key: 'operation',
            scopedSlots: {customRender: 'operation'},
        },
    ];


    export default {


        data() {

            return {
                defaultColor,
                data: [],
                colorData: [],
                cacheData: [],
                collectColumns,
                colorColumns,
                status: [],
                protocolValue: '',
                ModalText: '',
                visible: false,
                confirmLoading: false,
                start: 1, // 页
                limit: 10, // 数量
                total: 0,
                value: this.text,
                editable: false,
                editingKey: '',
                sketchPickerDisplay: false,
                currentKey: null
            }
        },
        mounted() {
            this.Strategy()
        },
        components: {
            'sketch-picker': Sketch,
        },
        watch: {
            start(val) {
                console.log(val)
                this.Strategy()
            },
            limit(val) {
                console.log(val)
                this.Strategy()
            },
        },
        methods: {
            colorSelectFinish(val) {
                console.info(val.hex);
            },
            checkOut(type) {
                this.Strategy(this.protocolValue[type])
            },
            Strategy(type = 0) {
                var that = this;
                getColorStrategy().then((res) => {
                    this.colorData = res.data.map((item) => ({...item, key: item.id}))
                    this.cacheData = JSON.parse(JSON.stringify(this.colorData));
                });
                getStrategy({start: this.start, limit: this.limit, condition: type}).then((res) => {
                    console.log(res)
                    if (res.total) {
                        this.total = res.total
                    }
                    this.data = res.data.map((item) => ({...item, key: item.strategyId}))
                    // for (let k = 0; k < this.data.length; k++) {
                    //   this.status.push(this.data[k].status);
                    // }
                });
                getProtocol().then((res) => {
                    that.protocolValue = res.data
                });

            },
            update(info) {
                console.log(info)
                this.visible = true
                this.ModalText = info
            },
            handleOk(e) {
                const obj = this.ModalText
                delete obj.key
                update({...obj}).then((res) => {
                    this.confirmLoading = true
                    this.visible = false
                    this.confirmLoading = false
                    this.ModalText = {}
                })
            },
            handleCancel(e) {
                console.log('Clicked cancel button')
                this.visible = false
            },

            handleColorStrategy() {
                getColorStrategy().then((res) => {
                    this.colorData = res.data.map((item) => ({...item, key: item.id}))
                    this.cacheData = JSON.parse(JSON.stringify(this.colorData));
                });
            },


            onDeleteColorStrategy(key) {
                this.editingKey = '';
                if (key) {
                    delColorStrategy(key).then((res) => {
                        if (res.msgCode === 0) {
                            this.handleColorStrategy();
                        }
                    })
                } else {
                    this.colorData = JSON.parse(JSON.stringify(this.cacheData));
                }


            },
            handleAdd() {
                const {colorData} = this;
                const newData = {
                    key: new Date().getTime(),
                    color: `#87CEFA`,
                    rangeMin: 0,
                    rangeMax: 0,
                    editable: true
                };
                this.colorData = [...colorData, newData];
            },
            handleChange(value, key, column) {
                const newData = [...this.colorData];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target[column] = value;
                    this.colorData = newData;
                    console.info(target);
                }

            },
            configColor(record) {
                this.currentKey = record.key;
                this.defaultColor = record.color;
                this.sketchPickerDisplay = true;
            },
            edit(key) {
                const newData = [...this.colorData];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = key;
                if (target) {
                    target.editable = true;
                    this.colorData = newData;
                }
            },
            save(record) {
                if (!record.id) {
                    addColorStrategy(record).then((res) => {
                        if (res.msgCode !== 0) {
                            this.$message.error('新增失败！')
                        } else {
                            this.$message.info('新增成功！');
                            this.editingKey = '';
                            this.handleColorStrategy();
                        }
                    }).catch((err) => {
                            return this.$message.error('新增失败！' + err);
                        }
                    )
                } else {
                    updateColorStrategy(record).then((res) => {
                        if (res.msgCode !== 0) {
                            this.$message.error('修改失败！')
                        } else {
                            this.$message.info('修改成功！');
                            this.editingKey = '';
                            this.handleColorStrategy();
                        }
                    }).catch((err) => {
                            return this.$message.error('修改失败！' + err);
                        }
                    )
                }
            },
            cancel(record) {
                let key = record.key;
                const newData = [...this.colorData];
                const target = newData.filter(item => key === item.key)[0];
                this.editingKey = '';
                if (record.id) {
                    if (target) {
                        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                        delete target.editable;
                        this.colorData = newData;
                    }
                } else {
                    //新增
                    this.colorData = JSON.parse(JSON.stringify(this.cacheData));
                }
            },
        },
    }
</script>

<style scoped>
    .sel {
        margin-bottom: 30px;
    }

    .ant-pagination {
        margin-top: 20px;
    }

    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
