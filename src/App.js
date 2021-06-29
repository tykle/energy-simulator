import { Component } from 'react';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import './App.css';

import Template from './lib/tpl-simple'

import moment from 'moment';
import numeral from 'numeral';
import prefix from 'metric-prefix';

import * as XLSX from 'xlsx';

import { Card, Row, Col } from 'antd';

import {
    Layout,
    Form,
    Input,
    Switch,
    Select,
    DatePicker,
    Button,
    Progress,
    Space
} from 'antd';

import { fuelSources, cryptoMachines } from './lib/sources'

const { Header, Footer, Sider, Content } = Layout;
const { Option } = Select;

/*
Le client arrive et hash() et sign()
Contact 5 noeuds qui vont hash() verify() sign() circulairement
5 autres noeuds sont la pour témoigner en suivant ( hash() verify() ) * 5 et relay()
Le message se propage et tous le monde va ( hash() verify() ) * 5 a terme
*/
const machines = cryptoMachines

const hardriveResidence = 10 / (250 * 1024 * 1024 * 1024)

export default class elecarfuel extends Component {

    constructor() {
        super()

        this.state = {
            input: {},
            result: {
                combus: []
            }
        }

        this.state = this.prepare({
            step: 0,
            lifetime: new Date(),
            machineId: 0,
            nodes: 100,
            validationAuthority: 15,
            model: "native",

            exportable: false,
            simulation: false,
            transactionSize: 3000,
            difficulty: 2,
            // dailyNewNode: Math.round(150000 / 5 / 365),
            dailyNewNode: 50,
            // dailyNewTransaction: Math.round(350000000 * 0.3 / 5 / 365),
            dailyNewTransaction: 50000,
            tyklePerVision: 450000,

            sim: {
                transactions: 0,
                blocks: 10,
                size: 0,
                energy: 0,
                distriEnergy: 0,
                distriRequests: 0,
                fuels: [],
                paperFuels: []
            }
        })

        this.backup = { ...this.state }
        this.export = []
        this.rr = 0
    }

    componentDidMount() {
        this.__life = setTimeout(this.simulation.bind(this), 4000 / 12)
    }

    componentDidUpdate() {
        if (this.__life) {
            clearTimeout(this.__life)
            delete this.__life;
        }
        if (this.state.input.simulation === true) {
            this.__life = setTimeout(this.simulation.bind(this), 4000 / 12)
        }
    }

    // sortir
    // energy
    // taille 
    simulation() {
        if (this.state.input.simulation === false) return;

        const result = { ...this.state.input.sim }

        const getMachine = () => {
            const machine = machines[this.rr]
            if (!machine) {
                this.rr = 0;
                return (getMachine())
            }
            this.rr++;
            return (machine)
        }

        // node
        for (var a = 0; a < this.state.input.dailyNewNode; a++) {
            const machine = getMachine()
            const model = machine.performance[this.state.input.model]

            this.simAddNode(machine, model, result)
        }

        // add transaction
        for (var a = 0; a < this.state.input.dailyNewTransaction; a++) {
            const machine = getMachine()
            const model = machine.performance[this.state.input.model]

            this.simAddTransaction(machine, model, result)
        }

        // add transaction
        {
            const machine = getMachine()
            const model = machine.performance[this.state.input.model]

            var upToChain = model._micro_hash + model._micro_sign
            for (var a = 0; a < 6; a++) {
                const machine = machines[this.state.input.machineId]
                if (!machine) return;
                const model = machine.performance[this.state.input.model]
                upToChain += model._micro_verify
            }
        }

        // block residence
        result.energy += hardriveResidence * result.size * 24 * this.state.input.nodes

        // every day 10% transaction distributed
        result.distriEnergy += Math.round(result.transactions * 3 * upToChain) // 5 = remonter la chaine
        result.distriRequests += Math.round(result.transactions * 3)
        result.totalEnergy = result.distriEnergy + result.energy;

        // date
        const nlife = this.state.input.lifetime;
        nlife.setDate(nlife.getDate() + 1)

        result.energyFormat = prefix.prefix(result.energy / 1000 / 1000, { unit: "Wh" })
        result.sizeFormat = prefix.prefix(result.size, { unit: "B" })
        result.transactionsFormat = prefix.prefix(result.transactions, { unit: "Tr" })

        result.distriEnergyFormat = prefix.prefix(result.distriEnergy / 1000 / 1000, { unit: "Wh" })
        result.distriRequestsFormat = prefix.prefix(result.distriRequests, { unit: "Req" })
        result.totalEnergyFormat = prefix.prefix(result.totalEnergy / 1000 / 1000, { unit: "Wh" })

        // process source fuel for production kwh
        result.fuels = []
        for (var a in fuelSources) {
            const fuel = fuelSources[a];
            if (!fuel.co2) continue;
            const insert = { name: fuel.name }
            insert.co2 = result.totalEnergy / 1000 / 1000 / 1000
            insert.co2 *= (fuel.co2 * (2 - fuel.meca)) / fuel.kwh

            if (!isNaN(insert.co2))
                insert.co2Format = `${(insert.co2 / 1000 / 1000).toFixed(2)} T`

            // {prefix.prefix((this.state.input.sim.totalEnergy / 1000--$ / 1000 / 1000)*(value.co2 * (1 + value.meca)))}
            result.fuels.push(insert)
        }

        // process paper computation
        result.paperNeeded = Math.floor(result.blocks * 0.1 * this.state.input.tyklePerVision / 15)
        result.paperPower = result.blocks * 0.1 * this.state.input.tyklePerVision / 15 * 17
        result.paperPowerFormat = prefix.prefix(result.paperPower, { unit: "Wh" })


        result.paperFuels = []
        for (var a in fuelSources) {
            const fuel = fuelSources[a];
            if (!fuel.co2) continue;
            const insert = { name: fuel.name }
            insert.co2 = result.paperPower / 1000
            insert.co2 *= (fuel.co2 * (2 - fuel.meca)) / fuel.kwh

            insert.price = insert.co2 / 1000 / 1000 * 13.1 // cost of 1t of co2

            insert.saved = insert.co2 - result.fuels[a].co2
            insert.savedPrice = insert.saved * insert.price / insert.co2;

            if (!isNaN(insert.co2)) {
                // insert.co2Format = `${(insert.co2 / 1000 / 1000).toFixed(2)} T`
                // insert.savedFormat = `${(insert.saved / 1000 / 1000).toFixed(2)} T`

                insert.co2Format = prefix.prefix(insert.co2 / 1000 / 1000, { unit: "T" })
                insert.savedFormat = prefix.prefix(insert.saved / 1000 / 1000, { unit: "T" })
            }

            // {prefix.prefix((this.state.input.sim.totalEnergy / 1000 / 1000 / 1000)*(value.co2 * (1 + value.meca)))}
            result.paperFuels.push(insert)
        }

        // processing surface information
        result.surfaces = Math.round(result.size / (4 * 1000))

        // prepare returned result 
        const update = {
            // nodes
            nodes: this.state.input.nodes + this.state.input.dailyNewNode,
            sim: result,
            lifetime: nlife,
            step: ++this.state.input.step
        }

        // process monthly state
        if (!this.prevSim || this.prevSim.getMonth() != nlife.getMonth()) {
            // console.log(this.prevSim ? this.prevSim.getMonth():null, nlife.getMonth(), this.state.input.step)
            this.exportMarkup(nlife, { ...this.state })
        }

        this.prevSim = new Date(nlife)

        // console.log(this.state.input.step++)
        this.process(update)
        this.__life = setTimeout(this.simulation.bind(this), 1000 / 12)
    }

    exportMarkup(date, state) {
        this.export.push({ date, state })
    }

    simAddNode(machine, model, result) {
        // process difficulty
        result.energy += (model._micro_hash + model._micro_verify) * result.blocks

        // sign from source
        result.energy += model._micro_hash + model._micro_sign
        result.size += 1000;
        result.blocks += 1;

        // sign from provider & cot x 2 (chainned)
        result.energy += (model._micro_hash + model._micro_sign) * 2
        result.size += 1000 * 2;
        result.blocks += 2;
    }

    simAddTransaction(machine, model, result, state) {
        if (!state) state = this.state

        if (!result) {
            result = {
                steps: [],
                energy: 0,
                size: 0,
                blocks: 0,
                transactions: 0
            }
        }

        const VA = state.input.validationAuthority;

        result.transactions++;

        // "Le client arrive et hash() et sign()"
        result.energy += model._micro_hash + model._micro_sign
        result.size += 3000;
        result.blocks += 1;
        if (result.steps) {
            result.steps.push({
                name: "Client initiate block transaction",
                energy: model._micro_hash + model._micro_sign,
                size: 3000,
                total: result.energy,
                blocks: 1,
            })
        }


        // il paye
        result.energy += model._micro_hash + model._micro_verify + model._micro_sign
        result.size += 200;
        result.blocks += 1;
        if (result.steps) {
            result.steps.push({
                name: "Payin Operation",
                energy: model._micro_hash + model._micro_verify + model._micro_sign,
                size: 200,
                total: result.energy,
                blocks: 1
            })
        }


        // `Contact ${inputState.validationAuthority} noeuds qui vont hash() verify() sign() circulairement`
        result.energy += (model._micro_hash + model._micro_verify + model._micro_sign) * VA * 3
        if (result.steps) {
            result.steps.push({
                name: "Operations with Workers",
                energy: (model._micro_hash + model._micro_verify + model._micro_sign) * VA * 3, // 3 worker space for spare
                total: result.energy,
            })
        }


        // `${inputState.validationAuthority} autres noeuds sont la pour témoigner en suivant ( hash() verify() ) * ${inputState.validationAuthority}`
        result.energy += (model._micro_hash + model._micro_verify + model._micro_sign) * VA
        if (result.steps) {
            result.steps.push({
                name: "Witness operation",
                energy: (model._micro_hash + model._micro_verify + model._micro_sign) * VA,
                total: result.energy,
            })
        }


        // `Le message se propage et tous le monde va ( hash() verify() )`
        result.energy += (model._micro_hash + model._micro_verify) * VA * (state.input.nodes - VA * 2)
        if (result.steps) {
            result.steps.push({
                name: "Block Broadcasting",
                energy: (model._micro_hash + model._micro_verify) * VA * (state.input.nodes - VA * 2),
                total: result.energy,
            })
        }


        result.energy += hardriveResidence * state.input.sim.size * state.input.nodes
        if (result.steps) {
            result.steps.push({
                name: "Harddrive Residence",
                energy: hardriveResidence * state.input.sim.size * state.input.nodes,
                total: result.energy,
            })
        }

        return (result)
    }

    prepare(data) {
        var refresh = null;

        const inputState = { ...this.state.input }
        const resultState = { ...this.state.result }

        function retrieveInt(name) {
            const pi = parseInt(data[name]);

            if (!isNaN(pi)) {
                inputState[name] = pi
                refresh = true
            }
        }

        retrieveInt("difficulty")
        retrieveInt("machineId")
        retrieveInt("validationAuthority")
        retrieveInt("transactionSize")
        retrieveInt("dailyNewNode")
        retrieveInt("dailyNewTransaction")
        retrieveInt("nodes")
        retrieveInt("tyklePerVision")

        // result 
        if (data.hasOwnProperty("model")) {
            inputState.model = data.model
            refresh = true
        }
        if (data.hasOwnProperty("lifetime")) {
            inputState.lifetime = data.lifetime
            refresh = true
        }
        if (data.hasOwnProperty("simulation")) {
            inputState.simulation = data.simulation
            refresh = true
        }

        if (data.hasOwnProperty("exportable")) {
            inputState.exportable = data.exportable
        }

        if (data.hasOwnProperty("step")) {
            inputState.step = parseInt(data.step)
            resultState.progress = inputState.step * 100 / (5 * 365)

            if (resultState.progress >= 100) {
                inputState.exportable = false;
                inputState.simulation = false;
                refresh = true;
            }
        }

        if (data.hasOwnProperty("sim")) {
            inputState.sim = data.sim
        }

        const machine = machines[inputState.machineId]

        if (data.hasOwnProperty("weight") && machine) {
            machine.weight = data.weight
        }
        if (refresh === true) {

            if (!machine) return (null)

            const model = machine.performance[inputState.model]

            const sim = this.simAddTransaction(machine, model, null, { input: inputState })

            resultState.transaction = sim.steps

            resultState[`_total_transaction`] = sim.energy;
        }

        return ({
            input: inputState,
            result: resultState
        })
    }

    process(data) {
        var refresh = this.prepare(data)

        // refresh
        if (refresh !== null) {
            this.setState(refresh)
        }
    }

    render() {
        const machine = machines[this.state.input.machineId]

        const changeTyklePerVision = ({ target }) => {
            this.process({
                tyklePerVision: target.value,
            })
        }

        const changeNodes = ({ target }) => {
            this.process({
                nodes: target.value,
            })
        }

        const changeValidation = ({ target }) => {
            this.process({
                validationAuthority: target.value,
            })
        }

        const changeDailyNewNode = ({ target }) => {
            this.process({
                dailyNewNode: target.value,
            })
        }

        const changeDailyNewTransaction = ({ target }) => {
            this.process({
                dailyNewTransaction: target.value,
            })
        }

        const changeTransactionSize = ({ target }) => {
            this.process({
                transactionSize: target.value,
            })
        }

        const changeModel = (target) => {
            this.process({
                model: target,
            })
        }

        const changeDateSimulation = (target) => {
            if (!target) return;
            this.process({
                lifetime: target.toDate(),
            })
        }

        const switchSimulation = (target) => {
            this.process({
                simulation: target,
            })
        }

        const changeReset = ({ target }) => {
            this.export = []
            this.setState(this.backup)
        }

        const changeMachine = (target) => {
            this.process({
                machineId: target,
            })
        }

        const changeWeight = ({ target }) => {
            this.process({
                weight: target.value,
            })
        }

        const exportClick = ({ target }) => {
            const organized = {}

            function differential(field, value, unit) {
                if (!organized[field]) organized[field] = []
                const position = organized[field]

                var last = position[position.length - 1]
                if (!last) {
                    last = {
                        diff: 0,
                        value: 0
                    }
                }
                if (isNaN(value)) {
                    position.push({
                        diff: 0,
                        value: 0,
                        unit
                    })
                }
                else {
                    position.push({
                        diff: value - last.value,
                        value: value,
                        unit
                    })
                }

            }

            // prepapre the export
            for (var a in this.export) {
                const line = this.export[a];


                differential("Nodes in network", line.state.input.nodes)
                differential("Number of blocks", line.state.input.sim.blocks)
                differential("Number of transactions", line.state.input.sim.transactions)
                differential("Tykle Vision or Right", line.state.input.sim.blocks * 0.1)

                differential("Tykle Chain Size", line.state.input.sim.size, "B")
                differential("Required Tykle Surface", line.state.input.sim.surfaces)
                differential("Distributed Trust Request", line.state.input.sim.distriRequests)

                differential("Total Energy", line.state.input.sim.energy / 1000 / 1000, "Wh")

                differential("Bitcoin Energy Equivalence", line.state.input.sim.transactions * 741 * 1000 / 1000 / 1000, "Wh")
                differential("Ethereum Energy Equivalence", line.state.input.sim.transactions * 34 * 1000 / 1000 / 1000, "Wh")
                differential("Visa Energy Equivalence", line.state.input.sim.transactions * (149 * 1000 / 100000) / 1000 / 1000, "Wh")

                // fuel
                if (line.state.input.sim.fuels.length > 0) {
                    for (var b in line.state.input.sim.fuels) {
                        const fuel = line.state.input.sim.fuels[b]
                        differential(`${fuel.name} CO2 Emission`, fuel.co2, "Tco2")
                    }
                }
                else {
                    for (var b in fuelSources) {
                        const fuel = fuelSources[b]
                        if (fuel.co2) differential(`${fuel.name} CO2 Emission`, 0, "Tco2")
                    }
                }
            }

            var dataRaw = []
            const dataReadable = []

            // prepare data in xls
            for (var key in organized) {
                const line = organized[key];
                const insertRaw = [key]
                const insertReadable = [key]
                const insertReadableTT = [key]

                for (var a in line) {
                    const position = line[a]

                    insertRaw.push(position.diff)

                    if (position.unit) {
                        insertReadable.push(`+ ${prefix.prefix(position.diff, { unit: position.unit })}`)
                        insertReadableTT.push(`${prefix.prefix(position.value, { unit: position.unit })}`)
                    }
                    else {
                        insertReadable.push(`+ ${position.diff}`)
                        insertReadableTT.push(position.value)
                    }
                }

                dataRaw.push(insertRaw)
                // dataReadable.push(insertReadable)
                dataReadable.push(insertReadableTT)
            }

            var wb = XLSX.utils.book_new();
            var wsRaw = XLSX.utils.aoa_to_sheet(dataRaw);
            var wsReadable = XLSX.utils.aoa_to_sheet(dataReadable);

            /* add worksheet to workbook */
            XLSX.utils.book_append_sheet(wb, wsRaw, "Raw");
            XLSX.utils.book_append_sheet(wb, wsReadable, "Readable");

            var filename = "write.xlsx";
            XLSX.writeFile(wb, filename);

        }


        return (

            <Template>
                <Row gutter={2}>
                    <Col xs={24} sm={6}>
                        <Card>
                            <h1>Simulation Model A</h1>
                            <small>December 2020</small>
                            <Form name="complex-form" layout="vertical" initialValues={this.state.input}>
                                <Form.Item label="Simulation">
                                    <Space>
                                        <Switch onChange={switchSimulation} checkedChildren="Working" unCheckedChildren="Paused" checked={this.state.input.simulation} />
                                        <Button onClick={changeReset}>Reset</Button>
                                        <Button onClick={exportClick} type="primary" disabled={this.state.input.exportable}>Export Simulation</Button>
                                    </Space>

                                </Form.Item>
                                <Form.Item label="Machine Preset">
                                    <Select
                                        showSearch
                                        placeholder="Select a machine"
                                        optionFilterProp="children"
                                        onChange={changeMachine}
                                        value={this.state.input.machineId}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {machines.map((value, index) => (
                                            <Option value={index} key={`machine-${index}`}>{value.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Platform model">
                                    <Select
                                        showSearch
                                        placeholder="Select a platform model"
                                        optionFilterProp="children"
                                        onChange={changeModel}
                                        value={this.state.input.model}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {Object.entries(machine.performance).map((value, index) => (
                                            <Option value={value[0]} key={`performance-${index}`}>{value[0]}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Weight in simulation"
                                >
                                    <Input placeholder="Please input" onChange={changeWeight} value={machine.weight} />
                                </Form.Item>

                                <Form.Item
                                    label="Number of nodes in the network"
                                    validateStatus={this.state.input.nodesError}
                                    help={this.state.input.nodesError}
                                >
                                    <Input placeholder="Please input" onChange={changeNodes} value={this.state.input.nodes} />
                                </Form.Item>

                                <Form.Item
                                    label="Number of validation authorities"
                                    validateStatus={this.state.input.validationAuthorityError}
                                    help={this.state.input.validationAuthorityError}
                                >
                                    <Input placeholder="Please input" onChange={changeValidation} value={this.state.input.validationAuthority} />
                                </Form.Item>

                                <Form.Item
                                    label="Average Transaction Size"
                                    validateStatus={this.state.input.transactionSizeError}
                                    help={this.state.input.transactionSizeError}
                                >
                                    <Input placeholder="Please input" onChange={changeTransactionSize} value={this.state.input.transactionSize} />
                                </Form.Item>

                                <Form.Item
                                    label="Daily New Nodes"
                                    validateStatus={this.state.input.dailyNewNodeError}
                                    help={this.state.input.dailyNewNodeError}
                                >
                                    <Input placeholder="Please input" onChange={changeDailyNewNode} value={this.state.input.dailyNewNode} />
                                </Form.Item>

                                <Form.Item
                                    label="Daily Transactions"
                                    validateStatus={this.state.input.dailyNewTransactionError}
                                    help={this.state.input.dailyNewTransactionError}
                                >
                                    <Input placeholder="Please input" onChange={changeDailyNewTransaction} value={this.state.input.dailyNewTransaction} />
                                </Form.Item>

                                <Form.Item
                                    label="Number of Tykle per Vision"
                                    validateStatus={this.state.input.tyklePerVisionError}
                                    help={this.state.input.tyklePerVisionError}
                                >
                                    <Input placeholder="Please input" onChange={changeTyklePerVision} value={this.state.input.tyklePerVision} />
                                </Form.Item>

                                <Form.Item
                                    label="Simulation Date"
                                >
                                    <DatePicker onChange={changeDateSimulation} picker="month" value={moment(this.state.input.lifetime)} />
                                </Form.Item>

                            </Form>
                        </Card>
                    </Col>



                    <Col xs={24} sm={18}>


                        <Card>
                            <small>
                                {this.state.input.lifetime.toString()}
                            </small>

                            <Progress
                                strokeColor={{
                                    from: '#108ee9',
                                    to: '#87d068',
                                }}
                                status={this.state.input.simulation === true ? "active" : null}
                                percent={this.state.result.progress.toFixed(2)}
                            />

                        </Card>


                        <Card>
                            <h1>{machine.name}</h1>
                            <Row gutter={2}>
                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Power per transaction</h1>
                                    <h2>{prefix.prefix(this.state.result._total_transaction / 1000 / 1000, { unit: "Wh" })}</h2>
                                </Col>


                                {/* <li key={`transaction-${index}`}>{value.name} (+{value.energy} µWh) = {value.total} µWh <small>difficulty: {value.difficulty}</small></li> */}

                                {this.state.result.transaction.map((value, index) => (
                                    <Col xs={24} sm={6} className="sim-block" key={`per-transaction-${index}`}>
                                        <h1>{value.name}</h1>

                                        <h2>+{prefix.prefix(value.energy / 1000 / 1000, { unit: "Wh" })} <small>{prefix.prefix(value.total / 1000 / 1000, { unit: "Wh" })}</small></h2>
                                    </Col>
                                ))}

                            </Row>

                        </Card>

                        <Card>
                            <h1>Simulation</h1>

                            <Row gutter={2}>
                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Number of blocks</h1>
                                    <h2>{numeral(this.state.input.sim.blocks).format()}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Number of Tykle Vision or Tykle Right</h1>
                                    <h2>{numeral(this.state.input.sim.blocks * 0.01).format()}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Number of transactions</h1>
                                    <h2>{this.state.input.sim.transactions}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Tykle Chain Size</h1>
                                    <h2>{this.state.input.sim.sizeFormat}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Energy consumed by the Tykle Chain</h1>
                                    <h2>{this.state.input.sim.energyFormat}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Distributed Trusted Request for players</h1>
                                    <h2>{this.state.input.sim.distriRequestsFormat}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>Energy consumed to distribute requests</h1>
                                    <h2>{this.state.input.sim.distriEnergyFormat}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#d48806" }}>Required Surfaces</h1>
                                    <h2 style={{ color: "#d48806" }}>{numeral(this.state.input.sim.surfaces).format()}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#cf1322" }}>Total Energy</h1>
                                    <h2 style={{ color: "#cf1322" }}>{this.state.input.sim.totalEnergyFormat}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#389e0d" }}>Bitcoin Energy Equivalence</h1>
                                    <h2 style={{ color: "#389e0d" }}>{prefix.prefix(this.state.input.sim.transactions * 741 * 1000, { unit: 'Wh' })}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#389e0d" }}>Ethereum Energy Equivalence</h1>
                                    <h2 style={{ color: "#389e0d" }}>{prefix.prefix(this.state.input.sim.transactions * 34 * 1000, { unit: 'Wh' })}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#389e0d" }}>Visa Energy Equivalence</h1>
                                    <h2 style={{ color: "#389e0d" }}>{prefix.prefix(this.state.input.sim.transactions * (149 * 1000 / 100000), { unit: 'Wh' })}</h2>
                                </Col>
                                {/* co2 burnt */}

                            </Row>

                        </Card>

                        <Card>
                            <h1>CO2 Production following fuel sources</h1>
                            <p>
                                Here we are talking about the CO2 emitted by different fuels to produce the energy needed to run the Tykle Chain.
                </p>
                            <Row gutter={2}>
                                {this.state.input.sim.fuels.map((value, index) => (
                                    this.state.input.sim.totalEnergy && (
                                        <Col xs={24} sm={6} className="sim-block" key={`co2-prod-${index}`}>
                                            <h1>{value.name}</h1>
                                            <h2>{value.co2Format}</h2>
                                        </Col>
                                    )
                                ))}

                            </Row>
                        </Card>

                        <Card>
                            <h1>A4 Paper</h1>

                At production, an A4 paper costs (without printing) 17 Wh of energy. It is normally possible to apply 5*3 (15) Tykle per A4 paper. Thus 1 Tykle costs 1 Wh printed..

                A transaction corresponds to the inscription of a right or a Tykle vision in the blockchain and this one will make on average {this.state.input.tyklePerVision} Tykle.

                The idea of this simulation is to measure the level of co2 saved by using the Tykle Chain

                <Row>
                                <Col xs={24} sm={6} className="sim-block">
                                    <h1>A4 Paper Equivalence</h1>
                                    <h2>{numeral(this.state.input.sim.paperNeeded).format()}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#389e0d" }}>Trees Saved</h1>
                                    <h2 style={{ color: "#389e0d" }}>{numeral(this.state.input.sim.paperNeeded / 16666).format()}</h2>
                                </Col>

                                <Col xs={24} sm={6} className="sim-block">
                                    <h1 style={{ color: "#cf1322" }}>Energy to produce paper</h1>
                                    <h2 style={{ color: "#cf1322" }}>{this.state.input.sim.paperPowerFormat}</h2>
                                </Col>

                                {this.state.input.sim.paperFuels[0] && (
                                    <>


                                        <Col xs={24} sm={6} className="sim-block">
                                            <h1>Price of 1 Surface indexed to CO2</h1>
                                            <h2>{numeral((this.state.input.sim.paperFuels[0].savedPrice / (this.state.input.sim.blocks * 0.05))).format("0.000")} €</h2>
                                        </Col>
                                        <Col xs={24} sm={6} className="sim-block">
                                            <h1>Value of Tykle Surface indexed to CO2</h1>
                                            <h2>{numeral((this.state.input.sim.surfaces * ((this.state.input.sim.paperFuels[0].savedPrice / (this.state.input.sim.blocks * 0.05))))).format()} €</h2>
                                        </Col>
                                    </>
                                )}


                                {this.state.input.sim.paperFuels.map((value, index) => (
                                    this.state.input.sim.totalEnergy && (
                                        <Col xs={24} sm={6} className="sim-block" key={`a4-prod-${index}`}>
                                            <h1>{value.name}</h1>

                                            <h2>{value.savedFormat} <small>({numeral(value.savedPrice).format()} €)</small></h2>
                                            {/* <h3>{value.co2Format} <small>({value.price.toFixed(2)} €)</small></h3> */}
                                            {/* <h2>{(value.co2 * (1 + value.meca))}</h2> */}
                                        </Col>
                                    )
                                ))}
                            </Row>
                        </Card>




                    </Col>
                </Row>
            </Template>
        )
    }
}
