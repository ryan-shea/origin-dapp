import React, { Component } from 'react'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'

import { showAlert } from 'actions/Alert'

// Components
import Listings from './listings-grid'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = { translatorsInvited: false }
  }

  inviteTranslators() {
    const messages = defineMessages({
      inviteTranslators: {
        id: 'homepage.invite-translators',
        defaultMessage: `You are currently viewing a machine translated version of this page. It probably has some mistakes. If you would like to assist us in fixing some of these errors please click here to register to help us. We would love your help.`
      }
    })
    const message = this.props.intl.formatMessage(messages.inviteTranslators)

    this.setState({ translatorsInvited: true }, () => {
      this.props.showAlert(message, true)
    })
  }

  componentDidUpdate() {
    const currentLanguage = this.props.selectedLanguageAbbrev
    const english = currentLanguage === "en"

    // Invite users to contribute with translations if they're seeing a translated version
    if (!english && !this.state.translatorsInvited) {
      this.inviteTranslators()
    }
  }

  render() {
    return (
      <div className="container">
        <Listings />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  selectedLanguageAbbrev: state.app.translations.selectedLanguageAbbrev
})

const mapDispatchToProps = dispatch => ({
  showAlert: (message, sticky) => dispatch(showAlert(message, sticky)),
})

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(HomePage))
