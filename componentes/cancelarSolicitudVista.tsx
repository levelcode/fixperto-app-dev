import React, { Component } from 'react';
import { Text, Platform, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "./alertView";
import { url } from "./config";
export default class CancelarSolicitudVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, texto: "", type: "", cancellations: [] } }
	componentDidMount() { this.getCancelType(); }
	getCancelType = () => {
		return fetch(url + 'seguridad/getCancelType', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.setState({ cancellations: responseJson.cancellations }); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	enviar = () => {
		return fetch(url + 'cliente/cancelRequest', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({
				texto: this.state["texto"],
				type: this.state["type"],
				id: this.props["request"],
			})
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.setState({ showAlert: true, textoAlert: "El servicio ha sido cancelado satisfactoriamente" });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	disabledEnviar = () => {
		if (this.state["type"] === "" || this.state["texto"] === "") return true;
		else return false;
	}
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => {
						this.setState({ showAlert: false, textoAlert: "" }); this.props["close"](true);
					}} />

					<Text style={{ marginHorizontal: 20, marginTop: 15, marginBottom: 5, fontFamily: "Raleway-Regular", fontSize: 16 }}>Motivo del problema *</Text>

					<MultiSelect
						hideTags hideDropdown hideSubmitButton single
						items={this.state["cancellations"]}
						uniqueKey="id"
						displayKey="denomination"
						onSelectedItemsChange={(selectedItems) => this.setState({ type: selectedItems[0] })}
						selectedItems={[this.state["type"]]}
						tagTextColor="#CCC"
						selectedItemTextColor="#CCC"
						itemTextColor="#000"
						styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
						searchInputPlaceholderText="Buscar..."
						selectText="Seleccione"
					/>
					<Text style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 5, fontFamily: "Raleway-Regular", fontSize: 16 }}>Cuéntanos por qué cancelas</Text>
					<Input multiline
						inputContainerStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: 10, borderRadius: 5, borderWidth: 0, marginHorizontal: 20 }}
						containerStyle={{ paddingLeft: 0, paddingRight: 0, borderWidth: 0 }}
						inputStyle={{ borderWidth: 1, borderColor: "silver", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular", }}
						value={this.state["texto"]}
						onChangeText={(texto) => this.setState({ texto })}
					/>
					<Button title="ENVIAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						disabled={this.disabledEnviar()}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 20, marginVertical: 20 }}
						onPress={() => this.enviar()}
					/>
					<Button type="outline" title="ATRÁS"
						buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, borderWidth: 2 }}
						titleStyle={{ fontFamily: "Raleway-Bold", color: "#D25353" }}
						containerStyle={{ marginHorizontal: 25, marginTop: 20, marginBottom: 50 }}
						onPress={() => this.props["close"](false)}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}