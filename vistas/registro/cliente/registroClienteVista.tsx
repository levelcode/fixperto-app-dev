import React, { Component } from 'react';
import { View, ScrollView, AsyncStorage, Image, TouchableOpacity, Text, Platform } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { Input, CheckBox, Button } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentVista from "../../../componentes/documentVista";
import Modal from "react-native-modal";
import { buttons, textos } from "../../../style/style";
import Cargador from "../../../componentes/cargador";
import AlertModal from "../../../componentes/alertView";
import * as FileSystem from 'expo-file-system';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { url } from "../../../componentes/config";
export default class RegistroClienteVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passShow: "ios-eye", confShow: "ios-eye",
			textoAlert: "", showAlert: false, politica_privacidad: false,
			cargador: false, buttonDisabled: false, isModalVisible: false, photo: "", name: "", email: "", birth_date: "", show_birth_date: false, gender: 0, phone: "", hidden_password: true, password: "", hidden_repeat_password: true, repeat_password: "", term_condition: false
		}
	}
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "RegistroCliente" }); }
	showVista = (state) => {
		if (state["params"] && state["params"]["photos"].length > 0) {
			this.setState(prevState => ({ photo: state["params"]["photos"][0] }));
			this.props["navigation"].setParams({ photos: [] });
		}
	}
	formatDate = date => {
		let today = new Date(date);
		let fecha = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
		return fecha;
	}
	convertDateTime = date => {
		var fecha = new Date(date);
		return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	gender_type = [{ id: 0, denomination: 'Seleccione' }, { id: 1, denomination: 'Masculino' }, { id: 2, denomination: 'Femenino' }];
	continuar = () => {
		let vacios = [];
		//	if (this.state["photo"] === "") { vacios.push("  *Foto"); }
		if (this.state["name"] === "") { vacios.push("  *Nombre y Apellidos"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		//	if (this.state["birth_date"] === "") { vacios.push("  *Fecha de nacimiento"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		if (this.state["password"] === "") { vacios.push("  *Contraseña"); }
		if (this.state["term_condition"] === false) { vacios.push("  *Términos y condiciones"); }
		if (this.state["politica_privacidad"] === false) { vacios.push("  *Política y privacidad"); }
		if (!vacios.length) {
			if (this.state["password"] !== this.state["repeat_password"]) {
				return this.setState({ showAlert: true, textoAlert: "Contraseña distinta a su confirmación" });
			}
			else if (this.state["password"].length <= 5) {
				return this.setState({ showAlert: true, textoAlert: "La contraseña debe de tener más de 6 caracteres" });
			}
			else if (!this.validateEmail(this.state["email"])) {
				return this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
			}
			else if (!this.validatePhone(this.state["phone"])) {
				return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" });
			}
			else if (!this.validateName(this.state["name"])) {
				return this.setState({ showAlert: true, textoAlert: "Nombre y apellido, por favor verifíquelo" });
			}
			else {
				this.setState({ cargador: true, buttonDisabled: true });
				AsyncStorage.getItem("token").then((token) => {
					token = JSON.parse(token);
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
						Object.keys(this.state).forEach(key => {
							switch (key) {
								case "photo":
									if (this.state["photo"] !== "")
										data.append("documentos", convertirImagen(this.state["photo"]));
									break;
								case "name":
									data.append("name", this.state["name"]);
									break;
								case "email":
									data.append("email", this.state["email"]);
									break;
								case "birth_date":
									if (this.state["birth_date"] !== "")
										data.append("birth_date", this.convertDateTime(this.state["birth_date"]));
									break;
								case "phone":
									data.append("phone", this.state["phone"]);
									break;
								case "password":
									data.append("password", this.state["password"]);
									break;
								case "gender":
									data.append("gender", this.state["gender"]);
									break;
							}
						});
						return data;
					};
					return fetch(url + 'seguridad/addCliente', {
						method: "POST", headers: { Accept: 'application/json' }, body: createFormData()
					}).then(response => response.json())
						.then(responseJson => {
							this.setState({ buttonDisabled: false, cargador: false });
							if (responseJson.success) {
								globalThis.tokenAuth = responseJson.user.tokenAuth;
								AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, type: "cliente", avatar: responseJson.user.avatar, notification: true, notification_chat: true, name: this.state["name"], email: this.state["email"], token, code_number: responseJson.user.code_number }));
								FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: false, registered: true, validate_number: false, user: { tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, type: "cliente", avatar: responseJson.user.avatar, notification: true, notification_chat: true, name: this.state["name"], email: this.state["email"], token, code_number: responseJson.user.code_number } }));
								this.props["navigation"].navigate("ValidarPhone");
							}
							else { if (responseJson.existe) { this.toggleModal(); } }
						}).catch((error) => {
							this.setState({ buttonDisabled: false, cargador: false });
							if (error.message === 'Timeout' || error.message === 'Network request failed') {
								this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
							}
						})
				})
			}
		}
		else { return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() }); }
	}
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	fechaAutorizada = () => { var fecha = new Date(); fecha.setFullYear(fecha.getFullYear() - 18); return fecha; }
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); }
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	render() {
		const { photo, birth_date, show_birth_date } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<Cargador show={this.state["cargador"]} texto="Bienvenido. Estamos creando tu cuenta..." modal={true} />
					<NavigationEvents onDidFocus={payload => { this.showVista(payload["state"]) }} />
					<Text style={[textos.titulos, textos.blue]}>Ingresa tus datos</Text>
					<Text style={textos.textcopydos}>Eres muy importante para nosotros, regálanos tus datos de contacto.</Text>
					<View style={{ alignItems: "center" }}>
						<Image source={(photo !== "") ? { uri: photo.uri } : require("../../../assets/icon.png")} style={{ width: 120, height: 120, marginBottom: 5 }} />
						<View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", marginRight: 10, padding: 3, }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12 }}
								onPress={() => this.openCamera()}
								icon={<Ionicons name="ios-camera" size={25} style={{ marginHorizontal: 5 }} color="#42AECB" />}
							/>
							<DocumentVista selectDocuments={(photo) => { this.setState(prevState => ({ photo })); }} />
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Nombre y Apellido *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["name"]} onChangeText={(name) => this.setState({ name })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Correo *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["email"]} onChangeText={(email) => { this.setState({ email }) }}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Fecha de nacimiento</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10 }}>
							<TouchableOpacity onPress={() => this.setState({ show_birth_date: true })}
								style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
								<Text style={{ marginLeft: 10, fontSize: 15, marginTop: 5 }}>{(birth_date !== "") ? this.formatDate(birth_date) : ""}</Text>
								<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, marginTop: 5, display: (birth_date !== "") ? "flex" : "none" }}
									onPress={() => { this.setState({ birth_date: "" }); }}
								/>
							</TouchableOpacity>
							{show_birth_date && <View>
								{Platform.OS === "ios" && <Button title="CONTINUAR"
									titleStyle={buttons.PrimaryText}
									onPress={() => { this.setState({ show_birth_date: false }); }}
								/>}
								<DateTimePicker
									testID="birthTimePicker"
									value={birth_date || this.fechaAutorizada()}
									maximumDate={this.fechaAutorizada()}
									onChange={(event, birth_date) => {
										if (Platform.OS === "android" && event["type"] === "set") {
											this.setState({ birth_date, show_birth_date: false });
										}
										else if (Platform.OS === "ios") {
											this.setState({ birth_date });
										}
									}}>
								</DateTimePicker>
							</View>
							}
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Género</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10, paddingTop: 3 }}>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								selectText="Seleccione"
								items={this.gender_type}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => { this.setState({ gender: selectedItems[0] }) }}
								selectedItems={[this.state["gender"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
							/>
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Teléfono *</Text>
						<Input
							keyboardType='numeric'
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Contraseña *</Text>
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
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Repetir Contraseña *</Text>
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
					<Button title="CONTINUAR" buttonStyle={buttons.primary}
						disabled={this.state["buttonDisabled"]}
						titleStyle={buttons.PrimaryText}
						containerStyle={{}}
						onPress={() => this.continuar()}
					/>
					<Modal isVisible={this.state["isModalVisible"]}>
						<View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, justifyContent: "center" }}>
							<View style={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}>
								<View style={{ alignItems: "center", marginTop: 10 }}>
									<Image source={require("../../../assets/iconos/cancelar.png")} style={{ width: 50, height: 50 }} />
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
			</KeyboardAwareScrollView >
		);
	}
}