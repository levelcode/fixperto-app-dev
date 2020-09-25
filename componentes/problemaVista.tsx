import React, { Component } from 'react';
import { Text, Platform, ScrollView } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "./alertView";
import { url } from "./config";
export default class ProblemaVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, problem: "", type: "", problems: [] } }
	componentDidMount() { this.getProblemsType(); }
	getProblemsType = () => {
		if (!(this.state["problems"].length > 0)) {
			return fetch(url + 'seguridad/getProblemType', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth }
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) { this.setState({ problems: responseJson.problems }); }
				else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
			})
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		}
	}
	enviar = () => {
		return fetch(url + 'seguridad/reportProblem', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({
				problem: this.state["problem"],
				type: this.state["type"],
				request: this.props["request"],
				user: this.props["user"].id,
				type_user: this.props["user"].type,
				typeId: this.props["user"].typeId
			})
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) {
				this.setState({ showAlert: true, textoAlert: "Su problema ha sido reportado satisfactoriamente" });
			}
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ flex: 0.8, backgroundColor: "#ffffff", }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => {
						this.setState({ showAlert: false, textoAlert: "" }); this.props["close"]();
					}} />

					<Text style={{ textAlign: "center", marginVertical: 20, fontFamily: "Raleway-Bold", color: "#36425C", fontSize: 18 }}>¡Hola {this.props["user"].name}!</Text>

					<Text style={{ marginHorizontal: 20, marginTop: 15, marginBottom: 5, fontFamily: "Raleway-Regular", fontSize: 16, }}>Motivo del problema *</Text>

					<MultiSelect
						hideTags hideDropdown hideSubmitButton single
						selectText="Seleccione"
						items={this.state["problems"]}
						uniqueKey="id"
						displayKey="denomination"
						onSelectedItemsChange={(selectedItems) => { this.setState({ type: selectedItems[0] }) }}
						selectedItems={[this.state["type"]]}
						tagTextColor="#CCC"
						selectedItemTextColor="#CCC"
						itemTextColor="#000"
						styleDropdownMenu={{ marginHorizontal: 10, marginTop: 5 }}
						searchInputPlaceholderText="Buscar..."
					/>

					<Text style={{ marginHorizontal: 20, marginTop: 10, marginBottom: 5, fontFamily: "Raleway-Regular", fontSize: 16 }}>Cuéntanos tu inconveniente</Text>

					<Input multiline
						inputContainerStyle={{ paddingLeft: 0, paddingRight: 0, marginBottom: 10, borderRadius: 5, borderWidth: 0, marginHorizontal: 20, marginTop: 20 }}
						containerStyle={{ paddingLeft: 0, paddingRight: 0, borderWidth: 0 }}
						inputStyle={{ borderWidth: 1, borderColor: "silver", borderRadius: 7, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						value={this.state["problem"]}
						onChangeText={(problem) => this.setState({ problem })}
					/>

					<Button title="ENVIAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 20, marginVertical: 20 }}
						onPress={() => this.enviar()}
					/>
					<Button type="outline" title="ATRÁS"
						buttonStyle={{ borderColor: "#CE4343", borderRadius: 5, borderWidth: 2 }}
						titleStyle={{ fontFamily: "Raleway-Bold", color: "#CE4343" }}
						containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.props["close"]()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}