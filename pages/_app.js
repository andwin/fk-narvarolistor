import React from 'react'
import PropTypes from 'prop-types'
import '../styles/styles.scss'

const MyApp = ({ Component, props }) => <Component {...props} />

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  props: PropTypes.object,
}

MyApp.defaultProps = {
  props: {},
}

export default MyApp
