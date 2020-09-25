import React, { Component } from 'react';
import { Image, AsyncStorage, TouchableOpacity, Text } from 'react-native';
import { Notifications } from 'expo';
export default class CantFixcoinVista extends Component {
	constructor(props) { super(props); this.state = { cant_fitcoints: 0 }; }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ cant_fitcoints: user["cant_fitcoints"] }); });
		Notifications.addListener(this._handleNotification);
	}
	_handleNotification = notification => {
		if (notification["data"]["compra"]) {
			setTimeout(() => {
				AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ cant_fitcoints: user["cant_fitcoints"] }); });
			}, 2000);
		}
		else if (notification["data"]["actualizarFix"]) {
			setTimeout(() => {
				AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ cant_fitcoints: user["cant_fitcoints"] }); });
			}, 2000);
		}
		else if (notification["data"]["datos"] && notification["data"]["datos"]["type"] === "add_fixcoin") {
			setTimeout(() => {
				AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ cant_fitcoints: user["cant_fitcoints"] }); });
			}, 2000);
		}
	};
	render() {
		return (
			<TouchableOpacity onPress={() => { this.props["navigation"].navigate("Fixcoins") }}
				style={{ flexDirection: "row-reverse", padding: 5, alignItems: "center", marginVertical: 5 }}>
				<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", color: "#46ADCC", marginRight: 10, marginLeft: 5 }}>{this.state["cant_fitcoints"]}</Text>
				<Image source={require("../assets/iconos/fixcoin.png")} style={{ width: 20, height: 20 }} />
			</TouchableOpacity>
		)
	}
}