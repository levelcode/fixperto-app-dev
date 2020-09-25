import React, { Component } from 'react';
import { Text, ScrollView, View, AsyncStorage, Dimensions, ImageBackground, Image, Share } from 'react-native';
import { Button, Card } from 'react-native-elements';
import AlertModal from "../../componentes/alertView";
import { url } from "../../componentes/config";
export default class ReferirAmigoVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, codigo: "", referidos: 0 } }
	compartir = () => {
		Share.share({ message: "¡Hola! Descarga ahora fixperto https://www.fixperto.com, regístrate y al final del formulario agrega el siguiente código y recibirás tres créditos gratis. Anímate y se parte de la comunidad fixperto. Código fixperto:  " + this.state["codigo"] }).then();
	}
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			this.setState({ codigo: user["codigo"] });
			return fetch(url + 'fixperto/getReferred', {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth },
				body: JSON.stringify({ cupon: user["codigo"] })
			}).then(response => response.json()).then(responseJson => { this.setState({ referidos: responseJson.referidos }); })
				.catch((error) => {
					if (error.message === 'Timeout' || error.message === 'Network request failed') {
						this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
					}
				})
		})
	}
	render() {
		const { width } = Dimensions.get('window');
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />
				<ImageBackground source={require('../../assets/iconos/referir_amigo.png')}
					style={{ width: width + 10, height: 140, justifyContent: "center" }} >
					<Text style={{ marginLeft: 150, marginRight: 20, fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 20 }}>Gana 3 fixcoin</Text>
					<Text style={{ marginLeft: 150, marginRight: 20, color: "#FFFFFF", fontSize: 15 }}>por cada amigo que refiera tu código</Text>
				</ImageBackground>
				<View style={{ marginTop: 20, flexDirection: "row", borderRadius: 7, borderWidth: 1, marginHorizontal: 10, marginBottom: 10, borderStyle: "dashed" }}>
					<View style={{ flex: 0.5, alignItems: "flex-start", padding: 10, marginStart: 20 }}>
						<Text style={{ fontSize: 12 }}>TU CÓDIGO ES</Text>
						<Text style={{ fontFamily: "Raleway-Bold", fontSize: 20 }}>{this.state["codigo"]}</Text>
					</View>
					<View style={{ flex: 0.5, alignItems: "center", justifyContent: "center" }}>
						<Button buttonStyle={{ borderColor: "#47AAC9", borderWidth: 0.5, backgroundColor: "#47AAC9", paddingVertical: 3, paddingHorizontal: 15 }}
							title="COMPARTIR" titleStyle={{ fontFamily: "Raleway-Bold", fontSize: 12 }}
							containerStyle={{ marginHorizontal: 10, alignItems: "flex-start" }}
							onPress={() => this.compartir()} />
					</View>
				</View>
				<Text style={{ color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20, textAlign: "center", marginTop: 10 }}>Tus códigos compartidos</Text>
				<Card containerStyle={{ borderRadius: 10, alignItems: "center" }}>
					<Text style={{ textAlign: "center" }}>{(this.state["referidos"] > 0) ? (this.state["referidos"] > 1) ? this.state["referidos"] + " Amigos han usado tú codigo" : "Un amigo ha usado tu código" : "Ningún amigo ha usado tu código"}</Text>
					<Text style={{ textAlign: "center", marginTop: 5 }}>Has ganado</Text>
					<View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 5 }}>
						<Image source={require("../../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25 }} />
						<Text style={{ marginLeft: 10, color: "#263762", fontFamily: "Raleway-Bold", fontSize: 20 }}>{this.state["referidos"] * 3} fixcoin</Text>
					</View>
				</Card>
			</ScrollView>
		)
	}
}