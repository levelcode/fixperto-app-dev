import React, { Component } from "react";
import { Text, AsyncStorage, ScrollView, View, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from "react-native-elements";
import { general, buttons, textos, inputs } from "../../style/style";
import * as FileSystem from 'expo-file-system';
import { NavigationEvents } from 'react-navigation';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class IngresoVista extends Component {
	constructor(props) { super(props); this.state = { contenido: {}, passShow: "ios-eye", textoAlert: "", showAlert: false, show: false, buttonDisabled: false, email: "", password: "", show_password: true }; }
	validacion = () => {
		FileSystem.getInfoAsync(FileSystem.documentDirectory + '/config.json')
			.then(({ exists, isDirectory }) => {
				if (!exists) {
					FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: false, vista: "Ingreso", registered: false, validate_number: false, user: {}, notifications: [] }))
					this.setState({ passShow: "ios-eye", show: true, contenido: { logged: false, vista: "Ingreso", registered: false, validate_number: false, user: {}, notifications: [] } });
					globalThis.tokenAuth = "";
				}
				else {
					FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json')
						.then((contenido) => {
							contenido = JSON.parse(contenido);
							globalThis.tokenAuth = contenido["user"]["tokenAuth"];
							if (contenido["registered"]) {
								if (contenido["validate_number"]) {
									if (contenido["logged"]) {
										AsyncStorage.setItem("@USER", JSON.stringify(contenido["user"]));
										if (contenido["user"]["type"] === "cliente") this.props["navigation"].navigate("BottomNavigatorCliente");
										else this.props["navigation"].navigate("BottomNavigatorFixperto");
									} else this.setState({ passShow: "ios-eye", show: true, contenido });
								} else {
									if (contenido["user"]["type"] === "cliente") { this.props["navigation"].navigate("ValidarPhone", { to: "BottomNavigatorCliente" }); }
									else if (contenido["user"]["type"] === "independiente") { this.props["navigation"].navigate("ValidarPhone", { to: "RegistroProfesional3", informacion: {} }); }
									else if (contenido["user"]["type"] === "empresa") { this.props["navigation"].navigate("ValidarPhone", { to: "RegistroEmpresa2", informacion: {} }); }
								}
							}
							else { this.setState({ passShow: "ios-eye", show: true, contenido }); }
						})
				}
			})
	}
	ingresar() {
		if (this.state["email"] !== "" && this.state["password"] !== "") {
			if (!this.validateEmail(this.state["email"])) {
				this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" })
			}
			else {
				this.setState({ buttonDisabled: true });
				AsyncStorage.getItem("token").then((token) => {
					token = JSON.parse(token);
					return fetch(url + 'seguridad/login', {
						method: "POST",
						headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
						body: JSON.stringify({ email: this.state["email"], password: this.state["password"], token })
					}).then(response => response.json()).then(responseJson => {
						this.setState({ buttonDisabled: false });
						if (responseJson.success && responseJson["user"].length) {
							var state = this.state;
							for (const key in state) { state[key] = (key === "show_password") ? true : (key === "buttonDisabled") ? false : (key === "contenido") ? state[key] : ""; }
							this.setState(state);
							var user = responseJson["user"][0];
							globalThis.tokenAuth = user["tokenAuth"];
							if (user["type"] === "independiente" || user["type"] === "empresa") {
								AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: user["tokenAuth"], phone: user["phone"], insured: 1, evaluation: (user["evaluation"]) ? user["evaluation"] : 0, plan: user["plan"], userId: user["id"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], email: user["email"], token, photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false, codigo: user["codigo"], cant_fitcoints: user["fitcoints"], planId: user["planId"], planPrice: user["planPrice"], planUri: user["planUri"], planEnd: user["planEnd"], planStatus: user["planStatus"] }));
								FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ notifications: this.state["contenido"]["notifications"], logged: true, registered: true, validate_number: true, user: { tokenAuth: user["tokenAuth"], phone: user["phone"], plan: user["plan"], evaluation: (user["evaluation"]) ? user["evaluation"] : 0, userId: user["id"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], email: user["email"], token, photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false, codigo: user["codigo"], cant_fitcoints: user["fitcoints"], planId: user["planId"], planPrice: user["planPrice"], planUri: user["planUri"], planEnd: user["planEnd"], planStatus: user["planStatus"] } }))
								if (user["validate_number"] === 0) {
									this.props["navigation"].navigate("ValidarPhone", { to: "BottomNavigatorFixperto" });
								}
								else { this.props["navigation"].navigate("BottomNavigatorFixperto"); }
							}
							else {
								AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: user["tokenAuth"], phone: user["phone"], insured: 1, evaluation: (user["evaluation"]) ? user["evaluation"] : 0, userId: user["id"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], email: user["email"], token, photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false }));
								FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ notifications: this.state["contenido"]["notifications"], logged: true, registered: true, validate_number: true, user: { tokenAuth: user["tokenAuth"], phone: user["phone"], evaluation: (user["evaluation"]) ? user["evaluation"] : 0, userId: user["id"], type: user["type"], id: user["id"], typeId: user["typeId"], avatar: user["avatar"], name: user["name"], email: user["email"], token, photo: user["photo"], notification: (user["notification"] === 1) ? true : false, notification_chat: (user["notification_chat"] === 1) ? true : false } }))
								if (user["validate_number"] === 0)
									this.props["navigation"].navigate("ValidarPhone", { to: "BottomNavigatorCliente" });
								else this.props["navigation"].navigate("BottomNavigatorCliente");
							}
						}
						else {
							this.setState({ showAlert: true, textoAlert: "Correo o contraseña incorrecta, inténtelo nuevamente" });
						}
					}).catch((error) => {
						this.setState({ buttonDisabled: false });
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
				})
			}
		}
		else { this.setState({ showAlert: true, textoAlert: "Existen campos vacios" }); }
	}
	validateEmail = email => { let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; return reg.test(email.trim()); };
	render() {
		return (
			(!this.state["show"]) ? <View style={{ flex: 1, backgroundColor: "#273861" }}>
				<NavigationEvents onWillFocus={payload => { this.validacion() }} />
			</View> :
				<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
					extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#273861" }}>
					<ScrollView style={{ flex: 1, backgroundColor: "#273861" }}>
						<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
						<NavigationEvents onWillFocus={payload => { this.validacion() }} />
						<Text style={textos.titulos}>Bienvenido</Text>
						<Text style={textos.textcopy}>Todo lo que necesitas en arreglos para tu <Text style={[textos.bold, { fontFamily: "Raleway-Bold" }]}>casa, oficina y trabajo</Text> en un sólo lugar.</Text>
						<Text style={inputs.text}>Email</Text>
						<Input
							inputContainerStyle={{ borderColor: "silver", borderWidth: 0.5, backgroundColor: "#D5D5D5", borderRadius: 5, marginHorizontal: 10 }}
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							leftIcon={<Ionicons name="ios-mail" size={20} color="#FFFFFF" style={{ marginEnd: 15 }} />}
							leftIconContainerStyle={{ backgroundColor: "#D5D5D5" }}
							value={this.state["email"]}
							onChangeText={(email) => { this.setState({ email }) }}
						/>
						<Text style={inputs.text}>Contraseña</Text>
						<Input
							secureTextEntry={this.state["show_password"]}
							inputContainerStyle={{ borderColor: "silver", borderWidth: 0.5, backgroundColor: "#D5D5D5", borderRadius: 5, marginHorizontal: 10 }}
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							leftIcon={<Ionicons name="ios-lock" size={20} color="#FFFFFF" style={{ marginEnd: 15 }} />}
							leftIconContainerStyle={{ backgroundColor: "#D5D5D5" }}
							value={this.state["password"]}
							onChangeText={(password) => { this.setState({ password }) }}
							rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
							rightIcon={<Ionicons name={this.state["passShow"]} size={20} color="#D5D5D5" onPress={() => {
								this.setState({
									show_password: !this.state["show_password"],
									passShow: (this.state["show_password"]) ? "ios-eye-off" : "ios-eye"
								})
							}}
							/>}
						/>
						<Button title="INGRESAR" buttonStyle={[buttons.primary, general.espacio1]}
							titleStyle={[buttons.PrimaryText, { fontFamily: "Raleway-Bold" }]}
							onPress={() => this.ingresar()}
						/>
						<Button title="REGISTRARME" buttonStyle={buttons.secondary} type="outline"
							disabled={this.state["buttonDisabled"]}
							titleStyle={[buttons.SecondaryText, { fontFamily: "Raleway-Bold" }]}
							onPress={() => { this.props["navigation"].navigate("Home") }}
						/>
						<Text style={{ fontSize: 15, color: "#2CA4BF", fontFamily: "Raleway-Bold", textAlign: "center", marginVertical: 5 }}
							onPress={() => { this.props["navigation"].navigate("OlvidoPassword") }}
						>¿Olvidaste tu contraseña?</Text>
					</ScrollView>
				</KeyboardAwareScrollView>
		)
	}
}
