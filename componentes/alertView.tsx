import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import Modal from "react-native-modal";
import { general, alerts } from "../style/alerts";
export default class AlertModalVista extends Component {
	constructor(props) { super(props); }
	render() {
		return (
			<Modal
				isVisible={this.props["showAlert"] || false}
				animationIn="zoomIn"
				animationOut="zoomOut"
			>
				<View style={[general.container]}>
					<View style={[alerts.cont]}>
						{(this.props["check"])
							? <Image source={require('../assets/iconos/icono-ok.png')} style={[alerts.contAlertImg]} />
							: <View style={[alerts.borderAlert]}>
								<View style={[alerts.contAlert]}>
									<Image source={require('../assets/iconos/alert_icon.png')} style={[alerts.contAlertImg]} />
								</View>
							</View>
						}
						<Text style={[alerts.title]}>Información</Text>
					</View>
					<View style={[alerts.cont]}>
						<Text style={[alerts.desc]}>{this.props["texto"]}</Text>
						<Text style={[alerts.btnOk]}
							onPress={this.props["closeModal"]}>Aceptar</Text>
					</View>
				</View>
			</Modal>
		)
	}
}