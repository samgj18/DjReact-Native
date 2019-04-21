import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import Toast, { DURATION } from 'react-native-easy-toast'
import { Icon } from 'react-native-elements'
import ModalDropdown from 'react-native-modal-dropdown';
import PreLoader from '../Components/PreLoader'
import * as actions from '../Stores/Actions/auth'



class Login extends Component {
  constructor(props) {
    super(props)

    const { navigation } = this.props;
    const email = navigation.getParam('email');

    this.state = {
      email: email,
      dropdown: true
    }
    this.id = parseInt(this.props.id)
  }


  async componentDidMount() {
    if (this.id) {
      this.setState({
        isLoading: false
      })
    }
  }


  static navigationOptions = { title: '', header: null };
  gotoUserScreen() {
    this.props.navigation.navigate('Start');
  }

  gotoBleConf() {
    this.props.navigation.navigate('BleScreen', {
      userID: this.id,
    });
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
      this.gotoUserScreen();
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
            <Icon
              reverse
              name='leaf'
              type='font-awesome'
              color='rgba(58, 227, 116, 0.7)'
              onPress={() => console.log('hello')} />
            <Icon
              reverse
              name='send'
              type='font-awesome'
              color='#2f3542'
              onPress={() => console.log('hello')} />
            <Icon
              reverse
              name='bluetooth-b'
              type='font-awesome'
              color='#3498db'
              onPress={this.gotoBleConf.bind(this)} />
            <Icon
              reverse
              name='ellipsis-h'
              type='font-awesome'
              color='black'
              onPress={dropdownShowOrHide}
            />
            <ModalDropdown ref={el => this.dropdown = el}
              defaultValue=''
              options={['Cerrar sesión']}
              onSelect={this.dropdownOnSelect.bind(this)}
            />
          </View>
          <View style={styles.UserDashboard}>
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
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  UserDashboard: {
    flex: 5,
    justifyContent: 'flex-end',
    marginBottom: 15
  }
});

const mapStateToProps = state => {
  return {
    token: state.token,
    id: state.id,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: () => dispatch(actions.logout())
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)

