import React, { Component } from 'react';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, ScrollView, Platform, Text } from 'react-native';
import { Button, Input, AirbnbRating } from 'react-native-elements';
import Experto from "../../componentes/expertoVista";
import Cliente from "../../componentes/clienteVista";
import AlertModal from "../../componentes/alertView";
import Copy from "../../componentes/copyVista";
import { url } from "../../componentes/config";
export default class CalificarVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, evaluation: 0, cost: "", commentary: "" } }

	enviar = () => {
		var ruta = (this.props["navigation"].getParam("type") === "experto")
			? url + 'fixperto/ratingCustomer'
			: url + 'cliente/ratingExpert';
		return fetch(ruta, {
			method: "POST",
			headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
			body: JSON.stringify({
				evaluation: this.state["evaluation"],
				cost: this.state["cost"],
				commentary: this.state["commentary"],
				calificador: this.props["navigation"].getParam("calificador"),
				calificado: this.props["navigation"].getParam("calificado").id
			})
		}).then(response => response.json()).then(responseJson => {
			if (responseJson.success) { this.props["navigation"].navigate("Completados"); }
			else { this.setState({ showAlert: true, textoAlert: "Ha ocurrido un problema, inténtelo nuevamente" }); }
		})
			.catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
	}
	ratingCompleted = (evaluation) => { this.setState({ evaluation }) }
	render() {
		return (
			<KeyboardAwareScrollView enableAutomaticScroll extraScrollHeight={15} enableOnAndroid={true}
				extraHeight={Platform.select({ android: 100 })} style={{ flex: 1, backgroundColor: "#fff" }}>
				<ScrollView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
					<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

					<View style={{ backgroundColor: "#F8F8F8", padding: 25 }}>
						{
							(this.props["navigation"].getParam("type") === "experto") ?
								<Cliente cliente={this.props["navigation"].getParam("calificado")} navigation={this.props["navigation"]} />
								: <Experto experto={this.props["navigation"].getParam("calificado")} navigation={this.props["navigation"]} />
						}

					</View>

					{this.props["navigation"].getParam("type") === "experto" && <Copy texto="Calificar a tus clientes te hará ganar fixcoin que podrás redimir por servicios." />}


					<Text style={{ color: "#293551", fontFamily: "Raleway-Bold", marginTop: 10, marginHorizontal: 20, textAlign: "center", fontSize: 17 }}>{(this.props["navigation"].getParam("type") === "experto") ? "Califica a tu cliente" : "Califica a tu experto"}</Text>

					<AirbnbRating
						onFinishRating={this.ratingCompleted}
						count={5} reviews={["Muy mal", "Mal", "Regular", "Bien", "Excelente"]}
						defaultRating={this.state["evaluation"]} size={40}
					/>
					<Text style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 10, color: "#293551", fontFamily: "Raleway-Bold", fontSize: 17 }}>¿Cuál fue cobro final del servicio?</Text>
					<Input
						keyboardType="numeric"
						inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular" }}
						inputContainerStyle={{ marginHorizontal: 10, borderColor: "silver", borderWidth: 0.5, borderRadius: 5 }}
						value={this.state["cost"]} onChangeText={(cost) => this.setState({ cost })}
					/>
					<View style={{ marginHorizontal: 0, flex: 1 }}>
						<Text style={{ textAlign: "justify", fontSize: 12, color: "#293551", fontFamily: "Raleway-Regular", marginHorizontal: 20 }}>Este valor no es obligatorio pero será de gran utilidad para crear una guía de precios</Text>

						<Text style={{ marginTop: 20, marginBottom: 10, color: "#293551", fontFamily: "Raleway-Bold", fontSize: 17, marginHorizontal: 20 }}>{(this.props["navigation"].getParam("type") === "experto") ? "Escribe un comentario sobre tu cliente" : "Escribe un comentario sobre tu experto"}</Text>

						<Input multiline
							inputStyle={{ backgroundColor: "#FFFFFF", borderRadius: 5, paddingLeft: 10, fontFamily: "Raleway-Regular", }}
							inputContainerStyle={{ borderColor: "silver", borderWidth: 0.5, borderRadius: 5, marginHorizontal: 10 }}
							value={this.state["commentary"]}
							onChangeText={(commentary) => this.setState({ commentary })}
						/>

					</View>
					<Button title="ENVIAR" buttonStyle={{ backgroundColor: "#43AECC", borderRadius: 7 }}
						containerStyle={{ marginHorizontal: 20, marginVertical: 20 }}
						onPress={() => this.enviar()}
					/>
				</ScrollView>
			</KeyboardAwareScrollView>
		)
	}
}