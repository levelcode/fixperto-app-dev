import React, { Component } from 'react';
import MultiSelect from 'react-native-multiple-select';
import { ScrollView, Platform, AsyncStorage, View, Image, TouchableOpacity, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationEvents } from 'react-navigation';
import Modal from "react-native-modal";
import AlertModal from "../../../componentes/alertView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { url } from "../../../componentes/config";
export default class InformacionClienteVista extends Component {
	constructor(props) {
		super(props);
		this.state = { textoAlert: "", showAlert: false, buttonDisabled: false, isModalVisible: false, id: "", typeId: "", name: "", email: "", birth_date: "", gender: 0, phone: "" }
	}
	getInformation = () => {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'cliente/getInformation', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["id"] })
			}).then(response => response.json()).then(responseJson => {
				var datos = responseJson.customer;
				if (responseJson.success) {
					this.setState({
						id: datos["id"],
						typeId: datos["typeId"],
						name: datos["name"],
						email: datos["email"],
						birth_date: (datos["birth_date"]) ? this.convertDateTimeUpdate(datos["birth_date"]) : "",
						gender: datos["gender"],
						phone: datos["phone"].toString()
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
		if (this.state["name"] === "" || this.state["email"] === "" || /*this.state["birth_date"] === ""
			|| this.state["gender"] === "" ||*/ this.state["phone"] === "") {
			return this.setState({ showAlert: true, textoAlert: "Existen campos vacios" });
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
			this.setState({ buttonDisabled: true });
			return fetch(url + 'cliente/modInformation', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({
					id: this.state["id"],
					typeId: this.state["typeId"],
					name: this.state["name"],
					email: this.state["email"],
					birth_date: (this.state["birth_date"] !== "") ? this.convertDateTime(this.state["birth_date"]) : null,
					gender: this.state["gender"],
					phone: this.state["phone"]
				})
			}).then(response => response.json()).then(responseJson => {
				this.setState({ buttonDisabled: false });
				if (responseJson.success) {
					AsyncStorage.getItem("@USER").then((user) => {
						user = JSON.parse(user); user["name"] = this.state["name"];
						AsyncStorage.setItem("@USER", JSON.stringify(user)); this.props["navigation"].goBack();
					})
				}
				else { if (responseJson.existe) { this.toggleModal(); } }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		}
	}
	formatDate = date => {
		let today = new Date(date); return today.getDate() + "/" + parseInt(today.getMonth() + 1) + "/" + today.getFullYear();
	}
	convertDateTimeUpdate(date) { var from = date.split("/"); return new Date(from[2], from[1] - 1, from[0]); }
	convertDateTime = (date) => {
		var fecha = new Date(date); return fecha.toISOString().split('T')[0] + ' ' + fecha.toTimeString().split(' ')[0];
	}
	gender_type = [{ id: 0, denomination: 'Seleccione' }, { id: 1, denomination: 'Masculino' }, { id: 2, denomination: 'Femenino' }];
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	fechaAutorizada = () => {
		var fecha = new Date();
		fecha.setFullYear(fecha.getFullYear() - 18);
		return fecha;
	}
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); }
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); }
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
							value={this.state["birth_date"] || this.fechaAutorizada()}
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
					</View>}

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

					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Teléfono *</Text>

					<Input
						keyboardType="numeric"
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
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