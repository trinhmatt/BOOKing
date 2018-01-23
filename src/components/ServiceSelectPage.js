import React from 'react'
import {connect} from 'react-redux'
import ServiceSelect from './ServiceSelect'

const ServiceSelectPage = (props) => (
  <div>
    <ServiceSelect
      uid={props.match.params.uid}
      match={props.match}
      history={props.history}
    />
  </div>
)

export default connect()(ServiceSelectPage)
