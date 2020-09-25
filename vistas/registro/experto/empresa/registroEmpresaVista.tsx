import React, { Component } from 'react';
import { View, ScrollView, Image, Platform, AsyncStorage, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, CheckBox } from 'react-native-elements';
import DocumentVista from "../../../../componentes/documentVista";
import Copy from "../../../../componentes/copyVista";
import { NavigationEvents } from 'react-navigation';
import Modal from "react-native-modal";
import Cargador from "../../../../componentes/cargador";
import AlertModal from "../../../../componentes/alertView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as FileSystem from 'expo-file-system';
import { url } from "../../../../componentes/config";
export default class RegistroEmpresaVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passShow: "ios-eye", confShow: "ios-eye",
			textoAlert: "", showAlert: false, check: false,
			cargador: false, buttonDisabled: false, isModalVisible: false, term_condition: false, politica_privacidad: false,
			photo: "", name: "", nit: "", email: "", phone: "", hidden_password: true, password: "", hidden_repeat_password: true, repeat_password: "", coupon: false, coupon_number: ""
		}
	}
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "RegistroEmpresa" }); }
	showVista = (state) => {
		if (state["params"] && state["params"]["photos"].length > 0) {
			this.setState(prevState => ({ photo: state["params"]["photos"][0] }));
			this.props["navigation"].setParams({ photos: [] });
		}
	}
	continuar = () => {
		let vacios = [];
		//if (this.state["photo"] === "") { vacios.push("  *Foto"); }
		if (this.state["name"] === "") { vacios.push("  *Nombre de la empresa"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["nit"] === "") { vacios.push("  *Nit"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		if (this.state["password"] === "") { vacios.push("  *Contraseña"); }
		if ((this.state["coupon"] === true && this.state["coupon_number"] === "")) { vacios.push("  *Cupón"); }
		if (this.state["term_condition"] === false) { vacios.push("  *Términos y condiciones"); }
		if (this.state["politica_privacidad"] === false) { vacios.push("  *Política y privacidad"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
		}
		else {
			if (this.state["password"] !== this.state["repeat_password"]) {
				return this.setState({ showAlert: true, textoAlert: "Contraseña distinta a su confirmación" });
			}
			else if (this.state["password"].length <= 5) {
				return this.setState({ showAlert: true, textoAlert: "La contraseña debe de tener más de 6 caracteres" });
			}
			else if (!this.validateEmail(this.state["email"].trim())) {
				return this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
			}
			else if (!this.validateNit(this.state["nit"].trim())) {
				return this.setState({ showAlert: true, textoAlert: "Nit inválido, por favor verifíquelo. Formato: XXXXXXXXX-X" });
			}
			else if (!this.validatePhone(this.state["phone"].trim())) {
				return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" });
			}
			else if (!this.validateName(this.state["name"].trim())) {
				return this.setState({ showAlert: true, textoAlert: "Nombre y apellido, por favor verifíquelo" });
			}
			else {
				this.setState({ buttonDisabled: true, cargador: true });
				AsyncStorage.getItem("token").then((token) => {
					token = JSON.parse(token);
					var codigo = Math.random().toString(36).substring(10, 15) + Math.random().toString(36).substring(12, 15);
					const createFormData = () => {
						const convertirImagen = (result) => {
							var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
							name = name + "_" + Date.now().toString();
							let localUri = result.uri;
							let filename = localUri.split('/').pop();
							let match = /\.(\w+)$/.exec(filename);
							let type = match ? `image/${match[1]}` : `image`;
							return { uri: localUri, name: name + match[0], type }
						}
						const data = new FormData();
						data.append("token", token);
						data.append("code", codigo);
						Object.keys(this.state).forEach(key => {
							switch (key) {
								case "photo": if (this.state["photo"] !== "")
									data.append("documentos", convertirImagen(this.state[key]));
									break;
								case "coupon": if (this.state["coupon"] === true)
									data.append("coupon", this.state["coupon_number"]);
									break;
								default: if (key !== "politica_privacidad" && key !== "term_condition" && key !== "repeat_password" && key !== "buttonDisabled" && key !== "isModalVisible" && key !== "coupon" && key !== "coupon_number")
									data.append(key, this.state[key]);
									break;
							}
						});
						return data;
					};
					return fetch(url + "fixpertoEmpresa/addEmpresa", {
						method: "POST", headers: { Accept: 'application/json' }, body: createFormData()
					}).then(response => response.json()).then(responseJson => {
						this.setState({ buttonDisabled: false, cargador: false });
						if (responseJson.success) {
							globalThis.tokenAuth = responseJson.user.tokenAuth;
							this.setState({ check: true, showAlert: true, textoAlert: "Se ha registrado exitosamente, por favor continue digitalizando otros datos de interés" });
							AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], plan: 0, insured: 1, userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, avatar: responseJson.user.avatar, name: this.state["name"], email: this.state["email"], token, notification: true, notification_chat: true, codigo: responseJson.user.codigo, cant_fitcoints: responseJson.user.fitcoints, type: "empresa", planId: responseJson.user.planId, planUri: "regalo", planEnd: responseJson.user.planEnd, planPrice: false, planStatus: "active", code_number: responseJson.user.code_number }));
							FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: false, registered: true, validate_number: false, user: { tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], plan: 0, insured: 1, userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, avatar: responseJson.user.avatar, name: this.state["name"], email: this.state["email"], token, notification: true, notification_chat: true, codigo: responseJson.user.codigo, cant_fitcoints: responseJson.user.fitcoints, type: "empresa", planId: responseJson.user.planId, planUri: "regalo", planEnd: responseJson.user.planEnd, planPrice: false, planStatus: "active", code_number: responseJson.user.code_number } }));
							this.props["navigation"].navigate("ValidarPhone");
						}
						else {
							if (responseJson.existe) { this.toggleModal(); }
							else if (responseJson.noCoupon) { this.setState({ showAlert: true, textoAlert: "Cupón inválido, verifíquelo" }); }
						}
					}).catch((error) => {
						this.setState({ buttonDisabled: false, cargador: false });
						if (error.message === 'Timeout' || error.message === 'Network request failed') {
							this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
						}
					})
				})
			}
		}
	}
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email); };
	validateNit = nit => { let reg = /^[0-9]{9}-[0-9]{1}$/; return reg.test(nit); };
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	validateName = name => { let reg = /^[0-9_A-Za-zÁÉÍÓÚñáéíóúÑ \.-]{2,254}$/; return reg.test(name); };
	render() {
		const { photo, check } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal check={check} texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<Cargador show={this.state["cargador"]} texto="Bienvenido. Estamos creando tu cuenta..." modal={true} />
					<View style={{ backgroundColor: "silver" }}>
						<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 1 de 5</Text>
					</View>
					<NavigationEvents onDidFocus={payload => { this.showVista(payload["state"]) }} />
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>Queremos saber más de ti</Text>
						<Image source={(photo !== "") ? { uri: photo.uri } : require("../../../../assets/icon.png")} style={{ width: 120, height: 120, marginBottom: 5 }} />
						<View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", marginRight: 5, padding: 3 }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12 }}
								onPress={() => this.openCamera()}
								icon={<Ionicons name="ios-camera" size={25} style={{ marginHorizontal: 5 }} color="#42AECB" />}
							/>
							<DocumentVista selectDocuments={(photo) => { this.setState(prevState => ({ photo })); }} />
						</View>
						<Copy texto="Busca una foto que muestre muy bien tu cara, esto es muy importante para generar confianza en tus clientes." />
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Empresa *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 0 }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["name"]} onChangeText={(name) => this.setState({ name })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Nit de la empresa *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 0 }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["nit"]} onChangeText={(nit) => this.setState({ nit })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Correo de la empresa *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 0 }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["email"]} onChangeText={(email) => this.setState({ email })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Teléfono *</Text>
						<Input
							keyboardType='numeric'
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 0 }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Contraseña *</Text>
						<Input
							secureTextEntry={this.state["hidden_password"]}
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							inputContainerStyle={{ marginHorizontal: 0, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
							rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
							value={this.state["password"]} onChangeText={(password) => this.setState({ password })}
							rightIcon={<Ionicons name={this.state["passShow"]} size={25} color="#D5D5D5" onPress={() => {
								this.setState({
									hidden_password: !this.state["hidden_password"],
									passShow: (this.state["hidden_password"]) ? "ios-eye-off" : "ios-eye"
								})
							}} />}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Repetir Contraseña *</Text>
						<Input
							secureTextEntry={this.state["hidden_repeat_password"]}
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							inputContainerStyle={{ marginHorizontal: 0, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
							rightIconContainerStyle={(Platform.OS === 'ios') ? { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 5 } : { backgroundColor: "#FFFFFF", borderTopRightRadius: 7, borderBottomRightRadius: 7, marginLeft: 0, padding: 15 }}
							value={this.state["repeat_password"]} onChangeText={(repeat_password) => this.setState({ repeat_password })}
							rightIcon={<Ionicons name={this.state["confShow"]} size={25} color="#D5D5D5" onPress={() => {
								this.setState({
									hidden_repeat_password: !this.state["hidden_repeat_password"],
									confShow: (this.state["hidden_repeat_password"]) ? "ios-eye-off" : "ios-eye"
								})
							}} />}
						/>
					</View>
					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>
					<CheckBox containerStyle={{ backgroundColor: "#FFFFFF", borderWidth: 0, marginLeft: 12 }}
						title={<Text style={{ fontSize: 14, }}>¿Tienes un cupón de referido?</Text>}
						checked={this.state["coupon"]} checkedColor="#3D99B9"
						onPress={() => { this.setState({ coupon: !this.state["coupon"] }) }}
					/>
					<View style={{ display: (this.state["coupon"]) ? "flex" : "none", backgroundColor: "#FFFFFF", marginHorizontal: 20, borderColor: "#BFBFBF", borderRadius: 5, paddingTop: 8, borderWidth: 1, marginBottom: 20, paddingBottom: 0 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#BFBFBF", fontFamily: "Raleway-Bold", lineHeight: 14 }}>Cupón *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["coupon_number"]} onChangeText={(coupon_number) => this.setState({ coupon_number })}
						/>
					</View>
					<CheckBox
						containerStyle={{ borderWidth: 0, marginLeft: 12, }}
						title={<View>
							<View style={{ flexDirection: "column" }}>
								<Text onPress={() => { this.props["navigation"].navigate("TerminosCondiciones") }}
									style={{ textAlign: "left", textDecorationLine: 'underline', color: "#3D99B9", fontFamily: "Raleway-Bold", fontSize: 14, paddingLeft: 5 }}>Acepto términos y condiciones </Text>
							</View>
						</View>}
						checked={this.state["term_condition"]}
						checkedColor="#3D99B9"
						onPress={() => { this.setState({ term_condition: !this.state["term_condition"] }) }}
					/>
					<CheckBox
						containerStyle={{ borderWidth: 0, marginLeft: 12, }}
						title={<View>
							<View style={{ flexDirection: "column" }}>
								<Text onPress={() => { this.props["navigation"].navigate("PoliticasPrivacidad") }}
									style={{ textAlign: "left", textDecorationLine: 'underline', color: "#3D99B9", fontFamily: "Raleway-Bold", fontSize: 14, paddingLeft: 5, marginRight: 5 }}>Bajo la política y privacidad autorizo el uso de mis datos
									personales </Text>
							</View>
						</View>}
						checked={this.state["politica_privacidad"]}
						checkedColor="#3D99B9"
						onPress={() => { this.setState({ politica_privacidad: !this.state["politica_privacidad"] }) }}
					/>
					<Button title="CONTINUAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7, paddingVertical: 15 }}
						disabled={this.state["buttonDisabled"]}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.continuar()} />
					<Modal isVisible={this.state["isModalVisible"]}>
						<View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, justifyContent: "center" }}>
							<View style={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}>
								<View style={{ alignItems: "center", marginTop: 10 }}>
									<Image source={require("../../../../assets/iconos/cancelar.png")} style={{ width: 50, height: 50 }} />
								</View>
								<Text style={{ marginVertical: 10, textAlign: "center" }}>Correo en uso por favor modifíquelo</Text>
								<Button title="ACEPTAR"
									buttonStyle={{ borderColor: "#49B0CD", borderRadius: 7 }}
									titleStyle={{ fontFamily: "Raleway-Bold", color: "#FFFFFF" }}
									containerStyle={{ marginHorizontal: 25, marginBottom: 20 }}
									onPress={() => { this.toggleModal() }}
								/>
							</View>
						</View>
					</Modal>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}