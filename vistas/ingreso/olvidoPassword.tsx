import React, { Component } from "react";
import { Text, View, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class OlvidoPasswordVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, email: "" } }
	enviar() {
		if (this.state["email"] === "") {
			this.setState({ showAlert: true, textoAlert: "Por favor escriba un correo" });
		}
		else if (!this.validateEmail(this.state["email"])) {
			this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
		}
		else {
			return fetch(url + 'seguridad/olvidoPassword', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ email: this.state["email"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					if (responseJson.emailSend === true) {
						this.setState({ showAlert: true, textoAlert: "Le fue enviado su nueva contraseña al correo especificado" });
						setTimeout(() => { this.props["navigation"].goBack(); }, 2000);
					}
					else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
				}
				else {
					if (responseJson.noExiste) {
						this.setState({ showAlert: true, textoAlert: "No existe registro con el correo especificado, por favor revíselo" });
					}
					else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	validateEmail = email => { let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; return reg.test(email.trim()); };
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#273861" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<View style={{ flex: 1, backgroundColor: "#273861" }}>
					<Text style={{ fontSize: 20, textAlign: "center", fontFamily: "Raleway-Bold", color: "#FFFFFF", marginTop: 40, marginHorizontal: 20 }}>Te enviaremos un código a tu email para restablecer tu contraseña.</Text>
					<View style={{ marginVertical: 60, justifyContent: "center" }}>
						<Text style={{ fontSize: 15, color: "#FFFFFF", marginHorizontal: 10, fontFamily: "Raleway-Bold", marginBottom: 5 }}>Correo *</Text>
						<Input
							inputContainerStyle={{ borderColor: "silver", borderWidth: 0.5, backgroundColor: "#D5D5D5", borderRadius: 5 }}
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							leftIcon={<Ionicons name="ios-lock" size={20} color="#FFFFFF" style={{ marginEnd: 15 }} />}
							leftIconContainerStyle={{ backgroundColor: "#D5D5D5" }}
							value={this.state["email"]}
							onChangeText={(email) => { this.setState({ email }) }}
						/>
					</View>
					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>
					<Button title="ENVIAR" buttonStyle={{ backgroundColor: "#43AECC" }}
						type="solid" containerStyle={{ marginHorizontal: 20, marginVertical: 20, borderRadius: 7 }}
						onPress={() => { this.enviar() }}
					/>
				</View>
			</KeyboardAwareScrollView>
		)
	}
}