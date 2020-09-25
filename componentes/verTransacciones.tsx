import React, { Component } from 'react';
import { Text, View, ScrollView, Image, AsyncStorage, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import AlertModal from "./alertView";
import { url } from "./config";
export default class VerTransaccionesVista extends Component {
	constructor(props) { super(props); this.state = { textoAlert: "", showAlert: false, transacciones: [] } }
	componentDidMount() {
		AsyncStorage.getItem("@USER").then((user) => {
			user = JSON.parse(user);
			return fetch(url + "fixperto/getTransacciones", {
				method: "POST",
				headers: { Accept: 'application/json', 'Content-Type': 'application/json', "Access-Token": globalThis.tokenAuth  },
				body: JSON.stringify({ expert: user["typeId"], coupon: user["codigo"] })
			}).then(response => response.json()).then(responseJson => {
				if (responseJson.success) { this.setState({ transacciones: responseJson.transacciones }); }
			}).catch((error) => {
				if (error.message === 'Timeout' || error.message === 'Network request failed') {
					this.setState({ showAlert: true, textoAlert: "Problemas de conexión" });
				}
			})
		})
	}
	render() {
		const { transacciones } = this.state;
		return (

			<View style={{ flex: 1, backgroundColor: "#FFFFFF", padding: 5 }}>
				<AlertModal texto={this.state["textoAlert"]} showAlert={this.state["showAlert"]} closeModal={() => { this.setState({ showAlert: false, textoAlert: "" }) }} />

				<View style={{ flexDirection: "row", padding: 10, backgroundColor: "#49B0CD" }}>
					<Text style={[styles.textPrincipal, { textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 16 }]}>Asunto</Text>
					<Text style={[{ fontFamily: "Raleway-Bold", textAlign: "center", color: "#FFFFFF", fontSize: 16, marginLeft: 12 }]}>Movimiento</Text>
					<Text style={[styles.textPrincipal, { textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 16 }]}>Fecha</Text>
					<Text style={[styles.textPrincipal, { textAlign: "center", fontFamily: "Raleway-Bold", fontSize: 16 }]}>Valor</Text>
				</View>

				<ScrollView >
					{transacciones.map((transaccion, i) => (
						<ListItem
							key={i} bottomDivider
							containerStyle={{ backgroundColor: "#FFFFFF" }}
							title={<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text style={{ fontSize: 15, flex: 0.8, fontFamily: "Raleway-Regular" }}>
									{(transaccion.type === "gasto") ? transaccion.title : (transaccion.type === "fixcoin") ? "Compra de fixcoin" : (transaccion.type === "plan") ? "Compra de plan" : (transaccion.type === "evaluar") ? "Evaluar" : (transaccion.type === "evaluado") ? "Evaluado" : (transaccion.type === "referido") ? "Referido" : "Referir"}
								</Text>
								<Text style={{ fontSize: 15, flex: 0.8, fontFamily: "Raleway-Regular" }}>
									{(transaccion.type === "gasto") ? "Gasto" : "Ingreso"}
								</Text>
								<Text style={{ fontSize: 15, fontFamily: "Raleway-Regular" }}>{transaccion.date}</Text>
							</View>}
							chevron={
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Image source={require("../assets/iconos/fixcoin.png")} style={{ width: 25, height: 25 }} />
									<Text style={{ marginLeft: 5, fontSize: 20, fontFamily: "Raleway-Bold" }}>{transaccion.valor}</Text>
								</View>
							}
						/>
					))}
				</ScrollView>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	textPrincipal: { fontFamily: "Raleway-Bold", flex: 0.35, textAlign: "center", color: "#FFFFFF" }
})