import React, { Component } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity, Platform, AsyncStorage, Image, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Icon } from 'react-native-elements';
import DocumentVista from "../../../componentes/documentVista";
import Seleccionador from "../../../componentes/seleccionador";
import { NavigationEvents } from 'react-navigation';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../componentes/alertView";
import { url } from "../../../componentes/config";
export default class ProfesionalIndependienteVista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props)
		this.state = {
			textoAlert: "", showAlert: false, category_proposal: "",
			isModalVisibleCert: false, buttonDisabled: false,
			categories: [], categoriesSelected: [], profile_description: "", certifications: [], certification_type: [], type: 0, certification: "", cert_type: "",
		}
	}
	guardar = () => {
		let vacios = [];
		if (this.state["profile_description"] === "") { vacios.push("  *Descripción del perfil"); }
		if (this.state["categoriesSelected"].length === 0) { vacios.push("  *Categorías"); }
		if (vacios.length) {
			return this.setState({ showAlert: true, textoAlert: "Los siguientes campos son obligatorios: " + vacios.toString() });
		}
		else {
			AsyncStorage.getItem("@USER").then((user) => {
				user = JSON.parse(user);
				this.setState({ buttonDisabled: true });
				const createFormData = () => {
					const convertirImagen = (result) => {
						let localUri = result.uri;
						let filename = localUri.split('/').pop();
						let match = /\.(\w+)$/.exec(filename);
						let type = match ? `image/${match[1]}` : `image`;
						if (match[1] === "pdf") type = `application/pdf`;
						return { uri: localUri, name: user["typeId"] + "_" + Date.now().toString() + result["name"], type }
					}
					const data = new FormData();
					let categories = [];
					for (let index = 0; index < this.state["categoriesSelected"].length; index++) {
						categories.push(this.state["categoriesSelected"][index]["value"]);
					}
					let certification_type = [];
					for (let index = 0; index < this.state["certifications"].length; index++) {
						if (!this.state["certifications"][index]["noDel"]) {
							data.append("certifications", convertirImagen(this.state["certifications"][index]["certification"]));
							certification_type.push(this.state["certifications"][index]["type"]);
						}
					}
					data.append("user", user["id"]);
					data.append("id", user["typeId"]);
					data.append("certification_type", JSON.stringify(certification_type));
					data.append("categoriesSelected", JSON.stringify(categories));
					data.append("profile_description", this.state["profile_description"]);
					if (this.state["category_proposal"] !== "")
						data.append("category_proposal", this.state["category_proposal"]);
					return data;
				};
				return fetch(url + 'fixpertoProfesional/modPerfilProfesional', {
					method: "POST",
					headers: { Accept: 'application/json', "Access-Token": globalThis.tokenAuth },
					body: createFormData()
				}).then(response => response.json()).then(responseJson => {
					this.setState({ buttonDisabled: false });
					if (responseJson.success) { this.props["navigation"].goBack(); }
					else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
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
	getPerfilProfesional = () => {
		this.getServicesConcatCategories("");
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + 'fixpertoProfesional/getPerfilProfesional', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ id: user["typeId"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) {
					var result = responseJson.result;
					var certifications = []
					for (let index = 0; index < result["certifications"].length; index++) {
						certifications.push({
							noDel: true,
							id: result["certifications"][index]["id"],
							name: result["certifications"][index]["certification"],
							format: result["certifications"][index]["certification"].split(".")[1],
							cert_type: result["certifications"][index]["certification_type"],
							uri: url + "uploads/registros/profesional/certifications/" + result["certifications"][index]["certification"]
						})
					}
					this.setState({ certifications, categoriesSelected: result["categoriesSelected"], profile_description: result["profile_description"] })
				}
			}).catch((error) => {
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
		}).then(response => response.json()).then(responseJson => { this.getCertificationsType(responseJson.categories); })
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	getCertificationsType = (categories) => {
		return fetch(url + 'services/getCertificationsType', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
		}).then(response => response.json())
			.then(responseJson => { this.setState({ categories, certification_type: responseJson.certification_type }); })
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	onSelectedCategories = categoriesSelected => { this.setState({ categoriesSelected }); }
	deleteCertification(certification) {
		let certifications = this.state["certifications"];
		var i = certifications.indexOf(certification);
		if (i !== -1) { certifications.splice(i, 1); }
		this.setState({ certifications: (certifications.length > 0) ? certifications : [] });
	}
	keyExtractor = (item, index) => index.toString();
	toggleModalCert = () => {
		this.setState(prevState => ({ isModalVisibleCert: !prevState["isModalVisibleCert"], type: "", certification: "" }));
	}
	almacenarCert = () => {
		if (this.state["type"] !== 0 && this.state["certification"] !== "")
			this.setState(prevState => (
				{
					isModalVisibleCert: false, certification: "", type: 0, cert_type: "",
					certifications: prevState["certifications"].concat({ certification: this.state["certification"], type: this.state["type"], cert_type: this.state["cert_type"] })
				}));
	}
	render() {
		const { isModalVisibleCert, certifications, type, certification, certification_type } = this.state;
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onDidFocus={payload => { this.getPerfilProfesional() }} />
					<View style={{ marginHorizontal: 20, marginVertical: 30, }}>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
							<Icon name="user-o" type="font-awesome" size={25} color="#A5A5A5" style={{}} />
							<Text style={{ marginLeft: 5, fontSize: 13, fontFamily: "Raleway-Bold", color: "#A5A5A5" }}>Elige las categorías a las que perteneces... *</Text>
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
					</View>
					<Text style={{ marginHorizontal: 20, fontSize: 15, fontFamily: "Raleway-Bold", color: "#A5A5A5", marginBottom: 10, marginTop: 20 }}>Describe tu perfil *</Text>
					<Input
						multiline
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, marginHorizontal: 0, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 1, borderRadius: 5 }}
						value={this.state["profile_description"]} onChangeText={(profile_description) => this.setState({ profile_description })}
					/>
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginBottom: 10, marginTop: 20, color: "#A5A5A5", fontFamily: "Raleway-Bold" }}>Adjunta tus certificaciones o cursos tomados</Text>
					<View style={{ marginHorizontal: 20, borderWidth: 0.5, borderColor: "silver", borderRadius: 5, padding: 10 }}>
						<View style={{ flexDirection: "row-reverse" }}>
							<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}
								onPress={() => { this.setState({ isModalVisibleCert: true }) }} >
								<Ionicons name="ios-add" color="#43AECC" size={25} style={{ marginHorizontal: 5 }} />
							</TouchableOpacity>
							<View style={{ flex: 0.8, flexDirection: "column", display: (certifications.length) ? "flex" : "none" }}>
								<FlatList data={certifications}
									renderItem={({ item, index }) =>
										<View style={{ flexDirection: "row", alignItems: "center", marginStart: 10, borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10, marginBottom: 20 }}>
											<Image source={(!item["noDel"]) ? (item.certification["format"] === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: item.certification["uri"] } : (item["format"] === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: item.uri }} style={{ width: 75, height: 75 }} />
											<Text style={{ fontSize: 15, marginLeft: 10, fontFamily: "Raleway-Bold", color: "#A5A5A5" }}>{item.cert_type}</Text>
											{(!item["noDel"]) && <Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
												onPress={() => { this.deleteCertification(item) }} />}
										</View>}
									keyExtractor={this.keyExtractor} />
							</View>
						</View>
						<View style={{ flex: 1, marginVertical: 5, display: (isModalVisibleCert) ? "flex" : "none" }}>
							<View style={{ flexDirection: "row-reverse" }}>
								<Ionicons name="ios-close-circle" size={40} color="silver" onPress={this.toggleModalCert} style={{}} />
								<View style={{ marginTop: 25, flexDirection: "row" }}>
									<View style={{ alignItems: "center" }}>
										<Text style={{ marginHorizontal: 20, fontSize: 15, marginBottom: 10, marginTop: 20, color: "#A5A5A5", fontFamily: "Raleway-Bold" }}>Certificado *</Text>
										<Image source={(certification !== "") ? (certification["format"] === "pdf") ? require("../../../assets/iconos/pdf.png") : { uri: certification.uri } : require("../../../assets/icon.png")} style={{ width: 75, height: 75, marginBottom: 5 }} />
										<DocumentVista doc={true} selectDocuments={(certification) => { this.setState({ certification }) }} />
									</View>
									<View style={{ marginLeft: 0 }}>
										<Text style={{ marginTop: 20, fontFamily: "Raleway-Regular" }}>Tipo de certificación *</Text>
										<MultiSelect
											hideTags hideDropdown hideSubmitButton single
											items={certification_type}
											uniqueKey="id"
											displayKey="denomination"
											onSelectedItemsChange={(selectedItems) => { this.setState({ type: selectedItems[0], cert_type: certification_type.find(cert => cert["id"] === selectedItems[0])["denomination"] }) }}
											selectedItems={[type]}
											tagTextColor="#CCC"
											selectedItemTextColor="#CCC"
											itemTextColor="#000"
											styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
											searchInputPlaceholderText="Buscar..."
											selectText="Seleccione"
										/>
									</View>
								</View>
							</View>
							<Button title="ADICIONAR CERTIFICADO" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
								titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
								onPress={() => this.almacenarCert()}
							/>
						</View>
					</View>
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