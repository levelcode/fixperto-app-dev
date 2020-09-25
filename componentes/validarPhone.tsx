import React, { Component } from 'react';
import { Text, View, StyleSheet, AsyncStorage, Modal } from 'react-native';
import { Button, Input } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import AlertModal from "./alertView";
import { Ionicons } from '@expo/vector-icons';
import { buttons } from "../style/style";
import { url } from "./config";
export default class ValidarPhoneVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, code_number: "", isModalVisibleShangePhone: false, new_phone: "", user: {} } }
	componentDidMount() { AsyncStorage.getItem("@USER").then((user) => { user = JSON.parse(user); this.setState({ user }); }) }
	enviar = () => {
		var user = this.state["user"];
		return fetch(url + 'seguridad/validatePhone', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: user["id"], code_number: this.state["code_number"], cliente: (user["type"] === "cliente") ? 1 : 0 })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				if (responseJson.validate) {
					if (user["type"] === "independiente" || user["type"] === "empresa") {
						AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: user["tokenAuth"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], token: user["token"], photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false, codigo: user["codigo"], cant_fitcoints: user["cant_fitcoints"], planId: user["planId"], planPrice: user["planPrice"], planUri: user["planUri"], planEnd: user["planEnd"], planStatus: user["planStatus"] }));
						FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: true, user: { tokenAuth: user["tokenAuth"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], token: user["token"], photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false, codigo: user["codigo"], cant_fitcoints: user["cant_fitcoints"], planId: user["planId"], planPrice: user["planPrice"], planUri: user["planUri"], planEnd: user["planEnd"], planStatus: user["planStatus"] } }))
						if (this.props["navigation"].getParam("to")) { this.props["navigation"].navigate(this.props["navigation"].getParam("to")); }
						else {
							if (user["type"] === "empresa") {
								this.props["navigation"].navigate("RegistroEmpresa2", { informacion: {} });
							} else this.props["navigation"].navigate("RegistroProfesional3", { informacion: {} });
						}
					}
					else {
						AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: user["tokenAuth"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], token: user["token"], photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false }));
						FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: true, user: { tokenAuth: user["tokenAuth"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], token: user["token"], photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false } }))
						this.props["navigation"].navigate("BottomNavigatorCliente");
					}
				}
				else { this.setState({ showAlert: true, textoAlert: "Código incorrecto, inténtelo nuevamente" }); }
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema inténtelo nuevamente" }); }

		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	reenviar = () => {
		var user = this.state["user"];
		return fetch(url + 'seguridad/reenviarCode', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ id: user["id"], type: user["type"] })
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.setState({ showAlert: true, textoAlert: "Se le ha enviado nuevamente el código" });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema inténtelo nuevamente" }); }
		}).catch((error) => {
			if (error.message === 'Timeout' || error.message === 'Network request failed') {
				this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
			}
		})
	}
	shangePhone = () => {
		if (this.validatePhone(this.state["new_phone"])) {
			var user = this.state["user"]; this.toggleShangePhone();
			return fetch(url + 'seguridad/shangePhone', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ user: user["id"], type: user["type"], phone: this.state["new_phone"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) { this.setState({ showAlert: true, textoAlert: "El teléfono ha sido cambiado" }); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema inténtelo nuevamente" }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
		else { return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" }); }
	}
	disabledVerificar = () => {
		if (this.state["code_number"] === "" || this.state["code_number"].length !== 4) return true;
		else return false;
	}
	toggleShangePhone = () => { this.setState(prevState => ({ isModalVisibleShangePhone: !prevState["isModalVisibleShangePhone"], new_phone: "" })); }
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	render() {
		return (
			<View style={styles.container}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<Text style={[styles.textPrincipal, { fontFamily: "Raleway-Bold" }]}>¡Ya estás registrado! Ahora verifiquemos tu cuenta</Text>
				<Text style={styles.text}>Ingresa el código de verificación que se te envió a tu equipo</Text>
				<View style={[styles.view]}>
					<Input
						containerStyle={styles.containerStyle}
						inputContainerStyle={styles.inputContainerStyle}
						keyboardType="numeric"
						inputStyle={[styles.inputStyle, { marginTop: 8, fontFamily: "Raleway-Regular" }]}
						maxLength={4}
						value={this.state["code_number"]}
						onChangeText={code_number => { this.setState({ code_number }); }}
					/>
				</View>
				<Button title="VERIFICAR CUENTA" buttonStyle={[buttons.primary, { marginTop: 15 }]}
					titleStyle={buttons.PrimaryText} onPress={() => this.enviar()}
					disabled={this.disabledVerificar()}
				/>
				<View style={[styles.view, { marginTop: 10 }]}>
					<Text style={[{ fontSize: 18 }]}>No recibiste el código</Text>
					<Text style={[styles.textAction]} onPress={() => { this.reenviar() }}>Reenviar</Text>
				</View>
				<Text style={[styles.textAction, { marginTop: 15 }]} onPress={this.toggleShangePhone}>CAMBIAR TELÉFONO</Text>
				<Modal visible={this.state["isModalVisibleShangePhone"]}>

					<Ionicons name="ios-close-circle" size={40} color="silver" onPress={this.toggleShangePhone} style={{ marginLeft: 300, marginVertical: 50 }} />

					<View style={{ flex: 1 }}>

						<View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>


							<Text style={{ fontSize: 22, marginBottom: 20, fontFamily: "Raleway-Bold", color: "#1B263C", textAlign: "center" }}>Nuevo número de teléfono *</Text>

							<Input
								inputStyle={{ fontFamily: "Raleway-Regular", paddingLeft: 10 }}
								keyboardType="numeric"
								inputContainerStyle={{ borderColor: "silver", borderWidth: 1, height: 60 }}
								value={this.state["new_phone"]} onChangeText={(new_phone) => this.setState({ new_phone })}
							/>

							<Button title="CAMBIAR NÚMERO" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
								titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
								onPress={() => this.shangePhone()}
							/>
						</View>

					</View>
				</Modal >
			</View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
	},
	view: { flexDirection: "row", alignItems: "center", marginTop: 25 },
	containerStyle: { width: 150, height: 60, borderWidth: 1, borderRadius: 25, borderColor: "gray", marginHorizontal: 3 },
	inputContainerStyle: { borderBottomWidth: 0 },
	inputStyle: { color: "#42AECB", fontSize: 30, textAlign: "center", fontFamily: "Raleway-Bold" },
	text: { textAlign: "center", marginHorizontal: 30, fontSize: 20 },
	textAction: { fontSize: 18, marginLeft: 5, color: "#42AECB", textDecorationLine: "underline", fontFamily: "Raleway-Bold" },
	textPrincipal: { marginVertical: 40, textAlign: "center", fontSize: 25, fontFamily: "Raleway-Bold", color: "#2B3065", marginHorizontal: 25 }
});