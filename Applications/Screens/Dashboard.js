import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { Text } from 'react-native-elements'
import Toast, { DURATION } from 'react-native-easy-toast'
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import PreLoader from '../Components/PreLoader'
import DashboardList from '../Components/DashboardList'
import * as actions from '../Stores/Actions/auth'



class Dashboard extends Component {
  constructor(props) {
    super(props)

    const { navigation } = this.props;
    const email = navigation.getParam('email', 'visitor@gmail.com');

    this.state = {
      email: email,
      articles: '',
      dropdown: true
    }
  }


  gotoDashboard() {
    this.props.navigation.navigate('Landing');
  }

  dropdownShow() {
    this.dropdown && this.dropdown.show();
    this.setState({
      dropdown: false
    })
  }

  dropdownHide() {
    this.dropdown.hide();
    this.setState({
      dropdown: true
    })
  }

  dropdownOnSelect(idx) {
    this.dropdownIdx = idx;
    if (this.dropdownIdx == 0) {
      this.refs.toast.show('Cerrando sesión', DURATION.LENGTH_LONG);
      this.props.onAuth()
      this.gotoDashboard();
    }
  }

  render() {
    const dropdownShowOrHide = this.state.dropdown ? this.dropdownShow.bind(this) : this.dropdownHide.bind(this);
    if (this.props.loading) {
      return (
        <PreLoader />
      )
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.UserHoover}>
            <Text h4
              style={{ alignSelf: 'center' }}
            >Dashboard</Text>
            <DashboardList />
            <View style={styles.UserLogout}>
              <Icon
                reverse
                name='ellipsis-h'
                type='font-awesome'
                color='black'
                onPress={dropdownShowOrHide}
              />
            </View>
            <ModalDropdown ref={el => this.dropdown = el}
              defaultValue=''
              options={['Cerrar sesión']}
              onSelect={this.dropdownOnSelect.bind(this)}
            />
          </View>
          <Toast
            ref="toast"
            style={{ backgroundColor: 'transparent' }}
            position='top'
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
            textStyle={{ color: 'black' }}
          />
        </View>
      )
    }
  }
}

/* This is the Component that User is redirected to when the successfully login or register passing all
the forms validations and connecting to database */

const styles = StyleSheet.create({

  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 11
  },
  UserHoover: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 50
  },
  UserLogout: {
    flex: 1,
    justifyContent: 'flex-end'
  }
});

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    loading: state.auth.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: () => dispatch(actions.logout())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
