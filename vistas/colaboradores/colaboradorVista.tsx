import React, { Component } from 'react';
import { View, ScrollView, Platform, Image, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button, Icon } from 'react-native-elements';
import DocumentVista from "../../componentes/documentVista";
import Copy from "../../componentes/copyVista";
import Seleccionador from "../../componentes/seleccionador";
import { NavigationEvents } from 'react-navigation';
import { buttons, textos, inputs } from "../../style/style";
import AlertModal from "../../componentes/alertView";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { url } from "../../componentes/config";
export default class ColaboradorVista extends Component {
	constructor(props) {
		super(props);
		this.state = {
			textoAlert: "", showAlert: false,
			type: "numeric", categories: [], categoriesSelected: [], categoriesEmergency: [], categoriesEmergencySelected: [], photo: "", name: "", email: "", identification_type: 1, number: "", phone: ""
		}
	}
	stateInitial = () => {
		this.setState({ type: "numeric", photo: "", name: "", email: "", identification_type: 1, number: "", categoriesSelected: [], categoriesEmergencySelected: [], phone: "" });
		this.props["navigation"].setParams({ collaborator: {}, action: "", idMod: -1 });
	}
	componentDidMount() { this.getServicesConcatCategories(""); }
	getServicesConcatCategories = (text) => {
		return fetch(url + 'services/getServicesConcatCategories', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ text, selected: this.props["navigation"].getParam("categories").concat(this.props["navigation"].getParam("categoriesEmergency")) })
		})
			.then(response => response.json()).then(responseJson => { this.setState({ categories: responseJson.categories, categoriesEmergency: responseJson.categoriesEmergency }); })
			.catch((error) => { if (error.message === 'Timeout' || error.message === 'Network request failed') { this.setState({ showAlert: true, textoAlert: "Problemas de conexión" }); } })
	}
	onSelectedCategories = categoriesSelected => { this.setState({ categoriesSelected }) }
	onSelectedCategoriesEmergency = categoriesEmergencySelected => { this.setState({ categoriesEmergencySelected }) }
	identification_type = [{ id: 1, denomination: 'Cédula de ciudadanía' }, { id: 2, denomination: 'Pasaporte' }, { id: 3, denomination: 'Cédula de extranjería' }];
	modificarImagen = imagen => { this.setState({ photo: imagen[0].uri }); }
	openCamera() { this.props["navigation"].navigate('Camera', { multiple: false, ruta: "Colaborador" }); }
	showVista = (params) => {
		if (params["collaborator"] && Object.keys(params["collaborator"]).length > 0) {
			this.setState(params["collaborator"]);
			this.props["navigation"].setParams({ collaborator: {} });
		}
		if (params["photos"] && params["photos"].length > 0) {
			this.setState(prevState => ({ photo: params["photos"][0].uri }));
			this.props["navigation"].setParams({ photos: [] });
		}
	}
	guardar = () => {
		let vacios = [];
		if (this.state["photo"] === "") { vacios.push("  *Foto"); }
		if (this.state["name"] === "") { vacios.push("  *Nombre del colaborador"); }
		if (this.state["email"] === "") { vacios.push("  *Correo"); }
		if (this.state["phone"] === "") { vacios.push("  *Teléfono"); }
		if (this.state["number"] === "") { vacios.push("  *Número de identificación"); }
		if (this.state["categoriesSelected"].length === 0) { vacios.push("  *Categoría"); }
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
		} else {
			let colaborador = {
				name: this.state["name"],
				email: this.state["email"],
				categoriesSelected: this.state["categoriesSelected"],
				categoriesEmergencySelected: this.state["categoriesEmergencySelected"],
				identification_type: this.state["identification_type"],
				number: this.state["number"],
				phone: this.state["phone"],
				photo: this.state["photo"]
			}
			this.props["navigation"].navigate(this.props["navigation"].getParam("ruta"), { colaborador, idMod: this.props["navigation"].getParam("idMod") })
		}
	}
	validateEmail = email => { let reg = /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; return reg.test(email.trim()); };
	validateName = name => { let reg = /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/; return reg.test(name); };
	validatePhone = phone => { let reg = /^[0-9]{7,10}$/; return reg.test(phone); }
	validateNumber = number => { let reg = /^[0-9]{6,11}$/; return reg.test(number); }
	render() {
		const { photo } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onDidFocus={payload => { this.showVista(payload["state"].params) }}
						onWillFocus={payload => { if (payload["state"].params.action === "add") this.stateInitial() }}
					/>
					<View style={{ fontFamily: "Raleway-Bold", color: "#273861", textAlign: "center", fontSize: 20, marginVertical: 15 }}>
						<Text style={[textos.titulos, textos.blue, textos.mbott]}>Registro de tu colaborador</Text>
						<View style={{ flex: 1, alignItems: "center" }}>
							<Image source={(photo !== "") ? { uri: photo.uri } : require("../../assets/icon.png")} style={{ width: 120, height: 120 }} />
						</View>
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
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5", marginHorizontal: 10 }}>Nombres y Apellidos *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["name"]} onChangeText={(name) => this.setState({ name })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5", marginHorizontal: 10 }}>Correo *</Text>
						<Input
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["email"]} onChangeText={(email) => { this.setState({ email }) }}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5", marginHorizontal: 10 }}>Tipo de Identificación *</Text>
						<View style={{ marginBottom: 0, paddingBottom: 0, borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, paddingTop: 3, marginHorizontal: 10 }}>
							<MultiSelect
								hideTags hideDropdown hideSubmitButton single
								items={this.identification_type}
								uniqueKey="id"
								displayKey="denomination"
								onSelectedItemsChange={(selectedItems) => { this.setState({ identification_type: selectedItems[0], type: (selectedItems[0] === 2) ? "default" : "numeric" }) }}
								selectedItems={[this.state["identification_type"]]}
								tagTextColor="#CCC"
								selectedItemTextColor="#CCC"
								itemTextColor="#000"
								styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
								searchInputPlaceholderText="Buscar..."
								selectText="Seleccione"
							/>
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5", marginHorizontal: 10 }}>Número de Identificación *</Text>
						<Input
							keyboardType={this.state["type"]}
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["number"]} onChangeText={(number) => this.setState({ number })}
						/>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 20, }}>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
							<Icon name="user-o" type="font-awesome" size={20} color="#A5A5A5" style={{ marginLeft: 10 }} />
							<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 20, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Elige las categorías a las que perteneces *</Text>
						</View>
						<Seleccionador
							texto="Seleccionar categorías..."
							confirm={this.onSelectedCategories}
							items={this.state["categories"]}
							selectedItems={this.state["categoriesSelected"]}
							cp={(category_proposal) => { }}
							category_proposal=""
							add_cp={(category) => { }}
						/>
						<View style={{ marginTop: 15 }}>
							<Seleccionador
								texto="Seleccionar categorías de emergencia..."
								confirm={this.onSelectedCategoriesEmergency}
								items={this.state["categoriesEmergency"]}
								selectedItems={this.state["categoriesEmergencySelected"]}
								cp={(category_proposal) => { }}
								category_proposal=""
								add_cp={(category) => { }}
							/>
						</View>
					</View>
					<View style={{ marginHorizontal: 20, marginVertical: 20, }}>
						<Text style={{ fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5", marginHorizontal: 10 }}>Teléfono *</Text>
						<Input
							keyboardType={'numeric'}
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomWidth: 0 }}
							value={this.state["phone"]} onChangeText={(phone) => this.setState({ phone })}
						/>
					</View>
					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>
					<Button title="GUARDAR" buttonStyle={buttons.primary}
						titleStyle={buttons.PrimaryText}
						onPress={() => this.guardar()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}