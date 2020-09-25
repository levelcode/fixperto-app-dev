import React, { Component } from 'react';
import { Text, View, Platform } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AlertModal from "./alertView";
import { url } from "./config";
export default class DireccionVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, address: "" } }

	enviar = () => {
		return fetch(url + 'cliente/acceptOffert', {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth  },
			body: JSON.stringify({
				address: this.state["address"],
				expert: this.props["navigation"].getParam("expert"),
				request: this.props["navigation"].getParam("request"),
				collaborator: this.props["navigation"].getParam("collaborator")
			})
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.props["navigation"].navigate("Agendados"); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	disabledEnviar = () => { if (this.state["address"] === "") return true; else return false; }
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
					<Text style={{ textAlign: "center", marginVertical: 10, fontFamily: "Raleway-Bold", color: "#36425C", fontSize: 20 }}>Para terminar</Text>
					<Text style={{ textAlign: "center", marginHorizontal: 20, fontSize: 15 }}>Solo debes incluir la dirección donde se realizará el trabajo</Text>
					<Text style={{ marginHorizontal: 20, fontSize: 15, marginTop: 15, fontFamily: "Raleway-Bold" }}>Dirección del servicio</Text>
					<Input
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 0.5, borderRadius: 5 }}
						value={this.state["address"]} onChangeText={(address) => this.setState({ address })}
					/>
					<Text style={{ marginHorizontal: 20, fontSize: 13, color: "#43AECC" }}>Esta dirección solo la podrá ver el ﬁxperto con que agendaste</Text>
					<Button title="ENVIAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						disabled={this.disabledEnviar()}
						titleStyle={{ fontFamily: "Raleway-Bold" }} containerStyle={{ marginHorizontal: 25, marginVertical: 20 }}
						onPress={() => this.enviar()}
					/>
				</View>
			</KeyboardAwareScrollView>
		)
	}
}