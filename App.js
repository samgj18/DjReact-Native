import React from 'react'
import Guest from './Applications/Navigation/Guest'
import Preloader from './Applications/Components/PreLoader'
import Logged from './Applications/Navigation/Logged'
import { connect } from 'react-redux';




class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loaded: true,
    }
  }


  render() {
    const { loaded } = this.state

    if (!loaded) {
      return (<Preloader />)
    }
   
     return <Logged/>
  
   
  }
}

const mapStateToProps = state => {

  return {
    isAuthenticated: state.auth.token !== null,
  }
}

export default connect(mapStateToProps)(App)