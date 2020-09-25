import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notifications } from 'expo';
export default class NotificacionesVista extends Component {
	constructor(props) { super(props); this.state = { display: false }; }
	componentDidMount() { Notifications.addListener(this._handleNotification); }
	_handleNotification = notification => {
		if (notification["data"]["actualizar"]) { this.setState(prevState => ({ display: !prevState["display"] })); }
	};
	onPress = () => { this.props["reload"](); this.setState(prevState => ({ display: !prevState["display"] })); }
	render() {
		const { display } = this.state;
		return (<TouchableOpacity style={{ marginEnd: 10, alignItems: "flex-end", display: (display) ? "flex" : "none" }}
			onPress={() => this.onPress()} >
			<Ionicons name="ios-refresh-circle" size={35} color="red" />
		</TouchableOpacity>)
	}
}