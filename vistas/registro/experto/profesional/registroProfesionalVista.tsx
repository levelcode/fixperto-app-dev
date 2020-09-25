import React, { Component } from 'react';
import { View, ScrollView, Platform, Image, TouchableOpacity, AsyncStorage, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { Input, CheckBox, Button } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentVista from "../../../../componentes/documentVista";
import Copy from "../../../../componentes/copyVista";
import Modal from "react-native-modal";
import { buttons } from "../../../../style/style";
import Cargador from "../../../../componentes/cargador";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../../componentes/alertView";
import * as FileSystem from 'expo-file-system';
import { url } from "../../../../componentes/config";
export default class RegistroProfesionalVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			passShow: "ios-eye", confShow: "ios-eye",
			textoAlert: "", showAlert: false, experiencia: 1, check: false,
			cargador: false, buttonDisabled: false, isModalVisible: false, term_condition: false, politica_privacidad: false,
			type: "numeric", photo: "", name: "", email: "", identification_type: 1, number: "", birth_date: "", show_birth_date: false,
			gender: 0, fotocopy: "", phone: "", hidden_password: true, password: "", hidden_repeat_password: true, repeat_password: "", coupon: false, coupon_number: ""
		}
	}
	continuar = () => {
		let vacios = [];
		//if (this.state["photo"] === "") { vacios.push("  *Foto"); }
		if (this.state["fotocopy"] === "") { vacios.push("  *Fotocopia de identificación"); }
		if (this.state["name"] === "") { vacios.push("  *Nombre y Apellidos"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["number"] === "") { vacios.push("  *Número de identificación"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		//	if (this.state["birth_date"] === "") { vacios.push("  *Fecha de nacimiento"); }
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
			else if (!this.validateEmail(this.state["email"])) {
				return this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
			}
			else if (!this.validatePhone(this.state["phone"])) {
				return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" });
			}
			else if (!this.validateName(this.state["name"])) {
				return this.setState({ showAlert: true, textoAlert: "Nombre y apellido, por favor verifíquelo" });
			}
			else if (this.state["identification_type"] !== 2 && !this.validateNumber(this.state["number"])) {
				return this.setState({ showAlert: true, textoAlert: "Número de identificación inválido, por favor verifíquelo" });
			}
			else {
				this.setState({ buttonDisabled: true, cargador: true });
				AsyncStorage.getItem("token").then((token) => {
					token = JSON.parse(token);
					var codigo = Math.random().toString(36).substring(10, 15) + Math.random().toString(36).substring(12, 15);
					const createFormData = () => {
						const convertirImagen = (result, n) => {
							var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
							name = name + "_" + Date.now().toString();
							let localUri = result.uri;
							let filename = localUri.split('/').pop();
							let match = /\.(\w+)$/.exec(filename);
							let type = match ? `image/${match[1]}` : `image`;
							if (match[1] === "pdf") type = `application/pdf`;
							return { uri: localUri, name: n + name + match[0], type }
						}
						const data = new FormData();
						data.append("token", token);
						data.append("code", codigo);
						Object.keys(this.state).forEach(key => {
							switch (key) {
								case "photo": if (this.state["photo"] !== "")
									data.append("documentos", convertirImagen(this.state[key], "avatar_"));
									break;
								case "fotocopy": if (this.state["fotocopy"] !== "")
									data.append("documentos", convertirImagen(this.state[key], "fotocopy_"));
									break;
								case "birth_date":
									if (this.state["birth_date"] !== "")
										data.append("birth_date", this.convertDateTime(this.state["birth_date"]));
									break;
								case "coupon": if (this.state["coupon"] === true)
									data.append("coupon", this.state["coupon_number"]);
									break;
								default: if (key !== "politica_privacidad" && key !== "term_condition" && key !== "coupon_number" && key !== "coupon" && key !== "show_birth_date" && key !== "repeat_password" && key !== "buttonDisabled" && key !== "isModalVisible" && key !== "type")
									data.append(key, this.state[key]);
									break;
							}
						});
						return data;
					};
					return fetch(url + "fixpertoProfesional/addProfesional", {
						method: "POST", headers: { Accept: 'application/json' }, body: createFormData()
					}).then(response => response.json()).then(responseJson => {
						this.setState({ buttonDisabled: false, cargador: false });
						if (responseJson.success) {
							globalThis.tokenAuth = responseJson.user.tokenAuth;
							this.setState({ check: true, showAlert: true, textoAlert: "Se ha registrado exitosamente, por favor continue digitalizando otros datos de interés" });
							AsyncStorage.setItem("@USER", JSON.stringify({ tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], insured: 1, plan: 0, userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, avatar: responseJson.user.avatar, name: this.state["name"], email: this.state["email"], token, notification: true, notification_chat: true, codigo: responseJson.user.codigo, cant_fitcoints: responseJson.user.fitcoints, type: "independiente", planId: responseJson.user.planId, planUri: "regalo", planEnd: responseJson.user.planEnd, planPrice: false, planStatus: "active", code_number: responseJson.user.code_number }));
							FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: false, registered: true, validate_number: false, user: { tokenAuth: responseJson.user.tokenAuth, phone: this.state["phone"], plan: 0, insured: 1, userId: responseJson.user.id, id: responseJson.user.id, typeId: responseJson.user.typeId, avatar: responseJson.user.avatar, name: this.state["name"], email: this.state["email"], token, photo: responseJson.user.avatar, notification: true, notification_chat: true, codigo: responseJson.user.codigo, cant_fitcoints: responseJson.user.fitcoints, type: "independiente", planId: responseJson.user.planId, planUri: "regalo", planEnd: responseJson.user.planEnd, planPrice: false, planStatus: "active", code_number: responseJson.user.code_number } }));
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
	experiencia =
		[{ id: 1, denomination: 'Menos de un año' },
		{ id: 2, denomination: 'Un año' },
		{ id: 3, denomination: 'De 2 a 3 años' },
		{ id: 4, denomination: 'De 3 a 5 años' },
		{ id: 5, denomination: 'De 5 a 10 años' },
		{ id: 6, denomination: 'Más de 10 años' }];
	identification_type = [{ id: 1, denomination: 'Cédula de ciudadanía' }, { id: 2, denomination: 'Pasaporte' }, { id: 3, denomination: 'Cédula de extranjería' }];
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "RegistroProfesional" }); }
	showVista = (state) => {
		if (state["params"] && state["params"]["photos"].length > 0) {
			this.setState(prevState => ({ photo: state["params"]["photos"][0] }));
			this.props["navigation"].setParams({ photos: [] });
		}
	}
	keyExtractor = (item, index) => index.toString();
	gender_type = [{ id: 0, denomination: 'Seleccione' }, { id: 1, denomination: 'Masculino' }, { id: 2, denomination: 'Femenino' }];
	formatDate = date => {
		let today = new Date(date);
		let fecha = today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
		return fecha;
	}
	convertDateTime = date => { var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0]; }
	fechaAutorizada = () => { var fecha = new Date(); fecha.setFullYear(fecha.getFullYear() - 18); return fecha; }
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); };
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	validateNumber = number => { let reg = /^[0-9]{6,11}$/; return reg.test(number); };
	shoDoc = uri => { /*Linking.openURL(uri);*/ }
	render() {
		const { photo, fotocopy, birth_date, show_birth_date, check } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal check={check} texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<Cargador show={this.state["cargador"]} texto="Bienvenido. Estamos creando tu cuenta..." modal={true} />
					<View style={{ backgroundColor: "#F2F2F2" }}>
						<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10, color: "#707070" }}>Paso 1 de 5</Text>
					</View>
					<NavigationEvents onDidFocus={payload => { this.showVista(payload["state"]) }} />
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>Queremos saber más de ti</Text>
						<Image source={(photo !== "") ? { uri: photo.uri } : require("../../../../assets/icon.png")} style={{ width: 120, height: 120, marginBottom: 5 }} />
						<View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
							<Button type="outline" buttonStyle={{ borderColor: "#42AECB", marginRight: 10, padding: 3 }}
								titleStyle={{ color: "#42AECB", fontFamily: "Raleway-Bold", fontSize: 12 }}
								onPress={() => this.openCamera()}
								icon={<Ionicons name="ios-camera" size={30} style={{ marginHorizontal: 5 }} color="#42AECB" />}
							/>
							<DocumentVista selectDocuments={(photo) => { this.setState(prevState => ({ photo })); }} />
						</View>
						<Copy texto="Busca una foto que muestre muy bien tu cara, esto es muy importante para generar confianza en tus clientes." />
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Nombres y Apellidos *</Text>
						<Input
							inputStyle={{ fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, paddingLeft: 10 }}
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
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Tipo de Identificación *</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10 }}>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								selectText="Seleccione"
								items={this.identification_type}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => { this.setState({ identification_type: selectedItems[0] }) }}
								selectedItems={[this.state["identification_type"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
							/>
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Número de Identificación *</Text>
						<Input
							keyboardType={this.state["type"]}
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["number"]} onChangeText={(number) => this.setState({ number })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Fecha de nacimiento</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10, }}>
							<TouchableOpacity onPress={() => this.setState({ show_birth_date: true })}
								style={{ flexDirection: "row", alignItems: "center", marginBottom: 15, }}>
								<Text style={{ marginLeft: 10, fontSize: 15, marginTop: 10 }}>{(birth_date !== "") ? this.formatDate(birth_date) : ""}</Text>
								<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10, marginTop: 10, display: (birth_date !== "") ? "flex" : "none" }}
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
									}}
								/>
							</View>
							}
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Género</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10 }}>
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
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Fotocopia de la cédula *</Text>
						<View style={{ flexDirection: "row-reverse", borderWidth: 0.5, borderColor: "silver", borderRadius: 5, padding: 5, marginHorizontal: 10 }}>
							<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}>
								<DocumentVista doc={true} selectDocuments={(document) => {
									this.setState(prevState => ({ fotocopy: document }));
								}} />
							</TouchableOpacity>
							<View style={{ flex: 0.8, display: (Object.keys(fotocopy).length) ? "flex" : "none", flexDirection: "row", alignItems: "center", marginStart: 0, borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
								<Image source={(fotocopy.format === "pdf") ? require("../../../../assets/iconos/pdf.png") : { uri: fotocopy.uri }} style={{ width: 50, height: 50 }} />
								<Text onPress={() => { this.shoDoc(fotocopy["uri"]); }} style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{fotocopy["name"]}</Text>
								<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
									onPress={() => { this.setState({ fotocopy: "" }); }}
								/>
							</View>
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
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Años de experiencia *</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10 }}>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								selectText="Seleccione"
								items={this.experiencia}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => { this.setState({ experiencia: selectedItems[0] }) }}
								selectedItems={[this.state["experiencia"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
							/>
						</View>
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
						<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Repetir contraseña *</Text>
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
						<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#273861" }}>Cupón *</Text>
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