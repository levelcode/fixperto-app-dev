import React, { Component } from 'react';
import { Platform, AsyncStorage, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class ShangePasswordVista extends Component {
	constructor(props) {
		super(props); this.state = {
			passShow: "ios-eye", confShow: "ios-eye", newShow: "ios-eye",
			textoAlert: "", showAlert: false, hidden_pass: true, pass: "", hidden_new_pass: true, new_pass: "", hidden_confirm: true, confirm: "", buttonDisabled: false
		}
	}
	enviar() {
		if (this.state["pass"] === "" || this.state["new_pass"] === "" || this.state["confirm"] === "") {
			return this.setState({ showAlert: true, textoAlert: "Existe campo vacío" });
		}
		else if (this.state["new_pass"].length <= 5) {
			return this.setState({ showAlert: true, textoAlert: "La contraseña debe de tener más de 6 caracteres" });
		}
		else if (this.state["new_pass"] !== this.state["confirm"]) {
			return this.setState({ showAlert: true, textoAlert: "Nueva contraseña distinta de su confirmación" });
		}
		else {
			this.setState({ buttonDisabled: true });
			AsyncStorage.getItem("@USER").then((user) => {
				user = JSON.parse(user);
				return fetch(url + 'seguridad/shangePassword', {
					method: "POST",
					headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
					body: JSON.stringify({ id: user["id"], pass: this.state["pass"], new_pass: this.state["new_pass"] })
				}).then(response => response.json()).then(responseJson => {
					this.setState({ buttonDisabled: false });
					if (responseJson.success) {
						if (responseJson.emailSend === true) {
							this.setState({ showAlert: true, textoAlert: "Contraseña cambiada" });
							this.props["navigation"].goBack();
						}
						else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
					}
					else {
						if (responseJson.passIncorrecto) {
							this.setState({ showAlert: true, textoAlert: "Contraseña actual incorrecta, por favor corríjala" });
						}
						else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
					}
				})
					.catch((error) => {
						this.setState({ buttonDisabled: false });
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
			})
		}
	}
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Contraseña actual *</Text>
					<Input
						secureTextEntry={this.state["hidden_pass"]}
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
						value={this.state["pass"]} onChangeText={(pass) => this.setState({ pass })}
						rightIcon={<Ionicons name={this.state["passShow"]} size={25} color="#D5D5D5" onPress={() => {
							this.setState({
								hidden_pass: !this.state["hidden_pass"],
								passShow: (this.state["hidden_pass"]) ? "ios-eye-off" : "ios-eye"
							})
						}} />}
					/>
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Nueva contraseña *</Text>
					<Input
						secureTextEntry={this.state["hidden_new_pass"]}
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
						value={this.state["new_pass"]} onChangeText={(new_pass) => this.setState({ new_pass })}
						rightIcon={<Ionicons name={this.state["newShow"]} size={25} color="#D5D5D5" onPress={() => {
							this.setState({
								hidden_new_pass: !this.state["hidden_new_pass"],
								newShow: (this.state["hidden_new_pass"]) ? "ios-eye-off" : "ios-eye"
							})
						}} />}
					/>
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Repetir Contraseña *</Text>
					<Input
						secureTextEntry={this.state["hidden_confirm"]}
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 7, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 7 }}
						rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
						value={this.state["confirm"]} onChangeText={(confirm) => this.setState({ confirm })}
						rightIcon={<Ionicons name={this.state["confShow"]} size={25} color="#D5D5D5" onPress={() => {
							this.setState({
								hidden_confirm: !this.state["hidden_confirm"],
								confShow: (this.state["hidden_confirm"]) ? "ios-eye-off" : "ios-eye"
							})
						}} />}
					/>
					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>

					<Button title="GUARDAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						disabled={this.state["buttonDisabled"]}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.enviar()}
					/>
				</View>
			</KeyboardAwareScrollView >
		)
	}
}