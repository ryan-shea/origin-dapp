import React, { Component } from 'react'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import AvatarEditor from 'react-avatar-editor'
import readAndCompressImage from 'browser-image-resizer'

import Modal from 'components/modal'

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.nameRef = React.createRef()

    const { pic, firstName, lastName, description } = this.props.data
    this.state = {
      pic,
      firstName,
      lastName,
      description
    }

    this.intlMessages = defineMessages({
      descriptionPlaceholder: {
        id: 'EditProfile.descriptionPlaceholder',
        defaultMessage: 'Tell us a little something about yourself'
      },
      firstNamePlaceholder: {
        id: 'EditProfile.firstNamePlaceholder',
        defaultMessage: 'Your First Name'
      },
      lastNamePlaceholder: {
        id: 'EditProfile.lastNamePlaceholder',
        defaultMessage: 'Your Last Name'
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      setTimeout(() => {
        this.nameRef.current.focus()
      }, 500)
    }
  }

  blobToDataURL(blob) {
    return new Promise(resolve => {
      const a = new FileReader()
      a.onload = function(e) {
        resolve(e.target.result)
      }
      a.readAsDataURL(blob)
    })
  }

  render() {
    const { intl, open, handleToggle } = this.props

    return (
      <Modal isOpen={open} data-modal="profile" handleToggle={handleToggle}>
        <h2>
          <FormattedMessage
            id={'EditProfile.editProfileHeading'}
            defaultMessage={'Edit Profile'}
          />
        </h2>
        <form
          onSubmit={async e => {
            e.preventDefault()
            const data = {
              firstName: this.state.firstName,
              lastName: this.state.lastName,
              description: this.state.description
            }
            if (this.state.picChanged) {
              const canvas = this.imageEditor.getImage().toDataURL()
              const res = await fetch(canvas)
              const blob = await res.blob()
              const resized = await readAndCompressImage(blob, {
                quality: 1,
                maxWidth: 500,
                maxHeight: 500
              })
              data.pic = await this.blobToDataURL(resized)
            }
            this.props.handleSubmit({ data })
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="image-container">
                  <div className="image-pair">
                    <div className="avatar-container">
                      <AvatarEditor
                        ref={r => (this.imageEditor = r)}
                        image={this.state.pic || 'images/avatar-unnamed.svg'}
                        width={140}
                        height={140}
                        border={20}
                        borderRadius={20}
                        position={{ x: 0, y: 0 }}
                      />
                    </div>
                    <label className="edit-profile">
                      <img
                        src="images/camera-icon-circle.svg"
                        alt="camera icon"
                      />
                      <input
                        type="file"
                        ref={r => (this.editPic = r)}
                        style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
                        onChange={e => {
                          this.setState({
                            picChanged: true,
                            pic: e.currentTarget.files[0]
                          })
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="form-group">
                  <label htmlFor="first-name">
                    <FormattedMessage
                      id={'EditProfile.firstName'}
                      defaultMessage={'First Name'}
                    />
                  </label>
                  <input
                    type="text"
                    ref={this.nameRef}
                    name="firstName"
                    className="form-control"
                    value={this.state.firstName}
                    onChange={e =>
                      this.setState({ firstName: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.firstNamePlaceholder
                    )}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last-name">
                    <FormattedMessage
                      id={'EditProfile.lastName'}
                      defaultMessage={'Last Name'}
                    />
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="lastName"
                    className="form-control"
                    value={this.state.lastName}
                    onChange={e =>
                      this.setState({ lastName: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.lastNamePlaceholder
                    )}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                  <label htmlFor="description">
                    <FormattedMessage
                      id={'EditProfile.description'}
                      defaultMessage={'Description'}
                    />
                  </label>
                  <textarea
                    rows="4"
                    id="description"
                    name="description"
                    className="form-control"
                    value={this.state.description}
                    onChange={e =>
                      this.setState({ description: e.currentTarget.value })
                    }
                    placeholder={intl.formatMessage(
                      this.intlMessages.descriptionPlaceholder
                    )}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="explanation text-center">
                  <FormattedMessage
                    id={'EditProfile.publicDataNotice'}
                    defaultMessage={
                      'This information will be published on the blockchain and will be visible to everyone.'
                    }
                  />
                </div>
                <div className="button-container d-flex justify-content-center">
                  <button type="submit" className="btn btn-clear">
                    <FormattedMessage
                      id={'EditProfile.continue'}
                      defaultMessage={'Continue'}
                    />
                  </button>
                </div>
                <div className="link-container text-center">
                  <a href="#" data-modal="profile" onClick={handleToggle}>
                    <FormattedMessage
                      id={'EditProfile.cancel'}
                      defaultMessage={'Cancel'}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    )
  }
}

export default injectIntl(EditProfile)
