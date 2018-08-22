import React, { Component, Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

import { localizeApp, setMobile } from 'actions/App'
import { fetchProfile } from 'actions/Profile'
import { init as initWallet } from 'actions/Wallet'

// Components
import Alert from 'components/alert'
import Layout from 'components/layout'
import ListingCreate from 'components/listing-create'
import ListingDetail from 'components/listing-detail'
import ListingsGrid from 'components/listings-grid'
import Messages from 'components/messages'
import MessagingProvider from 'components/messaging-provider'
import MyListings from 'components/my-listings'
import MyPurchases from 'components/my-purchases'
import MySales from 'components/my-sales'
import NotFound from 'components/not-found'
import Notifications from 'components/notifications'
import PurchaseDetail from 'components/purchase-detail'
import ScrollToTop from 'components/scroll-to-top'
import Web3Provider from 'components/web3-provider'
import SearchResult from 'components/search/search-result'

import Profile from 'pages/profile/Profile'
import User from 'pages/user/User'
import SearchBar from 'components/search/searchbar'

import 'bootstrap/dist/js/bootstrap'

// CSS
import 'bootstrap/dist/css/bootstrap.css'
import '../css/lato-web.css'
import '../css/poppins.css'
import '../css/app.css'

const HomePage = () => (
  <div>
    <SearchBar />
    <div className="container">
      <ListingsGrid renderMode='home-page' />
    </div>
  </div>
)

const ListingDetailPage = props => (
  <ListingDetail
    listingAddress={props.match.params.listingAddress}
    withReviews={true}
  />
)

const CreateListingPage = () => (
  <div className="container">
    <ListingCreate />
  </div>
)

const PurchaseDetailPage = props => (
  <PurchaseDetail offerId={props.match.params.offerId} />
)

const UserPage = props => <User userAddress={props.match.params.userAddress} />

// Top level component
class App extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.localizeApp()
  }

  componentDidMount() {
    this.props.fetchProfile()
    this.props.initWallet()

    this.detectMobile()
  }

  /**
   * Detect if accessing from a mobile browser
   * @return {void}
   */
  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera

    if (/android/i.test(userAgent)) {
      this.props.setMobile('Android')
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      this.props.setMobile('iOS')
    } else {
      this.props.setMobile(null)
    }
  }

  render() {
    return this.props.selectedLanguageCode ? (
      <IntlProvider
        locale={this.props.selectedLanguageCode}
        defaultLocale="en-US"
        messages={this.props.messages}
        textComponent={Fragment}
      >
        <Router>
          <ScrollToTop>
            <Web3Provider>
              <MessagingProvider>
                <Layout>
                  <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/page/:activePage" component={HomePage} />
                    <Route
                      path="/listing/:listingAddress"
                      component={ListingDetailPage}
                    />
                    <Route path="/create" component={CreateListingPage} />
                    <Route path="/my-listings" component={MyListings} />
                    <Route
                      path="/purchases/:offerId"
                      component={PurchaseDetailPage}
                    />
                    <Route path="/my-purchases" component={MyPurchases} />
                    <Route path="/my-sales" component={MySales} />
                    <Route
                      path="/messages/:conversationId?"
                      component={Messages}
                    />
                    <Route path="/notifications" component={Notifications} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/users/:userAddress" component={UserPage} />
                    <Route path="/search" component={SearchResult} />
                    <Route component={NotFound} />
                  </Switch>
                </Layout>
                <Alert />
              </MessagingProvider>
            </Web3Provider>
          </ScrollToTop>
        </Router>
      </IntlProvider>
    ) : null // potentially a loading indicator
  }
}

const mapStateToProps = state => ({
  messages: state.app.translations.messages,
  selectedLanguageCode: state.app.translations.selectedLanguageCode
})

const mapDispatchToProps = dispatch => ({
  fetchProfile: () => dispatch(fetchProfile()),
  initWallet: () => dispatch(initWallet()),
  setMobile: device => dispatch(setMobile(device)),
  localizeApp: () => dispatch(localizeApp())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
