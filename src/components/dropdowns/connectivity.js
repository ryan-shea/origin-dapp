import React, { Component } from 'react'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import $ from 'jquery'

import origin from '../../services/origin'

const ipfsGateway = process.env.IPFS_DOMAIN || 'gateway.originprotocol.com'
const bridgeServerDomain =
  process.env.BRIDGE_SERVER_DOMAIN || 'bridge.originprotocol.com'
const web3 = origin.contractService.web3
const ONE_SECOND = 1000

class ConnectivityDropdown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      connectedStatus: {
        network: false,
        ipfsGateway: false,
        bridgeServer: false
      },
      networkName: null
    }

    this.intlMessages = defineMessages({
      mainEthereumNetwork: {
        id: 'connectivity.mainEthereumNetwork',
        defaultMessage: 'Main Ethereum Network'
      },
      mordenTestNetwork: {
        id: 'connectivity.mordenTestNetwork',
        defaultMessage: 'Morden Test Network'
      },
      ropstenTestNetwork: {
        id: 'connectivity.ropstenTestNetwork',
        defaultMessage: 'Ropsten Test Network'
      },
      rinkebyTestNetwork: {
        id: 'connectivity.rinkebyTestNetwork',
        defaultMessage: 'Rinkeby Test Network'
      },
      kovanTestNetwork: {
        id: 'connectivity.kovanTestNetwork',
        defaultMessage: 'Kovan Test Network'
      },
      localhost: {
        id: 'connectivity.localhost',
        defaultMessage: 'Localhost'
      }
    })

    this.networkNames = {
      1: this.props.intl.formatMessage(this.intlMessages.mainEthereumNetwork),
      2: this.props.intl.formatMessage(this.intlMessages.mordenTestNetwork),
      3: this.props.intl.formatMessage(this.intlMessages.ropstenTestNetwork),
      4: this.props.intl.formatMessage(this.intlMessages.rinkebyTestNetwork),
      42: this.props.intl.formatMessage(this.intlMessages.kovanTestNetwork),
      999: this.props.intl.formatMessage(this.intlMessages.localhost)
    }
  }

  async componentDidMount() {
    $(document).on('click', '.connectivity .dropdown-menu', e => {
      e.stopPropagation()
    })

    !web3.givenProvider &&
      $('#connectivityDropdown').dropdown('toggle') &&
      setTimeout(() => {
        if ($('.connectivity.dropdown').hasClass('show')) {
          $('#connectivityDropdown').dropdown('toggle')
        }
      }, 10 * ONE_SECOND)

    try {
      const networkId = await web3.eth.net.getId()

      this.setState({
        networkName: this.networkNames[networkId],
        ipfsGateway,
        bridgeServerDomain
      })

      // simulate delayed connections

      setTimeout(() => {
        this.setState({
          connectedStatus: { ...this.state.connectedStatus, network: true }
        })
      }, ONE_SECOND)

      setTimeout(() => {
        this.setState({
          connectedStatus: { ...this.state.connectedStatus, ipfsGateway: true }
        })
      }, 2 * ONE_SECOND)

      setTimeout(() => {
        this.setState({
          connectedStatus: { ...this.state.connectedStatus, bridgeServer: true }
        })
      }, 3 * ONE_SECOND)
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { networkName, ipfsGateway, connectedStatus } = this.state

    return (
      <div className="nav-item connectivity dropdown">
        <a
          className="nav-link active dropdown-toggle"
          id="connectivityDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <div className="d-flex indicators align-items-center">
            <span
              className={`blockchain indicator ml-auto${
                connectedStatus.network ? ' connected' : ''
              }`}
            />
            <span
              className={`gateway indicator m-1${
                connectedStatus.ipfsGateway ? ' connected' : ''
              }`}
            />
            <span
              className={`server indicator mr-auto${
                connectedStatus.bridgeServer ? ' connected' : ''
              }`}
            />
          </div>
        </a>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="connectivityDropdown"
        >
          <div className="triangle-container d-flex justify-content-end">
            <div className="triangle" />
          </div>
          <div className="actual-menu">
            <div className="connectivity-list">
              <ul className="list-group">
                <li className="connection d-flex flex-wrap">
                  <div
                    className={`indicator${
                      connectedStatus.network ? ' connected' : ''
                    }`}
                  />
                  <div className="name">
                    <strong>
                      <FormattedMessage
                        id={'connectivity.ethereumNetwork'}
                        defaultMessage={'Ethereum Network:'}
                      />
                    </strong>
                  </div>
                  <div className="ml-auto">
                    {connectedStatus.network ? (
                      networkName
                    ) : (
                      <FormattedMessage
                        id={'connectivity.connecting'}
                        defaultMessage={'Connecting...'}
                      />
                    )}
                  </div>
                </li>
                <li className="connection d-flex flex-wrap">
                  <div
                    className={`indicator${
                      connectedStatus.ipfsGateway ? ' connected' : ''
                    }`}
                  />
                  <div className="name">
                    <strong>
                      <FormattedMessage
                        id={'connectivity.ipfsGateway'}
                        defaultMessage={'IPFS Gateway:'}
                      />
                    </strong>
                  </div>
                  <div className="ml-auto">
                    {connectedStatus.ipfsGateway ? (
                      ipfsGateway
                    ) : (
                      <FormattedMessage
                        id={'connectivity.connecting'}
                        defaultMessage={'Connecting...'}
                      />
                    )}
                  </div>
                </li>
                <li className="connection d-flex flex-wrap">
                  <div
                    className={`indicator${
                      connectedStatus.bridgeServer ? ' connected' : ''
                    }`}
                  />
                  <div className="name">
                    <strong>
                      <FormattedMessage
                        id={'connectivity.bridgeServer'}
                        defaultMessage={'Bridge Server:'}
                      />
                    </strong>
                  </div>
                  <div className="ml-auto">
                    {connectedStatus.bridgeServer ? (
                      bridgeServerDomain
                    ) : (
                      <FormattedMessage
                        id={'connectivity.connecting'}
                        defaultMessage={'Connecting...'}
                      />
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default injectIntl(ConnectivityDropdown)
