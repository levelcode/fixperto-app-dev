import React, { Component } from 'react';
import { View, ScrollView, FlatList, TouchableOpacity, Image, Dimensions, Modal, Text } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Icon } from 'react-native-elements';
import DocumentVista from "../../../../componentes/documentVista";
import Seleccionador from "../../../../componentes/seleccionador";
import { NavigationEvents } from 'react-navigation';
import { buttons, textos, inputs } from "../../../../style/style";
import AlertModal from "../../../../componentes/alertView";
import { url } from "../../../../componentes/config";
const initialLayout = { width: Dimensions.get('window').width, height: Dimensions.get('window').height };
export default class RegistroProfesional3Vista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props)
		this.state = {
			textoAlert: "", showAlert: false,
			categories: [], categoriesSelected: [], profile_description: "",
			educational_level: 1, title: "", isModalVisibleCert: false, certifications: [], certification_type: [], type: 0, certification: "", cert_type: "", jobs: [], emergency: false,
			isModalVisible: false, photo: "", name: "", category_proposal: ""
		}
	}
	continuar = () => {
		if (this.state["categoriesSelected"].length && this.state["profile_description"] !== "") {
			let categories = [];
			for (let index = 0; index < this.state["categoriesSelected"].length; index++) {
				categories.push(this.state["categoriesSelected"][index]["value"]);
			}
			let informacion = this.props["navigation"].getParam("informacion");
			informacion["categoriesSelected"] = categories;
			if (this.state["category_proposal"] !== "") {
				informacion["category_proposal"] = this.state["category_proposal"];
			}
			informacion["emergency"] = this.state["emergency"];
			informacion["educational_level"] = this.state["educational_level"];
			informacion["profile_description"] = this.state["profile_description"];
			if (this.state["title"] !== "")
				informacion["title"] = this.state["title"];
			if (this.state["certifications"].length > 0)
				informacion["certifications"] = this.state["certifications"];
			if (this.state["jobs"].length > 0)
				informacion["jobs"] = this.state["jobs"];
			this.props["navigation"].navigate("RegistroProfesional4", { informacion });
		}
		else {
			if (this.state["profile_description"] === "") { return this.setState({ showAlert: true, textoAlert: "Debe dar una breve descripción" }); }
			else { return this.setState({ showAlert: true, textoAlert: "Debe seleccionar al menos una categoría" }); }
		}
	}
	componentDidMount() { this.getServicesConcatCategories(""); }
	getServicesConcatCategories = (text) => {
		return fetch(url + 'services/getServicesConcatCategories', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ text })
		}).then(response => response.json())
			.then(responseJson => { this.getCertificationsType(responseJson.categories); })
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
	deleteJob(job) {
		let jobs = this.state["jobs"];
		var i = jobs.indexOf(job);
		if (i !== -1) { jobs.splice(i, 1); }
		this.setState({ jobs: (jobs.length > 0) ? jobs : [] });
	}
	keyExtractor = (item, index) => index.toString();
	educational_level = [
		{ id: 1, denomination: 'Bachiller' }, { id: 2, denomination: 'Técnico' },
		{ id: 3, denomination: 'Tecnólogo' }, { id: 4, denomination: 'Profesional' },
		{ id: 5, denomination: 'Especialista' }, { id: 7, denomination: 'No aplica' }
	];
	toggleModal = () => {
		this.setState(prevState => ({ isModalVisible: !prevState["isModalVisible"], name: "", photo: "" }));
	}
	toggleModalCert = () => {
		this.setState(prevState => ({ isModalVisibleCert: !prevState["isModalVisibleCert"], type: "", certification: "" }));
	}
	almacenar = () => {
		if (this.state["photo"] !== "" && this.state["name"] !== "") {
			this.setState(prevState => (
				{
					jobs: prevState["jobs"].concat({ name: this.state["name"], photo: this.state["photo"] }),
					isModalVisible: false, photo: "", name: ""
				}));
		}
		else {
			let vacios = [];
			if (this.state["photo"] === "") { vacios.push("  *Imagen"); }
			if (this.state["name"] === "") { vacios.push("  *Nombre del trabajo"); }
			if (vacios.length) {
				return this.setState({ showAlert: true, textoAlert: "Debe especificar: " + vacios.toString() });
			}
		}
	}
	almacenarCert = () => {
		if (this.state["type"] !== 0 && this.state["certification"] !== "")
			this.setState(prevState => (
				{
					certifications: prevState["certifications"].concat({ certification: this.state["certification"], type: this.state["type"], cert_type: this.state["cert_type"] }),
					isModalVisibleCert: false, certification: "", type: 0, cert_type: ""
				}));
	}
	nav = (action) => {
		if (!action["routeName"]) {
			this.setState({ showAlert: true, textoAlert: "Tu cuenta ya fué creada, inicia sesión y completa tu información en la sección perfil" });
			this.props["navigation"].navigate("Ingreso");
		}
	}
	render() {
		const { isModalVisibleCert, certifications, isModalVisible, jobs, photo, name,
			type, certification, certification_type, category_proposal } = this.state;
		return (
			<ScrollView style={{ backgroundColor: "#FFFFFF", height: initialLayout.height }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<NavigationEvents onWillBlur={payload => { this.nav(payload["action"]) }} />
				<View style={{ backgroundColor: "silver" }}>
					<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 2 de 5</Text>
				</View>
				<Text style={[textos.titulos, textos.blue, textos.mbott, { fontFamily: "Raleway-Regular" }]}>Perfil profesional</Text>
				<View style={{ marginHorizontal: 20, marginBottom: 20 }}>
					<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
						<Icon name="user-o" type="font-awesome" color="#A5A5A5" size={25} />
						<Text style={{ marginLeft: 5, fontSize: 13, fontFamily: "Raleway-Bold", color: "#A5A5A5" }}>Elige las categorías a las que perteneces *</Text>
					</View>
					<Seleccionador
						texto="Seleccionar categorías..."
						confirm={this.onSelectedCategories}
						items={this.state["categories"]}
						cp={(category_proposal) => { this.setState({ category_proposal }) }}
						selectedItems={this.state["categoriesSelected"]}
						category_proposal={this.state["category_proposal"]}
						add_cp={(category) => { this.state["categoriesSelected"].push(category) }}
					/>
				</View>
				<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
					<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Describe tu perfil *</Text>
					<Input
						multiline
						inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
						inputContainerStyle={{ borderBottomWidth: 0, }}
						value={this.state["profile_description"]} onChangeText={(profile_description) => this.setState({ profile_description })}
					/>
				</View>
				<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
					<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Nivel educativo *</Text>
					<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, paddingTop: 5, marginHorizontal: 10 }}>
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
				<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
					<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Título profesional</Text>
					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
						inputContainerStyle={{ borderBottomWidth: 0, }}
						value={this.state["title"]} onChangeText={(title) => this.setState({ title })}
					/>
				</View>
				<View style={{ marginHorizontal: 20, marginVertical: 3 }}>
					<Text style={{ marginHorizontal: 10, fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Adjunta tus certificaciones o cursos tomados</Text>
					<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10 }}>
						<View style={{ flexDirection: "row-reverse", marginHorizontal: 10, paddingVertical: 10, }}>
							<TouchableOpacity style={{ flex: 0.2, alignItems: "flex-end" }}
								onPress={() => { this.setState({ isModalVisibleCert: true }) }} >
								<Ionicons name="ios-add" color="#43AECC" size={25} style={{ marginHorizontal: 5 }} />
							</TouchableOpacity>
							<View style={{ flex: 0.8, display: (certifications.length) ? "flex" : "none" }}>
								<FlatList data={certifications}
									renderItem={({ item, index }) =>
										<View style={{ flexDirection: "row", alignItems: "center", marginStart: 10, borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10 }}>
											<Image source={(item.certification["format"] === "pdf") ? require("../../../../assets/iconos/pdf.png") : { uri: item.certification["uri"] }} style={{ width: 75, height: 75 }} />
											<Text style={[inputs.textInt, { marginHorizontal: 20, fontSize: 15, fontFamily: "Raleway-Bold", color: "#A5A5A5", marginBottom: 10 }]}>{item["cert_type"]}</Text>
											<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
												onPress={() => { this.deleteCertification(item) }} />
										</View>}
									keyExtractor={this.keyExtractor} />
							</View>
						</View>
						<View style={{ flex: 1, marginVertical: 10, display: (isModalVisibleCert) ? "flex" : "none" }}>
							<View style={{ flexDirection: "row-reverse" }}>
								<Ionicons name="ios-close-circle" size={40} color="silver" onPress={this.toggleModalCert} style={{ marginHorizontal: 30, marginTop: -30 }} />
								<View style={{ marginTop: 25, flex: 0.90, flexDirection: "row" }}>
									<View style={{ alignItems: "center" }}>
										<Text style={{ fontFamily: "Raleway-Regular" }}>Certificado *</Text>
										<Image source={(certification !== "") ? (certification["format"] === "pdf") ? require("../../../../assets/iconos/pdf.png") : { uri: certification.uri } : require("../../../../assets/icon.png")} style={{ width: 75, height: 75, marginBottom: 5, }} />
										<DocumentVista doc={true} selectDocuments={(certification) => { this.setState({ certification }) }} />
									</View>
									<View style={{ marginLeft: 10 }}>
										<Text style={[inputs.textInt, { marginHorizontal: 20, fontSize: 15, fontFamily: "Raleway-Bold", color: "#A5A5A5", marginBottom: 10 }]}>Tipo de certificación *</Text>
										<MultiSelect
											hideTags hideDropdown hideSubmitButton single
											selectText="Seleccione"
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
				</View>
				<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
					<View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 10, paddingVertical: 10 }}>
						<Text style={{ fontSize: 14, color: "#A5A5A5", fontFamily: "Raleway-Bold", lineHeight: 14, marginVertical: 5 }}>Adjunta las fotos de tus proyectos</Text>
					</View>
					<View style={{ borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, marginHorizontal: 10, paddingVertical: 10 }}>
						<TouchableOpacity style={{ alignItems: "flex-end" }}
							onPress={() => { this.setState({ isModalVisible: true }) }} >
							<Ionicons name="ios-add" color="#43AECC" size={25} style={{ marginHorizontal: 15 }} />
						</TouchableOpacity>
						<View style={{ display: (jobs.length) ? "flex" : "none" }}>
							<FlatList data={jobs}
								renderItem={
									({ item, index }) =>
										<View style={{ flexDirection: "row", alignItems: "center", marginStart: 5, borderWidth: 0.5, borderColor: "#FFFFFF", borderRadius: 10, paddingHorizontal: 10 }}>
											<View style={{ flex: 0.4, alignItems: "center" }}>
												<Image source={{ uri: item.photo.uri }} style={{ width: 75, height: 75, }} />
											</View>
											<View style={{ flex: 0.8 }}>
												<Text style={{ fontSize: 16, marginLeft: 10, fontFamily: "Raleway-Regular" }}>{item.name}</Text>
												<Ionicons name="ios-close-circle" color="#CE4343" size={25} style={{ marginHorizontal: 10 }}
													onPress={() => { this.deleteJob(item) }} />
											</View>
										</View>
								}
								keyExtractor={this.keyExtractor} />
						</View>
					</View>
				</View>
				<Modal visible={isModalVisible}>
					<View style={{ flex: 1, marginVertical: 35, flexDirection: "row-reverse" }}>
						<Ionicons name="ios-close-circle" size={40} color="silver" onPress={this.toggleModal} style={{ marginHorizontal: 20 }} />
						<View style={{ alignItems: "center", marginTop: 25, flex: 0.85 }}>
							<Text style={{ fontSize: 20, fontFamily: "Raleway-Regular" }}>Imagen *</Text>
							<Image source={(photo !== "") ? { uri: photo.uri } : require("../../../../assets/icon.png")} style={{ width: 90, height: 90, marginBottom: 5 }} />
							<DocumentVista selectDocuments={(photo) => { this.setState({ photo }) }} />
							<Text style={{ fontSize: 15, marginTop: 20, marginBottom: 20, fontFamily: "Raleway-Regular" }}>Nombre del trabajo *</Text>
							<Input
								inputStyle={{ borderRadius: 5, fontFamily: "Raleway-Regular", paddingLeft: 10 }}
								inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 0.5, borderRadius: 5 }}
								value={name} onChangeText={(name) => this.setState({ name })}
							/>
							<Button title="ADICIONAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
								titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
								onPress={() => this.almacenar()}
							/>
						</View>
					</View>
				</Modal>
				<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
					<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
				</View>
				<Button title="CONTINUAR" buttonStyle={[buttons.primary, buttons.mtop]}
					titleStyle={buttons.PrimaryText}
					onPress={() => this.continuar()}
				/>
			</ScrollView>
		)
	}
}