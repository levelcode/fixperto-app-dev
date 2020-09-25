import React, { Component } from 'react';
import { View, Platform, ScrollView, Text } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import Seleccionador from "../../../../componentes/seleccionador";
import { NavigationEvents } from 'react-navigation';
import { buttons, textos, inputs } from "../../../../style/style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "../../../../componentes/alertView";
import { url } from "../../../../componentes/config";
export default class RegistroEmpresa2Vista extends Component {
	multiSelect = null;
	constructor(props) {
		super(props); this.state = {
			textoAlert: "", showAlert: false, categories: [], categoriesSelected: [],
			categoriesEmergency: [], categoriesEmergencySelected: [], profile_description: "", category_proposal: "", category_proposal_emergencia: ""
		}
	}
	componentDidMount() { this.getServicesCategories(""); }
	continuar = () => {
		if (this.state["categoriesSelected"].length > 0 && this.state["profile_description"] !== "") {
			let categories = [];
			for (let index = 0; index < this.state["categoriesSelected"].length; index++) {
				categories.push(this.state["categoriesSelected"][index]["value"]);
			}
			let categoriesEmergency = [];
			for (let index = 0; index < this.state["categoriesEmergencySelected"].length; index++) {
				categoriesEmergency.push(this.state["categoriesEmergencySelected"][index]["value"]);
			}
			let informacion = this.props["navigation"].getParam("informacion");
			informacion["categoriesSelected"] = categories;
			if (this.state["category_proposal"] !== "") {
				informacion["category_proposal"] = this.state["category_proposal"];
			}
			informacion["categoriesEmergencySelected"] = categoriesEmergency;
			if (this.state["category_proposal_emergencia"] !== "") {
				informacion["category_proposal_emergencia"] = this.state["category_proposal_emergencia"];
			}
			informacion["profile_description"] = this.state["profile_description"];
			this.props["navigation"].navigate("RegistroEmpresa3", { informacion });
		}
		else {
			if (this.state["profile_description"] === "") { return this.setState({ showAlert: true, textoAlert: "Debe dar una breve descripción" }); }
			else { return this.setState({ showAlert: true, textoAlert: "Debe seleccionar al menos una categoría" }); }
		}
	}
	getServicesCategories = (text) => {
		return fetch(url + 'services/getServicesConcatCategories', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({ text })
		}).then(response => response.json()).then(responseJson => {
			this.setState({ categories: responseJson.categories, categoriesEmergency: responseJson.categoriesEmergency })
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	onSelectedCategories = categoriesSelected => { this.setState({ categoriesSelected }); }
	onSelectedCategoriesEmergency = categoriesEmergencySelected => { this.setState({ categoriesEmergencySelected }) }
	nav = (action) => {
		if (!action["routeName"]) {
			this.setState({ showAlert: true, textoAlert: "Tu cuenta ya fué creada, inicia sesión y completa tu información en la sección perfil" });
			this.props["navigation"].navigate("Ingreso");
		}
	}
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<NavigationEvents onWillBlur={payload => { this.nav(payload["action"]) }} />
					<View style={{ backgroundColor: "silver" }}>
						<Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", marginVertical: 10 }}>Paso 2 de 5</Text>
					</View>
					<Text style={[textos.titulos, textos.blue, textos.mbott]}>Perfil empresarial</Text>


					<View style={{ marginHorizontal: 20, marginBottom: 20 }}>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
							<Icon name="user-o" type="font-awesome" size={25} />
							<Text style={{ marginLeft: 5, fontSize: 16, marginHorizontal: 10, }}>Elige las categorías de servicios en las que estarán presentes tus expertos *</Text>
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
					<View style={{ marginHorizontal: 20, marginVertical: 10 }}>
						<Text style={{ marginHorizontal: 10, fontSize: 15, marginTop: 0, fontFamily: "Raleway-Bold", marginBottom: 10, color: "#A5A5A5" }}>Describe brevemente los servicios con los que cuenta tu empresa *</Text>
						<Input
							multiline
							inputStyle={{ backgroundColor: "#FFFFFF", fontSize: 15, marginBottom: 0, paddingBottom: 0, paddingLeft: 10, fontFamily: "Raleway-Regular", borderColor: "#A5A5A5", borderWidth: 0.5, borderRadius: 7, }}
							inputContainerStyle={{ borderBottomColor: "white" }}
							value={this.state["profile_description"]} onChangeText={(profile_description) => this.setState({ profile_description })}
						/>
					</View>

					<View style={{ marginHorizontal: 30, marginVertical: 15 }}>
						<Text style={[{ fontFamily: "Raleway-Italic", fontSize: 13, color: "#8d8d8d" }]}>Nota:  * (campo obligatorio)</Text>
					</View>

					<Button title="CONTINUAR" buttonStyle={[buttons.primary, buttons.mtop]}
						titleStyle={buttons.PrimaryText} containerStyle={{}}
						onPress={() => this.continuar()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}
