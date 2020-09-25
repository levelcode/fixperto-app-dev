import React, { Component } from 'react';
import { ScrollView, Platform, AsyncStorage, TouchableOpacity, View, Image, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Input, Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationEvents } from 'react-navigation';
import Modal from "react-native-modal";
import DocumentVista from "../../../componentes/documentVista";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
import * as Linking from 'expo-linking';
export default class InformacionIndependienteVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textoAlert: "", showAlert: false, buttonDisabled: false, isModalVisible: false, id: "",
			typeId: "", name: "", email: "", birth_date: "", gender: 0, number: "", fotocopy: { edit: false, photo: "" },
			phone: "", show_birth_date: false, educational_level: 0, title: "", experiencia: 1
		}
	}
	getInformation = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixpertoProfesional/getInformation', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["id"] })
			}).then(response => response.json()).then(responseJson => {
				var datos = responseJson.expert;
				if (responseJson.success) {
					this.setState({
						id: datos["id"],
						typeId: datos["typeId"],
						name: datos["name"],
						email: datos["email"],
						birth_date: (datos["birth_date"]) ? this.convertDateTimeUpdate(datos["birth_date"]) : "",
						gender: datos["gender"],
						experiencia: datos["experiencia"],
						number: datos["number"].toString(),
						fotocopy: {
							edit: false,
							photo: {
								format: datos["fotocopy"].split(".")[1],
								name: datos["fotocopy"],
								uri: (datos["fotocopy"]) ? url + "uploads/registros/profesional/" + datos["fotocopy"] : ""
							}
						},
						phone: datos["phone"].toString(),
						educational_level: datos["educational_level"],
						title: datos["title"]
					})
				}
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	guardar = () => {
		let vacios = [];
		if (this.state["name"] === "") { vacios.push("  *Nombre y Apellidos"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["number"] === "") { vacios.push("  *Número de identificación"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		//	if (this.state["birth_date"] === "") { vacios.push("  *Fecha de nacimiento"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
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
			const createFormData = () => {
				const convertirImagen = (result) => {
					var name = Math.random().toString(36).substring(7, 15) + Math.random().toString(36).substring(7, 15);
					name = name + "_" + Date.now().toString();
					let localUri = result.uri;
					let filename = localUri.split('/').pop();
					let match = /\.(\w+)$/.exec(filename);
					let type = match ? `image/${match[1]}` : `image`;
					if (match[1] === "pdf") type = `application/pdf`;
					return { uri: localUri, name: this.state["typeId"] + name + match[0], type }
				}
				const data = new FormData();
				data.append("id", this.state["id"]);
				data.append("typeId", this.state["typeId"]);
				data.append("name", this.state["name"]);
				data.append("email", this.state["email"]);
				if (this.state["birth_date"] !== "")
					data.append("birth_date", this.convertDateTime(this.state["birth_date"]));
				data.append("gender", this.state["gender"]);
				data.append("number", this.state["number"]);
				data.append("experiencia", this.state["experiencia"]);
				if (this.state["fotocopy"]["edit"])
					data.append("documentos", convertirImagen(this.state["fotocopy"]["photo"]));
				data.append("phone", this.state["phone"]);
				data.append("educational_level", this.state["educational_level"]);
				data.append("title", this.state["title"]);
				return data;
			};
			this.setState({ buttonDisabled: true });
			return fetch(url + 'fixpertoProfesional/modInformation', {
				method: "POST", headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth }, body: createFormData()
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) {
					AsyncStorage.getItem("@USER").then((user) => {
						user = JSON.parse(user); user["name"] = this.state["name"];
						AsyncStorage.setItem("@USER", JSON.stringify(user)); this.props["navigation"].goBack();
					})
				} else { if (responseJson.existe) { this.toggleModal(); } }
			}).catch((error) => {
				this.setState({ buttonDisabled: false });
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
	}
	formatDate = date => { let today = new Date(date); return today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear(); }
	convertDateTimeUpdate(date) { var from = date.split("/"); return new Date(from[2], from[1] - 1, from[0]); }
	convertDateTime = (date) => { var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0]; }
	gender_type = [{ id: 0, denomination: 'Seleccione' }, { id: 1, denomination: 'Masculino' }, { id: 2, denomination: 'Femenino' }];
	educational_level = [
		{ id: 1, denomination: 'Bachiller' }, { id: 2, denomination: 'Técnico' },
		{ id: 3, denomination: 'Tecnólogo' }, { id: 4, denomination: 'Profesional' },
		{ id: 5, denomination: 'Especialista' }, { id: 7, denomination: 'No aplica' }
	];
	experiencia = [
		{ id: 1, denomination: 'Menos de un año' },
		{ id: 2, denomination: 'Un año' },
		{ id: 3, denomination: 'De 2 a 3 años' },
		{ id: 4, denomination: 'De 3 a 5 años' },
		{ id: 5, denomination: 'De 5 a 10 años' },
		{ id: 6, denomination: 'Más de 10 años' }];
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); }
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); }
	validateNumber = number => { let reg = /^[0-9]{6,11}$/; return reg.test(number); }
	setFotocopy = photo => { this.setState(prevState => ({ fotocopy: { edit: true, photo } })); }
	shoDoc = uri => { Linking.openURL(uri); }
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onDidFocus={payload => { this.getInformation() }} />
					<Text style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>Tus datos</Text>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Nombre y Apellidos *</Text>

					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["name"]} onChangeText={(name) => this.setState({ name })}
					/>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Correo *</Text>
					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["email"]} onChangeText={(email) => this.setState({ email })}
					/>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Fecha de nacimiento</Text>
					<TouchableOpacity
						onPress={() => this.setState({ show_birth_date: true })}
						style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center", borderRadius: 5, borderWidth: 1, borderColor: "silver", height: 40 }}>
						<Text style={{ marginLeft: 5 }}>{(this.state["birth_date"]) ? this.formatDate(this.state["birth_date"]) : ""}</Text>
					</TouchableOpacity>

					{this.state["show_birth_date"] && <View>
						{Platform.OS === "ios" && <Button title="CONTINUAR"
							buttonStyle={{ backgroundColor: "#49B0CD" }}
							titleStyle={{ color: "#FFFFFF", fontSize: 14 }}
							onPress={() => { this.setState({ show_birth_date: false }); }}
						/>}
						<DateTimePicker
							testID="dateInicioModTimePicker"
							value={this.state["birth_date"] || new Date()}
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
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Género</Text>
					<View style={{ marginHorizontal: 20, borderWidth: 1, borderColor: "silver", borderRadius: 5, paddingVertical: 1 }}>
						<MultiSelect
							hideTags hideDropdown hideSubmitButton single
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
							selectText="Seleccione"
						/>
					</View>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Cédula *</Text>
					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 }}
						value={this.state["number"]} onChangeText={(number) => this.setState({ number })}
					/>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Fotocopia *</Text>

					<View style={{ marginHorizontal: 20, flexDirection: "row", alignItems: "center", borderColor: "silver", borderWidth: 1, borderRadius: 5, }}>
						<Image
							source={(this.state["fotocopy"]["photo"]["format"] === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: this.state["fotocopy"]["photo"]["uri"] }}
							style={{ width: 70, height: 70, }}
						/>
						<Text onPress={() => { this.shoDoc(this.state["fotocopy"]["photo"]["uri"]); }} style={{ marginLeft: 5, fontSize: 12, textDecorationLine: "underline", width: 160 }}>{this.state["fotocopy"]["photo"]["name"]}</Text>
						<DocumentVista doc={true} selectDocuments={(photo) => { this.setFotocopy(photo) }} />
					</View>

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Teléfono *</Text>
					<Input
						keyboardType="numeric"
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
					/>

					<View style={{ marginHorizontal: 12, marginTop: 20 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, color: "#999797", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Años de experiencia *</Text>
						<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 5, marginHorizontal: 10 }}>
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

					<View style={[{ marginHorizontal: 20, }]}>
						<Text style={[{ marginHorizontal: 0, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }]}>Nivel educativo *</Text>
						<View style={[{ borderColor: "silver", borderWidth: 1, borderRadius: 5, paddingVertical: 1 }]}>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								selectText="Seleccione"
								items={this.educational_level}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => { this.setState({ educational_level: selectedItems[0] }) }}
								selectedItems={[this.state["educational_level"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
							/>
						</View>
					</View>
					<Text style={[{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }]}>Título profesional</Text>
					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ borderColor: "silver", borderWidth: 1, borderRadius: 5, marginHorizontal: 10, paddingHorizontal: 10 }}
						value={this.state["title"]} onChangeText={(title) => this.setState({ title })}
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

					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>

					<Button title="GUARDAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						disabled={this.state["buttonDisabled"]}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.guardar()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView >
		);
	}
}