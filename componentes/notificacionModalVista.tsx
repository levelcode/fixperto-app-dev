import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Modal from 'react-native-modal';
export default class NotificacionModalVista extends Component {
	constructor(props) { super(props); this.state = { notificacion: {} }; }
	showNotification = () => {
		this.setState({ notificacion: this.props["notification"]["data"] });
		setTimeout(() => { this.props["closeModal"](); }, 4000);
	}
	closeNotification = () => { this.props["closeModal"](); }
	selectedNotification = (notificacion) => {
		this.props["closeModal"]();
		if (notificacion["vista_data"]) {
			this.props["navigation"]["dispatch"](
				NavigationActions.navigate({ routeName: notificacion["vista"], params: notificacion["vista_data"] })
			);
		} else { NavigationActions.navigate({ routeName: notificacion["vista"] }) }
	}
	render() {
		const { notificacion } = this.state;
		return (
			<Modal backdropOpacity={0} isVisible={this.props["show"] || false} onModalShow={this.showNotification}
				onBackdropPress={this.closeNotification} 
			>
				<View style={{  marginHorizontal: 20, backgroundColor: "#ECF7F9", borderRadius: 7, padding: 20, borderColor: "#42AECB", borderWidth: 3, height : "auto", position : "absolute", top : 60, width : 90 + "%" }}>
					<TouchableHighlight
						onPress={() => { this.selectedNotification(notificacion) }}>
						<View >
							<Image source={require("../assets/iconos/alert.png")} style={{ width: 30, height: 30 }} />

							<Text style={{ fontFamily: "Raleway-Bold", fontSize: 17, color: "#2C3C5D", marginVertical: 5, marginHorizontal: 40, marginTop : -25 }}>{(notificacion["title"]) ? notificacion["title"] : ""}</Text>

							<Text style={{ fontFamily: "Raleway-Regular", fontSize: 15, color: "#2C3C5D", marginTop: 5, marginHorizontal : 10 }}>{(notificacion["texto"]) ? notificacion["texto"] : ""}</Text>

							<View style={{ position: "absolute", right: -10, }}>
								<Image source={require("../assets/iconos/continuar.png")} style={{ width: 20, height : 25 }} />
							</View>

						</View>
					</TouchableHighlight>
				</View>
			</Modal >
		)
	}
}