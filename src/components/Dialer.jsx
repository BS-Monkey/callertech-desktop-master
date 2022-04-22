import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { IconButton, Paper, Tooltip } from '@material-ui/core'
import { AssignmentInd, Dialpad, Phone } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import Logger from '../Managers/Logger'
import PhoneNumberInput from './PhoneNumberInput'
import makeCall from '../redux/actionCreators/makeCall'
import { changeCallNum } from '../redux/actionCreators/changeCallNum'
import fetchDemographics from '../redux/actionCreators/thunk/fetchDemographics'
import updateActiveCampaign from '../redux/actionCreators/updateActiveCampaign'
import updateCampaignItem from '../redux/actionCreators/updateCampaignItem'
import { changeTab } from '../redux/actionCreators/tabs.actions'
import Keypad from './Keypad'
import { getPhoneNumber } from '../utils'
import { agentFromExtension, agentsSelector } from '../redux/selectors/agents'
import {
    selectedPhonenumber,
    selectedPhonenumberInvalid,
} from '../redux/selectors/details'

const logger = new Logger('Dialer')

const styles = {
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    rootMini: {
        display: 'flex',
        flexDirection: 'column-reverse',
        alignContent: 'center',
    },
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    inputWrapper: {
        width: 290,
    },
    inputWrapperMini: {
        textAlign: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
    },
    iconButton: {
        padding: 6,
    },
}

class Dialer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            uri: props.callme || '',
            open: false,
            anchorEl: null,
            isCalling: false,
        }
    }

    handleInput(input) {
        switch (input) {
            case 'call':
                if (!this.props.sessions[0] && !this.props.incomingSession)
                    this.handleClickCall()
                else if (this.props.incomingSession)
                    this.props.handleAnswerCall()
                break
            case 'end':
                if (this.props.sessions.length)
                    this.props.sessions[0].terminate()
                else if (this.props.incomingSession)
                    this.props.incomingSession.terminate()
                break
            case 'back':
                if (this.state.uri.length > 0) {
                    this.setState({
                        uri: this.state.uri.slice(0, -1),
                    })
                }
                break
            default:
                if (this.props.onInput(input)) {
                    const oldUri = this.state.uri.replace(/-/g, '')
                    if (oldUri.length >= 10) {
                        return
                    }
                    // !this._canCall() || !state.uri
                    this.handleUriChange(oldUri + input)
                }
        }
    }

    handleToggleKeypad(close = false) {
        this.setState({ open: close ? false : !this.state.open })
    }

    render() {
        const state = this.state
        const classes = this.props.classes
        const mini = this.props.mini

        return (
            <div
                className={mini ? classes.wrapperMini : classes.wrapper}
                data-component="Dialer"
            >
                {/* <div className={classes.keypad}> */}
                {/* </div> */}
                <form
                    className={
                        mini ? classes.inputWrapperMini : classes.inputWrapper
                    }
                    action=""
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <Paper
                        ref={(r) => {
                            this.anchorEl = r
                        }}
                        className={mini ? classes.rootMini : classes.root}
                    >
                        <Keypad
                            call={this.handleClickCall}
                            sendInput={this.handleInput.bind(this)}
                            propOpen={this.state.open}
                            mini={mini}
                            anchorEl={this.anchorEl}
                        />
                        <If condition={!mini}>
                            <Tooltip title="Dialpad">
                                <span>
                                    <IconButton
                                        onClick={() => {
                                            this.handleToggleKeypad()
                                        }}
                                        color="primary"
                                    >
                                        <Dialpad />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </If>
                        <PhoneNumberInput
                            disabled={!this._canCall()}
                            value={state.uri}
                            onChange={(event) => {
                                this.handleUriChange(
                                    event.target.value.replace(/-/g, '')
                                )
                            }}
                            inputProps={{ 'aria-label': 'Phone Number' }}
                        />
                        <If condition={!mini}>
                            <Tooltip title="Call">
                                <span>
                                    <IconButton
                                        type="submit"
                                        aria-label="Call"
                                        className={classes.iconButton}
                                        disabled={
                                            !this._canCall() || !state.uri
                                        }
                                    >
                                        <Phone />
                                    </IconButton>
                                </span>
                            </Tooltip>
                            <Tooltip title="Show Details">
                                <span>
                                    <IconButton
                                        type="button"
                                        aria-label="Show"
                                        className={classes.iconButton}
                                        onClick={() => {
                                            if (
                                                '+1' + this.state.uri ==
                                                    this.props.callnum ||
                                                (!this.state.uri &&
                                                    this.props.callnum)
                                            ) {
                                                this.props.fetchDemographics(
                                                    this.props.callnum,
                                                    true
                                                )
                                                this.props.changeTab('details')
                                            } else {
                                                this.props.changeCallNum(
                                                    this.state.uri,
                                                    'manual'
                                                )
                                                this.props.changeTab('details')
                                            }
                                        }}
                                    >
                                        <AssignmentInd />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </If>
                    </Paper>
                </form>
            </div>
        )
    }

    componentDidMount() {
        if (this.state.uri) {
            const obj = this
            setTimeout(function () {
                obj.handleClickCall()
            }, 2000)
        }
    }

    componentDidUpdate(preProps) {
        //// add logic to pause the campaign if calling callme
        if (this.props.selectedPhonenumber != preProps.selectedPhonenumber) {
            if (!this.props.selectedPhonenumberInvalid) {
                let uri = this.props.selectedPhonenumber
                if (uri.length > 5) {
                    uri = uri.replace(/^[1, \+]*/, '')
                }
                this.setState({ uri })
            }
        }
        if (this.props.caller_number != preProps.caller_number) {
            let uri = this.props.caller_number
            if (uri.length > 5) {
                uri = uri.replace(/^[1, \+]*/, '')
            }
            this.setState({ uri })
        }
        if (preProps.callme != this.props.callme && this.props.callme) {
            this.setState({ uri: this.props.callme.replace('+1', '') })
            const obj = this
            this.props.makeCall('')
            setTimeout(function () {
                obj.handleClickCall()
            }, 200)
        }
        if (
            preProps.phone.state != this.props.phone.state &&
            this.props.phone.state == 'waiting'
        ) {
            this.handleIncrementIndex()
        }

        //increment the call counters
        if (
            this.props.item &&
            this.props.item == preProps.item &&
            this.props.phone.phonenumber ==
                this.props.item.phonenumber.replace('+1', '')
        ) {
            if (this.props.phone.state == 'ringing') {
                // this.props.changeTab("autodialer");
                this.props.updateCampaignItem(this.props.item.id, {
                    calls_made: this.props.item.calls_made + 1,
                })
            }
            if (this.props.phone.state == 'connected') {
                this.props.changeTab('details')
                this.props.updateCampaignItem(this.props.item.id, {
                    calls_attended: this.props.item.calls_attended + 1,
                })
            }
        }

        //when to call next?
        // 1- active campaign changed
        // 2- current_index changed
        // 3- phone status changed
        // 4- paused changed
        // 5- previous call disconnected,
        if (
            preProps.phone.current_index != this.props.phone.current_index ||
            (preProps.phone.paused == true &&
                this.props.phone.paused == false) ||
            preProps.phone.active_campaign != this.props.phone.active_campaign
        ) {
            this.handleCallNext()
        }
    }

    handleCallNext() {
        const phone = this.props.phone
        if (!this._canCall() || phone.paused || this.props.busy) return
        const item = this.props.item
        if (item) {
            if (item.dnc) {
                this.handleIncrementIndex()
            } else {
                this.setState({ uri: item.phonenumber.replace('+1', '') })
                setTimeout(() => {
                    this.handleClickCall()
                }, 200)
            }
        }
    }

    handleIncrementIndex() {
        const phone = this.props.phone
        if (phone.active_campaign_items.length > phone.current_index + 1) {
            this.props.updateActiveCampaign({
                current_index: this.props.phone.current_index + 1,
            })
        } else {
            this.props.updateActiveCampaign({
                current_index: 0,
                paused: true,
                active_campaign: null,
                active_campaign_items: [],
            })
        }
    }

    handleUriChange(uri) {
        const number = this.formatPhonenumber(uri)
        if (number.phonenumber) {
            this.props.changeCallNum(number.nationalPhonenumber, 'no_fetch')
        }
        this.setState({ uri })
    }

    formatPhonenumber(uri) {
        let strippedPhonenumber = uri.length === 11 ? uri.slice(1) : uri
        const agent = agentFromExtension(uri, this.props.agents)
        if (agent) {
            strippedPhonenumber = agent.phonenumber
        }
        const phonenumber = getPhoneNumber(strippedPhonenumber)
        if (!phonenumber) {
            return { phonenumber }
        }
        const nationalPhonenumber = phonenumber.replace('+1', '')
        console.log(strippedPhonenumber, phonenumber, nationalPhonenumber)
        return { phonenumber, nationalPhonenumber }
    }

    handleSubmit(event) {
        logger.debug('handleSubmit()')
        this.handleClickCall()
        event.stopPropagation()
        event.preventDefault()
        const number = this.formatPhonenumber(this.state.uri)
        if (number.phonenumber) {
            this.props.changeCallNum(number.nationalPhonenumber, 'out')
        }
    }

    handleClickCall() {
        logger.debug('handleClickCall()')
        if (this.state.isCalling) {
            return
        }
        this.setState({ isCalling: true })
        setTimeout(() => {
            this.setState({ isCalling: false })
        }, 500)
        console.log(this.state.uri)
        if (!this._canCall() || !this.state.uri) return

        this._doCall()
    }

    _doCall() {
        const uri = this.state.uri.replace('+1', '')

        logger.debug('_doCall() [uri:"%s"]', uri)

        // this.setState({ uri: "" });
        this.props.onCall(uri)
    }

    _canCall() {
        const props = this.props

        return props.status === 'connected' || props.status === 'registered'
    }
}

Dialer.propTypes = {
    settings: PropTypes.object.isRequired,
    status: PropTypes.string.isRequired,
    busy: PropTypes.bool.isRequired,
    callme: PropTypes.string,
    onCall: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
    let obj = {
        callme: state.phone.callme,
        callnum: state.calldata.phonenumber,
        selectedPhonenumber: selectedPhonenumber(state),
        selectedPhonenumberInvalid: selectedPhonenumberInvalid(state),
        phone: state.phone,
        item_id: state.phone.active_campaign_items[state.phone.current_index],
        item: null,
        mini: state.app.mini,
        agents: agentsSelector(state),
    }
    if (obj.item_id) obj.item = state.campaign_items.data[obj.item_id]
    return obj
}

export default connect(mapStateToProps, {
    makeCall,
    changeCallNum,
    fetchDemographics,
    updateActiveCampaign,
    updateCampaignItem,
    changeTab,
})(withStyles(styles)(Dialer))
