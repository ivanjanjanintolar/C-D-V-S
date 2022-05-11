import PropTypes from 'prop-types'
import React from 'react'
import { CCallout, CLink } from '@coreui/react'

const DocsCallout = (props) => {
  const { content, name } = props

  const plural = name.slice(-1) === 's' ? true : false

  const _href = `https://cotrugli.org`

  return (
    <CCallout color="info" className="bg-white">
      {content
        ? content
        : `COTRUGLI Baas ${name} component ${
            plural ? 'have' : 'has'
          } been created as a a part of this document verifiable system utilising blockchain technology.`}
      <br />
      <br />
      For more information please visit our official{' '}
      <CLink href={_href} target="_blank">
        Website
      </CLink>
      .
    </CCallout>
  )
}

DocsCallout.propTypes = {
  content: PropTypes.string,
  href: PropTypes.string,
  name: PropTypes.string,
}

export default React.memo(DocsCallout)
