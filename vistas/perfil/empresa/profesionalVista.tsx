import React, { Component } from 'react';
import { View, ScrollView, Platform, AsyncStorage, Image, Text } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import Modal from "react-native-modal";
import Seleccionador from "../../../componentes/seleccionador";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
export default class ProfesionalEmpresaVista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props);
		this.state = {
			textoAlert: "", showAlert: false, category_proposal: "", category_proposal_emergencia: "",
			buttonDisabled: false, isModalVisible: false, name: "", email: "", nit: "", phone: "", categories: [], categoriesSelected: [], categoriesEmergency: [], categoriesEmergencySelected: [], profile_description: ""
		}
	}
	guardar = () => {
		let vacios = [];
		if (this.state["name"] === "") { vacios.push("  *Nombre de la empresa"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["nit"] === "") { vacios.push("  *Nit"); }
		if (this.state["profile_description"] === "") { vacios.push("  *Descripción del perfil"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		if (this.state["categoriesSelected"].length === 0) { vacios.push("  *Categorías"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
		}
		else if (!this.validateEmail(this.state["email"])) {
			return this.setState({ showAlert: true, textoAlert: "Correo inválido, por favor verifíquelo" });
		}
		else if (!this.validateNit(this.state["nit"])) {
			return this.setState({ showAlert: true, textoAlert: "Nit inválido, por favor verifíquelo. Formato: XXXXXXXXX-X" });
		}
		else if (!this.validatePhone(this.state["phone"])) {
			return this.setState({ showAlert: true, textoAlert: "Teléfono inválido, por favor verifíquelo" });
		}
		else if (!this.validateName(this.state["name"])) {
			return this.setState({ showAlert: true, textoAlert: "Nombre y apellido, por favor verifíquelo" });
		} else {
			this.setState({ buttonDisabled: true });
			AsyncStorage.getItem("@USER").then((user) => {
				user = JSON.parse(user);
				let cat = this.state["categoriesSelected"].concat(this.state["categoriesEmergencySelected"]);
				let categories = [];
				for (let index = 0; index < cat.length; index++) { categories.push(cat[index]["value"]); }
				return fetch(url + 'fixpertoEmpresa/modPerfilEmpresa', {
					method: "POST",
					headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
					body: JSON.stringify({
						id: user["typeId"],
						user: user["id"],
						name: this.state["name"],
						email: this.state["email"],
						nit: this.state["nit"],
						profile_description: this.state["profile_description"],
						category_proposal: this.state["category_proposal"],
						category_proposal_emergencia: this.state["category_proposal_emergencia"],
						categoriesSelected: categories,
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
					else {
						if (responseJson.existe) { this.toggleModal(); }
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
	getPerfilEmpresa = () => {
		this.getServicesConcatCategories("");
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixpertoEmpresa/getPerfilEmpresa', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					var result = responseJson.result;
					this.setState({
						name: result["name"],
						email: result["email"],
						nit: result["nit"],
						profile_description: result["profile_description"],
						phone: result["phone"].toString(),
						categoriesSelected: result["categoriesSelected"],
						categoriesEmergencySelected: result["categoriesEmergencySelected"]
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
	getServicesConcatCategories = (text) => {
		return fetch(url + 'services/getServicesConcatCategories', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ text })
		}).then(response => response.json()).then(responseJson => {
			this.setState({ categories: responseJson.categories, categoriesEmergency: responseJson.categoriesEmergency });
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	onSelectedCategories = categoriesSelected => { this.setState({ categoriesSelected }); }
	onSelectedCategoriesEmergency = categoriesEmergencySelected => { this.setState({ categoriesEmergencySelected }) }
	toggleModal = () => { this.setState({ isModalVisible: !this.state["isModalVisible"] }); }
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateNit = nit => { let reg = /^[0-9]{9}-[0-9]{1}$/; return reg.test(nit); };
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); };
	validateName = name => { let reg = /^[0-9_A-Za-zÁÉÍÓÚñáéíóúÑ \.-]{2,254}$/; return reg.test(name); };
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onDidFocus={payload => { this.getPerfilEmpresa() }} />
					<View style={{ marginVertical: 10 }}>

						<Text style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>Tus datos</Text>

						<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Empresa *</Text>
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

						<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Nit de empresa *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
							value={this.state["nit"]} onChangeText={(nit) => this.setState({ nit })}
						/>
						<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Teléfono *</Text>
						<Input
							keyboardType="numeric"
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
							inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
							value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
						/>

						<View style={{ marginHorizontal: 20, }}>
							<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5, marginTop: 20 }}>
								<Icon name="user-o" type="font-awesome" size={20} style={{}} />
								<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Elige las categorías a las que perteneces *</Text>
							</View>
							<Seleccionador
								texto="Seleccionar categorías..."
								confirm={this.onSelectedCategories}
								items={this.state["categories"]}
								selectedItems={this.state["categoriesSelected"]}
								cp={(category_proposal) => { this.setState({ category_proposal }) }}
								category_proposal={this.state["category_proposal"]}
								add_cp={(category) => { this.state["categoriesSelected"].push(category) }}
							/>

							<View style={{ marginTop: 15 }}>
								<Seleccionador
									texto="Seleccionar categorías de emergencia..."
									confirm={this.onSelectedCategoriesEmergency}
									items={this.state["categoriesEmergency"]}
									selectedItems={this.state["categoriesEmergencySelected"]}
									cp={(category_proposal) => { this.setState({ category_proposal_emergencia: category_proposal }) }}
									category_proposal={this.state["category_proposal_emergencia"]}
									add_cp={(category) => { this.state["categoriesEmergencySelected"].push(category) }}
								/>
							</View>
						</View>
					</View>
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#999797" }}>Describe tu perfil *</Text>
					<Input
						multiline
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, marginHorizontal: 0, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["profile_description"]}
						onChangeText={(profile_description) => this.setState({ profile_description })}
					/>
					<Modal isVisible={this.state["isModalVisible"]}>
						<View style={{ flex: 1, marginHorizontal: 20, marginVertical: 35, justifyContent: "center" }}>
							<View style={{ backgroundColor: "#FFFFFF", borderRadius: 10 }}>
								<View style={{ alignItems: "center", marginTop: 10 }}>
									<Image source={require("../../../assets/iconos/alert_icon.png")} style={{ width: 50, height: 50 }} />
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
						onPress={() => this.guardar()} />
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}