import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'

export default class AppButton extends Component {
  render() {
      const {action, title, bgColor, icon}=this.props;
    return (
      <Icon.Button
      name = {icon}
      backgroundColor={bgColor}
      onPress={action}
    >
      {title}
    </Icon.Button>
      
    );
  }
}
/* This component is made for creating buttons all over the project, 
some props are send when AppButton Component is called (action, title, bgColor,icon). 
This props are, as their name indicates, for setting action of the button, the title, 
the background colors, and the icon that is on the left */
/* This component is made for creating buttons all over the project,
some props are send when AppButton Component is called (action, title, bgColor,icon).
This props are, as their name indicates, for setting action of the button, the title,
the background colors, and the icon that is on the left */